import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

type UseMutaionResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T>(url: string): UseMutaionResult<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
  });
  function mutation(data: any): any {
    setState({
      loading: true,
    });
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {}))
      .then((data) =>
        setState({
          loading: false,
          data,
        })
      )
      .catch((error) =>
        setState({
          loading: false,
          error,
        })
      );
  }
  return [mutation, state];
}
