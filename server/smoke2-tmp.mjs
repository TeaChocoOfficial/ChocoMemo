import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/home/teachoco/Dev/TeaChoco/TeaChoco-Application/ChocoMemo/server/');
const env = Object.fromEntries(readFileSync('.env','utf8').split('\n').filter(l=>l.includes('=')&&!l.trim().startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')).trim(), l.slice(l.indexOf('=')+1).trim().replace(/^["']|["']$/g,'')]));
const jwt = require(process.argv[2]);
const B='http://127.0.0.1:3942';
const OWNER = process.argv[3];
const OTHER = process.argv[4];
const mk = (uid) => jwt.sign({userId:uid,name:'T',nameTag:'t',role:'user',lastLoginAt:new Date().toISOString()}, env.JWT_SECRET, {expiresIn:'1h'});
const ownerCk = `access_token=${mk(OWNER)}`, otherCk = `access_token=${mk(OTHER)}`;
const word = (w) => ({word:w,meaning:'m',example:{before:[],segments:[{ch:w}],after:[],meaning:'s'}});

const call = async (label, method, path, body, ck) => {
  const res = await fetch(B+path,{method,headers:{...(ck?{Cookie:ck}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const t = await res.text();
  let j=null; try{j=JSON.parse(t)}catch{}
  console.log(`[${label}] ${res.status} ${method} ${path}` + (j?.message ? ` -> ${JSON.stringify(j.message).slice(0,140)}` : ''));
  return {status:res.status, body:j};
};

console.log('--- visibility ---');
const priv = await call('create private','POST','/api/decks',{type:'vocab',language:'japanese',name:'Hidden deck',visibility:'private',content:[word('隠')]},ownerCk);
const pub  = await call('create public','POST','/api/decks',{type:'vocab',language:'japanese',name:'Open deck',visibility:'public',content:[word('開')]},ownerCk);
await call('anon browse hides private','GET','/api/decks?language=japanese');
const anonPage = await fetch(B+'/api/decks?language=japanese').then(r=>r.json());
console.log('   anon sees', anonPage.items.length, 'deck(s); private leaked?', anonPage.items.some(d=>d.id===priv.body.id));
await call('anon read private -> 404','GET',`/api/decks/${priv.body.id}`);
await call('owner read private -> 200','GET',`/api/decks/${priv.body.id}`,null,ownerCk);

console.log('--- ownership ---');
await call('other updates -> 400','PUT',`/api/decks/${pub.body.id}`,{name:'hijacked'},otherCk);
await call('other deletes -> 400','DELETE',`/api/decks/${pub.body.id}`,null,otherCk);
await call('anon cursor=mine -> 401','GET','/api/decks?cursor=mine');

console.log('--- version bump ---');
const before = pub.body.meta.version;
const after = await call('owner updates content','PUT',`/api/decks/${pub.body.id}`,{content:[word('新')]},ownerCk);
console.log(`   version ${before} -> ${after.body.meta.version}, contentIds ${after.body.contentIds.length}`);

console.log('--- cursor pagination ---');
for (let i=0;i<4;i++) await call(`seed page deck ${i}`,'POST','/api/decks',{type:'vocab',language:'english',name:`Paged ${i}`,visibility:'public',content:[word('x'+i)]},ownerCk);
let cursor=null, seen=[], pages=0;
do {
  const q = '/api/decks?language=english&limit=2' + (cursor ? `&cursor=${encodeURIComponent(cursor)}` : '');
  const page = await fetch(B+q,{headers:{Cookie:ownerCk}}).then(r=>r.json());
  seen.push(...page.items.map(d=>d.name.en));
  cursor = page.nextCursor; pages++;
} while (cursor && pages < 10);
console.log(`   ${pages} page(s), ${seen.length} items, no duplicates: ${new Set(seen).size===seen.length}`);
console.log('   order:', seen.join(', '));

console.log('--- sort=popular (stable, heart ties fall back to date) ---');
const pop = await fetch(B+'/api/decks?language=english&sort=popular&limit=10',{headers:{Cookie:ownerCk}}).then(r=>r.json());
console.log('   ', pop.items.map(d=>d.name.en).join(', '), '| nextCursor:', pop.nextCursor);

console.log('--- delete cascades content ---');
const del = await call('owner deletes','DELETE',`/api/decks/${pub.body.id}`,null,ownerCk);
const gone = await call('read deleted -> 404','GET',`/api/decks/${pub.body.id}`,null,ownerCk);
