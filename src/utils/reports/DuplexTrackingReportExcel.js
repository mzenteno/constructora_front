import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function addSummaryRow(worksheet, rowNumber, title, values, backgroundColor = null) {
  const row = worksheet.getRow(rowNumber);

  worksheet.mergeCells(`A${rowNumber}:C${rowNumber}`);

  const titleCell = worksheet.getCell(`A${rowNumber}`);
  titleCell.value = title;
  titleCell.alignment = { horizontal: "right" };

  if (backgroundColor) {
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: backgroundColor },
    };
  }

  values.forEach((val, idx) => {
    const cell = row.getCell(idx + 4);
    cell.value = val;
    cell.alignment = { horizontal: "right" };

    if (backgroundColor) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: backgroundColor },
      };
    }
  });

  row.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
}

export const GenerateDuplexTrackingReportExcel = async (dataBudget, dataDuplex, t) => {
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

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(t("duplex-tracking-form.report-title"));

  const titleCell = worksheet.getCell("A1");
  titleCell.value = t("duplex-tracking-form.report-title");
  titleCell.font = { name: "Calibri", size: 13, bold: true };

  // Fecha de generación
  const dateGenerationCell = worksheet.getCell("A3:B3");
  dateGenerationCell.value = `${t("util.report-date-generation")}: ${new Date().toLocaleDateString("es-BO")}`;

  // código
  const CodeCell = worksheet.getCell("A4:B4");
  CodeCell.value = `${t("duplex-form.code")}: ${dataDuplex.code}`;

  // Descripción
  const DescriptionCell = worksheet.getCell("A5:B5");
  DescriptionCell.value = `${t("duplex-form.description")}: ${dataDuplex.description}`;

  worksheet.addRow([]);

  // Encabezados
  const headerRow = worksheet.addRow([
    t("duplex-tracking-form.table-column-payitem"),
    t("duplex-tracking-form.table-column-description"),
    t("duplex-tracking-form.table-column-unit"),
    t("duplex-tracking-form.table-column-budgete"),
    t("duplex-tracking-form.table-column-spent"),
    t("duplex-tracking-form.table-column-real"),
  ]);
  headerRow.font = { name: "Calibri", bold: true };
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  let totalBudgete = 0;
  let totalReal = 0;
  structuredData.forEach((section) => {
    const divisionRow = worksheet.addRow([section.division]);
    divisionRow.getCell(1).font = { name: "Calibri", bold: true };

    worksheet.mergeCells(`B${divisionRow.number}:F${divisionRow.number}`);
    const descripcionCell = worksheet.getCell(`B${divisionRow.number}`);
    descripcionCell.value = section.section;
    descripcionCell.font = { name: "Calibri", bold: true };

    divisionRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "d3d3d3" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    section.items.forEach((item) => {
      totalBudgete += Number(item.amountBudgete) || 0;
      totalReal += Number(item.amountReal) || 0;

      const itemRow = worksheet.addRow(["", item.description, item.unit, item.amountBudgete, item.amountSpent, item.amountReal]);
      itemRow.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffff00" } };
      itemRow.getCell(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "92d050" } };
      itemRow.getCell(4).alignment = { horizontal: "right" };
      itemRow.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ffff00" } };
      itemRow.getCell(5).alignment = { horizontal: "right" };
      itemRow.getCell(6).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "92d050" } };
      itemRow.getCell(6).alignment = { horizontal: "right" };

      itemRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
  });
  const blankRow = worksheet.addRow([]);
  worksheet.mergeCells(`A${blankRow.number}:F${blankRow.number}`);
  const blankCell = worksheet.getCell(`A${blankRow.number}`);
  blankCell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  blankCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "bfbfbf" } };

  const newRowNumberSubTotal = worksheet.addRow([]).number;
  addSummaryRow(worksheet, newRowNumberSubTotal, "SUBTOTAL ($)", [totalBudgete.toFixed(2), Number(dataDuplex.subTotalSpent).toFixed(2), totalReal.toFixed(2)], "ffff00");

  const newRowNumberTotalToDate = worksheet.addRow([]).number;
  addSummaryRow(worksheet, newRowNumberTotalToDate, "TOTAL TO DATE ($)", ["", totalToDate, ""], "00b050");

  const newRowNumberDeposit1 = worksheet.addRow([]).number;
  addSummaryRow(worksheet, newRowNumberDeposit1, "1st DEPOSIT ($)", ["", Number(dataDuplex.deposit1), ""]);

  const newRowNumberDeposit2 = worksheet.addRow([]).number;
  addSummaryRow(worksheet, newRowNumberDeposit2, "2nd DEPOSIT ($)", ["", Number(dataDuplex.deposit2), ""]);

  const newRowNumberTotalDeposit = worksheet.addRow([]).number;
  addSummaryRow(worksheet, newRowNumberTotalDeposit, "TOTAL DEPOSIT ($)", ["", totalDeposit, ""]);

  const newRowNumberBalance = worksheet.addRow([]);
  addSummaryRow(worksheet, newRowNumberBalance.number, "BALANCE TO OPERATE ($)", ["", totalToDate - totalDeposit, ""]);
  newRowNumberBalance.getCell(5).font = { color: { argb: "FFFF0000" } };

  worksheet.getColumn(1).width = 13;
  worksheet.getColumn(2).width = 65;
  worksheet.getColumn(3).width = 10;
  worksheet.getColumn(4).width = 14;
  worksheet.getColumn(5).width = 12;
  worksheet.getColumn(6).width = 12;

  // Descargar archivo
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "report.xlsx");
};
