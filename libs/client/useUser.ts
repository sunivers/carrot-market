import { User } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

interface UserResponse {
  ok: boolean;
  profile: User;
}

const useUser = () => {
  const { data, error } = useSWR<UserResponse>("/api/users/me");
  const router = useRouter();
  if (data && !data?.ok) {
    router.replace("/enter");
  }
  return { user: data?.profile, isLoading: !data && !error };
};

export default useUser;
