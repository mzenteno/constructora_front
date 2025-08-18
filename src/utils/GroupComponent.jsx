export const GroupComponent = ({ label, children }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
    </div>
  );
};
