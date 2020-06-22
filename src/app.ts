import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { Routes } from './routes/userRoutes';

class App {
    public app: express.Application = express();
    public routePrev: Routes = new Routes();


    constructor() {
        this.app = express();
        this.config()
        this.routePrev.routes(this.app)
        this.mongoSetup();
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))
    }

    private mongoSetup(): void {
        mongoose.connect('mongodb://127.0.0.1:27017/user-management', {
            autoIndex: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })
        .then(() => console.log('connection successful'))
        .catch((e) => console.log(e))
    }
}

export default new App().app;