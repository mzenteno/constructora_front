import { useState } from "react";
import { DuplexBudgetItemDetailService } from "@services/DuplexBudgetItemDetailService";

export const UseDuplexBudgetItemDetail = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const getByDuplexIdBudgetItemId = async (duplexId, budgetItemId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await DuplexBudgetItemDetailService.getByDuplexIdBudgetItemId(duplexId, budgetItemId);
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
