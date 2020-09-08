// registers aliases, DON'T REMOVE THIS LINE!
import 'module-alias/register';

import * as passport from 'passport';
import * as session from 'express-session';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import AppModule from '@components/app/app.module';

const MongoDBStore = require('connect-mongodb-session')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      secret: process.env.PASSPORT_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new MongoDBStore({
        uri:
          'mongodb+srv://root:1234@cluster0-ilpdw.mongodb.net/nestjs-test-api',
        collection: 'sessions',
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const options = new DocumentBuilder()
    .setTitle('Api v1')
    .setDescription('The boilerplate API for nestjs devs')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  const port = process.env.SERVER_PORT || 3000;

  await app.listen(port, () =>
    console.log(`The server is running on ${port} port`),
  );
}
bootstrap();
