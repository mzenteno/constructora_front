import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseDuplex } from "@hooks/UseDuplex";
import { EditIcon } from "@assets/icons/EditIcon";
import { DeleteIcon } from "@assets/icons/DeleteIcon";
import { Loading } from "@utils/Loading";

export const Duplex = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data, loading, error, getAll } = UseDuplex();

  useEffect(() => {
    getAll();
  }, []);

  const handleAddNewClick = (e) => {
    e.preventDefault();
    navigate("/duplex-form");
  };

  const handleUpdateClick = (e, id) => {
    e.preventDefault();
    navigate(`/duplex-form/${id}`);
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("duplex-list.title")} />
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <button type="button" className="btn btn-primary btn-fw" onClick={(e) => handleAddNewClick(e)}>
                {t("button.new")}
              </button>

              <table className="table table-bordered table-striped mt-3">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}> </th>
                    <th> {t("duplex-list.table-column-code")} </th>
                    <th> {t("duplex-list.table-column-client")} </th>
                    <th> {t("duplex-list.table-column-description")} </th>
                    <th> {t("duplex-list.table-column-address")} </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((duplex) => (
                      <tr key={duplex.id}>
                        <td>
                          <EditIcon width={18} height={18} style={{ cursor: "pointer" }} onClick={(e) => handleUpdateClick(e, duplex.id)} />
                          <DeleteIcon width={21} height={21} style={{ cursor: "pointer" }} />
                        </td>
                        <td>{duplex.code}</td>
                        <td>{duplex.client}</td>
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
