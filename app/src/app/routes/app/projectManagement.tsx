// import '../Top.css';
import HighChart from '@/features/projectManagement/components/highChart';

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

// CSS
/*******************************************************************************/
const HighChartGanttArea = css`
`


// JS
/*******************************************************************************/
export const App = () => {
  return (
    <>
      <div id='ganttChart' css={HighChartGanttArea}>
        <HighChart />
      </div>
    </>
  )
}
