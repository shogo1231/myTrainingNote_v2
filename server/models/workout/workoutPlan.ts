import { dbSetting } from '../modules/mysql/mysqlConfig.js';
import dayjs from 'dayjs';
import * as group from '../modules/group.js'

interface Obj {
  [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
}
// const rowItem: Obj = {// 初期化するときにそのObjという型で宣言してあげることで、どんなプロパティでも持てる型になる
// }
interface calcRMDatas {
  weight: number
  count: number
}

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
  getWorkoutPlanToDate,
}