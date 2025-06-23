import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { useForm } from "react-hook-form";
import { UseExpenseType } from "@hooks/UseExpenseType";
import { Loading } from "@utils/Loading";

export const ExpenseTypeForm = () => {
  const { id } = useParams();
  const isEdit = !!id;

  const navigate = useNavigate();
  const { t } = useI18n();
  const { loading, error, create, update, getById } = UseExpenseType();
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
        navigate("/expense-type");
      }
    }
  };

  useEffect(() => {
    if (isEdit) {
      getById(id).then((data) => {
        reset({
          txtDescription: data.description,
        });
      });
    }
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("expense-type-form.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>{t("expense-type-form.description")}</label>
                  <input type="text" className={`form-control ${errors.txtDescription ? "is-invalid" : ""}`} {...register("txtDescription", { required: t("util.value-required") })} />
                  {errors.txtDescription && <div className="invalid-feedback d-block">{errors.txtDescription.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary btn-fw mr-1 mb-2">
                  {t("button.save")}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-fw mb-2"
                  onClick={() => {
                    navigate("/expense-type");
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
