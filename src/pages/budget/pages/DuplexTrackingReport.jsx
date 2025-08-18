import { useEffect, useState } from "react";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseDuplex } from "@hooks/UseDuplex";
import { UseDuplexBudgetItem } from "@hooks/UseDuplexBudgetItem";
import { Loading } from "@utils/Loading";
import { GenerateDuplexTrackingReportPdf } from "@utils/reports/DuplexTrackingReportPdf";
import { GenerateDuplexTrackingReportExcel } from "@utils/reports/DuplexTrackingReportExcel";

export const DuplexTrackingReport = () => {
  const { t } = useI18n();
  const { loading: loadingBudget, error: errorBudget, getByDuplexId } = UseDuplexBudgetItem();
  const { loading: loadingDuplexById, error: errorDuplexById, getById } = UseDuplex();
  const { loading: loadingDuplexAll, error: errorDuplexAll, data: dataDuplexAll, getAll } = UseDuplex();
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    getAll();
  }, []);

  const fetchData = async (dupĺexId) => {
    try {
      const [dataDuplex, dataBudget] = await Promise.all([getById(dupĺexId), getByDuplexId(dupĺexId)]);

      return { dataDuplex, dataBudget };
    } catch (error) {
      console.error("Error en una de las llamadas", error);
    }
  };

  const handleDownloadpdf = async () => {
    if (!selectedId) return;

    const result = await fetchData(selectedId);
    GenerateDuplexTrackingReportPdf(result.dataBudget, result.dataDuplex, t);
  };

  const handleDownloadExcel = async () => {
    if (!selectedId) return;

    const result = await fetchData(selectedId);
    GenerateDuplexTrackingReportExcel(result.dataBudget, result.dataDuplex, t);
  };

  if (loadingBudget || loadingDuplexAll || loadingDuplexById) return <Loading />;
  if (errorBudget || errorDuplexById || errorDuplexAll) return <p>Error: {errorBudget}</p>;

  return (
    <>
      <Title title={t("duplex-tracking.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label>Dúplex</label>
                <select id="cboDuplex" className="form-control" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                  <option value=""></option>
                  {dataDuplexAll.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code} - {item.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="btn-group">
                <button type="button" className="btn btn-secondary dropdown-toggle btn-fw" data-toggle="dropdown">
                  {t("button.download")}
                </button>
                <div className="dropdown-menu">
                  <a className="dropdown-item" onClick={handleDownloadpdf}>
                    pdf...
                  </a>
                  <a className="dropdown-item" onClick={handleDownloadExcel}>
                    excel...
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
