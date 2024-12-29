/* デバッグ起動時の処理 */

import express from 'express';
import { sitename } from '../../global/settings.js';
// import { makeUploadsDirectory } from './global/make-uploads.js';
import { ensureResponse } from '../models/modules/ensureResponse.js';
import { errMessage } from '../models/modules/constTable.js';
import * as task from '../models/task/task.js';

// const app = express();
const router = express.Router({
  caseSensitive: true,
  strict: true
});

// 将来的に、ここのルーティングが増えまくると煩雑になる
// ルーティングパスは長くなるが、画面単位でファイル分けし、読み込み式にしたい。
// ドメイン/taskApp/画面名API/処理名　みたいな感じに持っていきたい。
router.get('/getTaskManagementData', ensureResponse(
  async (req: any, res: any) => {
    let result = await task.getTaskData();
  res.status(200).send(result);
  },
  errMessage.getData
));

export default router;