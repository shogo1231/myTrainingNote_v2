// import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { drawDefaultTable_nonTitle } from '@/components/ui/ag-grid.js';
import { uploadCSVstruct } from '@/types/structCSV.js';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import styled from "@emotion/styled";

// 型定義
/*******************************************************************************/
// interface ToggleButtonProps {
//   isActive: boolean;
// }

// CSS
/*******************************************************************************/
const PostingButton = styled.button`
  background-color: #45a049;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
`;


// スクリプト
/*******************************************************************************/
const WorkoutPlan = () => {
  const [workPlanData, setWorkPlanData] = useState({});
  const [CSRFToken, setCSRFToken] = useState(''); // 全画面共通的に持たせる必要があるのでインポート式にしたい。
  const [workPlanDate, setWorkPlanDate] = useState(null);

  const getWorkoutPlanData = async () => {
    const URL = `/workoutAPI/workout/getWorkoutPlanData?date=${workPlanDate}`;

    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("データ取得に失敗しました。");
      }
      const json = await response.json();
      console.log(json);
      setWorkPlanData(json);
      // setWorkPlanData(response)
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


  // Column Definitions: Defines the columns to be displayed.
  const [colDefs] = useState([
    // { field: "ユーザー" },
    { field: "bodyPartsName" },
    { field: "eventName" },
    { field: "setCount" },
    { field: "useWeight" },
    { field: "leps" },
    { field: "memo" },
  ]);

  return (
    <>
      <div>
        <h1>トレーニング計画</h1>
        <span>
          日付選択：
        </span>
        <DatePicker
          selected={workPlanDate}
          dateFormat="yyyy/MM/dd"
          placeholderText="日付選択"
          onChange={(date) => {
            setWorkPlanDate(date);
            getWorkoutPlanData()
          }}
        />
        {workPlanDate && (
          (() => {
            return (
              <>
                {
                  Object.entries(workPlanData).map((rowItem, index) => (
                    <div key={index}>
                      <div>{rowItem[0]}</div>
                      {drawDefaultTable_nonTitle(rowItem[1], colDefs)}
                    </div>
                  ))
                }
              </>
            );
          })()
        )}
        <div>
          <PostingButton>実績登録する</PostingButton>
        </div>
      </div>
    </>
  );
};

export {
  WorkoutPlan,
};
