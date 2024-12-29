import mysql from "mysql2/promise"; // mysql2でasync/awaitを使うためのモジュール
import { MySQLConf } from './config.js'

export async function dbSetting () {
  const db_setting = {
    host : MySQLConf.host,
    user : MySQLConf.user,
    password : MySQLConf.password,
    port : MySQLConf.port,
    database : MySQLConf.database,
    namedPlaceholders: true,
  };
  const connection = await mysql.createConnection(db_setting);

  // const connection = await mysql.createConnection(MySQLConf);
  await connection.connect();
  return connection;
}