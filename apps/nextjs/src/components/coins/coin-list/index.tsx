"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Container } from "~/components/layout/container";
import { api } from "~/trpc/react";
import { SkeletonCoinList } from "../skeleton-coin-list";
import { CoinItem } from "./coin-item";
import { Pagination } from "./pagination";

const ITEMS_PER_PAGE = 10;

export function CoinList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const utils = api.useUtils();

  const { data, isLoading, isError } = api.coin.getTop100Coins.useQuery({
    page,
    perPage: ITEMS_PER_PAGE,
  });

  // Предзагрузка следующей страницы
  useEffect(() => {
    if (page < 10) {
      // У нас максимум 10 страниц (100 монет / 10 на страницу)
      void utils.coin.getTop100Coins.prefetch({
        page: page + 1,
        perPage: ITEMS_PER_PAGE,
      });
    }

    // Очищаем состояние при размонтировании
    return () => {
      void utils.coin.getTop100Coins.reset();
    };
  }, [page, utils]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return <SkeletonCoinList />;
  }

  if (isError || !data) {
    return (
      <Container>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          Failed to load coins
        </div>
      </Container>
    );
  }

  const totalPages = Math.ceil(data.totalCoins / ITEMS_PER_PAGE);

  return (
    <Container className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {data.coins.map((coin) => (
          <CoinItem key={coin.id} coin={coin} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}