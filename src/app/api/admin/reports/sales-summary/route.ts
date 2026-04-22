import { NextResponse } from "next/server";
import { getSession } from "~/app/api/auth/actions";

export async function GET() {
	const session = await getSession();
	const role = (session?.user as { role?: string })?.role;
	if (role !== "superadmin") {
		return new NextResponse("Forbidden", { status: 403 });
	}

	return NextResponse.json(
		{ error: "Sales summary reporting has been retired. Use order analytics instead." },
		{ status: 410 },
	);
}
