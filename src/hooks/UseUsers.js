import { useState, } from 'react';
import { UserService } from '@services/UserService';

export const UseUsers = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await UserService.create({ 
        userName: data.txtUserName,
        fullName: data.txtFullName,
        email: data.txtEmail
      });
      return response;

    } catch (err) {
      setError(err.message);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  const update = async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await UserService.update(id, { 
        userName: data.txtUserName,
        fullName: data.txtFullName,
        email: data.txtEmail
      });
      return response;

    } catch (err) {
      setError(err.message);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  const getAll = async (filter = {}) => {
    setLoading(true);
    setError(null);

    try {
      const data = await UserService.getAll(filter);
      setData(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  const getById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const data = await UserService.getById(id);
      setData(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await UserService.updatePassword(id, {
        password: data.txtPassword1
      });
      return response;

    } catch (err) {
      setError(err.message);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,    
    create,
    update,
    getAll,
    getById,
    updatePassword
  };

}