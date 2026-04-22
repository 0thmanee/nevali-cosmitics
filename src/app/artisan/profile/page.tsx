import { requireSession } from "~/app/api/auth/actions";
import { getProfile, getMyOrganizationSlug } from "~/app/api/profile/actions";
import { ProfileView } from "~/features/artisan/components/profile";

function formatPartnerId(userId: string): string {
  return "OM-" + userId.slice(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, "X");
}

function formatMemberSince(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(date));
}

export default async function ProducerProfilePage() {
  const session = await requireSession();
  const profile = await getProfile();
  const orgSlug = await getMyOrganizationSlug();
  const publicProfilePath = orgSlug ? `/artisans/${orgSlug}` : null;

  const user = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
  };

  const memberSince = profile
    ? formatMemberSince(profile.createdAt)
    : "—";

  const partnerId = session.user.id ? formatPartnerId(session.user.id) : "—";

  const profileForView = profile
    ? {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        entityType: profile.entityType,
        entityName: profile.entityName,
        registrationNumber: profile.registrationNumber,
        region: profile.region,
        city: profile.city,
        yearEstablished: profile.yearEstablished,
        categories: (profile.categories as string[]) ?? [],
        annualCapacity: profile.annualCapacity,
        profileImage: profile.profileImage ?? null,
        publicTagline: profile.publicTagline,
        businessDescription: profile.businessDescription,
        exportMarkets: profile.exportMarkets,
        valuesHighlight: profile.valuesHighlight,
      }
    : null;

  return (
    <ProfileView
      user={user}
      profile={profileForView}
      memberSince={memberSince}
      partnerId={partnerId}
      publicProfilePath={publicProfilePath}
    />
  );
}
