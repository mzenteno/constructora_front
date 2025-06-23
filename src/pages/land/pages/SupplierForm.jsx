import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { useForm } from "react-hook-form";
import { UseSupplier } from "@hooks/UseSupplier";
import { ErrorModal } from "@utils/ErrorModal";
import { Loading } from "@utils/Loading";

export const SupplierForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { t } = useI18n();
  const navigate = useNavigate();
  const [modalError, setModalError] = useState({
    show: false,
    message: "",
  });

  const { loading, error, create, update, getById } = UseSupplier();
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
    const response = isEdit ? await update(id, data) : await create(data);
    if (response?.sucess !== false) {
      if (response) {
        navigate("/supplier");
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

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
                  <input type="text" className={`form-control ${errors.txtFullName ? "is-invalid" : ""}`} {...register("txtFullName", { required: t("util.value-required") })} />
                  {errors.txtFullName && <div className="invalid-feedback d-block">{errors.txtFullName.message}</div>}
                </div>
                <div className="form-group">
                  <label>{t("supplier-form.phone")}</label>
                  <input type="text" className="form-control" {...register("txtPhone")} />
                </div>
                <div className="form-group">
                  <label>{t("supplier-form.email")}</label>
                  <input
                    type="text"
                    className={`form-control ${errors.txtEmail ? "is-invalid" : ""}`}
                    {...register("txtEmail", {
                      required: t("util.value-required"),
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t("util.error-value-email"),
                      },
                    })}
                  />
                  {errors.txtEmail && <div className="invalid-feedback d-block">{errors.txtEmail.message}</div>}
                </div>
                <div className="form-group">
                  <label>{t("supplier-form.document-number")}</label>
                  <input type="text" className="form-control" {...register("txtDocumentNumber")} />
                </div>
                <div className="form-group">
                  <label>{t("supplier-form.address")}</label>
                  <input type="text" className="form-control" {...register("txtAddress")} />
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
      <ErrorModal show={modalError.show} message={modalError.message} onClose={() => setModalError({ show: false, message: "" })} />
    </>
  );
};
