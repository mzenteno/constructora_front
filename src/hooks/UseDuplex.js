import { useState} from 'react';
import { DuplexService } from '@services/DuplexService';

export const UseDuplex = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);

    console.log(data);
    try {
      const response = await DuplexService.create({
        code: data.txtCode,
        description: data.txtDescription,
        address: data.txtAddress,
        duplexUnities: data.duplexUnities
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

    try {
      const data = await DuplexService.getAll();
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
      const data = await DuplexService.getById(id);
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
    getAll,
    getById
  };

}