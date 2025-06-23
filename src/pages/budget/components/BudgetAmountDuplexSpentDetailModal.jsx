import { useEffect } from "react";
import { useI18n } from "@store/I18nContext";
import { UseDuplexUnityBudgetItemDetail } from "@hooks/UseDuplexUnityBudgetItemDetail";
import { Loading } from "@utils/Loading";

export const BudgetAmountDuplexSpentDetailModal = ({ show, onClose, form }) => {
  const { t } = useI18n();
  const { loading, error, data, getByDuplexIdBudgetItemId } = UseDuplexUnityBudgetItemDetail();

  useEffect(() => {
    if (show) {
      fetchData();
      console.log(data);
    }
  }, [show]);

  const fetchData = async () => {
    await getByDuplexIdBudgetItemId(form.duplexId, form.budgetItemId);
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div>
              <div className="card">
                <div className="card-body">
                  <table className="table table-bordered table-striped mb-3 mt-3">
                    <thead>
                      <tr>
                        <th> {t("util.date")} </th>
                        <th> {t("duplex-tracking-form.table-column-spent")} </th>
                        <th> {t("duplex-tracking-form.table-column-description")} </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((item) => (
                          <tr key={item.id}>
                            <td>{item.createAt}</td>
                            <td>{item.total}</td>
                            <td>{item.description}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            {t("util.message-not-data")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <button type="button" className="btn btn-primary btn-fw mt-4" onClick={onClose}>
                    {t("button.accept")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
