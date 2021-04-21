import { useEffect, useState } from "react";

type ApiResponse = {
  loading: boolean;
  error: any;
  data: any;
};

const useApi = (path: string): ApiResponse => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (path) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api${path}`)
        .then(async (res) => {
          if (!res.ok) {
            setError({ status: res.status, message: res.statusText });
          }
          return await res.json();
        })
        .then((res) => setData(res))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, []);

  return {
    loading,
    error,
    data
  };
};

export default useApi;
