import { useState, useEffect } from 'react';
import { UserService } from '@services/UserService';

export const UseUsers = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getAll = async () => {
    setLoading(true);

    try {
      const data = await UserService.getAll();
      setData(data);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getAll();
  }, []);

  return { data, loading, getAll };

}