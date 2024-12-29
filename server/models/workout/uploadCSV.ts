import { dbSetting } from '../modules/mysql/mysqlConfig.js';
import dayjs from 'dayjs';

interface Obj {
  [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
}

// アップロードされるCSVの構造定義
interface uploadCSVstruct {
  ユーザー: string,
  日付: string,
  部位: string,
  種目: string,
  セット: string,
  重量: string,
  レップ数: string,
  メモ: string,
}

/**
 * 対象日付のトレーニング履歴を取得
 */
async function registUploadCSVdata (uploadData: Obj) {
  try {
    // DB接続
    const connection = await dbSetting();

    // bodyPartsとtrainingEventsコードの取得を行う
    const [bodyPartsItem] = await connection.query(
      'SELECT * FROM bodyParts;'
    );
    const [trainingEventsItem] = await connection.query(
      'SELECT * FROM trainingEvents;'
    );

    // 日付ごとにグループ化されたデータがクライアントより渡される（同じ日付に複数種目が混在する）
    // 日付ごとにデータを取り出し、かつ種目ごとに更新クエリを作成しINSERT処理を行う。
    for (const [key, uploadItems] of Object.entries(uploadData)) {
      // 日付単位での全データが保持されている
      // 種目ごとにグループ化する。セット数ふくめて1レコードにまとめてから登録する必要があるため。
      const groupToEvent = customGroupBy(uploadItems, (type: uploadCSVstruct) => type.種目);

      // 種目ごとの更新クエリ作成
      let updateQuery = [];
      for (const [eventName, eventItems] of Object.entries(groupToEvent)) {
        const executDate = `"${eventItems[0].日付} 00:00:00"`;
        const bodyPartsCode: number = selectBodyPartsCode(eventItems[0].部位, bodyPartsItem); // 変換対象
        const eventCode: number = selectEventCode(eventItems[0].種目, bodyPartsCode, trainingEventsItem); // 変換対象
        const memo = eventItems[0].メモ || '""';
        let columnQueryDetail = '';
        let updateQueryDetail = '';

        eventItems.forEach((registItem, i) => {
          // セット数、重量、レップ数の順に定義
          let colQuery =  `setCount${i+1}, useWeight${i+1}, leps${i+1}, `;
          columnQueryDetail = columnQueryDetail.concat(colQuery);
          let valueQuery = `${Number(registItem.セット)}, ${Number(registItem.重量)}, ${Number(registItem.レップ数)}, `;
          updateQueryDetail = updateQueryDetail.concat(valueQuery);
        });

        // １レコード当たりの更新クエリ作成
        const makeUpdateQuery = `
          INSERT INTO workout.trainingLogs (executeDate, bodyPartsCode, eventCode, ${columnQueryDetail} rest, memo)
          VALUES (${executDate}, ${bodyPartsCode}, ${eventCode}, ${updateQueryDetail} null, ${memo});
          `;
        updateQuery.push(makeUpdateQuery);
      }

      // 種目ごとの更新クエリ実行
      for (const query of updateQuery) {
        await connection.execute(query);
      }
    }
  }
  catch (err: any) {
    throw new Error(err)
  }
};

/**
 * 部位名から部位コードを取得する
 * @param {string} bodyPartsName
 * @param {Array<object>} bodyPartsItem
 */
function selectBodyPartsCode(bodyPartsName: string, bodyPartsItem: Array<object>) {
  // 部位名と一致する部位コードを取得
  const result = bodyPartsItem.find((item) => { return item.bodyPartsName === bodyPartsName; });
  return result.bodyPartsCode;
}

/**
 * 部位名,種目名から種目コードを取得する
 * @param {string} trainingEventName
 * @param {number} bodyPartsCode
 * @param {Array<object>} trainingEventsItem
 */
function selectEventCode(trainingEventName: string, bodyPartsCode: string, trainingEventsItem: Array<object>) {
  // 部位名と一致する部位コードを取得
  const result = trainingEventsItem.find((item) => {
    return item.bodyPartsCode === bodyPartsCode && item.eventName === trainingEventName;
  });
  return result?.eventCode || null;
}

function customGroupBy<T>(array: T[], callback: (item: T) => string): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const key = callback(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export {
  registUploadCSVdata,
}