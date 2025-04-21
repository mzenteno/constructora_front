import AxiosInstance from "@services/AxiosInstance";

const baseURL = `${import.meta.env.VITE_API_URL}duplex`;

export const DuplexService = {

    async create(data) {
      try {
        const response = await AxiosInstance.post(baseURL, data);
        const result = response.data;
  
        if (!result.success) {
          throw new Error(result.message || 'User creation failed.');
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
  
        return result.data;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },

}