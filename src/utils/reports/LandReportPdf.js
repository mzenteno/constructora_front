import pdfMake from "@utils/reports/pdfmake";

export const GenerateLandReportPdf = async (dataLand, t) => {
  const currentDate = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const headerRow = [
    { text: t("land-list.report-column-code"), bold: true, fillColor: "#d3d3d3" },
    { text: t("land-list.report-column-sold"), bold: true, fillColor: "#d3d3d3" },
    { text: t("land-list.report-column-supplier"), bold: true, fillColor: "#d3d3d3" },
    { text: t("land-list.report-column-description"), bold: true, fillColor: "#d3d3d3" },
    { text: `${t("land-list.report-column-price")} ($)`, bold: true, fillColor: "#d3d3d3" },
  ];

  const tableBody = [headerRow];
  let total = 0;
  dataLand.forEach((item) => {
    tableBody.push([{ text: item.code }, { text: item.sold }, { text: item.supplier.fullName }, { text: item.description }, { text: Number(item.price).toFixed(2), alignment: "right" }]);
    total += Number(item.price);
  });

  tableBody.push([{ text: "TOTAL ($)", bold: true, colSpan: 4, alignment: "right" }, {}, {}, {}, { text: total.toFixed(2), bold: true, alignment: "right" }]);

  const docDefinition = {
    content: [
      {
        columns: [{ text: t("land-list.report-title"), style: "header", bold: true, fontSize: 13 }],
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
          widths: ["auto", "auto", "*", "*", "auto"],
          body: tableBody,
        },
      },
    ],
    defaultStyle: { fontSize: 9 },
  };

  pdfMake.createPdf(docDefinition).download("report.pdf");
};
