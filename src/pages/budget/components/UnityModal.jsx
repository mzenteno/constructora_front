import { useI18n } from "@store/I18nContext";

export const UnityModal = ({ show, onClose, onSave, form, setForm }) => {
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
                    <label>{t("duplex-form.table-column-code")}</label>
                    <input type="text" className="form-control" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
                  </div>
                  <div className="form-group mb-3">
                    <label>{t("duplex-form.table-column-description")}</label>
                    <input type="text" className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="card">
                <div className="card-body">
                  <button type="button" className="btn btn-primary btn-fw mr-2" onClick={onSave}>
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
