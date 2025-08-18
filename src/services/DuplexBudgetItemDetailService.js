import AxiosInstance from "@services/AxiosInstance";

const baseURL = `${import.meta.env.VITE_API_URL}duplex-budget-item-detail`;

export const DuplexBudgetItemDetailService = {
  async getByDuplexIdBudgetItemId(duplexId, budgetItemId) {
    try {
      const response = await AxiosInstance.get(`${baseURL}/duplex/${duplexId}/budget-item/${budgetItemId}`);

      const result = response.data;
      if (!result.success) {
        throw new Error(result.message || "An error occurred. The operation could not be completed.");
      }

      const dataWithConverted = result.data.map((item) => ({
        ...item,
        total: item.total.toFixed(2),
      }));

      return dataWithConverted;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};
