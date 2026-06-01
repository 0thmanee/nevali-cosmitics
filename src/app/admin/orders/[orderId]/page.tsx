import { notFound } from "next/navigation";
import { getShopOrderForAdmin } from "~/app/api/shop-orders/admin-actions";
import { ShopOrderDetailPanel } from "~/features/shop-orders/shop-order-detail-panel";

export default async function AdminShopOrderDetailPage({
	params,
}: {
	params: Promise<{ orderId: string }>;
}) {
	const { orderId } = await params;
	const order = await getShopOrderForAdmin(orderId);
	if (!order) notFound();

	return (
		<div className="mx-auto w-full max-w-6xl">
			<ShopOrderDetailPanel
				backHref="/admin/orders"
				backLabelKey="adminShopOrders.backToList"
				breadcrumbParentLabelKey="adminShopOrders.navOrders"
				order={order}
				statusEditMode="admin"
			/>
		</div>
	);
}
