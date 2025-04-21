import logoImage from "@assets/img/logo.svg";

export const NavBarLogo = () => {
  return (
    <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <a className="navbar-brand brand-logo">
          <img src={logoImage} alt="Logo" width={100} height={100} />
        </a>
        <a className="navbar-brand brand-logo-mini">
          <img src="../../assets/images/logo-mini.svg" alt="logo" />
        </a>
      </div>
  )
}
