export default function ProducerPageLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white border border-[#f0e8dc] rounded-[14px] px-[22px] py-5"
          >
            <div className="flex flex-col gap-2.5">
              <div className="h-2 w-20 bg-[#f0e8dc] rounded-full animate-pulse" />
              <div className="h-8 w-10 bg-[#f0e8dc] rounded-lg animate-pulse" />
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#f0e8dc] animate-pulse shrink-0" />
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        {/* Table card */}
        <div className="bg-white border border-[#f0e8dc] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F4F1]">
            <div className="h-4 w-32 bg-[#f0e8dc] rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-[#f0e8dc] rounded-lg animate-pulse" />
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F5F5F3] last:border-0">
              <div className="w-11 h-11 rounded-[10px] bg-[#f0e8dc] animate-pulse shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-3 w-40 bg-[#f0e8dc] rounded-full animate-pulse" />
                <div className="h-2.5 w-24 bg-[#f0e8dc] rounded-full animate-pulse" />
              </div>
              <div className="h-5 w-16 bg-[#f0e8dc] rounded-full animate-pulse" />
            </div>
          ))}
        </div>

        {/* Sidebar cards */}
        <div className="flex flex-col gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white border border-[#f0e8dc] rounded-2xl p-5">
              <div className="h-4 w-28 bg-[#f0e8dc] rounded-full animate-pulse mb-4" />
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f0e8dc] animate-pulse shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="h-3 w-full bg-[#f0e8dc] rounded-full animate-pulse" />
                      <div className="h-2 w-3/4 bg-[#f0e8dc] rounded-full animate-pulse" />
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
