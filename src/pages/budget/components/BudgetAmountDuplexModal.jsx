import { useI18n } from "@store/I18nContext";

export const BudgetAmountDuplexModal = ({ show, onClose, onSave, form, setForm }) => {
  const { t } = useI18n();

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
                  <div className="form-group mb-3 mt-3">
                    <label>{t("duplex-tracking-form.table-column-budgete")}</label>
                    <input type="text" className="form-control" value={form.amountBudgete} onChange={(e) => setForm({ ...form, budgete: e.target.value })} />
                  </div>
                  <div className="form-group mb-3">
                    <label>{t("duplex-tracking-form.table-column-spent")}</label>
                    <input type="text" className="form-control" value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="card">
                <div className="card-body">
                  <button type="button" className="btn btn-primary btn-fw mr-1" onClick={onSave}>
                    {t("button.save")}
                  </button>
                  <button type="button" className="btn btn-primary btn-fw" onClick={onClose}>
                    {t("button.cancel")}
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
