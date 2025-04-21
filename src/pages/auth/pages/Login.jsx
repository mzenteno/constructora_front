import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { useAuthContext } from "@store/AuthContext";
import { useForm } from "react-hook-form";
import { GlobeIcon } from "@assets/icons/GlobeIcon";
import { UseAuth } from "@hooks/UseAuth";

export const Login = () => {
  const { t, i18n, changeLanguage } = useI18n();
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { validateLogin, loading, error } = UseAuth();

  const currentLanguage = i18n.language;
  const languageButtonText = currentLanguage === "en" ? t("español") : t("english");
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "es" : "en";
    changeLanguage(newLanguage); // Usa la función del contexto
  };

  const onSubmit = async (data) => {
    const response = await validateLogin(data.txtUserName, data.txtPassword);

    if (response) {
      login(response, localStorage.getItem("token_jwt"));
      navigate("/dashboard");
    }
  };

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
          <div className="row flex-grow">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left p-4">
                {/* <div className="brand-logo">
                  <img src="../../assets/images/logo-dark.svg" />
                </div> */}
                <h2 className="mt-2">{t("login.name")}</h2>
                <h6 className="font-weight-light">{t("login.title")}</h6>

                <form className="pt-3" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                    <input type="text" className="form-control form-control-lg" placeholder={t("login.user")} {...register("txtUserName", { required: t("login.user_required") })} />
                    {errors.txtUserName && <small className="text-danger">{errors.txtUserName.message}</small>}
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control form-control-lg" placeholder={t("login.password")} {...register("txtPassword", { required: t("login.password_required") })} />
                    {errors.txtPassword && <small className="text-danger">{errors.txtPassword.message}</small>}
                  </div>
                  <div className="mt-3">
                    <button type="submit" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" disabled={false}>
                      {loading ? t("login.loading") : t("button.login")}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-2 text-center text-danger">
                      <small>{error}</small>
                    </div>
                  )}

                  <div className="my-2 d-flex justify-content-center align-items-center">
                    <a href="#" className="auth-link text-black">
                      {t("login.forgot")}
                    </a>
                  </div>

                  <div className="mt-5 mb-3 d-flex justify-content-center align-items-center">
                    <GlobeIcon width={16} height={16} className="me-1" />
                    <a
                      href="#"
                      onClick={() => {
                        toggleLanguage();
                      }}
                      className="auth-link text-primary">
                      {languageButtonText}
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
