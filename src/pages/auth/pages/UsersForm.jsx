import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";

export const UsersForm = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <>
      <Title title={t("users-form.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label for="exampleInputName1">{t("users-form.username")}</label>
                  <input type="text" className="form-control" id="exampleInputName1" />
                </div>
                <div className="form-group">
                  <label for="exampleInputEmail3">{t("users-form.fullname")}</label>
                  <input type="email" className="form-control" id="exampleInputEmail3" />
                </div>
                <div className="form-group">
                  <label for="exampleInputPassword4">{t("users-form.email")}</label>
                  <input type="password" className="form-control" id="exampleInputPassword4" />
                </div>
                <button type="button" className="btn btn-primary btn-fw mr-1 mb-2">
                  {t("button.save")}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-fw mb-2"
                  onClick={() => {
                    navigate("/users");
                  }}>
                  {t("button.cancel")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
