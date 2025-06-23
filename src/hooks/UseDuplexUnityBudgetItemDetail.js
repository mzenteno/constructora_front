import { useState } from "react";
import { DuplexUnityBudgetItemDetailService } from "@services/DuplexUnityBudgetItemDetailService";

export const UseDuplexUnityBudgetItemDetail = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const getByDuplexIdBudgetItemId = async (duplexId, budgetItemId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await DuplexUnityBudgetItemDetailService.getByDuplexIdBudgetItemId(duplexId, budgetItemId);
      setData(data);
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
    getByDuplexIdBudgetItemId,
  };
};
