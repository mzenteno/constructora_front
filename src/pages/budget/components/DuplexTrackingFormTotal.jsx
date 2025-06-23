export const DuplexTrackingFormTotal = ({ subTotal, contractorsFee, deposit1, deposit2 }) => {
  const totalToDate = Number(subTotal) + Number(contractorsFee);
  const total = Number(totalToDate) - Number(deposit1) - Number(deposit2);

  return (
    <>
      <tr>
        <td colSpan={7} style={{ backgroundColor: "#bfbfbf", color: "#bfbfbf" }}>
          -
        </td>
      </tr>
      <tr>
        <td colSpan={4} style={{ textAlign: "right", backgroundColor: "#ffff00" }}>
          SUBTOTAL
        </td>
        <td style={{ textAlign: "right", backgroundColor: "#ffff00" }}></td>
        <td style={{ textAlign: "right", backgroundColor: "#ffff00" }}>{subTotal}</td>
        <td style={{ textAlign: "right", backgroundColor: "#ffff00" }}></td>
      </tr>
      <tr>
        <td colSpan={4} style={{ textAlign: "right", backgroundColor: "#00b0f0" }}>
          CONTRACTORS'S FEE
        </td>
        <td style={{ textAlign: "right", backgroundColor: "#00b0f0" }}></td>
        <td style={{ textAlign: "right", backgroundColor: "#00b0f0" }}>{contractorsFee}</td>
        <td style={{ textAlign: "right", backgroundColor: "#00b0f0" }}></td>
      </tr>
      <tr>
        <td colSpan={4} style={{ textAlign: "right", backgroundColor: "#00b050" }}>
          TOTAL TO DATE
        </td>
        <td style={{ textAlign: "right", backgroundColor: "#00b050" }}></td>
        <td style={{ textAlign: "right", backgroundColor: "#00b050" }}>{Number(totalToDate).toFixed(2)}</td>
        <td style={{ textAlign: "right", backgroundColor: "#00b050" }}></td>
      </tr>
      <tr>
        <td colSpan={4} style={{ textAlign: "right" }}>
          1st DEPOSIT
        </td>
        <td></td>
        <td style={{ textAlign: "right" }}>{deposit1}</td>
        <td></td>
      </tr>
      <tr>
        <td colSpan={4} style={{ textAlign: "right" }}>
          2nd DEPOSIT
        </td>
        <td></td>
        <td style={{ textAlign: "right" }}>{deposit2}</td>
        <td></td>
      </tr>
      <tr>
        <td colSpan={4} style={{ textAlign: "right" }}>
          BALANCE TO OPERATE
        </td>
        <td></td>
        <td style={{ textAlign: "right", color: "red" }}>{Number(total).toFixed(2)}</td>
        <td></td>
      </tr>
    </>
  );
};
