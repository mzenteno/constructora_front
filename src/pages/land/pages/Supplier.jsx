import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseSupplier } from "@hooks/UseSupplier";
import { EditIcon } from "@assets/icons/EditIcon";
import { DeleteIcon } from "@assets/icons/DeleteIcon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loading } from "@utils/Loading";

export const Supplier = () => {
  const isFirstLoad = useRef(true);
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data, loading, error, getAll } = UseSupplier();
  const [filters, setFilters] = useState({ fullName: "", phone: "", email: "", documentNumber: "" });

  const getAllWithFilter = () => {
    if (!isFirstLoad.current) {
      getAll({
        fullName: filters.fullName || undefined,
        phone: filters.phone || undefined,
        email: filters.email || undefined,
        documentNumber: filters.documentNumber || undefined,
      });
    }
  };

  const handleFilterChange = (field, value, callAPI = true) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value };
      if (callAPI) {
        getAll({
          ...newFilters,
          findName: newFilters.findName || undefined,
          phone: newFilters.phone || undefined,
          email: newFilters.email || undefined,
          documentNumber: newFilters.documentNumber || undefined,
        });
      }
      return newFilters;
    });
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      const loadData = async () => {
        await getAll({
          fullName: filters.fullName || undefined,
          phone: filters.phone || undefined,
          email: filters.email || undefined,
          documentNumber: filters.documentNumber || undefined,
        });
        isFirstLoad.current = false;
      };
      loadData();
    }
  }, []);

  const handleAddNewClick = (e) => {
    e.preventDefault();
    navigate("/supplier-form");
  };

  const handleUpdateClick = (e, id) => {
    e.preventDefault();
    navigate(`/supplier-form/${id}`);
  };

  const handleFullNameChange = (e) => {
    handleFilterChange("fullName", e.target.value, false);
  };

  const handlePhoneChange = (e) => {
    handleFilterChange("phone", e.target.value, false);
  };

  const handleEmailChange = (e) => {
    handleFilterChange("email", e.target.value, false);
  };

  const handleDocumentNumberChange = (e) => {
    handleFilterChange("documentNumber", e.target.value, false);
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
    doc.text("Reporte de proveedores", 15, 20);
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${formattedDate}`, 15, 26);

    const tableData = data.map((item) => [item.fullName, item.phone, item.email, item.documentNumber]);

    autoTable(doc, {
      startY: 35,
      head: [["Nombre completo", "Teléfono", "Correo electrónico", "Número de documento"]],
      body: tableData,
      styles: { fontSize: 9 },
    });

    doc.save("report.pdf");
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("supplier-list.title")} />
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <button type="button" className="btn btn-primary btn-fw mr-1" onClick={(e) => handleAddNewClick(e)}>
                {t("button.new")}
              </button>
              <button type="button" className="btn btn-secondary btn-fw" onClick={handleDownloadPDF}>
                {t("button.download")}
              </button>

              <table className="table table-bordered table-striped mt-3">
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ width: "20px" }}> </th>
                    <th> {t("supplier-list.table-column-full-name")} </th>
                    <th> {t("supplier-list.table-column-phone")} </th>
                    <th> {t("supplier-list.table-column-email")} </th>
                    <th> {t("supplier-list.table-column-document-number")} </th>
                  </tr>
                  <tr>
                    <th> </th>
                    <th className="p-1">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control border-1"
                          style={{ padding: "3px 8px", border: "1px solid #dee2e6" }}
                          placeholder={t("supplier-list.table-search-full-name")}
                          value={filters.fullName}
                          onChange={handleFullNameChange}
                          onKeyDown={(e) => e.key === "Enter" && getAllWithFilter()}
                        />
                      </div>
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        className="form-control border-1"
                        style={{ padding: "3px 8px", border: "1px solid #dee2e6" }}
                        placeholder={t("supplier-list.table-search-phone")}
                        value={filters.phone}
                        onChange={handlePhoneChange}
                        onKeyDown={(e) => e.key === "Enter" && getAllWithFilter()}
                      />
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        className="form-control border-1"
                        style={{ padding: "3px 8px", border: "1px solid #dee2e6" }}
                        placeholder={t("supplier-list.table-search-email")}
                        value={filters.email}
                        onChange={handleEmailChange}
                        onKeyDown={(e) => e.key === "Enter" && getAllWithFilter()}
                      />
                    </th>
                    <th className="p-1">
                      <input
                        type="text"
                        className="form-control border-1"
                        style={{ padding: "3px 8px", border: "1px solid #dee2e6" }}
                        placeholder={t("supplier-list.table-search-document-number")}
                        value={filters.documentNumber}
                        onChange={handleDocumentNumberChange}
                        onKeyDown={(e) => e.key === "Enter" && getAllWithFilter()}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((supplier) => (
                      <tr key={supplier.id}>
                        <td>
                          <EditIcon width={18} height={18} style={{ cursor: "pointer" }} onClick={(e) => handleUpdateClick(e, supplier.id)} />
                          <DeleteIcon width={21} height={21} style={{ cursor: "pointer" }} />
                        </td>
                        <td>{supplier.fullName}</td>
                        <td>{supplier.phone}</td>
                        <td>{supplier.email}</td>
                        <td>{supplier.documentNumber}</td>
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
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
