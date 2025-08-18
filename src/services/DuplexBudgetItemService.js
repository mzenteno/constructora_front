import AxiosInstance from "@services/AxiosInstance";

const baseURL = `${import.meta.env.VITE_API_URL}duplex-budget-item`;

export const DuplexBudgetItemService = {
  async create(data) {
    try {
      const response = await AxiosInstance.post(baseURL, data);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Register creation failed.");
      }

      return result.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await AxiosInstance.put(`${baseURL}/${id}`, data);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Register update failed.");
      }

      return result.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async getAll(filter = {}) {
    try {
      const response = await AxiosInstance.get(baseURL, { params: filter });

      const result = response.data;
      if (!result.success) {
        throw new Error(result.message || "An error occurred. The operation could not be completed.");
      }

      const dataWithConverted = result.data.map((item) => ({
        ...item,
        amount: item.amount.toFixed(2),
      }));

      return dataWithConverted;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await AxiosInstance.get(`${baseURL}/${id}`);

      const result = response.data;
      if (!result.success) {
        throw new Error(result.message || "An error occurred. The operation could not be completed.");
      }

      const dataWithConverted = {
        ...result.data, // Suponiendo que los datos estén en `result.data`
        amount: result.data.amount.toFixed(2), // Formatea el amount a 2 decimales
      };

      return dataWithConverted;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async updateByDuplex(duplexId, data) {
    try {
      const response = await AxiosInstance.put(`${baseURL}/by-duplex/${duplexId}`, data);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Register update failed.");
      }

      return result.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  async getByDuplexId(duplexId) {
    try {
      const response = await AxiosInstance.get(`${baseURL}/by-duplex/${duplexId}`);

      const result = response.data;
      if (!result.success) {
        throw new Error(result.message || "An error occurred. The operation could not be completed.");
      }

      const dataWithConverted = result.data.map((item) => ({
        ...item,
        amountBudgete: item.amountBudgete.toFixed(2),
        amountSpent: item.amountSpent.toFixed(2),
        amountReal: item.amountReal.toFixed(2),
      }));

      return dataWithConverted;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },
};
