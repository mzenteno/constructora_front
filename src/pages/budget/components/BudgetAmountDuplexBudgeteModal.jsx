import { useState, useEffect } from "react";
import { useI18n } from "@store/I18nContext";

export const BudgetAmountDuplexBudgeteModal = ({ show, onClose, onSave, form, setForm }) => {
  const { t } = useI18n();
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setError("");
    }
  }, [show]);

  const isValidDecimal = (value) => {
    return /^\d+(\.\d{1,2})?$/.test(value);
  };

  const handleSave = () => {
    if (!form.budgete || !isValidDecimal(form.budgete)) {
      setError(t("util.error-value-decimal"));
      return;
    }
    setError("");
    onSave();
  };

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
                    <input type="text" className={`form-control ${error ? "is-invalid" : ""}`} value={form.budgete} onChange={(e) => setForm({ ...form, budgete: e.target.value })} />
                    {error && <div className="invalid-feedback d-block">{error}</div>}
                  </div>
                  <button type="button" className="btn btn-primary btn-fw mr-1 mt-4" onClick={handleSave}>
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
