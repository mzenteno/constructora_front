import pdfMake from "@utils/reports/pdfmake";

export const GenerateDuplexTrackingReportPdf = async (dataBudget, dataDuplex, t) => {
  const currentDate = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  if (!dataBudget || dataBudget.length === 0) return;

  let totalToDate = Number(dataDuplex.subTotalSpent);
  let totalDeposit = Number(dataDuplex.deposit1) + Number(dataDuplex.deposit2);

  const structuredData = [];
  const divisions = dataBudget.filter((item) => item.budgetItem.typeItem === "D").sort((a, b) => a.budgetItem.orderItem - b.budgetItem.orderItem);

  divisions.forEach((division) => {
    const sectionItems = dataBudget
      .filter((item) => item.budgetItem.parentId === division.budgetItem.id && item.budgetItem.typeItem === "I")
      .sort((a, b) => a.budgetItem.orderItem - b.budgetItem.orderItem);

    const items = sectionItems.map((i) => ({
      division: "",
      description: i.budgetItem.descriptionEn,
      unit: i.budgetItem.unit,
      amountBudgete: i.amountBudgete,
      amountSpent: i.amountSpent,
      amountReal: i.amountReal,
    }));

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
    { text: `${t("duplex-tracking-form.table-column-budgete")}($)`, bold: true },
    { text: `${t("duplex-tracking-form.table-column-spent")}($)`, bold: true },
    { text: `${t("duplex-tracking-form.table-column-real")}($)`, bold: true },
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
        { text: item.description, fillColor: "#ffff00" },
        item.unit,
        { text: item.amountBudgete, alignment: "right", fillColor: "#92d050" },
        { text: item.amountSpent, alignment: "right", fillColor: "#ffff00" },
        { text: item.amountReal, alignment: "right", fillColor: "#92d050" },
      ]);
    });
  });

  const pushTotalRow = (label, value, color = null, foreColor = null) => {
    const row = [
      { text: label, bold: true, colSpan: 3, alignment: "right" },
      { text: "" },
      { text: "" },
      { text: "" },
      { text: value.toFixed(2), bold: true, alignment: "right", ...(foreColor && { color: foreColor }) },
      { text: "" },
    ];

    if (color) {
      row.forEach((cell) => {
        if (typeof cell === "object") {
          cell.fillColor = color;
        }
      });
    }

    return row;
  };

  tableBody.push([{ text: "A", colSpan: 6, fillColor: "#bfbfbf", color: "#bfbfbf" }]);

  tableBody.push([
    { text: "SUBTOTAL ($)", bold: true, colSpan: 3, alignment: "right", fillColor: "#ffff00" },
    { text: "", fillColor: "#ffff00" },
    { text: "", fillColor: "#ffff00" },
    { text: totalBudgete.toFixed(2), bold: true, alignment: "right", fillColor: "#ffff00" },
    { text: Number(dataDuplex.subTotalSpent).toFixed(2), bold: true, alignment: "right", fillColor: "#ffff00" },
    { text: totalReal.toFixed(2), bold: true, alignment: "right", fillColor: "#ffff00" },
  ]);
  tableBody.push(pushTotalRow("TOTAL TO DATE ($)", totalToDate, "#00b050"));
  tableBody.push(pushTotalRow("1st DEPOSIT ($)", Number(dataDuplex.deposit1)));
  tableBody.push(pushTotalRow("2nd DEPOSIT ($)", Number(dataDuplex.deposit2)));
  tableBody.push(pushTotalRow("TOTAL DEPOSIT ($)", totalDeposit));
  tableBody.push(pushTotalRow("BALANCE TO OPERATE ($)", totalToDate - totalDeposit, null, "#ff0000"));

  const docDefinition = {
    content: [
      { text: t("duplex-tracking-form.report-title"), style: "header", bold: true, fontSize: 13, margin: [0, 0, 0, 10] },
      { text: [{ text: `${t("util.report-date-generation")} : `, bold: true }, { text: currentDate }], margin: [0, 0, 0, 2] },
      { text: [{ text: `${t("duplex-form.code")} : `, bold: true }, { text: dataDuplex.code }], margin: [0, 0, 0, 2] },
      { text: [{ text: `${t("duplex-form.description")} : `, bold: true }, { text: dataDuplex.description }], margin: [0, 0, 0, 10] },
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

  pdfMake.createPdf(docDefinition).download("report.pdf");
};
