import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import helmet from 'helmet';
import nocache from 'nocache';
import path from 'path';

import { getGlobalName } from '../../global/global-name.js';

const { __dirname } = getGlobalName(import.meta.url);

const app: express.Express = express();

// 大文字小文字で区別をする
app.set('case sensitive routing', true);

// tariling slashで区別をする
app.set('strict routing', true);

// トークン発行
app.use(cookieParser());
app.use(csrf({ cookie: true }));

app.use(express.json());

// 検証　CORSを受け入れるドメイン設定
app.use(cors({
  origin: ['http://localhost:5174'],
  credentials: true, // クッキーを含める
}));

// ルーティング設定
import taskRouter from './task.js';
app.use(/^\/taskManagement/, taskRouter);
import workoutRouter from './workout.js';
app.use(/^\/workout/, workoutRouter);
// import indexRouter from './routes/index';
// app.use(/^\/.[^/]*\/taskmanager/, indexRouter);
import topRooting from './topRooting.js';
app.use(topRooting);

// 存在しないURLを叩いた場合の404エラー表示用
// app.get(/.*/, notFoundRouting());

export default app;