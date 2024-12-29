import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, useLocation } from 'react-router-dom';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export const AppRoot = () => {
  const location = useLocation();
  return (
    <Suspense
      fallback={
        <div className="flex size-full items-center justify-center">
        </div>
      }
    >
      {/* <ErrorBoundary
        key={location.pathname}
        fallback={<div>Something went wrong!</div>}
      > */}
        <Header />
        <Outlet />
        <Footer />
      {/* </ErrorBoundary> */}
    </Suspense>
  );
};
