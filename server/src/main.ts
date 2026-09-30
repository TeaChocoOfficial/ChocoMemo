// -Path: 'Nest-TypeScript/src/main.ts'
import os from 'node:os';
import chalk from 'chalk';
import { AppModule } from './app.module';
import packageJson from '../package.json';
import { NestFactory } from '@nestjs/core';
import type { FastifyPluginCallback } from 'fastify';
import { SecureService } from './secure/secure.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import fastifyCookie, { type FastifyCookieOptions } from '@fastify/cookie';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyMultipart, {
    type FastifyMultipartAttachFieldsToBodyOptions,
} from '@fastify/multipart';

async function bootstrap() {
    const time = Date.now();

    // ใช้ Fastify adapter
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            bodyLimit: 50 * 1024 * 1024, // 50mb
        }),
    );

    const secureService = app.get(SecureService);
    const { SERVER_HOST, SERVER_PORT, CLIENT_URL } = secureService.getEnvConfig();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // ลงทะเบียน Fastify plugins
    await app.register(fastifyMultipart, {
        limits: {
            fileSize: 50 * 1024 * 1024, // 50mb
        },
        attachFieldsToBody: true,
    });

    await app.register(fastifyCookie);

    // CORS configuration
    app.enableCors({
        origin: secureService.getAllowedUrls(),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    if (secureService.isDev()) {
        const theme = new SwaggerTheme();
        const themeKeys = Object.keys(SwaggerThemeNameEnum);
        const config = new DocumentBuilder()
            .setTitle('Nest TypeScript Server Rest API')
            .setDescription('Nest TypeScript Rest API for Projects. have many UI theme support.')
            .setVersion(packageJson.version)
            .build();

        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup('api', app, document, {
            explorer: true,
            swaggerOptions: {
                authAction: {
                    defaultBearerAuth: {
                        name: 'defaultBearerAuth',
                        schema: {
                            type: 'http',
                            scheme: 'basic',
                        },
                        value: 'Basic <base64_encoded_credentials>',
                    },
                },
            },
        });

        themeKeys.forEach((key) => {
            SwaggerModule.setup(`api-${key.toLocaleLowerCase()}`, app, document, {
                explorer: true,
                customCss: theme.getBuffer(SwaggerThemeNameEnum[key]),
            });
        });
    }

    const port = Number(SERVER_PORT ?? process.env.PORT) ?? 3000;
    const host = SERVER_HOST ?? '0.0.0.0';

    // Fastify listen - ต้องระบุ host
    await app.listen(port, host);

    const addresses: string[] = [];
    const interfaces = os.networkInterfaces();
    Object.values(interfaces).forEach((ifaces) =>
        ifaces?.forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) addresses.push(iface.address);
        }),
    );

    console.log('\n');
    Logger.debug(
        `${chalk.hex('#ff69B4')('Nest TypeScript')} by ${chalk.bold(chalk.blue('TeaChoco'))} ${chalk.gray(`ready in ${Date.now() - time} ms`)}\n`,
    );
    Logger.debug(`🚀 Local: ${chalk.cyan(await app.getUrl())}`);
    addresses.forEach((addr) =>
        Logger.debug(`🌐 Network: ${chalk.cyan(`http://${addr}:${port}`)}`),
    );
    Logger.debug(`📄 API Docs: ${chalk.cyan(`${await app.getUrl()}/api`)}`);
    Logger.debug(`🌐 Client Origin: ${chalk.cyan(CLIENT_URL)}`);
    Logger.debug(
        `🔴 Allowed Origins: ${secureService
            .getAllowedUrls()
            .map((url) => chalk.cyan(url))
            .join(' , ')}`,
    );
    console.log('\n');
}
bootstrap();
