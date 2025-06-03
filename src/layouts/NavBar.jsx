import { useI18n } from "@store/I18nContext";
import { useAuthContext } from "@store/AuthContext";
import { useNavigate } from "react-router-dom";
import { NavBarLogo } from "@layouts/NavBarLogo";
import faceImage from "@assets/img/face.png";
import { GlobeIcon } from "@assets/icons/GlobeIcon";
import { MenuIcon } from "@assets/icons/MenuIcon";
import { LogOutIcon } from "@assets/icons/LogOutIcon";
import { PasswordIcon } from "@assets/icons/PasswordIcon";

export const NavBar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { t, changeLanguage } = useI18n();

  const handleLanguajeClick = (event, languaje) => {
    event.preventDefault();
    changeLanguage(languaje);
  };

  const handlerChangePasswordClick = (event) => {
    event.preventDefault();
    navigate("/change-password");
  };

  const handlerLogOutClick = (event) => {
    event.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <NavBarLogo />
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
          <MenuIcon size={16} color="#000000" strokeWidth={1} />
        </button>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item dropdown">
            <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-toggle="dropdown">
              <GlobeIcon size={19} color="#000000" strokeWidth={2.5} />
            </a>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
              <div className="dropdown-divider"></div>
              <a className="dropdown-item preview-item" onClick={(e) => handleLanguajeClick(e, "en")}>
                <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                  <h6 className="preview-subject font-weight-normal mb-1">{t("navbar.languaje-english")}</h6>
                </div>
              </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item preview-item" onClick={(e) => handleLanguajeClick(e, "es")}>
                <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                  <h6 className="preview-subject font-weight-normal mb-1">{t("navbar.languaje-spanish")}</h6>
                </div>
              </a>
            </div>
          </li>
          <li className="nav-item nav-profile dropdown">
            <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
              <div className="nav-profile-img">
                <img src={faceImage} alt="image" />
              </div>
              <div className="nav-profile-text">
                <p className="mb-1">{user.userName}</p>
              </div>
            </a>
            <div className="dropdown-menu navbar-dropdown dropdown-menu-right p-0 border-0 font-size-sm" aria-labelledby="profileDropdown" data-x-placement="bottom-end">
              <div className="p-3 text-center bg-primary">
                <img className="img-avatar img-avatar48 img-avatar-thumb" src={faceImage} alt="" />
              </div>
              <div className="p-2">
                <h5 className="dropdown-header text-uppercase pl-2 text-dark mt-2">{t("navbar.user-option")}</h5>
                <a className="dropdown-item py-1 d-flex align-items-center justify-content-between" onClick={(e) => handlerChangePasswordClick(e, "es")}>
                  <span>{t("navbar.user-option-change-password")}</span>
                  <PasswordIcon size={16} color="#000000" strokeWidth={1.2} />
                </a>
                <a
                  className="dropdown-item py-1 d-flex align-items-center justify-content-between"
                  href="#"
                  onClick={(e) => {
                    handlerLogOutClick(e);
                  }}>
                  <span>{t("navbar.user-option-logout")}</span>
                  <LogOutIcon size={18} color="#000000" strokeWidth={1.4} />
                </a>
              </div>
            </div>
          </li>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            <MenuIcon width={18} height={18} />
          </button>
        </ul>
      </div>
    </nav>
  );
};
