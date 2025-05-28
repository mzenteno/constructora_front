import { useNavigate } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { UseUsers } from "@hooks/UseUsers";

export const Users = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleAddNewClick = (e) => {
    e.preventDefault();
    navigate("/users-form");
  };

  const { data, loading } = UseUsers();
  if (loading) return <p>Cargando usuarios...</p>;

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
                    <th> {t("users-list.table-column-username")} </th>
                    <th> {t("users-list.table-column-fullname")} </th>
                    <th> {t("users-list.table-column-email")} </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((user) => (
                      <tr key={user.id}>
                        <td>{user.userName}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
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
