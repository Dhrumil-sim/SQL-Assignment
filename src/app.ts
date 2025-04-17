import express, { Application } from 'express';
import cors from 'cors';

import { errorHandler } from './middlewares/errorHandler/errorHandler.js';
import morgan from 'morgan';
class App {
  public app: Application;
  a = 10;
  constructor() {
    this.app = express();
    this.setMiddlewares();

    this.setErrorHandler();
  }

  private setMiddlewares(): void {
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    this.app.use(cors({ origin: process.env['CORS_ORIGIN'] }));
    this.app.use(express.static('public'));
    this.app.set('view engine', 'ejs');

    this.app.use(morgan(':method :url :status :response-time ms'));
  }

  private setRoutes(): void {}

  private setErrorHandler(): void {
    this.app.use(errorHandler);
  }

  public getServer(): Application {
    return this.app;
  }
}

export default new App().getServer();
