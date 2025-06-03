import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseDuplex } from "@hooks/UseDuplex";
import { EditIcon } from "@assets/icons/EditIcon";
import { Loading } from "@utils/Loading";

export const DuplexTracking = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { loading, error, data, getAll } = UseDuplex();

  useEffect(() => {
    getAll();
  }, []);

  const handleUpdateClick = (e, id) => {
    e.preventDefault();
    navigate(`/duplex-tracking-form/${id}`);
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("duplex-tracking.title")} />
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <table className="table table-bordered table-striped mt-3">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}> </th>
                    <th> {t("duplex-tracking.table-column-code")} </th>
                    <th> {t("duplex-tracking.table-column-description")} </th>
                    <th> {t("duplex-tracking.table-column-address")} </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((duplex) => (
                      <tr key={duplex.id}>
                        <td>
                          <EditIcon width={18} height={18} style={{ cursor: "pointer" }} onClick={(e) => handleUpdateClick(e, duplex.id)} />
                        </td>
                        <td>{duplex.code}</td>
                        <td>{duplex.description}</td>
                        <td>{duplex.address}</td>
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
