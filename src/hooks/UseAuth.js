import { useState} from 'react';
import { AuthService } from "@services/AuthService";

export const UseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateLogin = async (userName, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await AuthService.validateLogin(userName, password);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;

    } finally {
      setLoading(false);
    }

  };

  return { validateLogin, loading, error };

}