import { useState} from 'react';
import { ExpenseService } from '@services/ExpenseService';

export const UseExpense = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ExpenseService.create({ 
        description: data.txtDescription,
        amount: data.txtAmount,
        expenseTypeId: parseInt(data.cboExpenseType, 10),
        createAt: `${data.dpkCreateAt}T00:00:00Z`
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
      const response = await ExpenseService.update(id, { 
        description: data.txtDescription,
        amount: data.txtAmount,
        expenseTypeId: parseInt(data.cboExpenseType, 10),
        createAt: `${data.dpkCreateAt}T00:00:00Z`
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
      const data = await ExpenseService.getAll(filter);
      setData(data);

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
      const data = await ExpenseService.getById(id);
      setData(data);

      return data;
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
    getById
  };

}
