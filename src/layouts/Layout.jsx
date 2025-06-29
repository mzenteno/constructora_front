import { Outlet } from "react-router-dom";
import { SideBar } from "@layouts/SideBar";
import { NavBar } from "@layouts/NavBar";
import { ExternalScriptsLoader } from "@layouts/ExternalScriptsLoader";

export const Layout = () => {
  return (
    <div className="container-scroller">
      <ExternalScriptsLoader />
      <NavBar />
      <div className="container-fluid page-body-wrapper">
        <SideBar />
        <div className="main-panel">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
