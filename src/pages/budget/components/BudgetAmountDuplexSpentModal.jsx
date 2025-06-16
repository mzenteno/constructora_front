import { useI18n } from "@store/I18nContext";

export const BudgetAmountDuplexSpentModal = ({ show, onClose, onSave, form, setForm }) => {
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
                  <div className="form-group mb-3">
                    <label>{t("duplex-tracking-form.table-column-spent")}</label>
                    <input type="text" className="form-control" value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} />
                  </div>
                  <div className="form-group mb-3 mt-3">
                    <label>{t("duplex-tracking-form.table-column-description")}</label>
                    <input type="text" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <button type="button" className="btn btn-primary btn-fw mr-1 mt-4" onClick={onSave}>
                    {t("button.save")}
                  </button>
                  <button type="button" className="btn btn-primary btn-fw mt-4" onClick={onClose}>
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
