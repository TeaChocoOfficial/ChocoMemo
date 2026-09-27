import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';

/** Cookie holding the CSRF `state` (and the PKCE verifier) for one OAuth round
 *  trip. Mirrors the `oauth_redirect_uri` cookie the guards already set. */
const STATE_COOKIE = 'oauth_state';
const MAX_AGE_SECONDS = 600;

interface StoredState {
    state: string;
    /** Only present when the provider mandates PKCE (X). */
    verifier?: string;
}

/** The state store is called by `passport-oauth2` with the request only, but it
 *  has to write a cookie. The guard runs first and can hand the reply over. */
type ReplyCarrier = { oauthReply?: FastifyReply };

export function attachOAuthReply(request: unknown, reply: FastifyReply): void {
    (request as ReplyCarrier).oauthReply = reply;
}

/** Passport ends the *raw* response, so Fastify never flushes its own header
 *  store — anything set through `reply.setCookie` is silently dropped. The
 *  guards already work around this by writing to `reply.raw` directly, and
 *  `setHeader` replaces rather than appends, so merge by hand. */
function appendSetCookie(reply: FastifyReply, cookie: string): void {
    const existing = reply.raw.getHeader('set-cookie');
    const values = Array.isArray(existing) ? [...existing] : existing ? [String(existing)] : [];
    values.push(cookie);
    reply.raw.setHeader('set-cookie', values);
}

function constantTimeEquals(a: string, b: string): boolean {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
}

/**
 * Cookie-backed `state` store for `passport-oauth2`.
 *
 * `passport-oauth2` only reaches the provider's authorization endpoint through
 * this store, and it defaults to a *session*-backed store whenever a strategy
 * enables `state` or PKCE. Those refuse to run without `req.session`, and this
 * app is Fastify with no session middleware — so LINE and X never issued a
 * redirect at all. Worse, the stateless variant that replaced them sent no
 * `state` parameter, which both providers reject outright
 * (`'state' is not specified.`).
 *
 * The state (and PKCE verifier, which X requires) round-trips through an
 * HttpOnly cookie instead of server-side session storage, so the handshake
 * keeps real CSRF protection while staying stateless.
 *
 * Arities are load-bearing: `passport-oauth2` inspects `fn.length` to decide
 * how to invoke these, and only the 5-arg `store` receives the PKCE verifier.
 */
export class CookieOAuth2StateStore {
    // Arity 5 is required: `passport-oauth2` dispatches on `store.length`, and
    // only the 5-argument call carries the PKCE verifier.
    store(
        request: unknown,
        verifier: string | undefined,
        _state: unknown,
        _meta: unknown,
        done: (err: Error | null, state?: string) => void,
    ) {
        try {
            const reply = (request as ReplyCarrier).oauthReply;
            if (!reply) {
                throw new Error('OAuth state store was not given a reply to write its cookie to');
            }

            const state = randomBytes(24).toString('base64url');
            const payload: StoredState = verifier ? { state, verifier } : { state };

            appendSetCookie(
                reply,
                `${STATE_COOKIE}=${encodeURIComponent(JSON.stringify(payload))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`,
            );

            done(null, state);
        } catch (error) {
            done(error as Error);
        }
    }

    verify(
        request: unknown,
        providedState: unknown,
        done: (err: Error | null, ok: boolean | string, state?: unknown) => void,
    ) {
        const fastifyRequest = request as FastifyRequest & ReplyCarrier;
        const raw = fastifyRequest.cookies?.[STATE_COOKIE];

        // One-shot: drop the cookie whether or not it matched, so a leaked one
        // cannot be replayed.
        if (fastifyRequest.oauthReply) {
            appendSetCookie(
                fastifyRequest.oauthReply,
                `${STATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
            );
        }

        if (!raw) return done(null, false, 'missing state cookie');
        if (typeof providedState !== 'string' || providedState === '') {
            return done(null, false, 'missing state parameter');
        }

        let payload: StoredState;
        try {
            payload = JSON.parse(raw) as StoredState;
        } catch {
            return done(null, false, 'malformed state cookie');
        }

        if (!payload?.state || !constantTimeEquals(payload.state, providedState)) {
            return done(null, false, 'state mismatch');
        }

        // `passport-oauth2` only sends `code_verifier` when this resolves to a
        // string, so a provider without PKCE must get a boolean instead.
        done(null, payload.verifier ?? true, payload.state);
    }
}
