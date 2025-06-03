export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return "";
  const start = new Date(startDate).toISOString().slice(0, 10);
  const end = new Date(endDate).toISOString().slice(0, 10);
  return `${start} - ${end}`;
};

export const formatDateInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
};