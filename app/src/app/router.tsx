// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { Layout } from '../components/common/Layout';
// import * as root from '../components/interface';

// /**
//  * memo
//  * Routes下のRouteは上から順に評価される
//  * つまり、ログイン画面などLayout（ヘッダやフッタなどの共通コンポーネントを使いたくない画面）を
//  * 使いたくない画面のpathを上に持ってくることで実装可能
//  * 現状はTopで確認できる。
//  */

// const Router = () => {
//   return  (
//     <BrowserRouter>
//       <Routes>
//         {/* <Route path="/Top" element={<Top />} /> */}
//         <Route path="/" element={<Layout />}>
//           <Route path="/Top" element={<root.Top />} />
//           <Route path="/ProjectManagement" element={<root.ProjectManagement />} />
//           <Route path="*" element={ <p>There's nothing here!</p> } />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default Router;


// import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  LoaderFunctionArgs,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

// import { ProtectedRoute } from '@/lib/auth';

import { AppRoot } from './routes/app/root';

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: '/taskApp',
      element: (
        // <ProtectedRoute>
          <AppRoot />
        // </ProtectedRoute>
      ),
      children: [
        {
          path: 'projectManagement',
          lazy: async () => {
            const { App } = await import('./routes/app/projectManagement');
            return { Component: App };
          },
        },
        // ここでもnotFoundの定義をしておくか、共通的なエラーパスとするか・・・
      ],
    },
    {
      path: '/workout',
      element: (
        // <ProtectedRoute>
          <AppRoot />
        // </ProtectedRoute>
      ),
      children: [
        {
          path: 'top',
          lazy: async () => {
            const { App } = await import('./routes/app/workout/top');
            return { Component: App };
          },
        },
        {
          path: 'fileUpload',
          lazy: async () => {
            const { CsvUploader } = await import('./routes/app/workout/fileUpload');
            return { Component: CsvUploader };
          },
        },
        {
          path: 'workoutPlan',
          lazy: async () => {
            const { WorkoutPlan } = await import('./routes/app/workout/workoutPlan');
            return { Component: WorkoutPlan };
          },
        },
        // ここでもnotFoundの定義をしておくか、共通的なエラーパスとするか・・・
      ],
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('./routes/not-found');
        return { Component: NotFoundRoute };
      },
    }
  ]);


export const AppRouter = () => {
  // const queryClient = useQueryClient();
  // const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
