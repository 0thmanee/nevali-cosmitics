import { redirect } from "next/navigation";
import { requireSession } from "~/app/api/auth/actions";
import { getProfile } from "~/app/api/profile/actions";
import { ProfileEditView } from "~/features/artisan/components/profile";

function formatPartnerId(userId: string): string {
  return "OM-" + userId.slice(0, 8).toUpperCase().replace(/[^A-Z0-9]/g, "X");
}

function formatMemberSince(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(date));
}

export default async function ProducerProfileEditPage() {
  const session = await requireSession();
  const profile = await getProfile();
  if (!profile) {
    redirect("/artisan/profile");
  }

  const user = {
    name: session.user.name ?? "",
    email: session.user.email ?? "",
  };
  const memberSince = formatMemberSince(profile.createdAt);
  const partnerId = session.user.id ? formatPartnerId(session.user.id) : "—";

  const profileForEdit = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    entityType: profile.entityType,
    entityName: profile.entityName,
    registrationNumber: profile.registrationNumber,
    region: profile.region,
    city: profile.city,
    yearEstablished: profile.yearEstablished,
    website: profile.website,
    categories: (profile.categories as string[]) ?? [],
    annualCapacity: profile.annualCapacity,
    exportExperience: profile.exportExperience,
    agreeTerms: profile.agreeTerms,
    agreeMarketing: profile.agreeMarketing,
    profileImage: profile.profileImage,
    publicTagline: profile.publicTagline,
    businessDescription: profile.businessDescription,
    exportMarkets: profile.exportMarkets,
    valuesHighlight: profile.valuesHighlight,
  };

  return (
    <ProfileEditView
      user={user}
      profile={profileForEdit}
      memberSince={memberSince}
      partnerId={partnerId}
    />
  );
}
