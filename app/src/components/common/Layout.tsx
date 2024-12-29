import { FC } from "react";
import Header from './Header';
import Footer from './Footer';

//Outletをインポート
import { Outlet } from 'react-router-dom';

export const Layout: FC = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}