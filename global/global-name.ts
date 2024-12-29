import { fileURLToPath, URL } from 'url';
import path from 'path';

/**********************************************************************/
// 関数
/**
 * __filename,__dirname取得
 * @param {string | URL} metaUrl import.meta.url
 * @description ESM形式では__filename,__dirnameは使用できないがこの処理を通せば同じものを使用できる
 */
function getGlobalName (metaUrl: string | URL) {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = path.dirname(__filename);

  return { __filename, __dirname };
}

/**********************************************************************/
// エクスポート設定
export {
  getGlobalName
};
