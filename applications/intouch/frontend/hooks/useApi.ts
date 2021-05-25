import { useEffect, useState } from "react";

type ApiResponse = {
  loading: boolean;
  error: any;
  data: any;
};

const useApi = (
  path: string,
  options: any = { method: "GET" }
): ApiResponse => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (path) {
      setLoading(true);
      fetch(
        `${window.location.protocol}//${window.location.host}/api${path}`,
        options
      )
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
