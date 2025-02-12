import { useState, useRef } from 'react';
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

// Emotion
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

// グローバル変数
const jsonData = {
  "eventName": [
    { setCount: '1', useWeight: 100, leps: 10, rest: 60, memo: '' },
    { setCount: '2', useWeight: 100, leps: 10, rest: 60, memo: '' },
    { setCount: '3', useWeight: 100, leps: 10, rest: 60, memo: '' },
  ],
  "eventName2": [
    { setCount: '1', useWeight: 100, leps: 10, rest: 60, memo: '' },
    { setCount: '2', useWeight: 100, leps: 10, rest: 60, memo: '' },
    { setCount: '3', useWeight: 100, leps: 10, rest: 60, memo: '' },
  ],
};

// CSS
/*******************************************************************************/
const hoverStyle = css`
  cursor: pointer;
`;

// JS
/*******************************************************************************/
// リファクタの方向性について
// 基本形は構造定義のみ（ボタンやコピー機能は共通）、肥大化する事を考慮、プロンプトの一部が可変になりそう、また拡張出来るような基本構造とする

// 基本（10回3セット）のメニューを作成するTips
const Basic = () => {
  const [isOpen_basic, setIsopen_basic] = useState(false);

  // トグルボタンがクリックされたときに呼ばれる関数
  const toggle = () => {
    setIsopen_basic(!isOpen_basic);
  };

  const contentRef = useRef(null);

  const handleCopy = () => {
    if (contentRef.current) {
      const textToCopy = (contentRef.current as HTMLElement).innerText;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          alert("コピーしました！")
        })
        .catch((err) => console.error("コピーに失敗しました: ", err));
    }
  };

  return (
    <>
      {/* ボタンとしての表示 */}
      <h2 onClick={toggle} css={hoverStyle}>
        {/* isOpen_basicがtrueならGoTriangleRight, falseならGoTriangleDown */}
        {isOpen_basic ? <GoTriangleDown /> : <GoTriangleRight />}
        基本（10回3セット）のメニューを作成するTips
      </h2>
      {isOpen_basic && (
        // この内容をコピーできる機能が欲しい（楽したい、スマホ対応したい）
        <>
          <div>
            <button onClick={handleCopy}>コピー</button>
            <div ref={contentRef}>
              <h4>命令文</h4>
              <div>
                  <p>あなたはプロのフィットネス・トレーナーです。以下の情報を基に、初心者向けのトレーニングメニューを考えてください。</p>
                  <p>トレーニング内容は、よく考えたうえで、短く簡潔にまとめた文章で説明してください。また、下記の条件にしたがってよく考えてから最後に示すJSON形式に沿って記述してください。</p>
              </div>

              <h4>トレーニング対象となる人物</h4>
              <div>
                <span>
                  <div><strong>・性別：</strong>男性</div>
                  <div><strong>・身長：</strong>175cm</div>
                  <div><strong>・体重</strong>75kg</div>
                </span>
              </div>

              <h4>トレーニングをする目的</h4>
              <div>
                <span>
                  <div>・体つくり</div>
                  <div>・健康促進</div>
                </span>
              </div>

              <h4>想定する期間</h4>
              <div>
                <span>
                  <div>・週3ペースで、土日は必須とする</div>
                </span>
              </div>

              <h4>その他条件について</h4>
              <div>
                <span>
                  <div>・初心者向けのトレーニングが知りたい</div>
                  <div>・1回のトレーニングは1時間以内に抑えたい</div>
                </span>
              </div>

              <h4>#出力形式</h4>
              <div>
                <div><strong>・以下のJSON形式に従うこと</strong></div>
                <div>・eventNameやsetCount等は作成メニューに応じて自由に調整可能です。</div>
                <div>・JSON形式はくずさない事</div>
                <div>・JSONデータは1データで出力しないこと、必ず曜日ごとに1つずつJSONで出力してください。</div>
                <div>・eventNameは日本語で出力してください</div>
                <div>{JSON.stringify(jsonData, null, 2)}</div>
              </div>
            </div>
            <p>[参考]サンプルJSONデータ...</p>
          </div>
        </>
      )}
    </>
  );
};

// 筋力向上メニューを作成するTips
const MuscleStrengthImprovement = () => {
  const [isOpen, setIsopen] = useState(false);

  // トグルボタンがクリックされたときに呼ばれる関数
  const toggle = () => {
    setIsopen(!isOpen);
  };

  return (
    <>
      {/* ボタンとしての表示 */}
      <h2 onClick={toggle} css={hoverStyle}>
        {/* isOpen_basicがtrueならGoTriangleRight, falseならGoTriangleDown */}
        {isOpen ? <GoTriangleDown /> : <GoTriangleRight />}
        筋力向上メニューを作成するTips
      </h2>
      {isOpen && (
        <>
          <div>
            <h4>命令文</h4>
            <div>
                <p>あなたはプロのフィットネス・トレーナーです。以下の情報を基に、筋力向上向けのトレーニングメニューを考えてください。</p>
                <p>トレーニング内容は、よく考えたうえで、短く簡潔にまとめた文章で説明してください。また、下記の条件にしたがってよく考えてから最後に示すJSON形式に沿って記述してください。</p>
            </div>

            <h4>トレーニング対象となる人物</h4>
            <div>
              <span>
                <div><strong>・性別：</strong>男性</div>
                <div><strong>・身長：</strong>175cm</div>
                <div><strong>・体重</strong>75kg</div>
              </span>
            </div>

            <h4>トレーニングをする目的</h4>
            <div>
              <span>
                <div>・筋力向上</div>
                <div>・BIG3（ベンチプレス、スクワット、デッドリフト）の最大挙上重力を伸ばす</div>
              </span>
            </div>

            <h4>想定する期間</h4>
            <div>
              <span>
                <div>・週5ペースで、土日は必須とする</div>
              </span>
            </div>

            <h4>各種目の1RM</h4>
            <div>
              <span>
                <div><strong>・ベンチプレス：</strong>100kg</div>
                <div><strong>・スクワット：</strong>130kg</div>
                <div><strong>・デッドリフト</strong>160kg</div>
              </span>
            </div>

            <h4>その他条件について</h4>
            <div>
              <span>
                <div>・上級向けのトレーニングが知りたい</div>
                <div>・1回のトレーニングは1時間以内に抑えたい</div>
                <div>・各実施種目は1RMを考慮したうえでよく考える事</div>
                <div>・JSON形式はくずさない事</div>
              </span>
            </div>

            <h4>#出力形式</h4>
            <div>
            <div>
              <strong>・以下のJSON形式に従うこと</strong></div>
              <div>・eventNameやsetCount等は作成メニューに応じて自由に調整可能です。</div>
              <div>・JSON形式はくずさない事</div>
              <div>・JSONデータは1データで出力しないこと、必ず曜日ごとに1つずつJSONで出力してください。</div>
              <div>・eventNameは日本語で出力してください</div>
              <div>{JSON.stringify(jsonData, null, 2)}</div>
            </div>

            <p>[参考]サンプルJSONデータ...</p>
          </div>
        </>
      )}
    </>
  );
};

export {
  Basic,
  MuscleStrengthImprovement,
};