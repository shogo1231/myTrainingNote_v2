import express from 'express';
import { sitename } from '../global/settings.js';
import appExpress from './routes/root.js';
// import { makeUploadsDirectory } from '../global/make-uploads';

const app = express();
const router = express.Router();

router.use('/', appExpress);
app.use('/' + sitename, router);

// const companyDiv = process.env.COMPANY_DIV;
// const replacedUrl = baseUrl.replace('$div', companyDiv);
const port = 3000;

// uploadsディレクトリ作成
// makeUploadsDirectory();

app.listen(port, () => {
  console.log(`Server is starting...`);
  console.log(`http://localhost:${port}/${sitename}`);
});