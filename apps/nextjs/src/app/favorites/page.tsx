import { FavoriteList } from "~/components/coins/favorite-list";
import { Container } from "~/components/layout/container";

export const dynamic = "force-dynamic";

export default function FavoritesPage() {
  return (
    <div className="flex-1 py-8">
      <Container>
        <div className="border-b pb-5">
          <h1 className="text-2xl font-semibold leading-7">Favorite Coins</h1>
        </div>
      </Container>

      <div className="mt-8">
        <FavoriteList />
      </div>
    </div>
  );
}