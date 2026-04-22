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
          <div key={i} className="relative flex items-stretch border border-cream-dark overflow-hidden bg-white">
            <div className="w-1 shrink-0 bg-cream-dark" />
            <div className="flex flex-1 items-center justify-between px-5 py-5 gap-4">
              <div className="flex flex-col gap-2.5">
                <Skel className="h-2 w-20" />
                <Skel className="h-8 w-10" />
              </div>
              <Skel className="w-11 h-11 shrink-0" />
            </div>
          </div>
        ))}
      </AdminStatRow>

      <AdminTableSkeleton rows={7} cols={5} />
    </AdminPageWrapper>
  );
}
