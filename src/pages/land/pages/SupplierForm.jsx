import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { useForm } from "react-hook-form";
import { UseSupplier } from "@hooks/UseSupplier";

export const SupplierForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { t } = useI18n();
  const { create, update, getById } = UseSupplier();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (isEdit) {
      getById(id).then((data) => {
        reset({
          txtFullName: data.fullName,
          txtPhone: data.phone,
          txtEmail: data.email,
          txtDocumentNumber: data.documentNumber,
          txtAddress: data.address,
        });
      });
    }
  }, []);

  const onSubmit = async (data) => {
    const response = isEdit ? update(id, data) : create(data);
    if (response?.sucess !== false) {
      if (response) {
        navigate("/supplier");
      }
    }
  };

  return (
    <>
      <Title title={t("supplier-form.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>{t("supplier-form.full-name")}</label>
                  <input type="text" className="form-control" {...register("txtFullName", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("supplier-form.phone")}</label>
                  <input type="text" className="form-control" {...register("txtPhone", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("supplier-form.email")}</label>
                  <input type="text" className="form-control" {...register("txtEmail", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("supplier-form.document-number")}</label>
                  <input type="text" className="form-control" {...register("txtDocumentNumber", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("supplier-form.address")}</label>
                  <input type="text" className="form-control" {...register("txtAddress", { required: t("login.user_required") })} />
                </div>
                <button type="submit" className="btn btn-primary btn-fw mr-1 mb-2">
                  {t("button.save")}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-fw mb-2"
                  onClick={() => {
                    navigate("/supplier");
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
