import { useI18n } from "@store/I18nContext";

export const ConfirmModal = ({ show, onConfirm, onCancel }) => {
  const { t } = useI18n();

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3">
            <div>
              <div className="card text-center border-0">
                <div className="card-body">{t("button.message-confirm")}</div>
              </div>
            </div>
            <div>
              <div className="card border-0">
                <div className="card-body d-flex justify-content-center">
                  <button type="button" className="btn btn-primary btn-fw mr-1" onClick={onConfirm}>
                    {t("button.accept")}
                  </button>
                  <button type="button" className="btn btn-secondary btn-fw" onClick={onCancel}>
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
