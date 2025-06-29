import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@store/I18nContext";
import { Title } from "@utils/Title";
import { useForm } from "react-hook-form";
import { UseDuplex } from "@hooks/UseDuplex";
import { UnityModal } from "@pages/budget/components/UnityModal";
import { EditIcon } from "@assets/icons/EditIcon";
import { ErrorModal } from "@utils/ErrorModal";
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
  const { loading, error, create, update, getById, getNewCode } = UseDuplex();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (isEdit) {
      setIsButtonDisabled(true);

      getById(id).then((data) => {
        reset({
          txtCode: data.code,
          txtDescription: data.description,
          txtAddress: data.address,
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

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Title title={t("duplex-form.title")} />
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label>{t("duplex-form.code")}</label>
                  <input type="text" className="form-control" {...register("txtCode")} readOnly />
                </div>
                <div className="form-group">
                  <label>{t("duplex-form.description")}</label>
                  <input type="text" className={`form-control ${errors.txtDescription ? "is-invalid" : ""}`} {...register("txtDescription", { required: t("util.value-required") })} />
                  {errors.txtDescription && <div className="invalid-feedback d-block">{errors.txtDescription.message}</div>}
                </div>
                <div className="form-group">
                  <label>{t("duplex-form.address")}</label>
                  <input type="text" className="form-control" {...register("txtAddress")} />
                </div>

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
                  className="btn btn-primary btn-fw mb-2"
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
