import * as React from 'react';

type AuthLoaderProps = {
  children: React.ReactNode;
  renderLoading: () => React.ReactNode;
};

export const AuthLoader = ({ children }: AuthLoaderProps) => {
  // 実際の認証ロジックはここに実装する
  return <>{children}</>;
};