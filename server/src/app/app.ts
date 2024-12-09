import express, { Express } from 'express';
import compression from 'compression'
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import cors from 'cors';
import { AuthRouter } from "../routes";
import helmet from "helmet";
import morgan from "morgan";

export const app : Express = express();


if (process.env.NODE_ENV === 'production') {
    app.use(compression());
    app.use(morgan('combined'));
    app.use(helmet());
}

app.use(bodyParser.json());
app.use(cookieParser())

app.use(cors({
    credentials : true,
    origin: process.env.FRONT_END_URL
}))

app.use('/api/auth', AuthRouter)

