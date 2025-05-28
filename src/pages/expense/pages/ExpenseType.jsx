import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseExpenseType } from "@hooks/UseExpenseType";
import { EditIcon } from "@assets/icons/EditIcon";
import { DeleteIcon } from "@assets/icons/DeleteIcon";

export const ExpenseType = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [filterDescription, setFilterDescription] = useState("");
  const { data, loading, error, getAll } = UseExpenseType();

  useEffect(() => {
    getAll({ description: "" });
  }, []);

  const handleAddNewClick = (e) => {
    e.preventDefault();
    navigate("/expense-type-form");
  };

  const handleUpdateClick = (e, id) => {
    e.preventDefault();
    navigate(`/expense-type-form/${id}`);
  };

  const handleFilterDescripcionChange = (e) => {
    setFilterDescription(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getAll({ description: filterDescription });
    }
  };

  if (loading) return <p>Cargando los datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("expense-type-list.title")} />
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
                    <th> {t("expense-type-list.table-column-description")} </th>
                  </tr>
                  <tr>
                    <th> </th>
                    <th className="p-1">
                      <input
                        type="text"
                        className="form-control border-1"
                        style={{
                          padding: "3px 8px",
                          border: "1px solid #dee2e6",
                        }}
                        placeholder={t("expense-type-list.table-search-description")}
                        value={filterDescription}
                        onChange={handleFilterDescripcionChange}
                        onKeyDown={handleKeyDown}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((expenseType) => (
                      <tr key={expenseType.id}>
                        <td>
                          <EditIcon width={18} height={18} style={{ cursor: "pointer" }} onClick={(e) => handleUpdateClick(e, expenseType.id)} />
                          <DeleteIcon width={21} height={21} style={{ cursor: "pointer" }} />
                        </td>
                        <td>{expenseType.description}</td>
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
