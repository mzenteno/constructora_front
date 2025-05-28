import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseLand } from "@hooks/UseLand";
import { UseSupplier } from "@hooks/UseSupplier";
import { EditIcon } from "@assets/icons/EditIcon";
import { DeleteIcon } from "@assets/icons/DeleteIcon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const Land = () => {
  const isFirstLoad = useRef(true);
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data: dataLand, loading: loadingLand, error: errorLand, getAll: getAllLand } = UseLand();
  const { data: dataSupplier, loading: loadingSupplier, error: errorSupplier, getAll: getAllSupplier } = UseSupplier();
  const [filters, setFilters] = useState({ code: "", sold: "", supplierId: "" });

  const getAllLandWithFilter = () => {
    if (!isFirstLoad.current) {
      getAllLand({
        code: filters.code || undefined,
        sold: filters.sold || undefined,
        supplierId: filters.supplierId || undefined,
      });
    }
  };

  const handleFilterChange = (field, value, callAPI = true) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };
      if (callAPI) {
        getAllLand({
          ...newFilters,
          code: newFilters.code || undefined,
          sold: newFilters.sold || undefined,
          supplierId: newFilters.supplierId || undefined,
        });
      }
      return newFilters;
    });
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      const loadData = async () => {
        await getAllSupplier();
        await getAllLand({});
        isFirstLoad.current = false;
      };
      loadData();
    }
  }, []);

  const handleAddNewClick = (e) => {
    e.preventDefault();
    navigate("/land-form");
  };

  const handleUpdateClick = (e, id) => {
    e.preventDefault();
    navigate(`/land-form/${id}`);
  };

  const handleCodeChange = (e) => {
    handleFilterChange("code", e.target.value, false);
  };

  const handleSoldChange = (e) => {
    handleFilterChange("sold", e.target.value, true);
  };

  const handleSupplierChange = (e) => {
    handleFilterChange("supplierId", e.target.value, true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const today = new Date();
    const formattedDate = today.toLocaleDateString();

    // Opción: Logo en la parte superior izquierda
    // if (logoBase64) {
    //   doc.addImage(logoBase64, "PNG", 14, 10, 20, 20);
    // }

    doc.setFontSize(16);
    doc.text("Reporte de Terrenos", 15, 20);
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${formattedDate}`, 15, 26);

    const tableData = dataLand.map((item) => [item.code, item.sold, item.supplier.fullName, item.ubication, item.description, Number(item.price).toFixed(2)]);

    const total = dataLand.reduce((acc, curr) => acc + Number(curr.price), 0);

    autoTable(doc, {
      startY: 35,
      head: [["Código", "Estado", "Proveedor", "Ubicación", "Descripción", "Precio"]],
      body: tableData,
      styles: { fontSize: 9 },
      foot: [["", "", "", "", "Total:", total.toFixed(2)]],
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });

    doc.save("report.pdf");
  };

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte de Gastos");

    const today = new Date();
    const formattedDate = today.toLocaleDateString();

    // Encabezado título
    worksheet.mergeCells("A1:F1");
    worksheet.getCell("A1").value = "Reporte de Terrenos";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Fecha de generación
    worksheet.mergeCells("A2:D2");
    worksheet.getCell("A2").value = `Fecha de generación: ${formattedDate}`;
    worksheet.getCell("A2").font = { size: 10 };
    worksheet.getCell("A2").alignment = { horizontal: "left" };

    // Espacio antes de tabla
    worksheet.addRow([]);

    // Encabezados de tabla
    worksheet.addRow(["Código", "Estado", "Proveedor", "Ubicación", "Descripción", "Precio"]);

    // Datos
    dataLand.forEach((item) => {
      worksheet.addRow([item.code, item.sold ? "Vendido" : "Disponible", item.supplier.fullName, item.ubication, item.description, Number(item.price).toFixed(2)]);
    });

    // Total
    const total = dataLand.reduce((acc, curr) => acc + Number(curr.price), 0);
    worksheet.addRow(["", "", "", "", "Total:", total.toFixed(2)]);

    // Estilos de encabezados
    worksheet.getRow(4).font = { bold: true };
    worksheet.getRow(4).alignment = { horizontal: "center" };

    // Estilo de total
    const lastRow = worksheet.lastRow;
    lastRow.font = { bold: true };
    lastRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F0F0F0" },
      };
    });

    // Ajustar ancho de columnas
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    // Generar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "reporte_gastos.xlsx");
  };

  if (loadingLand || loadingSupplier) return <p>Cargando los datos...</p>;
  if (errorLand || errorSupplier) return <p>Error: {errorLand}</p>;

  const totalAmount = dataLand.reduce((sum, land) => sum + Number(land.price), 0);

  return (
    <>
      <Title title={t("land-list.title")} />
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <button type="button" className="btn btn-primary btn-fw mr-1" onClick={(e) => handleAddNewClick(e)}>
                {t("button.new")}
              </button>
              <div className="btn-group">
                <button type="button" className="btn btn-secondary dropdown-toggle btn-fw" data-toggle="dropdown">
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

              <table className="table table-bordered table-striped mt-3">
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ width: "20px" }}> </th>
                    <th> {t("land-list.table-column-code")} </th>
                    <th> {t("land-list.table-column-sold")} </th>
                    <th> {t("land-list.table-column-supplier")} </th>
                    <th> {t("land-list.table-column-ubication")} </th>
                    <th> {t("land-list.table-column-price")} </th>
                  </tr>
                  <tr>
                    <th> </th>
                    <th className="p-1">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control border-1"
                          style={{ padding: "3px 8px", border: "1px solid #dee2e6" }}
                          placeholder={t("expense-list.table-search-description")}
                          value={filters.code}
                          onChange={handleCodeChange}
                          onKeyDown={(e) => e.key === "Enter" && getAllLandWithFilter()}
                        />
                      </div>
                    </th>
                    <th className="p-1">
                      <select className="form-control" value={filters.sold} onChange={handleSoldChange}>
                        <option value=""></option>
                        <option value="false">Disponible</option>
                        <option value="true">Vendido</option>
                      </select>
                    </th>
                    <th className="p-1">
                      <select className="form-control" value={filters.supplierId} onChange={handleSupplierChange}>
                        <option key={0} value=""></option>
                        {dataSupplier.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.fullName}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th> </th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {dataLand.length > 0 ? (
                    dataLand.map((land) => (
                      <tr key={land.id}>
                        <td>
                          <EditIcon width={18} height={18} style={{ cursor: "pointer" }} onClick={(e) => handleUpdateClick(e, land.id)} />
                          <DeleteIcon width={21} height={21} style={{ cursor: "pointer" }} />
                        </td>
                        <td>{land.code}</td>
                        <td>{land.sold ? "Vendido" : "Disponible"}</td>
                        <td>{land.supplier.fullName}</td>
                        <td>{land.ubication}</td>
                        <td style={{ textAlign: "right" }}>{land.price}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        {t("util.message-not-data")}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>
                      Total:
                    </td>
                    <td style={{ textAlign: "right", fontWeight: "bold" }}>{totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
