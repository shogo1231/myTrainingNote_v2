import * as mongo from '../../mongo.js';

// ローカルDBからサンプルデータを取得
async function getTaskData () {
  const db = await mongo.getDb();

  const result = await db.collection('task')
  .find({})
  .toArray();

  return result;
}

export {
  getTaskData,
}