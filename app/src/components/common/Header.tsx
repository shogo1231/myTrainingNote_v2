import { useState } from "react";

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { IconContext } from 'react-icons'
import { FaUserCircle } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";

// CSS
/*******************************************************************************/
const Wrapper = css`
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-left: auto;
  margin-right: auto;
`;

const sideMenuIcon = css`
  cursor: pointer;
`

const brand = css`
  font-weight: bold;
  font-size: 20px;
`

const siteHeader = css`
  position: relative;
  background-color: #ebffef;
`

const siteHeaderWrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const menuWrapper = (isShow: boolean) => css`
  background-color: rgb(154, 160, 144, 0.5);
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  transform: translateX(-100%);
  transition: transform 0.1s ease;
  z-index: 1; // highChartのグラフが上に表示されるので暫定的に設定。割と上に表示したい要素ではあるため必要に応じて調整する。
  // isShow が true の時に適用するスタイル
  ${isShow && css`
    transform: translateX(0%);
  `}
`

const menu = css`
  background-color: rgb(135, 228, 171);
  width: 200px;
  height: 100vh;
  display: flex;
  .menuList {
    margin: auto;
  }
`

// JS
/*******************************************************************************/
const closeWithClickOutSideMethod = (e, setIsShow) => {
  console.log("e.target", e.target);
  console.log("e.currentTarget", e.currentTarget);
  if (e.target === e.currentTarget) {
    //メニューの外側をクリックしたときだけメニューを閉じる
    console.log("メニューの外側をクリックした");
    setIsShow(false);
  } else {
    console.log("メニューの内側をクリックした");
  }
};

function Header() {
  const [isShow, setIsShow] = useState(false);

  return (
    <>
      <header css={siteHeader}>
        <div css={[Wrapper, siteHeaderWrapper]}>
          <IconContext.Provider value={{ size: '30px' }}>
            <div css={sideMenuIcon} onClick={() => setIsShow(!isShow)}>
              <CiMenuBurger />
            </div>
          </IconContext.Provider>

          <h2 css={brand}>Brand</h2>

          <IconContext.Provider value={{ size: '30px' }}>
            <div className="logonUser">
              <FaUserCircle />
            </div>
          </IconContext.Provider>
        </div>
      </header>

      {/* サイドメニュー */}
      <div
        css={menuWrapper(isShow)}
        onClick={(e) => { closeWithClickOutSideMethod(e, setIsShow); }}
      >
        <div css={menu}>
          <ul className="menuList">
            <li>ここを押しても閉じない</li>
            <li>でも枠外のグレーを押すと</li>
            <li>閉じるよ</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Header;