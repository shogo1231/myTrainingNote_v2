// import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Papa from "papaparse";
import { drawDefaultTable, execTansposition, drawTranspositionTable } from '@/components/ui/ag-grid.js';
import { uploadCSVstruct } from '@/types/structCSV.js';

import styled from "@emotion/styled";

// 型定義
/*******************************************************************************/
interface ToggleButtonProps {
  isActive: boolean;
}

// 転置後の行データの型定義
interface TransposedRow {
  field: string;
  [key: string]: string | number | boolean; // 動的キーに対応
}

// 転置後の列定義の型定義
interface ColumnDef {
  headerName: string;
  field: string;
}

// CSS
/*******************************************************************************/
const ToggleButton = styled.button<ToggleButtonProps>`
  background-color: ${({ isActive }) => (isActive ? "#4caf50" : "#f44336")};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#45a049" : "#e53935")};
  }
`;


// スクリプト
/*******************************************************************************/
const CsvUploader = () => {
  const [data, setData] = useState({});
  const [CSRFToken, setCSRFToken] = useState(''); // 全画面共通的に持たせる必要があるのでインポート式にしたい。
  const [isActive, setIsActive] = useState(false); // アップロード内容の行列表示(true:行表示, false:列表示)

  /**
   * 行列表示ボタンクリックイベント
   */
  const handleToggle = () => {
    setIsActive((prevState) => !prevState);
  };

  /**
   * ファイルアップ後のイベント
   * @param event
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        // reader.result は string | ArrayBuffer なので、型アサーションを使用
        const csvText = reader.result as string;
        Papa.parse<uploadCSVstruct>(csvText, {
          header: true, // ヘッダー行をパースする
          skipEmptyLines: true, // 空行をスキップする
          complete: (result: Papa.ParseResult<uploadCSVstruct>) => {
            // オブジェクトで保持されていそうなので日付ごとにグループ化してみる
            const groupToDate = Object.groupBy(result.data, (type: uploadCSVstruct) => type.日付);
            setData(groupToDate); // パースしたデータを状態に保存
            // グループ化されたデータをさらに種目でグループ化して配列に変換する。
            const result2 = [];
            for(const [dateKey, item] of Object.entries(groupToDate)) {
              const groupToDateAndMenu = Object.groupBy(item, (type: uploadCSVstruct) => type.種目);
              const result: Record<string, uploadCSVstruct[]> = {};

              for(const [groupKey, groupItem] of Object.entries(groupToDateAndMenu)) {
                const colName = `${dateKey}_${groupKey}`;
                const afterRenameItem = { [colName]: groupItem };
                Object.assign(result, afterRenameItem);
                result2.push(groupItem);
              }
            }
            setRowData(result2);
          },
        });
      };
      reader.readAsText(file);
    }
  };

  const registUploadFile = async () => {
    const URL = `/workoutAPI/workout/registUploadCSVdata`;

    if(!confirm('アップロード内容を登録します。よろしいですか？')) { return; }

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "X-CSRF-Token": CSRFToken, // トークンをヘッダーに追加
        },
        credentials: "include", // クッキーを送信
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error("登録に失敗しました。");
      }
      alert(`登録が成功しました`);
    }
    catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : '予期しないエラーが発生しました。');
    }
  }

  // 内部関数（共通コンポーネント側で処理を実行して呼び出すよう変更すべき）
  async function getToken() {
    const fetchData = async () => {
      try {
        fetch('/workoutAPI/workout/csrf-token')
        .then(res => res.json())
        .then(json => {
          console.log(json);
          setCSRFToken(json.csrfToken);
        })
      }
      catch (e) {
        console.error(e);
      }
    };
    await fetchData();
  }

  useEffect(() => {
    if (!CSRFToken) {
      getToken(); // 初回レンダリング時のみ実行
    }
  },[CSRFToken]); // 空配列を渡して無限ループを防ぐ


  const [rowData, setRowData] = useState([]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs] = useState([
    { field: "ユーザー" },
    { field: "部位" },
    { field: "種目" },
    { field: "セット" },
    { field: "重量" },
    { field: "レップ数" },
  ]);

  const [transRowData, setTransRowData] = useState<TransposedRow[][]>([]);
  const [transColData, setTransColData] = useState<ColumnDef[][]>([]);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      // データが存在する場合に処理を実行
      const transposedRowsList = [];
      const transposedColumnsList = [];
      for (const rowItem of rowData) {
        const { transposedRows, transposedColumns } = execTansposition(rowItem);
        transposedRowsList.push(transposedRows);
        transposedColumnsList.push(transposedColumns);
      }
      setTransRowData(transposedRowsList);
      setTransColData(transposedColumnsList);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]); // ファイルアップイベントが発火する度に実行される

  return (
    <>
      <div>
        <h1>CSVアップロード</h1>
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>
        {Object.keys(data).length > 0 &&
          <div>
            <input
              type="button"
              value='登録する'
              onClick={registUploadFile}
            />
          </div>
        }
        <h2>
          アップロード内容
          <ToggleButton isActive={isActive} onClick={handleToggle}>
            {isActive ? "行表示" : "列表示"}
          </ToggleButton>
        </h2>
        {Object.keys(data).length > 0 && (
          (() => {
            return (
              <>
                {isActive ? (
                  rowData.map((rowItem, index) => (
                    <div key={index}>
                      {drawDefaultTable(rowItem, colDefs)}
                    </div>
                  ))
                ) : (
                  transRowData.map((transRowItem, index) => {
                    // const transformedRows = transRowItem.map((item) => ({
                    //   value1: item.field1,
                    //   value2: item.field2,
                    //   value3: "", // 必要に応じて設定
                    //   value4: false, // 必要に応じて設定
                    // }));

                    <div key={index}>
                      {drawTranspositionTable(transRowItem, transColData[index])}
                    </div>
                  })
                )}
                <div>JSONデータ表示</div>
                <textarea
                  id='uploadDataJson'
                  rows={15}
                  cols={100}
                  value={JSON.stringify(data, null, 2)}
                  readOnly
                />
              </>
            );
          })()
        )}
      </div>
    </>
  );
};

export {
  CsvUploader,
};
