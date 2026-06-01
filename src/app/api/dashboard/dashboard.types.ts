import type {
	OrderDayPoint,
	ProductStatusCount,
	TopProductLine,
} from "./repo/dashboard.repo";

export type ProducerDashboardStats = {
	openSupportTickets: number;
	productsByStatus: ProductStatusCount[];
	/** Last 14 days, UTC day keys; includes zeros. */
	orderVolumeByDay: OrderDayPoint[];
	/** Top SKUs by line revenue in last 90 days (by product name on order line). */
	topProducts: TopProductLine[];
};

export type { OrderDayPoint, ProductStatusCount, TopProductLine };
