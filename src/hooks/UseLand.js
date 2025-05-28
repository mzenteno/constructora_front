import { useState} from 'react';
import { LandService } from '@services/LandService';

export const UseLand = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await LandService.create({ 
        code: data.txtCode,
        ubication: data.txtUbication,
        price: parseInt(data.txtPrice, 10),
        description: data.txtDescription,
        sold: Boolean(parseInt(data.cboSold, 10)),
        supplierId: parseInt(data.cboSupplier, 10)
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
      const response = await LandService.update(id, { 
        code: data.txtCode,
        ubication: data.txtUbication,
        price: parseInt(data.txtPrice, 10),
        description: data.txtDescription,
        sold: Boolean(parseInt(data.cboSold, 10)),
        supplierId: parseInt(data.cboSupplier, 10)
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

    try {
      const data = await LandService.getAll(filter);
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
      const data = await LandService.getById(id);
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