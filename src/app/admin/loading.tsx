import {
	AdminPageWrapper,
	AdminStatRow,
	AdminTableSkeleton,
	Skel,
} from "~/features/admin/components/admin-ui";

export default function AdminPageLoading() {
	return (
		<AdminPageWrapper>
			{/* Stat cards */}
			<AdminStatRow>
				{[0, 1, 2, 3].map((i) => (
					<div
						className="relative flex items-stretch overflow-hidden border border-cream-dark bg-white"
						key={i}
					>
						<div className="w-1 shrink-0 bg-cream-dark" />
						<div className="flex flex-1 items-center justify-between gap-4 px-5 py-5">
							<div className="flex flex-col gap-2.5">
								<Skel className="h-2 w-20" />
								<Skel className="h-8 w-10" />
							</div>
							<Skel className="h-11 w-11 shrink-0" />
						</div>
					</div>
				))}
			</AdminStatRow>

			<AdminTableSkeleton cols={5} rows={7} />
		</AdminPageWrapper>
	);
}
