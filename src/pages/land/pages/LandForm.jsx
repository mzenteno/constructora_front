import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { useForm } from "react-hook-form";
import { UseSupplier } from "@hooks/UseSupplier";
import { UseLand } from "@hooks/UseLand";

export const LandForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { data: dataSupplier, loading: loadingSupplier, error: errorSupplier, getAll: getAllSupplier } = UseSupplier();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { create, update, getById } = UseLand();
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
    const response = isEdit ? update(id, data) : create(data);
    if (response?.sucess !== false) {
      if (response) {
        navigate("/land");
      }
    }
  };

  if (loadingSupplier) return <p>Cargando los datos...</p>;
  if (errorSupplier) return <p>Error: {errorSupplier}</p>;

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
                  <input type="text" className="form-control" {...register("txtCode", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("land-form.ubication")}</label>
                  <input type="text" className="form-control" {...register("txtUbication", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("land-form.price")}</label>
                  <input type="text" className="form-control" {...register("txtPrice", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("land-form.description")}</label>
                  <input type="text" className="form-control" {...register("txtDescription", { required: t("login.user_required") })} />
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
                  <select className="form-control" {...register("cboSupplier", { required: t("login.user_required") })}>
                    {dataSupplier.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.fullName}
                      </option>
                    ))}
                  </select>
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
