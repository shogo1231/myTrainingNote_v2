// import path from 'path';
import util from 'util';
const f = util.format;

'use strict';
const settings = (function () {
  // mongoの接続先
  const hostAddr = '127.0.0.1';
  const dbName = 'taskapp';
  // const connectionString = f('mongodb://%s:%s@%s:27017/?authMechanism=%s&authSource=%s',
      // user, password, hostAddr, authMechanism, 'set_user_db_name');
  const connectionString = f('mongodb://%s:27017', hostAddr);
  /******************************************************************************/
  // 外部出力設定
  let exports = {
    connectionString,
    dbName,
  };

  return exports;
})();

export default settings;