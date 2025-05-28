import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseDuplexUnityBudgetItem } from "@hooks/UseDuplexUnityBudgetItem";
import { EditIcon } from "@assets/icons/EditIcon";
import { BudgetAmountDuplexModal } from "@pages/budget/components/BudgetAmountDuplexModal";

export const DuplexTrackingForm = () => {
  const { id } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [itemForm, setItemForm] = useState({ id: "", budgete: "", spent: "" });

  const { t } = useI18n();
  const { data, loading, error, getByDuplexId, updateByDuplex } = UseDuplexUnityBudgetItem();

  useEffect(() => {
    getByDuplexId(id);
  }, []);

  const handleUpdateClick = (e, id) => {
    e.preventDefault();
    setItemForm({ id: id, budgete: "", spent: "" });
    setModalOpen(true);
  };

  const handleNewUnity = async () => {
    setModalOpen(false);

    const budgete = parseFloat(itemForm.budgete) || 0;
    const spent = parseFloat(itemForm.spent) || 0;

    await updateByDuplex(id, {
      budgetItemId: itemForm.id,
      amountBudgete: budgete,
      amountSpent: spent,
    });

    await getByDuplexId(id);
  };

  if (loading) return <p>Cargando los datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("duplex-tracking-form.title")} />
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            {/* <div className="card-body" style={{ height: "calc(100vh - 200px)", overflowY: "auto", overflowX: "hidden" }}> */}
            <div className="card-body">
              <table className="table table-bordered table-responsive mt-3">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}> </th>
                    <th> {t("duplex-tracking-form.table-column-payitem")} </th>
                    <th> {t("duplex-tracking-form.table-column-description")} </th>
                    <th> {t("duplex-tracking-form.table-column-unit")} </th>
                    <th> {t("duplex-tracking-form.table-column-budgete")} </th>
                    <th> {t("duplex-tracking-form.table-column-spent")} </th>
                    <th> {t("duplex-tracking-form.table-column-real")} </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    [...data]
                      .filter((item) => item.budgetItem.parentId === null)
                      .sort((a, b) => Number(a.budgetItem.orderItem) - Number(b.budgetItem.orderItem))
                      .map((parent) => {
                        const children = data.filter((child) => child.budgetItem.parentId === parent.budgetItem.id).sort((a, b) => Number(a.budgetItem.orderItem) - Number(b.budgetItem.orderItem));

                        return (
                          <React.Fragment key={parent.budgetItem.id}>
                            <tr style={{ backgroundColor: "#E5E5E5" }}>
                              <td> </td>
                              <td>{parent.budgetItem.code}</td>
                              <td colSpan={5}>{parent.budgetItem.descriptionEn}</td>
                            </tr>

                            {children.map((child) => (
                              <tr key={child.budgetItem.id}>
                                <td>
                                  <EditIcon width={18} height={18} style={{ cursor: "pointer" }} onClick={(e) => handleUpdateClick(e, child.budgetItem.id)} />
                                </td>
                                <td style={{ paddingLeft: "20px" }}>{child.budgetItem.code}</td>
                                <td>{child.budgetItem.descriptionEn}</td>
                                <td>{child.budgetItem.unit}</td>
                                <td>{child.amountBudgete}</td>
                                <td>{child.amountSpent}</td>
                                <td>{child.amountReal}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        {t("util.message-not-data")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <BudgetAmountDuplexModal show={modalOpen} onClose={() => setModalOpen(false)} onSave={handleNewUnity} form={itemForm} setForm={setItemForm} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
