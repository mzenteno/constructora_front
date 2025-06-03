import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { useForm } from "react-hook-form";
import { UseExpenseType } from "@hooks/UseExpenseType";
import { UseExpense } from "@hooks/UseExpense";
import { Loading } from "@utils/Loading";

export const ExpenseForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { loading: loadingExpenseType, error: errorExpenseType, data: dataExpenseType, getAll: getAllExpenseType } = UseExpenseType();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { loading: loadingExpense, error: errorExpense, create, update, getById } = UseExpense();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    getAllExpenseType();

    if (isEdit) {
      getById(id).then((data) => {
        reset({
          dpkCreateAt: data.createAt,
          txtDescription: data.description,
          cboExpenseType: data.expenseType.id,
          txtAmount: data.amount,
        });
      });
    }
  }, []);

  const onSubmit = async (data) => {
    const response = isEdit ? await update(id, data) : await create(data);
    if (response?.sucess !== false) {
      if (response) {
        navigate("/expense");
      }
    }
  };

  if (loadingExpenseType || loadingExpense) return <Loading />;
  if (errorExpenseType || errorExpense) return <p>Error: {errorExpenseType}</p>;

  return (
    <>
      <Title title={t("expense-form.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>{t("expense-form.createAt")}</label>
                  <input type="date" className="form-control" {...register("dpkCreateAt", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("expense-form.expense-type")}</label>
                  <select className="form-control" {...register("cboExpenseType", { required: t("login.user_required") })}>
                    {dataExpenseType.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t("expense-form.description")}</label>
                  <input type="text" className="form-control" {...register("txtDescription", { required: t("login.user_required") })} />
                </div>
                <div className="form-group">
                  <label>{t("expense-form.amount")}</label>
                  <input type="text" className="form-control" {...register("txtAmount", { required: t("login.user_required") })} />
                </div>
                <button type="submit" className="btn btn-primary btn-fw mr-1 mb-2">
                  {t("button.save")}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-fw mb-2"
                  onClick={() => {
                    navigate("/expense");
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
