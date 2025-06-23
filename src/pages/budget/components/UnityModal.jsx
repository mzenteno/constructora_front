import { useI18n } from "@store/I18nContext";
import { useState } from "react";

export const UnityModal = ({ show, onClose, onSave, form, setForm }) => {
  const { t } = useI18n();
  const [errors, setErrors] = useState({ code: "", description: "" });

  if (!show) return null;

  const validate = () => {
    let valid = true;
    let newErrors = { code: "", description: "" };

    if (!form.code.trim()) {
      newErrors.code = t("util.value-required");
      valid = false;
    }
    if (!form.description.trim()) {
      newErrors.description = t("util.value-required");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = () => {
    if (validate()) {
      setErrors({ code: "", description: "" });
      onSave();
    }
  };

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
                    <label>{t("duplex-form.table-column-code")}</label>
                    <input type="text" className={`form-control ${errors.code ? "is-invalid" : ""}`} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                    {errors.code && <div className="invalid-feedback d-block">{errors.code}</div>}
                  </div>
                  <div className="form-group mb-3">
                    <label>{t("duplex-form.table-column-description")}</label>
                    <input
                      type="text"
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="card">
                <div className="card-body">
                  <button type="button" className="btn btn-primary btn-fw mr-1" onClick={handleSave}>
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
