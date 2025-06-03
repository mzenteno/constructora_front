import { ClipLoader } from "react-spinners";

export const Loading = () => {
  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
        }}>
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    </>
  );
};
