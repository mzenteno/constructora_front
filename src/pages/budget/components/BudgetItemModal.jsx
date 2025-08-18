import { useState, useEffect } from "react";
import { useI18n } from "@store/I18nContext";
import { UseDuplexBudgetItemDetail } from "@hooks/UseDuplexBudgetItemDetail";
import { Loading } from "@utils/Loading";

export const BudgetItemModal = ({ show, onClose, onSave, form, setForm }) => {
  const { t } = useI18n();
  const [errors, setErrors] = useState({ typeItem: "", code: "", description: "", unit: "", orderItem: "" });

  useEffect(() => {
    if (show) {
      setErrors({ typeItem: "", code: "", description: "", unit: "", orderItem: "" });
    }
  }, [show]);

  const isValidDecimal = (value) => {
    return /^\d+$/.test(value);
  };

  const handleSave = () => {
    let valid = true;
    let newErrors = { typeItem: "", code: "", description: "", unit: "", orderItem: "" };

    if (!form.typeItem == "D") {
      if (!form.code || !form.code.trim()) {
        newErrors.code = t("util.value-required");
        valid = false;
      }
    }

    if (!form.description || !form.description.trim()) {
      newErrors.description = t("util.value-required");
      valid = false;
    }

    if (!form.orderItem || !isValidDecimal(form.orderItem)) {
      newErrors.orderItem = t("util.error-value-decimal");
      valid = false;
    }

    if (!form.typeItem == "D") {
      if (!form.unit || !form.unit.trim()) {
        newErrors.unit = t("util.value-required");
        valid = false;
      }
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
                    <label>{t("duplex-tracking-form.table-column-payitem")}</label>
                    <input type="text" className={`form-control ${errors.code ? "is-invalid" : ""}`} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                    {errors.code && <div className="invalid-feedback d-block">{errors.code}</div>}
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
                  <div className="form-group mb-3">
                    <label>{t("duplex-tracking-form.table-column-unit")}</label>
                    <input type="text" className={`form-control ${errors.unit ? "is-invalid" : ""}`} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                    {errors.unit && <div className="invalid-feedback d-block">{errors.unit}</div>}
                  </div>
                  <div className="form-group mb-3">
                    <label>{t("duplex-configuration.table-column-order")}</label>
                    <input type="text" className={`form-control ${errors.orderItem ? "is-invalid" : ""}`} value={form.orderItem} onChange={(e) => setForm({ ...form, orderItem: e.target.value })} />
                    {errors.orderItem && <div className="invalid-feedback d-block">{errors.orderItem}</div>}
                  </div>
                  <button type="button" className="btn btn-primary btn-fw mr-1 mt-4" onClick={handleSave}>
                    {t("button.save")}
                  </button>
                  <button type="button" className="btn btn-secondary btn-fw mt-4" onClick={onClose}>
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
