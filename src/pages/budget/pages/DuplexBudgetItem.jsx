import React from "react";
import { useState, useEffect } from "react";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { BudgetItemModal } from "@pages/budget/components/BudgetItemModal";
import { UseBudgetItem } from "@hooks/UseBudgetItem";
import { EditIcon } from "@assets/icons/EditIcon";
import { ConfirmModal } from "@utils/ConfirmModal";
import { Loading } from "@utils/Loading";

export const DuplexBudgetItem = () => {
  const { t } = useI18n();
  const [FormModalOpen, setFormModalOpen] = useState(false);
  const [ConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [itemForm, setItemForm] = useState({ id: 0, typeItem: "", code: "", description: "", unit: "", orderItem: 0 });
  const { loading, error, data, getAll, create, update, remove } = UseBudgetItem();

  useEffect(() => {
    getAll();
  }, []);

  const handleModalClick = (e, id, typeItem, code, description, unit, orderItem, parentId) => {
    e.preventDefault();

    setItemForm({ id: id, typeItem: typeItem, code: code, description: description, unit: unit, orderItem: orderItem, parentId: parentId });
    setFormModalOpen(true);
  };

  const handleModalDeleteClick = (e, id) => {
    e.preventDefault();

    setItemForm({ id: id });
    setConfirmModalOpen(true);
  };

  const handleSaveItem = async () => {
    setFormModalOpen(false);
    if (!itemForm.id == 0) {
      await update(itemForm.id, {
        code: itemForm.code,
        descriptionEn: itemForm.description,
        descriptionEs: itemForm.description,
        unit: itemForm.unit,
        typeItem: itemForm.typeItem,
        orderItem: Number(itemForm.orderItem),
      });
    } else {
      await create({
        code: itemForm.code,
        descriptionEn: itemForm.description,
        descriptionEs: itemForm.description,
        unit: itemForm.unit,
        typeItem: itemForm.typeItem,
        orderItem: Number(itemForm.orderItem),
        parentId: itemForm.parentId,
      });
    }

    getAll();
  };

  const handleDeleteItem = async () => {
    setConfirmModalOpen(false);

    await remove(itemForm.id);
    getAll();
  };

  if (loading || loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("duplex-configuration.title")} />
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <table className="table table-bordered table-responsive mt-3">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}> </th>
                    <th> {t("duplex-tracking-form.table-column-payitem")} </th>
                    <th> {t("duplex-tracking-form.table-column-description")} </th>
                    <th> {t("duplex-tracking-form.table-column-unit")} </th>
                    <th> {t("duplex-configuration.table-column-order")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    [...data]
                      .filter((item) => item.parentId === null)
                      .sort((a, b) => Number(a.orderItem) - Number(b.orderItem))
                      .map((parent) => {
                        const children = data.filter((child) => child.parentId === parent.id).sort((a, b) => Number(a.orderItem) - Number(b.orderItem));

                        return (
                          <React.Fragment key={parent.id}>
                            <tr style={{ backgroundColor: "#bfbfbf" }}>
                              <td>
                                <ul className="navbar-nav">
                                  <li className="nav-item dropdown">
                                    <a className="count-indicator dropdown-toggle" href="#" id="notificationDropdown" data-toggle="dropdown">
                                      <EditIcon size={19} color="#000000" strokeWidth={2.5} />
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                                      <a
                                        className="dropdown-item preview-item"
                                        onClick={(e) => handleModalClick(e, parent.id, parent.typeItem, parent.code, parent.descriptionEn, parent.unit, parent.orderItem)}>
                                        <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                          <h6 className="preview-subject font-weight-normal mb-1">{t("button.edit")}</h6>
                                        </div>
                                      </a>
                                      {/* <div className="dropdown-divider"></div>
                                      <a className="dropdown-item preview-item">
                                        <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                          <h6 className="preview-subject font-weight-normal mb-1">{t("button.delete")}</h6>
                                        </div>
                                      </a> */}
                                      <div className="dropdown-divider"></div>
                                      <a className="dropdown-item preview-item" onClick={(e) => handleModalClick(e, 0, "I", "", "", "", 0, parent.id)}>
                                        <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                          <h6 className="preview-subject font-weight-normal mb-1">{t("duplex-configuration.table-option-new-item")}</h6>
                                        </div>
                                      </a>
                                    </div>
                                  </li>
                                </ul>
                              </td>
                              <td>
                                <span style={{ fontWeight: "600" }}> {parent.code}</span>
                              </td>
                              <td colSpan={2} style={{ fontWeight: "600" }}>
                                {parent.descriptionEn}
                              </td>
                              <td style={{ textAlign: "center" }}>{parent.orderItem}</td>
                            </tr>

                            {children.map((child) => (
                              <tr key={child.id}>
                                <td style={{ padding: "0.2375rem 0.5375rem" }}>
                                  <ul className="navbar-nav">
                                    <li className="nav-item dropdown">
                                      <a className="count-indicator dropdown-toggle" href="#" id="notificationDropdown" data-toggle="dropdown">
                                        <EditIcon size={19} color="#000000" strokeWidth={2.5} />
                                      </a>
                                      <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                                        <a
                                          className="dropdown-item preview-item"
                                          onClick={(e) => handleModalClick(e, child.id, child.typeItem, child.code, child.descriptionEn, child.unit, child.orderItem)}>
                                          <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                            <h6 className="preview-subject font-weight-normal mb-1">{t("button.edit")}</h6>
                                          </div>
                                        </a>
                                        <div className="dropdown-divider"></div>
                                        <a className="dropdown-item preview-item" onClick={(e) => handleModalDeleteClick(e, child.id)}>
                                          <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                                            <h6 className="preview-subject font-weight-normal mb-1">{t("button.delete")}</h6>
                                          </div>
                                        </a>
                                      </div>
                                    </li>
                                  </ul>
                                </td>
                                <td style={{ padding: "0.2375rem 0.5375rem" }}>{child.code}</td>
                                <td style={{ padding: "0.2375rem 0.5375rem", backgroundColor: "#ffff00" }}>{child.descriptionEn}</td>
                                <td style={{ textAlign: "center", padding: "0.2375rem 0.5375rem" }}>{child.unit}</td>
                                <td style={{ textAlign: "center", padding: "0.2375rem 0.5375rem", backgroundColor: "#92d050" }}>{child.orderItem}</td>
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <BudgetItemModal show={FormModalOpen} onClose={() => setFormModalOpen(false)} onSave={handleSaveItem} form={itemForm} setForm={setItemForm} />
      <ConfirmModal show={ConfirmModalOpen} onCancel={() => setConfirmModalOpen(false)} onConfirm={handleDeleteItem} />
    </>
  );
};
