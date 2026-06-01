export default function ProducerPageLoading() {
	return (
		<div className="flex flex-col gap-4">
			{/* Stat cards */}
			<div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
				{[0, 1, 2, 3].map((i) => (
					<div
						className="flex items-center justify-between rounded-[14px] border border-cream-dark bg-white px-[22px] py-5"
						key={i}
					>
						<div className="flex flex-col gap-2.5">
							<div className="h-2 w-20 animate-pulse rounded-full bg-cream-dark" />
							<div className="h-8 w-10 animate-pulse rounded-sm bg-cream-dark" />
						</div>
						<div className="h-11 w-11 shrink-0 animate-pulse rounded-sm bg-cream-dark" />
					</div>
				))}
			</div>

			{/* Main content grid */}
			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
				{/* Table card */}
				<div className="overflow-hidden rounded-sm border border-cream-dark bg-white">
					<div className="flex items-center justify-between border-cream-dark/60 border-b px-5 py-4">
						<div className="h-4 w-32 animate-pulse rounded-full bg-cream-dark" />
						<div className="h-8 w-24 animate-pulse rounded-sm bg-cream-dark" />
					</div>
					{[0, 1, 2, 3, 4].map((i) => (
						<div
							className="flex items-center gap-4 border-cream-dark/40 border-b px-5 py-3.5 last:border-0"
							key={i}
						>
							<div className="h-11 w-11 shrink-0 animate-pulse rounded-[10px] bg-cream-dark" />
							<div className="flex flex-1 flex-col gap-1.5">
								<div className="h-3 w-40 animate-pulse rounded-full bg-cream-dark" />
								<div className="h-2.5 w-24 animate-pulse rounded-full bg-cream-dark" />
							</div>
							<div className="h-5 w-16 animate-pulse rounded-full bg-cream-dark" />
						</div>
					))}
				</div>

				{/* Sidebar cards */}
				<div className="flex flex-col gap-4">
					{[0, 1].map((i) => (
						<div
							className="rounded-sm border border-cream-dark bg-white p-5"
							key={i}
						>
							<div className="mb-4 h-4 w-28 animate-pulse rounded-full bg-cream-dark" />
							<div className="flex flex-col gap-3">
								{[0, 1, 2].map((j) => (
									<div className="flex items-center gap-3" key={j}>
										<div className="h-8 w-8 shrink-0 animate-pulse rounded-sm bg-cream-dark" />
										<div className="flex flex-1 flex-col gap-1.5">
											<div className="h-3 w-full animate-pulse rounded-full bg-cream-dark" />
											<div className="h-2 w-3/4 animate-pulse rounded-full bg-cream-dark" />
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
