/**
 * 数値型かどうか判定する関数
 * @param {string} columnType
 * @returns {boolean}
 */
function isNumericType(columnType: string): boolean {
  // 数値型を示すパターンを正規表現でチェック
  const numericTypePattern = /^(tinyint|smallint|mediumint|int|bigint|decimal|float|double|real|numeric)\b/i;
  return numericTypePattern.test(columnType);
}

export {
  isNumericType,
}