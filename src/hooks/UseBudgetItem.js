import { useState } from "react";
import { BudgetItemService } from "@services/BudgetItemService";

export const UseBudgetItem = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await BudgetItemService.create({
        code: data.code,
        descriptionEn: data.descriptionEn,
        descriptionEs: data.descriptionEs,
        unit: data.unit,
        typeItem: data.typeItem,
        orderItem: data.orderItem,
        parentId: data.parentId,
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
      const response = await BudgetItemService.update(id, {
        code: data.code,
        descriptionEn: data.descriptionEn,
        descriptionEs: data.descriptionEs,
        unit: data.unit,
        orderItem: data.orderItem,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await BudgetItemService.remove(id);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await BudgetItemService.getAll();
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
      const data = await BudgetItemService.getById(id);
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
    remove,
    getAll,
    getById,
  };
};
