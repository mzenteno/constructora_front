import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseLand } from "@hooks/UseLand";
import { UseSupplier } from "@hooks/UseSupplier";
import { EditIcon } from "@assets/icons/EditIcon";
import { DeleteIcon } from "@assets/icons/DeleteIcon";
import { Loading } from "@utils/Loading";
import { GenerateLandReportPdf } from "@utils/reports/LandReportPdf";
import { GenerateLandReportExcel } from "@utils/reports/LandReportExcel";

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
    GenerateLandReportPdf(dataLand, t);
  };

  const handleDownloadExcel = async () => {
    GenerateLandReportExcel(dataLand, t);
  };

  if (loadingLand || loadingSupplier) return <Loading />;
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
                    <th> {t("land-list.table-column-zip-code")} </th>
                    <th> {t("land-list.table-column-ubication")} </th>
                    <th> {t("util.total")} ($) </th>
                  </tr>
                  <tr>
                    <th> </th>
                    <th className="p-1">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control border-1"
                          style={{ padding: "3px 8px", border: "1px solid #dee2e6" }}
                          placeholder={t("land-list.table-search-code")}
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
                        <td>{land.zipCode}</td>
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
                      Total ($):
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
