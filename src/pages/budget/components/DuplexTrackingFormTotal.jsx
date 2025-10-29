export const DuplexTrackingFormTotal = ({ budgete, spent, real }) => {
  return (
    <>
      <tr>
        <td colSpan={7} style={{ color: "#fff" }}>
          -
        </td>
      </tr>
      {/* <tr>
        <td colSpan={4} style={{ textAlign: "right", backgroundColor: "#ffff00" }}>
          SUBTOTAL ($)
        </td>
        <td style={{ textAlign: "right", backgroundColor: "#ffff00" }}></td>
        <td style={{ textAlign: "right", backgroundColor: "#ffff00" }}>{subTotal}</td>
        <td style={{ textAlign: "right", backgroundColor: "#ffff00" }}></td>
      </tr> */}
      <tr>
        <td colSpan={4} style={{ textAlign: "right", backgroundColor: "#cdccccff", fontWeight: "600" }}>
          TOTAL TO DATE ($)
        </td>
        <td style={{ textAlign: "right", backgroundColor: "#cdccccff", fontWeight: "600" }}>{Number(budgete).toFixed(2)}</td>
        <td style={{ textAlign: "right", backgroundColor: "#cdccccff", fontWeight: "600" }}>{Number(spent).toFixed(2)}</td>
        <td style={{ textAlign: "right", backgroundColor: "#cdccccff", fontWeight: "600" }}>{Number(real).toFixed(2)}</td>
      </tr>
      {/* <tr>
        <td colSpan={4} style={{ textAlign: "right" }}>
          1st DEPOSIT ($)
        </td>
        <td></td>
        <td style={{ textAlign: "right" }}>{deposit1}</td>
        <td></td>
      </tr>
      <tr>
        <td colSpan={4} style={{ textAlign: "right" }}>
          2nd DEPOSIT ($)
        </td>
        <td></td>
        <td style={{ textAlign: "right" }}>{deposit2}</td>
        <td></td>
      </tr>
      <tr>
        <td colSpan={4} style={{ textAlign: "right" }}>
          BALANCE TO OPERATE ($)
        </td>
        <td></td>
        <td style={{ textAlign: "right", color: "red" }}>{Number(total).toFixed(2)}</td>
        <td></td>
      </tr> */}
    </>
  );
};
