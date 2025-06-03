import { useState, useRef, useEffect } from "react";
import { formatDateRange, formatDateInput } from "@utils/DateFunctions";

function DateRangeFilter({ startDate, endDate, onChange }) {
  const [visible, setVisible] = useState(false);
  const [tempStart, setTempStart] = useState(startDate || "");
  const [tempEnd, setTempEnd] = useState(endDate || "");

  const wrapperRef = useRef(null);

  const formattedRange = formatDateRange(startDate, endDate);

  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  const handleAccept = () => {
    if (tempStart && tempEnd) {
      onChange({ startDate: tempStart, endDate: tempEnd });
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setVisible(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "inline-block", width: "250px" }}>
      <div className="input-group">
        <input type="text" className="form-control" readOnly value={formattedRange} onClick={() => setVisible(!visible)} />
      </div>

      {visible && (
        <div
          className="p-2 bg-white shadow-sm mt-1"
          style={{
            position: "absolute",
            zIndex: 1000,
            borderRadius: "0.5rem",
            width: "100%",
          }}>
          <div className="mb-2">
            <label style={{ fontSize: "0.85rem" }}>Desde</label>
            <input type="date" className="form-control" value={formatDateInput(tempStart)} onChange={(e) => setTempStart(e.target.value)} required autoFocus />
          </div>
          <div className="mb-2">
            <label style={{ fontSize: "0.85rem" }}>Hasta</label>
            <input type="date" className="form-control" value={formatDateInput(tempEnd)} min={tempStart} onChange={(e) => setTempEnd(e.target.value)} required />
          </div>
          <div className="d-flex justify-content-between mt-2">
            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
              Cancelar
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleAccept}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangeFilter;
