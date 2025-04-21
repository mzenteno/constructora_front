import AxiosInstance from "@services/AxiosInstance";

const baseURL = `${import.meta.env.VITE_API_URL}user`;

export const UserService = {

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
  }

};