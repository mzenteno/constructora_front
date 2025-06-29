import { useState, useEffect } from "react";
import { useI18n } from "@store/I18nContext";

export const BudgetAmountDuplexSpentModal = ({ show, onClose, onSave, form, setForm }) => {
  const { t } = useI18n();
  const [errors, setErrors] = useState({ spent: "", description: "" });

  useEffect(() => {
    if (show) {
      setErrors({ spent: "", description: "" });
    }
  }, [show]);

  const isValidDecimal = (value) => {
    return /^\d+(\.\d{1,2})?$/.test(value);
  };

  const handleSave = () => {
    let valid = true;
    let newErrors = { spent: "", description: "" };

    if (!form.spent || !isValidDecimal(form.spent)) {
      newErrors.spent = t("util.error-value-decimal");
      valid = false;
    }

    if (!form.description || !form.description.trim()) {
      newErrors.description = t("util.value-required");
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      onSave();
    }
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
                  <div className="form-group mb-3">
                    <label>{t("util.total")} ($)</label>
                    <input type="text" className={`form-control ${errors.spent ? "is-invalid" : ""}`} value={form.spent} onChange={(e) => setForm({ ...form, spent: e.target.value })} />
                    {errors.spent && <div className="invalid-feedback d-block">{errors.spent}</div>}
                  </div>
                  <div className="form-group mb-3 mt-3">
                    <label>{t("duplex-tracking-form.table-column-description")}</label>
                    <input
                      type="text"
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
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
