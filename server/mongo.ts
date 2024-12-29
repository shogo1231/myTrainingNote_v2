import settings from './settings.js';
import { MongoClient } from 'mongodb';

let clientPromise = getClientPromise();
clientPromise.catch((err) => { console.log(err); });

async function getClient() {
  return await getClientWithRetry();
};

async function getDb (name = settings.dbName) {
  const client = await getClientWithRetry();
  return client.db(name);
};

/**
 * MongoDB接続
 * @returns {Promise<any>}
 */
function getClientPromise () {
  return MongoClient.connect(settings.connectionString, {});
}

/**
 * MongoClient取得(リトライ込み)
 * @param {Number} cnt リトライカウント
 * @returns {Promise<any>}
 */
async function getClientWithRetry (cnt = 0) {
  try {
    let client = await clientPromise;
    if (cnt > 0) { console.log(`MongoDB接続リトライ${cnt}回目: 成功`); }
    return client;
  }
  catch (err) {
    let msg = cnt === 0 ? 'MongoDB接続リトライ開始' : `MongoDB接続リトライ${cnt}回目: ${err}`;
    console.log(msg);
    if (cnt >= 10) {
      throw new Error('MongoDBへの接続リトライに失敗しました。');
    }

    // 3秒待機後にDB接続をリトライする
    await new Promise((res) => { setTimeout(res, 3000); });

    clientPromise = getClientPromise();

    return getClientWithRetry(cnt + 1);
  }
}

export {
  getClient,
  getDb,
}