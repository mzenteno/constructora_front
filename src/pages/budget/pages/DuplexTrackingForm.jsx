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
import { Loading } from "@utils/Loading";
import pdfMake from "@utils/pdfmake";

export const DuplexTrackingForm = () => {
  const { id } = useParams();

  const [BudgeteModalOpen, setBudgeteModalOpen] = useState(false);
  const [SpentModalOpen, setSpentModalOpen] = useState(false);
  const [TotalModalOpen, setTotalModalOpen] = useState(false);
  const [itemForm, setItemForm] = useState({ id: "", budgete: "", spent: "" });

  const { t } = useI18n();
  const { loading, error, data, getByDuplexId, updateByDuplex } = UseDuplexUnityBudgetItem();
  const { loading: loadingDuplex, data: dataDuplex, getById } = UseDuplex();

  useEffect(() => {
    getByDuplexId(id);
  }, []);

  const handleUpdateClick = (e, idItem, type) => {
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

    await getByDuplexId(id);
  };

  const handleDownloadPDF = async () => {
    if (data.length == 0) {
      return;
    }

    const duplex = await getById(id);
    let totalToDate = Number(duplex.subTotalSpent) + Number(duplex.contractorsFee);
    let totalDeposit = Number(duplex.deposit1) + Number(duplex.deposit2);

    const structuredData = [];
    const divisions = data.filter((item) => item.budgetItem.typeItem === "D").sort((a, b) => a.budgetItem.orderItem - b.budgetItem.orderItem);
    divisions.forEach((division) => {
      const sectionItems = data
        .filter((item) => item.budgetItem.parentId === division.budgetItem.id && item.budgetItem.typeItem === "I")
        .sort((a, b) => a.budgetItem.orderItem - b.budgetItem.orderItem);

      const items = [];
      sectionItems.forEach((i) => {
        items.push({
          division: "", // Columna 1 vacía
          description: i.budgetItem.descriptionEn,
          unit: i.budgetItem.unit,
          amountBudgete: i.amountBudgete,
          amountSpent: i.amountSpent,
          amountReal: i.amountReal,
        });
      });

      structuredData.push({
        division: division.budgetItem.code,
        section: division.budgetItem.descriptionEn,
        items,
      });
    });

    const headerRow = [
      { text: t("duplex-tracking-form.table-column-payitem"), bold: true },
      { text: t("duplex-tracking-form.table-column-description"), bold: true },
      { text: t("duplex-tracking-form.table-column-unit"), bold: true },
      { text: t("duplex-tracking-form.table-column-budgete"), bold: true },
      { text: t("duplex-tracking-form.table-column-spent"), bold: true },
      { text: t("duplex-tracking-form.table-column-real"), bold: true },
    ];

    const tableBody = [headerRow];
    let totalBudgete = 0;
    let totalReal = 0;
    structuredData.forEach((section) => {
      tableBody.push([{ text: section.division, fillColor: "#d3d3d3", bold: true, noWrap: true }, { text: section.section, colSpan: 5, fillColor: "#d3d3d3", bold: true }, {}, {}, {}, {}]);

      section.items.forEach((item) => {
        totalBudgete += Number(item.amountBudgete) || 0;
        totalReal += Number(item.amountReal) || 0;
        tableBody.push([
          { text: "", noWrap: true },
          item.description,
          item.unit,
          { text: item.amountBudgete, alignment: "right" },
          { text: item.amountSpent, alignment: "right" },
          { text: item.amountReal, alignment: "right" },
        ]);
      });
    });

    tableBody.push([
      { text: "TOTAL", bold: true, colSpan: 3, alignment: "right" },
      {},
      {},
      { text: totalBudgete.toFixed(2), bold: true, alignment: "right" },
      { text: Number(duplex.subTotalSpent).toFixed(2), bold: true, alignment: "right" },
      { text: totalReal.toFixed(2), bold: true, alignment: "right" },
    ]);
    tableBody.push([{ text: "CONTRACTORS'S FEE", bold: true, colSpan: 3, alignment: "right" }, {}, {}, {}, { text: Number(duplex.contractorsFee).toFixed(2), bold: true, alignment: "right" }, {}]);
    tableBody.push([{ text: "TOTAL TO DATE", bold: true, colSpan: 3, alignment: "right" }, {}, {}, {}, { text: totalToDate.toFixed(2), bold: true, alignment: "right" }, {}]);
    tableBody.push([{ text: "1st DEPOSIT", bold: true, colSpan: 3, alignment: "right" }, {}, {}, {}, { text: Number(duplex.deposit1).toFixed(2), bold: true, alignment: "right" }, {}]);
    tableBody.push([{ text: "2nd DEPOSIT", bold: true, colSpan: 3, alignment: "right" }, {}, {}, {}, { text: Number(duplex.deposit2).toFixed(2), bold: true, alignment: "right" }, {}]);
    tableBody.push([{ text: "TOTAL DEPOSIT", bold: true, colSpan: 3, alignment: "right" }, {}, {}, {}, { text: totalDeposit.toFixed(2), bold: true, alignment: "right" }, {}]);
    tableBody.push([{ text: "BALANCE TO OPERATE", bold: true, colSpan: 3, alignment: "right" }, {}, {}, {}, { text: (totalToDate - totalDeposit).toFixed(2), bold: true, alignment: "right" }, {}]);

    const docDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "auto", "auto"],
            body: tableBody,
          },
        },
      ],
      defaultStyle: {
        fontSize: 9,
      },
    };

    pdfMake.createPdf(docDefinition).download("project-budget.pdf");
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
                  <a className="dropdown-item" onClick={handleDownloadPDF}>
                    pdf...
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
                                <td>
                                  <ul className="navbar-nav">
                                    <li className="nav-item dropdown">
                                      <a className="count-indicator dropdown-toggle" href="#" data-toggle="dropdown">
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
                                      </div>
                                    </li>{" "}
                                  </ul>
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
                      <td colSpan="7" className="text-center">
                        {t("util.message-not-data")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <BudgetAmountDuplexBudgeteModal show={BudgeteModalOpen} onClose={() => setBudgeteModalOpen(false)} onSave={handleNewRegister} form={itemForm} setForm={setItemForm} />
              <BudgetAmountDuplexSpentModal show={SpentModalOpen} onClose={() => setSpentModalOpen(false)} onSave={handleNewRegister} form={itemForm} setForm={setItemForm} />
              <BudgetDuplexTotalModal show={TotalModalOpen} onClose={() => setTotalModalOpen(false)} form={itemForm} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
