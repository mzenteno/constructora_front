import { useState } from "react";
import { DuplexService } from "@services/DuplexService";

export const UseDuplex = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await DuplexService.create({
        code: data.txtCode,
        description: data.txtDescription,
        address: data.txtAddress,
        client: data.txtClient,
        landId: parseInt(data.cboLand, 10),
        duplexUnities: data.duplexUnities,
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
      const response = await DuplexService.update(id, {
        code: data.txtCode,
        description: data.txtDescription,
        address: data.txtAddress,
        client: data.txtClient,
        landId: parseInt(data.cboLand, 10),
        duplexUnities: data.duplexUnities,
      });
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
      const data = await DuplexService.getAll();
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
      const data = await DuplexService.getById(id);
      setData(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getNewCode = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await DuplexService.getNewCode();
      setData(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDeposits = async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await DuplexService.updateDeposits(id, {
        deposit1: data.deposit1,
        deposit2: data.deposit2,
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
    getNewCode,
    updateDeposits,
  };
};
