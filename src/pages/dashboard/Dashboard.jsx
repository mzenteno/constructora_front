import duplexImage from "@assets/img/duplex_image.jpeg";

export const Dashboard = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
        backgroundColor: "#f8f9fa",
      }}>
      <img
        src={duplexImage}
        alt="Logo"
        style={{
          display: "block",
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};
