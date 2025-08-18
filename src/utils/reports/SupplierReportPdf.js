import pdfMake from "@utils/reports/pdfmake";

export const GenerateSupplierReportPdf = async (dataSupplier, t) => {
  const currentDate = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const headerRow = [
    { text: t("supplier-list.report-column-full-name"), bold: true, fillColor: "#d3d3d3" },
    { text: t("supplier-list.report-column-phone"), bold: true, fillColor: "#d3d3d3" },
    { text: t("supplier-list.report-column-email"), bold: true, fillColor: "#d3d3d3" },
    { text: t("supplier-list.report-column-document-number"), bold: true, fillColor: "#d3d3d3" },
  ];

  const tableBody = [headerRow];

  dataSupplier.forEach((item) => {
    tableBody.push([{ text: item.fullName }, { text: item.phone }, { text: item.email }, { text: item.documentNumber }]);
  });

  const docDefinition = {
    content: [
      {
        columns: [{ text: t("supplier-list.report-title"), style: "header", bold: true, fontSize: 13 }],
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
          widths: ["*", "auto", "*", "auto"],
          body: tableBody,
        },
      },
    ],
    defaultStyle: { fontSize: 9 },
  };

  pdfMake.createPdf(docDefinition).download("report.pdf");
};
