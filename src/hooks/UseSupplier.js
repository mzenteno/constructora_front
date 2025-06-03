import { useState} from 'react';
import { SupplierService } from '@services/SupplierService';

export const UseSupplier = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await SupplierService.create({ 
        fullName: data.txtFullName,
        phone: data.txtPhone,
        email: data.txtEmail,
        documentNumber: data.txtDocumentNumber,
        address: data.txtAddress
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
      const response = await SupplierService.update(id, { 
        fullName: data.txtFullName,
        phone: data.txtPhone,
        email: data.txtEmail,
        documentNumber: data.txtDocumentNumber,
        address: data.txtAddress
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
      const data = await SupplierService.getAll(filter);
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
      const data = await SupplierService.getById(id);
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