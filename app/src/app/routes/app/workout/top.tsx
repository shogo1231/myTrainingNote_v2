// import '../Top.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalender from '@/features/workout/components/fullCalender';

import { Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import CircleIcon from '@mui/icons-material/Circle';

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

const TestItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const TrainingItem = (props: Training) => {
  const navigate = useNavigate();
  const setStateVal = {
    'date': props.items.execute_date,
    'bodyCode': props.items.body_code,
    'eventCode': props.items.event_code,
  };
  return (
    <div onClick={() => navigate('/training/Log', {state: setStateVal})}>
      <Stack spacing={2}>
        <TestItem className="trainingList">
          <div className="flex">
            <div>{selectBodyPartsIcon(props.items.bodyParts_code)}</div>
            <div className="trainingName">{props.items.trainingEvents_name}</div>
          </div>
          <div className="flex">
            <div>{props.items.totalSetCount}セット  /</div> {/* 種目ごとのセット数を計算して表示 */}
            <div>ボリューム {props.items.totalWeight}kg  /</div> {/* 種目ごとのボリューム数を計算して表示 */}
            <div>推定1RM {props.items.repetitionMaximum}kg</div> {/* 種目ごとの推定1RM数を計算して表示 */}
          </div>
        </TestItem>
      </Stack>
    </div>
  );
};

function selectBodyPartsIcon(bodyPartsCode: number) {
  switch (bodyPartsCode) {
    case 1: // 胸
      return <CircleIcon style={{color: "#ef5350"}}></CircleIcon>;
    case 2: // 背中
      return <CircleIcon style={{color: "#42a5f5"}}></CircleIcon>;
    case 3: // 肩
      return <CircleIcon style={{color: "#66bb6a"}}></CircleIcon>;
    case 4: // 腕
      return <CircleIcon style={{color: "#ec407a"}}></CircleIcon>;
    case 5: // 腹
      return <CircleIcon style={{color: "#8d6e63"}}></CircleIcon>;
    case 6: // 足
      return <CircleIcon style={{color: "#7e57c2"}}></CircleIcon>;
    case 7: // 有酸素
      return <CircleIcon style={{color: "#ffa726"}}></CircleIcon>;
    case 8: // よくやる種目
      return <CircleIcon style={{color: "#26c6da"}}></CircleIcon>;
    default:
      return '';
  }
}


export const App = () => {

  const [isVisible, setIsVisible] = useState({});
  // 子コンポーネントからステートを更新する関数
  const handleVisibilityChange = (newState) => {
    setIsVisible(newState);
  };
  const [trainingDatas, settrainingDatas] = useState([{}]);
  const getTrainingDatas = (newState) => {
    settrainingDatas(newState);
  };

  return (
    <>
      <FullCalender onVisibilityChange={handleVisibilityChange} settrainingDatas = {getTrainingDatas} />
      <br></br>

      {isVisible?.dateStr &&
        <>
          <h2>{isVisible.dateStr || ''}</h2>
          {trainingDatas.map((trainingData: any, index: number) => {
            return <TrainingItem
              key={index}
              items={trainingData}
              date={isVisible.dateStr}
            >
            </TrainingItem>;
          })}
        </>
      }
    </>
  );
}
