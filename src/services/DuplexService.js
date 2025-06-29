import AxiosInstance from "@services/AxiosInstance";

const baseURL = `${import.meta.env.VITE_API_URL}duplex`;

export const DuplexService = {

    async create(data) {
      try {
        const response = await AxiosInstance.post(baseURL, data);
        const result = response.data;
  
        if (!result.success) {
          throw new Error(result.message || 'Register creation failed.');
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
          throw new Error(result.message || 'Register update failed.');
        }
  
        return result.data;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async getAll() {
      try {
        const response = await AxiosInstance.get(baseURL);
  
        const result = response.data;
        if (!result.success) {
          throw new Error(result.message || 'An error occurred. The operation could not be completed.');
        }
  
        return result.data;
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
          throw new Error(result.message || 'An error occurred. The operation could not be completed.');
        }
        const item = result.data;


        const dataWithConverted = {
          ...item,
          subTotalSpent: item.subTotalSpent.toFixed(2),
          contractorsFee: item.contractorsFee.toFixed(2),
          deposit1: item.deposit1.toFixed(2),
          deposit2: item.deposit2.toFixed(2)
        };
  
        return dataWithConverted;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

     async getNewCode() {
      try {
        const response = await AxiosInstance.get(`${baseURL}/new-code`);
  
        const result = response.data;
        if (!result.success) {
          throw new Error(result.message || 'An error occurred. The operation could not be completed.');
        }
  
        return result.data;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

    async updateContractorsDeposit(id, data) {
      try {
        const response = await AxiosInstance.put(`${baseURL}/contractors-deposit/${id}`, data);
        const result = response.data;
  
        if (!result.success) {
          throw new Error(result.message || 'Register update failed.');
        }
  
        return result.data;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

}