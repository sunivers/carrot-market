import useSWR from "swr";
import { ProductWithFavCount } from "pages";
import Item from "@components/item";

interface ProductListProps {
  kind: "sale" | "purchase" | "favorite";
}
interface Record {
  id: number;
  product: ProductWithFavCount;
}
interface ProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);
  return (
    <div className="flex flex-col space-y-5 pb-10  divide-y">
      {data?.[kind]?.map((record) => (
        <Item
          key={record.id}
          id={record.product.id}
          title={record.product.name}
          price={record.product.price}
          comments={1}
          hearts={record.product._count.favorite}
        />
      ))}
    </div>
  );
}
