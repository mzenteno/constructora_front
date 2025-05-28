import { useState} from 'react';
import { ExpenseTypeService } from '@services/ExpenseTypeService';

export const UseExpenseType = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ExpenseTypeService.create({ description: data.txtDescription });
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
      const response = await ExpenseTypeService.update(id, { description: data.txtDescription });
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

    try {
      const data = await ExpenseTypeService.getAll(filter);
      setData(data);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  const getById = async (id) => {
    setLoading(true);

    try {
      const data = await ExpenseTypeService.getById(id);
      setData(data);

      return data;
    } catch (err) {
      setError(err.message);

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
    getById
  };

}
