"use client";

import { FilterCarousel } from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CategoriesSectionProps {
  categoryId?: string;
}

export const CategorieSection = ({ categoryId }: CategoriesSectionProps) => {
  console.log("Categories in client:", categoryId);

  return (
    <Suspense
      fallback={<FilterCarousel isLoading data={[]} onSelect={() => {}} />}
    >
      <ErrorBoundary fallback={<p>Error loading categories</p>}>
        <CategoriesSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

// const CategoriesSkeleton = () => {
//   return <FilterCarousel isLoading data={[]} onSelect={() => {}} />;
// };

export const CategoriesSectionSuspense = ({
  categoryId,
}: CategoriesSectionProps) => {
  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  console.log("Categories in client:", categories, categoryId);
  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }
    router.push(url.toString());
  };

  return (
    <FilterCarousel
      onSelect={onSelect}
      value={categoryId}
      data={data}
      isLoading={false}
    />
  );
};
