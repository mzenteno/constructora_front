import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const GenerateLandReportExcel = async (dataLand, t) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(t("land-list.report-title"));

  // Título centrado
  const titleCell = worksheet.getCell("A1");
  titleCell.value = t("land-list.report-title");
  titleCell.font = { name: "Calibri", size: 13, bold: true };

  // Fecha de generación
  const dateGenerationCell = worksheet.getCell("A2:B2");
  dateGenerationCell.value = `${t("util.report-date-generation")}: ${new Date().toLocaleDateString("es-BO")}`;

  worksheet.addRow([]);

  // Encabezados
  const headerRow = worksheet.addRow([
    t("land-list.report-column-code"),
    t("land-list.report-column-sold"),
    t("land-list.report-column-supplier"),
    t("land-list.report-column-description"),
    `${t("land-list.report-column-price")} ($)`,
  ]);
  headerRow.font = { name: "Calibri", bold: true };

  // Datos
  dataLand.forEach((item) => {
    const row = worksheet.addRow([item.code, item.sold, item.supplier.fullName, item.description, Number(item.price).toFixed(2)]);
    row.getCell(5).alignment = { horizontal: "right" };
  });

  // Total
  const total = dataLand.reduce((acc, curr) => acc + Number(curr.price), 0);
  const totalRow = worksheet.addRow(["", "", "", "Total ($):", total.toFixed(2)]);
  totalRow.getCell(4).font = { name: "Calibri", bold: true };
  totalRow.getCell(4).alignment = { horizontal: "right" };
  totalRow.getCell(5).font = { name: "Calibri", bold: true };
  totalRow.getCell(5).alignment = { horizontal: "right" };

  // Ajustar ancho de columnas
  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) maxLength = columnLength;
    });
    column.width = maxLength < 15 ? 15 : maxLength;
  });

  // === Agregar bordes a la tabla ===
  const startRow = headerRow.number;
  const endRow = totalRow.number;

  for (let i = startRow; i <= endRow; i++) {
    const row = worksheet.getRow(i);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  // Descargar archivo
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "report.xlsx");
};
