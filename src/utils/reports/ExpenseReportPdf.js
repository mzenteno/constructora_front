import pdfMake from "@utils/reports/pdfmake";

export const GenerateExpenseReportPdf = async (dataExpense, t) => {
  const currentDate = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const headerRow = [
    { text: t("util.date"), bold: true, fillColor: "#d3d3d3" },
    { text: t("expense-list.report-column-expense-type"), bold: true, fillColor: "#d3d3d3" },
    { text: t("expense-list.report-column-description"), bold: true, fillColor: "#d3d3d3" },
    { text: `${t("util.total")}($)`, bold: true, fillColor: "#d3d3d3" },
  ];

  const tableBody = [headerRow];
  let total = 0;
  dataExpense.forEach((item) => {
    tableBody.push([{ text: item.createAt, noWrap: true }, { text: item.expenseType.description }, { text: item.description }, { text: Number(item.amount).toFixed(2), alignment: "right" }]);
    total += Number(item.amount);
  });

  tableBody.push([{ text: "TOTAL ($)", bold: true, colSpan: 3, alignment: "right" }, {}, {}, { text: total.toFixed(2), bold: true, alignment: "right" }]);

  const docDefinition = {
    content: [
      {
        columns: [{ text: t("expense-list.report-title"), style: "header", bold: true, fontSize: 13 }],
        margin: [0, 0, 0, 10],
      },
      {
        columns: [
          {
            stack: [{ text: [{ text: `${t("util.report-date-generation")} : `, bold: true }, { text: currentDate }] }],
            alignment: "LEFT",
          },
        ],
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "*", "auto"],
          body: tableBody,
        },
      },
    ],
    defaultStyle: { fontSize: 9 },
  };

  pdfMake.createPdf(docDefinition).download("report.pdf");
};
