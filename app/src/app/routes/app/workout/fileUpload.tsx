// import '../Top.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from "papaparse";


/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

// CSS
/*******************************************************************************/
const HighChartGanttArea = css`
`


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
}

const CsvUploader = () => {
  const [data, setData] = useState({});
  const [CSRFToken, setCSRFToken] = useState(''); // 全画面共通的に持たせる必要があるのでインポート式にしたい。

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
            const groupTodate = Object.groupBy(result.data, (type: uploadCSVstruct) => type.日付);
            setData(groupTodate); // パースしたデータを状態に保存
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

  // 内部関数
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
          <>
            <div>
              <input
                type="button"
                value='登録する'
                onClick={registUploadFile}
              />
            </div>
          </>
        }
        <h2>アップロードデータ:</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
};

export {
  CsvUploader,
};
