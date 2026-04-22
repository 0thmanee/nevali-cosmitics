import { getSession } from "~/app/api/auth/actions";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "~/features/admin/components/admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=" + encodeURIComponent("/admin"));
  }
  const role = (session.user as { role?: string }).role;
  if (role !== "superadmin") {
    redirect("/artisan");
  }

  const user = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
  };

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
