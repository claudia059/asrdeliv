import { useEffect, useState } from "react";

export function usePosts() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return { data, isLoading };
}

export function usePost(_id: number) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [_id]);

  return { data, isLoading };
}

export function useCreatePost() {
  return {
    mutateAsync: async (_data: any) => null,
    isPending: false,
  };
}

export function useUpdatePost() {
  return {
    mutateAsync: async (_data: any) => null,
    isPending: false,
  };
}

export function useDeletePost() {
  return {
    mutate: async (_id: number) => null,
    isPending: false,
  };
}
