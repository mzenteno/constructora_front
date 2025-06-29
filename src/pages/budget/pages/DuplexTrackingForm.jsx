import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseDuplexUnityBudgetItem } from "@hooks/UseDuplexUnityBudgetItem";
import { UseDuplex } from "@hooks/UseDuplex";
import { EditIcon } from "@assets/icons/EditIcon";
import { BudgetAmountDuplexBudgeteModal } from "@pages/budget/components/BudgetAmountDuplexBudgeteModal";
import { BudgetAmountDuplexSpentModal } from "@pages/budget/components/BudgetAmountDuplexSpentModal";
import { BudgetDuplexTotalModal } from "@pages/budget/components/BudgetDuplexTotalModal";
import { DuplexTrackingFormTotal } from "@pages/budget/components/DuplexTrackingFormTotal";
import { BudgetAmountDuplexSpentDetailModal } from "@pages/budget/components/BudgetAmountDuplexSpentDetailModal";
import { DuplexTrackingPdf } from "@pages/budget/components/DuplexTrackingPdf";
import { Loading } from "@utils/Loading";

export const DuplexTrackingForm = () => {
  const { id } = useParams();

  const [BudgeteModalOpen, setBudgeteModalOpen] = useState(false);
  const [SpentModalOpen, setSpentModalOpen] = useState(false);
  const [TotalModalOpen, setTotalModalOpen] = useState(false);
  const [SpentDetailModalOpen, setSpentDetailModalOpen] = useState(false);
  const [itemForm, setItemForm] = useState({ id: "", budgete: "", spent: "" });

  const { t } = useI18n();
  const { loading, error, data: dataBudget, getByDuplexId, updateByDuplex } = UseDuplexUnityBudgetItem();
  const { loading: loadingDuplex, data: dataDuplex, getById } = UseDuplex();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([getByDuplexId(id), getById(id)]);
    } catch (error) {
      console.error("Error en una de las llamadas", error);
    }
  };

  const handleUpdateClick = (e, idItem, type, budgetItem) => {
    e.preventDefault();

    switch (type) {
      case "Budgete":
        setItemForm({ id: idItem, type: "Budgete", budgete: "", spent: "", description: "" });
        setBudgeteModalOpen(true);
        break;
      case "Spent":
        setItemForm({ id: idItem, type: "Spent", budgete: "", spent: "", description: "" });
        setSpentModalOpen(true);
        break;
      case "Total":
        setItemForm({ id: id });
        setTotalModalOpen(true);
        break;
      case "SpentDetail":
        setItemForm({ duplexId: id, budgetItemId: idItem, duplexCode: dataDuplex.code, duplexDescription: dataDuplex.description, budgetItem: budgetItem });
        setSpentDetailModalOpen(true);
        break;

      default:
        break;
    }
  };

  const handleNewRegister = async () => {
    if (itemForm.type == "Budgete") {
      setBudgeteModalOpen(false);
    } else {
      setSpentModalOpen(false);
    }

    const budgete = parseFloat(itemForm.budgete) || 0;
    const spent = parseFloat(itemForm.spent) || 0;

    await updateByDuplex(id, {
      budgetItemId: itemForm.id,
      type: itemForm.type,
      amountBudgete: budgete,
      amountSpent: spent,
      description: itemForm.description,
    });

    fetchData();
  };

  const updateModalTotal = () => {
    fetchData();
    setTotalModalOpen(false);
  };

  if (loading || loadingDuplex) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("duplex-tracking-form.title")} />
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="btn-group">
                <button type="button" className="btn btn-primary btn-fw mr-1" onClick={(e) => handleUpdateClick(e, null, "Total")}>
                  {t("button.totals")}
                </button>
                <button type="button" className="btn btn-secondary dropdown-toggle btn-fw" data-toggle="dropdown">
                  {t("button.download")}
                </button>
                <div className="dropdown-menu">
                  <a className="dropdown-item">
                    <DuplexTrackingPdf t={t} dataBudget={dataBudget} dataDuplex={dataDuplex} id={id} />
                  </a>
                </div>
              </div>

              <table className="table table-bordered table-responsive mt-3">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}> </th>
                    <th> {t("duplex-tracking-form.table-column-payitem")} </th>
                    <th> {t("duplex-tracking-form.table-column-description")} </th>
                    <th> {t("duplex-tracking-form.table-column-unit")} </th>
                    <th> {t("duplex-tracking-form.table-column-budgete")} ($) </th>
                    <th> {t("duplex-tracking-form.table-column-spent")} ($) </th>
                    <th> {t("duplex-tracking-form.table-column-real")} ($) </th>
                  </tr>
                </thead>
                <tbody>
                  {dataBudget.length > 0 ? (
                    [...dataBudget]
                      .filter((item) => item.budgetItem.parentId === null)
                      .sort((a, b) => Number(a.budgetItem.orderItem) - Number(b.budgetItem.orderItem))
                      .map((parent) => {
                        const children = dataBudget
                          .filter((child) => child.budgetItem.parentId === parent.budgetItem.id)
                          .sort((a, b) => Number(a.budgetItem.orderItem) - Number(b.budgetItem.orderItem));

                        return (
                          <React.Fragment key={parent.budgetItem.id}>
                            <tr style={{ backgroundColor: "#bfbfbf" }}>
                              <td> </td>
                              <td>
                                <span style={{ fontWeight: "600" }}> {parent.budgetItem.code}</span>
                              </td>
                              <td colSpan={5} style={{ fontWeight: "600" }}>
                                {parent.budgetItem.descriptionEn}
                              </td>
                            </tr>

                            {children.map((child) => (
                              <tr key={child.budgetItem.id}>
                                <td style={{ padding: "0.2375rem 0.5375rem" }}>
                                  <ul className="navbar-nav">
                                    <li className="nav-item dropdown">
                                      <a className="count-indicator dropdown-toggle" href="#" id="notificationDropdown" data-toggle="dropdown">
                                        <EditIcon size={19} color="#000000" strokeWidth={2.5} />
                                      </a>
                                      <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                                        <a className="dropdown-item preview-item" onClick={(e) => handleUpdateClick(e, child.budgetItem.id, "Budgete")}>
                                          <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                            <h6 className="preview-subject font-weight-normal mb-1">{t("duplex-tracking-form.table-column-budgete")}</h6>
                                          </div>
                                        </a>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item preview-item" onClick={(e) => handleUpdateClick(e, child.budgetItem.id, "Spent")}>
                                          <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                            <h6 className="preview-subject font-weight-normal mb-1">{t("duplex-tracking-form.table-column-spent")}</h6>
                                          </div>
                                        </a>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item preview-item" onClick={(e) => handleUpdateClick(e, child.budgetItem.id, "SpentDetail", child.budgetItem.descriptionEn)}>
                                          <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                            <h6 className="preview-subject font-weight-normal mb-1">{t("duplex-tracking-form.menu-spent-detail")}</h6>
                                          </div>
                                        </a>
                                      </div>
                                    </li>
                                  </ul>
                                </td>
                                <td style={{ padding: "0.2375rem 0.5375rem" }}>{child.budgetItem.code}</td>
                                <td style={{ padding: "0.2375rem 0.5375rem", backgroundColor: "#ffff00" }}>{child.budgetItem.descriptionEn}</td>
                                <td style={{ padding: "0.2375rem 0.5375rem" }}>{child.budgetItem.unit}</td>
                                <td style={{ textAlign: "right", padding: "0.2375rem 0.5375rem", backgroundColor: "#92d050" }}>{child.amountBudgete}</td>
                                <td style={{ textAlign: "right", padding: "0.2375rem 0.5375rem", backgroundColor: "#ffff00" }}>{child.amountSpent}</td>
                                <td style={{ textAlign: "right", padding: "0.2375rem 0.5375rem", backgroundColor: "#92d050" }}>{child.amountReal}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        {t("util.message-not-data")}
                      </td>
                    </tr>
                  )}
                  <DuplexTrackingFormTotal subTotal={dataDuplex.subTotalSpent} contractorsFee={dataDuplex.contractorsFee} deposit1={dataDuplex.deposit1} deposit2={dataDuplex.deposit2} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <BudgetAmountDuplexBudgeteModal show={BudgeteModalOpen} onClose={() => setBudgeteModalOpen(false)} onSave={handleNewRegister} form={itemForm} setForm={setItemForm} />
      <BudgetAmountDuplexSpentModal show={SpentModalOpen} onClose={() => setSpentModalOpen(false)} onSave={handleNewRegister} form={itemForm} setForm={setItemForm} />
      <BudgetDuplexTotalModal show={TotalModalOpen} onSave={updateModalTotal} onClose={() => setTotalModalOpen(false)} form={itemForm} />
      <BudgetAmountDuplexSpentDetailModal show={SpentDetailModalOpen} onClose={() => setSpentDetailModalOpen(false)} form={itemForm} />
    </>
  );
};
