export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error?: string;
}

export function initialState<T>(): ApiState<T> {
  return {
    data: null,
    loading: false,
    error: undefined,
  };
}

export function setLoading<T>(state?: ApiState<T>): ApiState<T> {
  return {
    data: state?.data ?? null,
    loading: true,
    error: undefined,
  };
}

export function setSuccess<T>(data: T): ApiState<T> {
  return {
    data,
    loading: false,
    error: undefined,
  };
}

export function setError<T>(error: string): ApiState<T> {
  return {
    data: null,
    loading: false,
    error,
  };
}

export function setLoadingKeepData<T>(currentData: T | null): ApiState<T> {
  return {
    data: currentData,
    loading: true,
    error: undefined,
  };
}
