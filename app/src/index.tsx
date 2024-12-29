// import * as React from 'react';
// import * as ReactDOM from 'react-dom/client';
// import  Router from "./app/router";

// /** @jsxImportSource @emotion/react */
// import { Global, css } from '@emotion/react';

// // CSS
// /*******************************************************************************/
// const globalStyles = css`
//   body {
//     margin: 0px;
//     padding: 0px;
//   }
// `

// // JS
// /*******************************************************************************/
// const rootElement = document.getElementById('root')
// ReactDOM.createRoot(rootElement!).render(
//   <>
//     <Global styles={globalStyles} />
//     <React.StrictMode>
//       <Router />
//     </React.StrictMode>
//   </>
// );


import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';

/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';

// CSS
/*******************************************************************************/
const globalStyles = css`
  body {
    margin: 0px;
    padding: 0px;
  }
`

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

createRoot(root).render(
  <>
    <Global styles={globalStyles} />
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </>
);
