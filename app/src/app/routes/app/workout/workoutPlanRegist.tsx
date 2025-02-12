// import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import * as createPrompt from '@/features/workout/components/workoutPlanRegist.js';
// import { uploadCSVstruct } from '@/types/structCSV.js';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
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

const buttonStyle = css`
  /* position: fixed; */
  /* right: 10px;
  top: 50%; */
  transform: translateY(-50%);
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
`;

const panelStyle = (isOpen: boolean) => css`
  position: fixed;
  right: ${isOpen ? "0" : "-910px"}; /* 開閉の切り替え、雑だが1080pxの45％が見切れなく表示出来ればOKとしている(パディング値は目視確認) */
  top: 0;
  width: 45%;
  height: 100%;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  padding: 20px;
  transition: right 0.3s ease-in-out;
  overflow-y: auto;
`;

const closeButtonStyle = css`
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
`;


// スクリプト
/*******************************************************************************/

const WorkoutPlanRegist = () => {
  const [workPlanData, setWorkPlanData] = useState({});
  const [CSRFToken, setCSRFToken] = useState(''); // 全画面共通的に持たせる必要があるのでインポート式にしたい。
  const [workPlanDate, setWorkPlanDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false); //chatGPTのプロンプト作成手順画面の表示判定用
  // const [isOpen, setIsOpen] = useState(false); //chatGPTのプロンプト作成手順画面の表示判定用
  const workPlanDateRef = useRef(null); // 最新の日付を即時更新

  // JSONデータ記入欄の変更をハンドリング
  const handleChange = (e: any) => {
    setWorkPlanData(e.target.value);
  };

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

  const handleDateChange = (date) => {
    setWorkPlanDate(date); // UI 更新
    workPlanDateRef.current = date; // 最新の値を即時更新
  };

  const handleOpenChatGPTButtonClick = () => {
    window.open('https://chatgpt.com/', '_blank');
  };

  // トレーニング計画登録ボタンクリックイベント
  const workoutPlanRegist = async () => {
    const URL = `/workoutAPI/workout/workoutPlanRegist`;

    if(!workPlanDate) {
      alert('日付が未選択です。');
      return;
    }
    if(Object.keys(workPlanData).length <= 0) {
      alert('JSONデータが空欄です。');
      return;
    }
    if(!confirm('登録します。よろしいですか？')) { return; }

    // 送信データ整形
    const postData = {
      トレーニング作成日: workPlanDate,
      トレーニング内容: workPlanData,
    }

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "X-CSRF-Token": CSRFToken, // トークンをヘッダーに追加
        },
        body: JSON.stringify(postData)
      });
      if (!response.ok) {
        throw new Error("登録に失敗しました。");
      }
      alert(`登録が成功しました`);
      // 日付とJSONデータ入力欄のリセット
      setWorkPlanDate(null);
      setWorkPlanData({});
    }
    catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : '予期しないエラーが発生しました。');
    }
  }

  return (
    <>
      <div>
        <h1>トレーニング計画作成</h1>
        <div>
          <h3>
            トレーニング作成日付を選択：
          </h3>
          <DatePicker
            selected={workPlanDate}
            dateFormat="yyyy/MM/dd"
            placeholderText="日付選択"
            onChange={handleDateChange}
          />
        </div>
        <div>
          <h3>chatGPTでトレーニング計画のJSONを作成</h3>
          <button onClick={handleOpenChatGPTButtonClick}>
            chatGPTサイトへアクセス
          </button>
          <h4>【Tips】プロンプト作成手順</h4>
          {/* 開くボタン */}
          <button css={buttonStyle} onClick={() => setIsOpen(!isOpen)}>
            開く
          </button>

          {/* サイドパネル */}
          <div css={panelStyle(isOpen)}>
            <button css={closeButtonStyle} onClick={() => setIsOpen(false)}>
              閉じる
            </button>
            <h2>プロンプト作成の解説</h2>
            <createPrompt.Basic />
            <createPrompt.MuscleStrengthImprovement />
          </div>
        </div>
        <div>
          <div>chatGPTが生成したJSONデータを貼り付け（手動作成も可）</div>
          <textarea
            id='workoutPlanInputArea'
            rows={15}
            cols={50}
            value={Object.keys(workPlanData).length > 0 ? JSON.stringify(workPlanData, null, 2) : ''}
            onChange={handleChange}
            placeholder = 'chatGPTが生成したJSONデータを貼り付け（手動作成も可）'
          />
        </div>
        <div>
          <PostingButton onClick={workoutPlanRegist}>登録する</PostingButton>
        </div>
      </div>
    </>
  );
};

export {
  WorkoutPlanRegist,
};
