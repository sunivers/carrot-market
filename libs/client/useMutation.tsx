import { useState } from "react";

interface UseMutationState {
  loading: boolean;
  data?: object;
  error?: object;
}

type UseMutaionResult = [(data: any) => void, UseMutationState];

export default function useMutation(url: string): UseMutaionResult {
  const [state, setState] = useState<UseMutationState>({
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
