import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseExpense } from "@hooks/UseExpense";
import { UseExpenseType } from "@hooks/UseExpenseType";
import { EditIcon } from "@assets/icons/EditIcon";
import { DeleteIcon } from "@assets/icons/DeleteIcon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DateRangeFilter from "@utils/DateRangeFilter";
import { Loading } from "@utils/Loading";

export const Expense = () => {
  const isFirstLoad = useRef(true);
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data: dataExpense, loading: loadingExpense, error: errorExpense, getAll: getAllExpense } = UseExpense();
  const { data: dataExpenseType, loading: loadingExpenseType, error: errorExpenseType, getAll: getAllExpenseType } = UseExpenseType();

  const getCurrentDate = () => {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    return formattedDate;
  };
  const [filters, setFilters] = useState({ description: "", startDate: getCurrentDate(), endDate: getCurrentDate(), expenseTypeId: "" });

  const getAllExpenseWithFilter = () => {
    if (!isFirstLoad.current) {
      getAllExpense({
        description: filters.description || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        expenseTypeId: filters.expenseTypeId || undefined,
      });
    }
  };

  const handleFilterChange = (field, value, callAPI = true) => {
    setFilters((prev) => {
      let newFilters;

      if (typeof field === "object") {
        // Si field es objeto (como {startDate, endDate})
        newFilters = { ...prev, ...field };
      } else {
        // Si field es string (como "description")
        newFilters = { ...prev, [field]: value };
      }

      if (callAPI) {
        getAllExpense({
          description: newFilters.description || undefined,
          startDate: newFilters.startDate || undefined,
          endDate: newFilters.endDate || undefined,
          expenseTypeId: newFilters.expenseTypeId || undefined,
        });
      }

      return newFilters;
    });
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      const loadData = async () => {
        await getAllExpenseType();
        await getAllExpense({ startDate: filters.startDate || undefined, endDate: filters.endDate || undefined });
        isFirstLoad.current = false;
      };
      loadData();
    }
  }, []);

  const handleAddNewClick = (e) => {
    e.preventDefault();
    navigate("/expense-form");
  };

  const handleUpdateClick = (e, id) => {
    e.preventDefault();
    navigate(`/expense-form/${id}`);
  };

  const handleDescriptionChange = (e) => {
    handleFilterChange("description", e.target.value, false);
  };

  const handleTypeChange = (e) => {
    handleFilterChange("expenseTypeId", e.target.value, true);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const today = new Date();
    const formattedDate = today.toLocaleDateString();

    doc.setFontSize(16);
    doc.text(t("expense-list.report-title"), 15, 20);
    doc.setFontSize(10);
    doc.text(`${t("expense-list.report-date-generation")}: ${formattedDate}`, 15, 26);

    const tableData = dataExpense.map((item) => [item.createAt, item.expenseType.description, item.description, Number(item.amount).toFixed(2)]);

    const total = dataExpense.reduce((acc, curr) => acc + Number(curr.amount), 0);

    autoTable(doc, {
      startY: 35,
      head: [[t("expense-list.report-column-createAt"), t("expense-list.report-column-expense-type"), t("expense-list.report-column-description"), t("expense-list.report-column-amount")]],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [142, 148, 169],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      foot: [["", "", "Total:", total.toFixed(2)]],
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
    const worksheet = workbook.addWorksheet(t("expense-list.report-title"));

    // Encabezados
    worksheet.addRow([
      t("expense-list.report-column-createAt"),
      t("expense-list.report-column-expense-type"),
      t("expense-list.report-column-description"),
      t("expense-list.report-column-amount"),
    ]).font = { bold: true };

    // Datos
    dataExpense.forEach((item) => {
      worksheet.addRow([item.createAt, item.expenseType.description, item.description, Number(item.amount).toFixed(2)]);
    });

    // Total
    const total = dataExpense.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalRow = worksheet.addRow(["", "", "Total:", total.toFixed(2)]);
    totalRow.getCell(4).font = { bold: true };

    // Ajustar ancho de columnas automáticamente
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 15 ? 15 : maxLength;
    });

    // Guardar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "report.xlsx");
  };

  if (loadingExpense || loadingExpenseType) return <Loading />;
  if (errorExpense || errorExpenseType) return <p>Error: {errorExpense}</p>;

  const totalAmount = dataExpense.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <>
      <Title title={t("expense-list.title")} />
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
                    <th> {t("expense-list.table-column-createAt")}</th>
                    <th> {t("expense-list.table-column-expense-type")} </th>
                    <th> {t("expense-list.table-column-description")} </th>
                    <th> {t("expense-list.table-column-amount")} </th>
                  </tr>
                  <tr>
                    <th> </th>
                    <th className="p-1">
                      <div className="input-group">
                        <DateRangeFilter
                          startDate={filters.startDate} // Pasar startDate desde el estado
                          endDate={filters.endDate} // Pasar endDate desde el estado
                          onChange={(range) => {
                            handleFilterChange({ startDate: range.startDate, endDate: range.endDate });
                          }}
                        />
                      </div>
                    </th>
                    <th className="p-1">
                      <select className="form-control" value={filters.expenseTypeId} onChange={handleTypeChange}>
                        <option key={0} value=""></option>
                        {dataExpenseType.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.description}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        className="form-control border-1"
                        style={{ padding: "3px 8px", border: "1px solid #dee2e6" }}
                        placeholder={t("expense-list.table-search-description")}
                        value={filters.description}
                        onChange={handleDescriptionChange}
                        onKeyDown={(e) => e.key === "Enter" && getAllExpenseWithFilter()}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataExpense.length > 0 ? (
                    dataExpense.map((expense) => (
                      <tr key={expense.id}>
                        <td>
                          <EditIcon width={18} height={18} style={{ cursor: "pointer" }} onClick={(e) => handleUpdateClick(e, expense.id)} />
                          <DeleteIcon width={21} height={21} style={{ cursor: "pointer" }} />
                        </td>
                        <td>{expense.createAt}</td>
                        <td>{expense.expenseType.description}</td>
                        <td>{expense.description}</td>
                        <td style={{ textAlign: "right" }}>{expense.amount}</td>
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
                    <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>
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
