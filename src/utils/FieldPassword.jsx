import { useState } from "react";
import { useController } from "react-hook-form";

export const FieldPassword = ({ control, name, label = "Contraseña", rules = {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <div className="mb-3 position-relative">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input type={showPassword ? "text" : "password"} className={`form-control ${error ? "is-invalid" : ""}`} id={name} {...field} />
      <button
        type="button"
        className="btn position-absolute top-50 end-0 translate-middle-y me-2"
        onClick={() => setShowPassword(!showPassword)}
        style={{ background: "transparent", border: "none" }}
        tabIndex={-1}>
        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
      </button>
      {error && <div className="invalid-feedback d-block">{error.message}</div>}
    </div>
  );
};
