import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { useForm } from "react-hook-form";
import { UseSupplier } from "@hooks/UseSupplier";
import { UseLand } from "@hooks/UseLand";
import { Loading } from "@utils/Loading";

export const LandForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { loading: loadingSupplier, error: errorSupplier, data: dataSupplier, getAll: getAllSupplier } = UseSupplier();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { loading: loadingLand, error: errorLand, create, update, getById } = UseLand();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    getAllSupplier();

    if (isEdit) {
      getById(id).then((data) => {
        reset({
          txtCode: data.code,
          txtUbication: data.ubication,
          txtPrice: data.price,
          txtDescription: data.description,
          cboSold: data.sold ? "1" : "0",
          cboSupplier: data.supplier.id,
        });
      });
    }
  }, []);

  const onSubmit = async (data) => {
    const response = isEdit ? await update(id, data) : await create(data);
    if (response?.sucess !== false) {
      if (response) {
        navigate("/land");
      }
    }
  };

  if (loadingSupplier || loadingLand) return <Loading />;
  if (errorSupplier || errorLand) return <p>Error: {errorSupplier}</p>;

  return (
    <>
      <Title title={t("land-form.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>{t("land-form.code")}</label>
                  <input type="text" className={`form-control ${errors.txtCode ? "is-invalid" : ""}`} {...register("txtCode", { required: t("util.value-required") })} />
                  {errors.txtCode && <div className="invalid-feedback d-block">{errors.txtCode.message}</div>}
                </div>
                <div className="form-group">
                  <label>{t("land-form.ubication")}</label>
                  <input type="text" className={`form-control ${errors.txtUbication ? "is-invalid" : ""}`} {...register("txtUbication", { required: t("util.value-required") })} />
                  {errors.txtUbication && <div className="invalid-feedback d-block">{errors.txtUbication.message}</div>}
                </div>
                <div className="form-group">
                  <label>{t("land-form.description")}</label>
                  <input type="text" className="form-control" {...register("txtDescription")} />
                </div>
                <div className="form-group">
                  <label>{t("land-form.sold")}</label>
                  <select className="form-control" {...register("cboSold", { required: t("login.user_required") })}>
                    <option value={0}>Disponible</option>
                    <option value={1}>Vendido</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t("land-form.supplier")}</label>
                  <select className={`form-control ${errors.cboSupplier ? "is-invalid" : ""}`} {...register("cboSupplier", { required: t("util.value-required") })}>
                    {dataSupplier.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.fullName}
                      </option>
                    ))}
                  </select>
                  {errors.cboSupplier && <div className="invalid-feedback d-block">{errors.cboSupplier.message}</div>}
                </div>
                <div className="form-group">
                  <label>{t("util.total")} ($)</label>
                  <input
                    type="text"
                    className={`form-control ${errors.txtPrice ? "is-invalid" : ""}`}
                    {...register("txtPrice", {
                      required: t("util.value-required"),
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: t("util.error-value-decimal"),
                      },
                    })}
                  />
                  {errors.txtPrice && <div className="invalid-feedback d-block">{errors.txtPrice.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary btn-fw mr-1 mb-2">
                  {t("button.save")}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-fw mb-2"
                  onClick={() => {
                    navigate("/land");
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
