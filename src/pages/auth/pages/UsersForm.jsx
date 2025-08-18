import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { useForm } from "react-hook-form";
import { UseUsers } from "@hooks/UseUsers";
import { Loading } from "@utils/Loading";

export const UsersForm = () => {
  const { id } = useParams();
  const isEdit = !!id;

  const navigate = useNavigate();
  const { t } = useI18n();
  const { loading, error, create, update, getById } = UseUsers();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const response = isEdit ? await update(id, data) : await create(data);
    if (response?.sucess !== false) {
      if (response) {
        navigate("/user");
      }
    }
  };

  useEffect(() => {
    if (isEdit) {
      getById(id).then((data) => {
        reset({
          txtUserName: data.userName,
          txtFullName: data.fullName,
          txtEmail: data.email,
        });
      });
    }
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("users-form.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>{t("users-form.username")}</label>
                  <input type="text" className="form-control" {...register("txtUserName", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("users-form.fullname")}</label>
                  <input type="text" className="form-control" {...register("txtFullName", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("users-form.email")}</label>
                  <input type="text" className="form-control" {...register("txtEmail", { required: t("login.user_required") })} />
                </div>
                <button type="submit" className="btn btn-primary btn-fw mr-1 mb-2">
                  {t("button.save")}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-fw mb-2"
                  onClick={() => {
                    navigate("/user");
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
