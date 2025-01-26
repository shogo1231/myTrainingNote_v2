/* デバッグ起動時の処理 */

import express from 'express';
import { sitename } from '../../global/settings.js';
// import { makeUploadsDirectory } from './global/make-uploads.js';
import { ensureResponse } from '../models/modules/ensureResponse.js';
import { errMessage } from '../models/modules/constTable.js';
import * as trainingLog from '../models/workout/trainingLog.js';
import * as uploadCSV from '../models/workout/uploadCSV.js';
import * as workoutPlan from '../models/workout/workoutPlan.js';

// const app = express();
const router = express.Router({
  caseSensitive: true,
  strict: true
});

// 将来的に、ここのルーティングが増えまくると煩雑になる
// ルーティングパスは長くなるが、画面単位でファイル分けし、読み込み式にしたい。
router.get('/getTrainingLog', ensureResponse(
  async (req: any, res: any) => {
    const queryDate = new Date(req.query.date);
    let result = await trainingLog.getTrainingLogData(queryDate);
    res.status(200).send(result);
  },
  errMessage.getData
));


/********************************************************************************************************************/
// CSVアップロード登録
router.post('/registUploadCSVdata', ensureResponse(
  async (req: any, res: any) => {
    const uploadData = req.body;
    await uploadCSV.registUploadCSVdata(uploadData);
    res.status(200).send('OK');
  },
  errMessage.getData
));

/********************************************************************************************************************/
// トレーニング計画取得
router.get('/getWorkoutPlanData', ensureResponse(
  async (req: any, res: any) => {
    const searchDate = req.query.date;
    const result = await workoutPlan.getWorkoutPlanToDate(searchDate);
    res.status(200).send(result);
  },
  errMessage.getData
));

/********************************************************************************************************************/
// 共通ルーティングに移動させる
// CSRFトークンを提供するエンドポイント
router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

export default router;