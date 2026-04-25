import { notFound } from "next/navigation";
import { getMyShopOrderById } from "~/app/api/shop-orders/producer-actions";
import { ShopOrderDetailPanel } from "~/features/shop-orders/shop-order-detail-panel";

export default async function ArtisanShopOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await getMyShopOrderById(orderId);
  if (!order) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <ShopOrderDetailPanel
        order={order}
        backHref="/artisan/orders"
        backLabelKey="catalogOrdersView.backToOrders"
        breadcrumbParentLabelKey="catalogOrdersView.navOrders"
        statusEditMode="producer"
      />
    </div>
  );
}
