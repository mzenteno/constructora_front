import { useState, useEffect } from "react";
import { useI18n } from "@store/I18nContext";
import { UseDuplex } from "@hooks/UseDuplex";
import { Loading } from "@utils/Loading";

export const BudgetDuplexTotalModal = ({ show, onSave, onClose, form }) => {
  const { t } = useI18n();
  const { loading, error, updateContractorsDeposit, getById } = UseDuplex();
  const [formData, setFormData] = useState({
    subTotalSpent: 0,
    contractorsFee: 0,
    totalToDate: 0,
    deposit1: 0,
    deposit2: 0,
    total: 0,
  });

  useEffect(() => {
    if (show) {
      getById(form.id).then((data) => {
        const subTotal = parseFloat(data.subTotalSpent) || 0;
        const fee = parseFloat(data.contractorsFee) || 0;
        const deposit1 = parseFloat(data.deposit1) || 0;
        const deposit2 = parseFloat(data.deposit2) || 0;

        setFormData({
          subTotalSpent: subTotal,
          contractorsFee: fee,
          totalToDate: subTotal + fee,
          deposit1: deposit1,
          deposit2: deposit2,
          total: subTotal + fee - deposit1 - deposit2,
        });
      });
    }
  }, [show]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Validar entrada (solo números y un punto decimal)
    if (!/^(\d+\.?\d*|\.\d+)?$/.test(value) && value !== "") return;

    const decimalValue = value === "" ? 0 : parseFloat(value) || 0;

    setFormData((prev) => {
      "";
      const newData = { ...prev, [id]: value }; // Mantener valor original para display

      // Actualizar el valor numérico del campo modificado
      const updatedData = { ...prev };
      updatedData[id] = decimalValue;

      if (id === "contractorsFee") {
        // Solo actualizar totalToDate cuando cambia contractorsFee
        updatedData.totalToDate = updatedData.subTotalSpent + updatedData.contractorsFee;
        // Recalcular total también porque depende de totalToDate
        updatedData.total = updatedData.totalToDate - updatedData.deposit1 - updatedData.deposit2;
      } else if (id === "deposit1" || id === "deposit2") {
        // Solo actualizar total cuando cambian los depósitos
        updatedData.total = updatedData.totalToDate - updatedData.deposit1 - updatedData.deposit2;
      }

      return {
        ...newData,
        ...updatedData,
      };
    });
  };

  const formatDecimal = (value) => {
    return Number(value).toFixed(2);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      contractorsFee: formData.contractorsFee,
      deposit1: formData.deposit1,
      deposit2: formData.deposit2,
    };

    const response = await updateContractorsDeposit(form.id, payload);
    if (response?.sucess !== false) {
      if (response) {
        onSave();
      }
    }
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
                  <form onSubmit={onSubmit}>
                    <div className="form-group mb-3 mt-3">
                      <label>{t("duplex-tracking-form.modal-sub-total-spent")} ($)</label>
                      <input type="number" className="form-control" value={formatDecimal(formData.subTotalSpent)} readOnly />
                    </div>
                    <div className="form-group mb-3 mt-3">
                      <label>{t("duplex-tracking-form.modal-contractor")} ($)</label>
                      <input type="text" className="form-control" id="contractorsFee" inputMode="decimal" pattern="[0-9]*\.?[0-9]*" value={formData.contractorsFee} onChange={handleInputChange} />
                    </div>
                    <div className="form-group mb-3 mt-3">
                      <label>{t("duplex-tracking-form.modal-total-to-date")} ($)</label>
                      <input type="number" className="form-control" value={formatDecimal(formData.totalToDate)} readOnly />
                    </div>
                    <div className="form-group mb-3 mt-3">
                      <label>{t("duplex-tracking-form.modal-deposit1")} ($)</label>
                      <input type="text" className="form-control" id="deposit1" inputMode="decimal" pattern="[0-9]*\.?[0-9]*" value={formData.deposit1} onChange={handleInputChange} />
                    </div>
                    <div className="form-group mb-3 mt-3">
                      <label>{t("duplex-tracking-form.modal-deposit2")} ($)</label>
                      <input type="text" className="form-control" id="deposit2" inputMode="decimal" pattern="[0-9]*\.?[0-9]*" value={formData.deposit2} onChange={handleInputChange} />
                    </div>
                    <div className="form-group mb-3 mt-3">
                      <label>{t("duplex-tracking-form.modal-balance-operate")} ($)</label>
                      <input type="number" className="form-control" value={formatDecimal(formData.total)} readOnly />
                    </div>
                    <button type="submit" className="btn btn-primary btn-fw mr-1 mt-4">
                      {t("button.save")}
                    </button>
                    <button type="button" className="btn btn-primary btn-fw mt-4" onClick={onClose}>
                      {t("button.cancel")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
