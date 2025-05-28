import AxiosInstance from "@services/AxiosInstance";

const baseURL = `${import.meta.env.VITE_API_URL}land`;

export const LandService = {

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

  async getAll(filter = {}) {
    try {
      const response = await AxiosInstance.get(baseURL, {params: filter});

      const result = response.data;
      if (!result.success) {
        throw new Error(result.message || 'An error occurred. The operation could not be completed.');
      }

      const dataWithConverted = result.data.map(item => ({
        ...item,
        price: item.price.toFixed(2)
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
        throw new Error(result.message || 'An error occurred. The operation could not be completed.');
      }

      const dataWithConverted = {
        ...result.data,  // Suponiendo que los datos estén en `result.data`
        //price: result.data.price.toFixed(2),  // Formatea el amount a 2 decimales
      };

      return dataWithConverted;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

}