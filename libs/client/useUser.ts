import { useRouter } from "next/router";
import useSWR from "swr";

const useUser = () => {
  const { data, error } = useSWR("api/users/me");
  const router = useRouter();
  if (data && !data?.ok) {
    router.replace("/enter");
  }
  return { user: data?.profile, isLoading: !data && !error };
};

export default useUser;
