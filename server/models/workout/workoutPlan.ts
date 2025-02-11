import { dbSetting } from '../modules/mysql/mysqlConfig.js';
import dayjs from 'dayjs';
import * as group from '../modules/group.js'
import * as typeDef from '../modules/mysql/typeDefinition.js'

interface Obj {
  [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
}

// トレーニング内容（trainingItem）の型定義
interface TrainingItem {
  [eventName: string]: Array<{
    [key: string]: string | number | null;
  }>;
}

// カラム情報の型定義
interface Column {
  COLUMN_NAME: string;
  COLUMN_TYPE: string;
}

/**
 * 対象日付のトレーニング計画を登録
 */
async function workoutPlanRegist (postData: {
  トレーニング作成日: string;
  トレーニング内容: string;
}) {
  try {
    // DB接続
    const connection = await dbSetting();

    // 日付のフォーマット整形
    const trainingDate =  dayjs(new Date(postData.トレーニング作成日)).format('YYYY-MM-DD');
    // postDataをパース
    const trainingItem: TrainingItem = JSON.parse(postData.トレーニング内容);


    // 部位マスタとトレーニング種目マスタを取得
    const [trainingEvents]: any = await connection.execute('SELECT * FROM trainingEvents');
    const [bodyParts]: any = await connection.execute('SELECT * FROM bodyParts');

    // workoutPlansテーブルのカラム名を取得しリスト化
    const [columns]: any = await connection.execute(
      `SELECT COLUMN_NAME, COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = ?`,
      ['workout', 'workoutPlans']);

    const columnNames = columns.map((col: Column) => col.COLUMN_NAME);

    let insertParamArray: string[] = [];
    for(const [eventName, Items] of Object.entries(trainingItem)) {
      for(const item of Items) {

        // カラム名と挿入データをマッチさせてINSERT文を生成
        const valuesStr = columns.map((col: Column) => {
          // bodyPartsName, eventName, executeDate, は送信情報にもってないので手動作成とする
          const colNmane = col.COLUMN_NAME;
          const colType = col.COLUMN_TYPE;
          if (colNmane === 'bodyPartsName') {
            // evetNameから名称一致するデータを取得。そのbodyPartsCodeとbodyPartsCodeを突き合わせて名称を取得する
            const selectEvent = trainingEvents.find((item: any) => item.eventName === eventName);
            // 一旦nullで逃がす。ここで種目マスタに追加、作成後のトレーニング計画データのnullをパッチする処理を最後に追加する必要があり。
            if (!selectEvent) { return 'null'; }
            const selectBodyParts = bodyParts.find((item: any) => item.bodyPartsCode === selectEvent.bodyPartsCode);
            return `'${selectBodyParts?.bodyPartsName || null}'`;
          }
          else if (colNmane === 'eventName') {
            return `'${eventName}'`;
          }
          else if (colNmane === 'executeDate') {
            return `'${trainingDate}'`;
          }
          else {
            const isNmuDefiniton = typeDef.isNumericType(colType);
            if (isNmuDefiniton) { return `${item[colNmane] || null}`; }
            return `'${item[colNmane] || null}'`;
          }
        }).join(', ');

        const insertQuery = `(${valuesStr})`;
        insertParamArray.push(insertQuery);
      }
    }

    // バルクインサート用に上でつくったvaluesの内容をカンマ区切りで結合
    const columnsStr = columnNames.join(', ');
    const insertVal = insertParamArray.join(',');
    const insertQuery = `INSERT INTO workoutPlans (${columnsStr}) VALUES ${insertVal}`;
    await connection.execute(insertQuery);

  }
  catch (err: any) {
    throw new Error(err)
  }
};

/**
 * 対象日付のトレーニング計画を取得
 */
async function getWorkoutPlanToDate (_targetDate:any) {
  try {
    // DB接続
    const connection = await dbSetting();

    // 前方一致させたいので末尾にワイルドカードを追加する
    const targetDate = dayjs(_targetDate).format('YYYY-MM-DD');
    const query = `
      SELECT *
      FROM workoutPlans
      where executeDate = ?;`
    let param = [targetDate];

    const rows = await connection.execute(query, param);

    let rowItems: any = rows[0];
    if (rowItems.length === 0) { return rowItems; }

    // 種目ごとにグループ化する
    const groupToEvent = group.customGroupBy(rowItems, (type: uploadCSVstruct) => type.eventName);

    return groupToEvent;
  }
  catch (err: any) {
    throw new Error(err)
  }
};

export {
  workoutPlanRegist,
  getWorkoutPlanToDate,
}