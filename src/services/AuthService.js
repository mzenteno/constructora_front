import AxiosInstance from "@services/AxiosInstance";

const baseURL = `${import.meta.env.VITE_API_URL}login`;

export const AuthService = {

  async validateLogin(userName, password) {
    try {
      const response = await AxiosInstance.post(baseURL, {userName, password});
      const result = response.data;

      if (!result.success) {
        throw new Error(result.data.message || 'An error occurred. The operation could not be completed.');
      }

      localStorage.setItem("token_jwt", result.token);
      return result.data;

    } catch (error) {
      if (error.response && error.response.status === 401) {
        const backendMessage = error.response.data.message;
        throw new Error(backendMessage);
      }

      throw new Error('Unexpected error. Please try again later.');
    }    
  }
  
}
