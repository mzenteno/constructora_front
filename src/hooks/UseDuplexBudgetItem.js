import { useState } from "react";
import { DuplexBudgetItemService } from "@services/DuplexBudgetItemService";

export const UseDuplexBudgetItem = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await DuplexBudgetItemService.create({
        description: data.txtDescription,
        amount: data.txtAmount,
        expenseTypeId: parseInt(data.cboExpenseType, 10),
        createAt: `${data.dpkCreateAt}T00:00:00Z`,
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
      const response = await DuplexBudgetItemService.update(id, {
        description: data.txtDescription,
        amount: data.txtAmount,
        expenseTypeId: parseInt(data.cboExpenseType, 10),
        createAt: `${data.dpkCreateAt}T00:00:00Z`,
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
      const data = await DuplexBudgetItemService.getAll(filter);
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
      const data = await DuplexBudgetItemService.getById(id);
      setData(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateByDuplex = async (duplexId, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await DuplexBudgetItemService.updateByDuplex(duplexId, data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getByDuplexId = async (duplexId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await DuplexBudgetItemService.getByDuplexId(duplexId);
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
    getById,
    updateByDuplex,
    getByDuplexId,
  };
};
