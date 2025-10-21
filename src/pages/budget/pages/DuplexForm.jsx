import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { useForm } from "react-hook-form";
import { UseDuplex } from "@hooks/UseDuplex";
import { UseLand } from "@hooks/UseLand";
import { UnityModal } from "@pages/budget/components/UnityModal";
import { EditIcon } from "@assets/icons/EditIcon";
import { ErrorModal } from "@utils/ErrorModal";
import { GroupComponent } from "@utils/GroupComponent";
import { Loading } from "@utils/Loading";

export const DuplexForm = () => {
  const { id } = useParams();
  const isEdit = !!id;

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [modalError, setModalError] = useState({
    show: false,
    message: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemForm, setItemForm] = useState({ code: "", description: "" });
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const { t } = useI18n();
  const { loading: loadingDuplex, error: errorDuplex, create, update, getById, getNewCode } = UseDuplex();
  const { loading: loadingLand, error: errorLand, data: dataLand, getAll: getAllLand } = UseLand();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    getAllLand();

    if (isEdit) {
      setIsButtonDisabled(true);

      getById(id).then((data) => {
        reset({
          txtCode: data.code,
          txtDescription: data.description,
          txtAddress: data.address,
          txtClient: data.client,
          cboLand: data.landId,
        });
        setRows(data.duplexUnities);
      });
    } else {
      getNewCode().then((data) => {
        reset({ txtCode: data.code });
      });
    }
  }, [id]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      duplexUnities: rows,
    };

    if (payload.duplexUnities.length < 2) {
      setModalError({
        show: true,
        message: t("util.error-duplex-unity"),
      });
      return;
    }

    const response = isEdit ? await update(id, payload) : await create(payload);
    if (response?.sucess !== false) {
      if (response) {
        navigate("/duplex");
      }
    }
  };

  const handleNewUnity = () => {
    if (editingIndex !== null) {
      setRows((prev) => prev.map((item, idx) => (idx === editingIndex ? itemForm : item)));
    } else {
      setRows((prev) => [...prev, itemForm]);
    }

    setItemForm({ code: "", description: "" });
    setEditingIndex(null); // resetea modo edición
    setModalOpen(false);
  };

  const handleNewUnityClick = () => {
    if (rows.length < 2) {
      setItemForm({ code: "", description: "" });
      setModalOpen(true);
    }
  };

  const handleUpdateClick = (e, idx) => {
    e.preventDefault();
    setItemForm(rows[idx]); // carga los datos en el formulario del modal
    setEditingIndex(idx); // guarda el índice que estás editando
    setModalOpen(true); // abre el modal
  };

  if (loadingDuplex || loadingLand) return <Loading />;
  if (errorDuplex || errorLand) return <p>Error: {errorDuplex}</p>;

  return (
    <>
      <Title title={t("duplex-form.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <GroupComponent label={t("duplex-form.code")}>
                  <input type="text" className="form-control" {...register("txtCode")} readOnly />
                </GroupComponent>
                <GroupComponent label={t("duplex-form.client")}>
                  <input type="text" className="form-control" {...register("txtClient")} />
                </GroupComponent>
                <GroupComponent label={t("duplex-form.land")}>
                  <select className={`form-control ${errors.cboLand ? "is-invalid" : ""}`} {...register("cboLand", { required: t("util.value-required") })}>
                    {dataLand.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.code}
                      </option>
                    ))}
                  </select>
                  {errors.cboLand && <div className="invalid-feedback d-block">{errors.cboLand.message}</div>}
                </GroupComponent>
                <GroupComponent label={t("duplex-form.description")}>
                  <input type="text" className="form-control" {...register("txtDescription")} />
                </GroupComponent>
                <GroupComponent label={t("duplex-form.address")}>
                  <input type="text" className="form-control" {...register("txtAddress")} />
                </GroupComponent>

                <div className="form-group">
                  <button type="button" className="btn btn-danger btn-fw mr-1" disabled={isButtonDisabled} onClick={() => handleNewUnityClick()}>
                    {t("duplex-form.button-unity")}
                  </button>

                  <table className="table table-bordered table-striped mt-1">
                    <thead>
                      <tr>
                        <th style={{ width: "20px" }}> </th>
                        <th> {t("duplex-form.table-column-code")} </th>
                        <th> {t("duplex-form.table-column-description")} </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr key={idx}>
                          <td>
                            <EditIcon width={18} height={18} style={{ cursor: "pointer" }} onClick={(e) => handleUpdateClick(e, idx)} />
                          </td>
                          <td>{row.code}</td>
                          <td>{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button type="submit" className="btn btn-primary btn-fw mr-1 mb-2">
                  {t("button.save")}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-fw mb-2"
                  onClick={() => {
                    navigate("/duplex");
                  }}>
                  {t("button.cancel")}
                </button>
              </form>

              <UnityModal show={modalOpen} onClose={() => setModalOpen(false)} onSave={handleNewUnity} form={itemForm} setForm={setItemForm} />
            </div>
          </div>
        </div>
      </div>
      <ErrorModal show={modalError.show} message={modalError.message} onClose={() => setModalError({ show: false, message: "" })} />
    </>
  );
};
