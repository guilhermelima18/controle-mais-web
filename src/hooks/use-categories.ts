"use client";

import { useCallback, useState } from "react";
import { listCategoriesAction } from "@/app/actions/categories";

export type Categories = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
};

export function useCategories() {
  const [categories, setCategories] = useState<Categories[]>([]);

  const onListCategories = useCallback(async () => {
    const result = await listCategoriesAction();

    if (!result.success) {
      throw result.message;
    }

    setCategories(result.data || []);
  }, []);

  return {
    categories,
    onListCategories,
  };
}
