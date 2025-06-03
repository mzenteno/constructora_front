import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { EditIcon } from "@assets/icons/EditIcon";
import { DeleteIcon } from "@assets/icons/DeleteIcon";
import { UseUsers } from "@hooks/UseUsers";
import { Loading } from "@utils/Loading";

export const Users = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data, loading, error, getAll } = UseUsers();

  useEffect(() => {
    getAll();
  }, []);

  const handleAddNewClick = (e) => {
    e.preventDefault();
    navigate("/user-form");
  };

  const handleUpdateClick = (e, id) => {
    e.preventDefault();
    navigate(`/user-form/${id}`);
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("users-list.title")} />
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
                    <th> {t("users-list.table-column-username")} </th>
                    <th> {t("users-list.table-column-fullname")} </th>
                    <th> {t("users-list.table-column-email")} </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <EditIcon width={18} height={18} style={{ cursor: "pointer" }} onClick={(e) => handleUpdateClick(e, user.id)} />
                          <DeleteIcon width={21} height={21} style={{ cursor: "pointer" }} />
                        </td>
                        <td>{user.userName}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
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
