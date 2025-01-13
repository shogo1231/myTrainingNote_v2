// アップロードされるCSVの構造定義
export interface uploadCSVstruct {
  ユーザー: string,
  日付: string,
  部位: string,
  種目: string,
  セット: string,
  重量: string,
  レップ数: string,
  メモ: string,
}

// アップロードCSVの内容を転置した時の構造定義
export interface uploadCSVTranspositionStruct {
  field: string,
  value1: string,
  value2: string,
  value3: string,
  value4: string,
  value5: string,
  value6: string,
  value7: string,
  value8: string,
  value9: string,
  value10: string,
}