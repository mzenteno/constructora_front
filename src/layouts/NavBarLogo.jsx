import logoImage from "@assets/img/logo.png";

export const NavBarLogo = () => {
  return (
    <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
      <a className="navbar-brand brand-logo">
        <img src={logoImage} alt="Logo" width={210} height={45} />
      </a>
      <a className="navbar-brand brand-logo-mini"></a>
    </div>
  );
};
