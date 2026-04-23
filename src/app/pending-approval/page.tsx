import Link from "next/link";
import { getSession } from "~/app/api/auth/actions";
import { redirect } from "next/navigation";
import { PendingApprovalContent } from "./PendingApprovalContent";

export default async function PendingApprovalPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=" + encodeURIComponent("/pending-approval"));
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#ffffff" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5" style={{ borderBottom: "1px solid #e0d4c4" }}>
        <Link href="/" className="font-display font-bold uppercase text-[16px] tracking-wide text-text-dark">
          nevali
        </Link>
        <span className="font-sans text-[11px] font-bold tracking-[0.16em] uppercase px-3 py-1 rounded-full"
          style={{ background: "rgba(114,114,114,0.1)", color: "#727272", border: "1px solid rgba(114,114,114,0.25)" }}>
          Under Review
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <PendingApprovalContent />
      </div>
    </div>
  );
}
