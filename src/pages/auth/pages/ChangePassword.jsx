import { useState } from "react";
import { useAuthContext } from "@store/AuthContext";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { useForm } from "react-hook-form";
import { UseUsers } from "@hooks/UseUsers";
import { SucessModal } from "@utils/SucessModal";

export const ChangePassword = () => {
  const { user } = useAuthContext();
  const [modalOpen, setModalOpen] = useState(false);

  const { t } = useI18n();
  const { updatePassword } = UseUsers();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await updatePassword(user.id, data);
    if (response?.sucess !== false) {
      if (response) {
        setModalOpen(true);
      }
    }
  };

  return (
    <>
      <Title title={t("password.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>{t("password.password1")}</label>
                  <input type="password" className="form-control" {...register("txtPassword1", { required: t("login.user_required") })} />
                  {/* <FieldPassword control={control} name="password" label="Contraseña" rules={{ required: "La contraseña es obligatoria" }} /> */}
                </div>
                {/* <div className="form-group">
                  <label>{t("password.password2")}</label>
                  <input type="password" className="form-control" {...register("txtPassword2", { required: t("login.user_required") })} />
                  <FieldPassword control={control} name="ConfirmPassword" label="Confirmar Contraseña" rules={{ required: "La contraseña es obligatoria" }} />
                </div> */}
                <button type="submit" className="btn btn-primary btn-fw mr-1 mb-2">
                  {t("button.save")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <SucessModal show={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
