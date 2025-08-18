import { useEffect } from "react";
import pdfMake from "@utils/reports/pdfmake";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useI18n } from "@store/I18nContext";
import { UseDuplexBudgetItemDetail } from "@hooks/UseDuplexBudgetItemDetail";
import { Loading } from "@utils/Loading";

export const BudgetAmountDuplexSpentDetailModal = ({ show, onClose, form }) => {
  const { t } = useI18n();
  const { loading, error, data, getByDuplexIdBudgetItemId } = UseDuplexBudgetItemDetail();
  const currentDate = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  useEffect(() => {
    if (show) {
      fetchData();
    }
  }, [show]);

  const fetchData = async () => {
    await getByDuplexIdBudgetItemId(form.duplexId, form.budgetItemId);
  };

  const handleDownloadPDF = async () => {
    const headerRow = [
      { text: t("util.date"), bold: true, fillColor: "#d3d3d3" },
      { text: t("duplex-tracking-form.table-column-description"), bold: true, fillColor: "#d3d3d3" },
      { text: `${t("duplex-tracking-form.table-column-spent")} ($)`, bold: true, fillColor: "#d3d3d3" },
    ];

    const tableBody = [headerRow];
    let total = 0;

    data.forEach((item) => {
      tableBody.push([{ text: item.createAt, noWrap: true }, { text: item.description }, { text: item.total, alignment: "right" }]);
      total += Number(item.total);
    });

    tableBody.push([{ text: "TOTAL ($)", bold: true, colSpan: 2, alignment: "right" }, {}, { text: total.toFixed(2), bold: true, alignment: "right", color: "#ff0000" }]);

    const docDefinition = {
      content: [
        {
          columns: [{ text: t("duplex-tracking-form.report-title"), style: "header", bold: true, fontSize: 13 }],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            {
              width: 110,
              stack: [{ text: t("util.report-date-generation"), bold: true }, { text: currentDate }],
              alignment: "LEFT",
            },
            {
              width: 100,
              stack: [{ text: t("duplex-form.code"), bold: true }, { text: form.duplexCode }],
              alignment: "LEFT",
            },
            {
              width: "*",
              stack: [{ text: t("duplex-form.description"), bold: true }, { text: form.duplexDescription }],
              alignment: "LEFT",
            },
          ],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            {
              width: "*",
              stack: [{ text: "Item:", bold: true }, { text: form.budgetItem }],
              alignment: "LEFT",
            },
          ],
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto"],
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

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(t("duplex-tracking-form.report-title"));

    const titleCell = worksheet.getCell("A1");
    titleCell.value = t("duplex-tracking-form.report-title");
    titleCell.font = { name: "Calibri", size: 13, bold: true };

    // Fecha de generación
    const dateGenerationCell = worksheet.getCell("A2:B2");
    dateGenerationCell.value = `${t("util.report-date-generation")}: ${new Date().toLocaleDateString("es-BO")}`;

    worksheet.addRow([]);

    // Encabezados
    const headerRow = worksheet.addRow([t("util.date"), t("duplex-tracking-form.table-column-description"), `${t("duplex-tracking-form.table-column-spent")} ($)`]);
    headerRow.font = { name: "Calibri", bold: true };

    // Datos
    data.forEach((item) => {
      const row = worksheet.addRow([item.createAt, item.description, Number(item.total).toFixed(2)]);
      row.getCell(3).alignment = { horizontal: "right" };
    });

    // Total
    const total = data.reduce((acc, curr) => acc + Number(curr.total), 0);
    const totalRow = worksheet.addRow(["", "Total ($):", total.toFixed(2)]);
    totalRow.getCell(2).font = { name: "Calibri", bold: true };
    totalRow.getCell(2).alignment = { horizontal: "right" };
    totalRow.getCell(3).font = { name: "Calibri", bold: true };
    totalRow.getCell(3).alignment = { horizontal: "right" };

    // === Agregar bordes a la tabla ===
    const startRow = headerRow.number; // fila donde empieza la tabla
    const endRow = totalRow.number; // fila donde termina

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

    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 65;
    worksheet.getColumn(3).width = 10;

    // Descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "report.xlsx");
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  if (!show) return null;

  const total = data.reduce((acc, item) => acc + Number(item.total || 0), 0);

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1">
        <div className="modal-dialog" style={{ height: "80vh", maxHeight: "80vh" }}>
          <div className="modal-content" style={{ height: "100%" }}>
            <div className="card" style={{ height: "100%" }}>
              <div className="card-body d-flex flex-column" style={{ height: "100%" }}>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  <table className="table table-bordered table-striped mb-3 mt-3">
                    <thead className="table-light">
                      <tr>
                        <th>{t("util.date")}</th>
                        <th>{t("duplex-tracking-form.table-column-description")}</th>
                        <th>{t("duplex-tracking-form.table-column-spent")} ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length > 0 ? (
                        data.map((item) => (
                          <tr key={item.id}>
                            <td>{item.createAt}</td>
                            <td style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{item.description}</td>
                            <td style={{ textAlign: "right" }}>{item.total}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            {t("util.message-not-data")}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={2} style={{ textAlign: "right" }}>
                          Total ($)
                        </td>
                        <td style={{ textAlign: "right", color: "red" }}>{total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Botones abajo, fuera del scroll */}
                <div className="mt-3 text-end">
                  <div className="btn-group mt-4">
                    <button type="button" className="btn btn-secondary dropdown-toggle btn-fw mr-1" data-toggle="dropdown">
                      {t("button.download")}
                    </button>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" onClick={handleDownloadPDF}>
                        pdf...
                      </a>
                      <a className="dropdown-item" onClick={handleDownloadExcel}>
                        excel...
                      </a>
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary btn-fw mt-4" onClick={onClose}>
                    {t("button.cancel")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
