import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebSocketServer } from 'ws';
import * as http from 'http'
import { setupWSConnection } from 'y-websocket/bin/utils';
import { JSDOM } from 'jsdom'
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

var myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

const navigator = require("navigator");
global.navigator = navigator;

const dom = new JSDOM(`<!DOCTYPE html><div class="render-katex"></div>`);
global.window = dom.window;
global.document = dom.window.document;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.HTMLVideoElement = dom.window.HTMLVideoElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.HTMLElement = dom.window.Node;
global.Text = dom.window.Text;

async function bootstrap() {

  const wss = new WebSocketServer({
    maxPayload: 500 * 1024 * 1024,
    noServer: true
  })

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Article Storage API Documentation')
    .setDescription('This documentation you can use to communicate with the backend part of the project')
    .setVersion('1.0.0')
    .addServer(process.env.SWAGGER_BASE_PATH)
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            tokenUrl: `${process.env.AUTH_SERVICE}/oauth/token`,
            authorizationUrl: `${process.env.AUTH_SERVICE}/oauth/authorize`,
            scopes: {} // { openid: openid, ... }
          },
        },
      },
      'Auth2'
    )
    .build();
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persist_authorization: false,
      oauth2RedirectUrl: `${process.env.ARTICLE_STORAGE_SERVICE || `http://${process.env.LOCAL_HOST || '0.0.0.0'}:${Number(process.env.LOCAL_PORT || 4000)}`}/api/oauth2-redirect.html`,
      initOAuth: {
        clientId: process.env.SWAGGER_PASSPORT_PKCE_CLIENT_ID,
        usePkceWithAuthorizationCodeGrant: true
      }
    }
  }
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('okay')
  })

  wss.on('connection', setupWSConnection)

  server.on('upgrade', (request, socket, head) => {
    // You may check auth of request here..
    /**
     * @param {any} ws
     */
    const handleAuth = ws => {
      wss.emit('connection', ws, request)
    }
    wss.handleUpgrade(request, socket, head, handleAuth)
  })

  server.listen({ host: process.env.LOCAL_HOST, port: process.env.WS_PORT })
  app.setGlobalPrefix(process.env.API_PREFIX || 'api');
  app.enableCors({
    origin: '*'
  });
  await app.listen(Number(process.env.LOCAL_PORT || 4000), process.env.LOCAL_HOST || '0.0.0.0');
  const appUrl = await app.getUrl();

  console.log(`WS run in port ${process.env.WS_PORT}`)
  console.log(appUrl);

  console.log('Environment', process.env);

  const webServer = app.getHttpServer();

  const router = webServer._events.request._router;

  const availableRoutes: [] = router.stack
    .map(layer => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter(item => item !== undefined);
  console.log(availableRoutes);
}
bootstrap();
