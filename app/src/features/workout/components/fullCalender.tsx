import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import interactionPlugin from "@fullcalendar/interaction";

// Emotion
/** @jsxImportSource @emotion/react */
// import { css } from "@emotion/react";

// interface Obj {
//   [prop: string | number]: string | number // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
// }

// CSS
/*******************************************************************************/
// const Wrapper = css`
//   width: 80%;
//   margin-left: auto;
//   margin-right: auto;
// `;

// JS
/*******************************************************************************/


// Propsの型を定義
type FullCalendarProps = {
  onVisibilityChange: (newState: object) => void; // 関数の型
  settrainingDatas: (newState: object) => void; // 関数の型
};


const FullCalender = ({ onVisibilityChange, settrainingDatas }: FullCalendarProps) => {

  // 引数infoはFullCalendarのdateClickInfoを参照しているのでanyにしておく
  const handleDateClick = (info: any) => {
    // 日付をクリックしたタイミングで日付と一致するトレーニング履歴データを取得しstateを更新しておく
    const URL = `/workoutAPI/workout/getTrainingLog?date=${info.dateStr}`;
    const fetchData = async () => {
      try {
        fetch(URL)
        .then(res => res.json())
        .then(json => {
          settrainingDatas(json);
        })
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }

  return (
    <>
      <div className='calenderArea'>
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="dayGridWeek"
          locales={[jaLocale]}
          locale='ja'
          // dateClickInfoでクリックした日付の情報を参照できる
          dateClick={async (dateClickInfo) => {
            await handleDateClick(dateClickInfo);

            // 現在の状態を使ってstate更新
            const newState = dateClickInfo;
            // 親に新しい状態を通知
            onVisibilityChange(newState);
          }}
          // weekends={true} // 週末を強調表示する。
          titleFormat={{ // タイトルのフォーマット。
            year: 'numeric',
            month: 'short',
          }}
          // customButtons= {{ // カスタムボタン設置用
          //   'change': {
          //     text: '週表示',
          //     click: function() {
          //       alert('clicked the custom butto n!');
          //     }
          //   }
          // }}
          headerToolbar={{ // カレンダーのヘッダー設定。
            start: 'title',
            center: 'dayGridMonth,dayGridWeek',
            right: 'prev,next today',
          }}
          buttonText={ {
            today: '今日',
            month: '月表示',
            week: '週表示',
            list: 'リスト'
          }}
          height={ 300 }
        />
      </div>
    </>
  );
};

export default FullCalender;