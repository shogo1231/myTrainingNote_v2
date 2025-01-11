// import '../Top.css';
// import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Papa from "papaparse";

import { drawDefaultTable, execTansposition, drawTranspositionTable } from '../../../../components/ui/ag-grid.js';

// /** @jsxImportSource @emotion/react */
// import { css } from "@emotion/react";
import styled from "@emotion/styled";

// CSS
/*******************************************************************************/
const ToggleButton = styled.button`
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


// JS
/*******************************************************************************/
interface Training {
  children: never[],
  key: number,
  items: any,
  date: never,
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
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        Papa.parse(reader.result, {
          header: true, // ヘッダー行をパースする
          skipEmptyLines: true, // 空行をスキップする
          complete: (result) => {
            // オブジェクトで保持されていそうなので日付ごとにグループ化してみる
            const groupToDate = Object.groupBy(result.data, (type: uploadCSVstruct) => type.日付);
            setData(groupToDate); // パースしたデータを状態に保存
            // グループ化されたデータをさらに種目でグループ化して配列に変換する。
            const result2 = [];
            for(const [dateKey, item] of Object.entries(groupToDate)) {
              const groupToDateAndMenu = Object.groupBy(item, (type: uploadCSVstruct) => type.種目);
              const result = {};
              for(const [groupKey, groupItem] of Object.entries(groupToDateAndMenu)) {
                const colName = `${dateKey}_${groupKey}`;
                const afterRenameItem = { [colName]: groupItem };
                Object.assign(result, afterRenameItem);
              }
              console.log(result);

              for(const data of item) {
                result2.push(data);
              }
            }
            console.log(result2);
            setRowData(result2);
            // その結果をstateに更新する。
            // 先頭データのkey値を使って列名を定義する。その結果をstateに更新する。
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
      alert(err.message || "エラーが発生しました。");
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


  const [rowData, setRowData] = useState([
    // { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    // { make: "Ford", model: "F-Series", price: 33850, electric: false },
    // { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "ユーザー" },
    { field: "部位" },
    { field: "種目" },
    { field: "セット" },
    { field: "重量" },
    { field: "レップ数" },
  ]);

  const [transRowData, setTransRowData] = useState([]);
  const [transColData, setTransColData] = useState([]);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      // データが存在する場合に処理を実行
      const { transposedRows, transposedColumns } = execTansposition(rowData);
      setTransRowData(transposedRows);
      setTransColData(transposedColumns);
    }
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
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index}>
                    {isActive
                      ? drawDefaultTable(rowData, colDefs)
                      : drawTranspositionTable(transRowData, transColData)}
                  </div>
                ))}
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
