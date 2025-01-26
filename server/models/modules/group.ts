/**
 * Array<object>型のデータに対して特定カラムでグループ化するメソッド
 * @param {array} array
 * @param {function} callback
 * @returns
 */
function customGroupBy<T>(array: T[], callback: (item: T) => string): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const key = callback(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export {
  customGroupBy,
}