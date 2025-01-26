import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { uploadCSVstruct, uploadCSVTranspositionStruct } from '@/types/structCSV.js';

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

// 型定義
/*******************************************************************************/
// 元データの型定義
interface OriginalRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
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
const defaultTable = css`
  margin: 20px 0 50px 0;
`

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * デフォルトのテーブル描画
 * @param rowData
 * @param colDefs
 */
function drawDefaultTable (rowData: Array<uploadCSVstruct>, colDefs: Array<object>) {
  const rowHeight = 50;
  const colWidth = 200;
  const dynamicHeight = rowData.length > 0 ? rowData.length * rowHeight + 50 : 100;
  const dynamicWidth = colDefs.length > 0 ? colDefs.length * colWidth : 500;

  // タイトル用に日付と種目名を設定
  const dispTitle = `${rowData[0].日付} ${rowData[0].種目}`;
  return (
    <>
      <div
        // define a height because the Data Grid will fill the size of the parent container
        style={{ height: dynamicHeight, width: dynamicWidth }}
        css={defaultTable}
      >
        {dispTitle}
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
        />
      </div>
    </>
  );
}

/**
 * デフォルトのテーブル描画(タイトルなし)
 * @param rowData
 * @param colDefs
 */
function drawDefaultTable_nonTitle (rowData: Array<uploadCSVstruct>, colDefs: Array<object>) {
  const rowHeight = 50;
  const colWidth = 200;
  const dynamicHeight = rowData.length > 0 ? rowData.length * rowHeight + 50 : 100;
  const dynamicWidth = colDefs.length > 0 ? colDefs.length * colWidth : 500;

  return (
    <>
      <div
        // define a height because the Data Grid will fill the size of the parent container
        style={{ height: dynamicHeight, width: dynamicWidth }}
        css={defaultTable}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
        />
      </div>
    </>
  );
}

/**
 * 行と列を転置したテーブル描画
 * @param rowData
 * @param colDefs
 */
// データを転置する関数
const execTansposition = (data: OriginalRow[]): { transposedRows: TransposedRow[]; transposedColumns: ColumnDef[] } => {
  const keys = Object.keys(data[0]) as (keyof OriginalRow)[];

  // 転置された行データを作成
  const transposedRows: TransposedRow[] = keys.map((key) => {
    const transposedRow: TransposedRow = { field: key };
    data.forEach((row, index) => {
      transposedRow[`value${index + 1}`] = row[key];
    });
    return transposedRow;
  });

  // 転置された列定義を作成
  const transposedColumns: ColumnDef[] = [
    { headerName: '項目名', field: 'field' },
    ...data.map((_, index) => ({
      headerName: `${index + 1}セット目`,
      field: `value${index + 1}`,
    })),
  ];

  return { transposedRows, transposedColumns };
}

/**
 * 行と列を転置したテーブル描画
 * @param rowData
 * @param colDefs
 */
function drawTranspositionTable (rowData: Array<uploadCSVTranspositionStruct>, colDefs: Array<object>) {
  const rowHeight = 50;
  const colWidth = 200;
  const dynamicHeight = rowData.length > 0 ? rowData.length * rowHeight + 50 : 100;
  const dynamicWidth = colDefs.length > 0 ? colDefs.length * colWidth : 500;

  // タイトル用に日付と種目名を設定
  const selectDispDate = rowData.find((row) => { return row.field === '日付' });
  const selectDispMenu = rowData.find((row) => { return row.field === '種目' });
  const dispTitle = `${selectDispDate?.value1 ?? ''} ${selectDispMenu?.value1 ?? ''}`;

  return (
    <>
      <div
        // define a height because the Data Grid will fill the size of the parent container
        style={{ height: dynamicHeight, width: dynamicWidth }}
        css={defaultTable}
      >
        {dispTitle}
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
        />
      </div>
    </>
  );
}

export {
  drawDefaultTable,
  drawDefaultTable_nonTitle,
  execTansposition,
  drawTranspositionTable,
};