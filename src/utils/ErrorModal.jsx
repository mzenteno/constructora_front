import { useI18n } from "@store/I18nContext";

export const ErrorModal = ({ show, message, onClose }) => {
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
                <div className="card-body">{message}</div>
              </div>
            </div>
            <div>
              <div className="card border-0">
                <div className="card-body d-flex justify-content-center">
                  <button type="button" className="btn btn-danger btn-fw" onClick={onClose}>
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
