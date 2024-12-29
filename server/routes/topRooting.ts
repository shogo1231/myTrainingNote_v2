/* デバッグ起動時の処理 */

import express from 'express';
import { sitename } from '../../global/settings.js';
// import { makeUploadsDirectory } from './global/make-uploads.js';

// const app = express();
const router = express.Router({
  caseSensitive: true,
  strict: true
});

router.get('/api', (req, res) => {
  res.status(200).send('GET APIリクエスト')
});

export default router;