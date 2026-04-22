"use client";

import React from "react";
import Link from "next/link";
import type { ProfileViewUser, ProfileViewProfile } from "~/app/api/profile/schemas/profile.schema";
import { ProfileHeaderCard } from "./profile-header-card";
import { ProfilePersonalSection } from "./profile-personal-section";
import { ProfileBusinessSection } from "./profile-business-section";
import { ProfileSideCards } from "./profile-side-cards";
import { ProfilePublicShowcaseSection } from "./profile-public-showcase-section";

type Props = {
  user: ProfileViewUser;
  profile: ProfileViewProfile | null;
  memberSince: string;
  partnerId: string;
  publicProfilePath: string | null;
};

function formatMemberSince(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(date);
}

export function ProfileView({ user, profile, memberSince, partnerId, publicProfilePath }: Props) {
  if (!profile) {
    return (
      <div>
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "white", border: "1px solid #f0e8dc" }}
        >
          <p className="font-sans text-[#7a4d38]">No profile data yet. Complete onboarding to see your profile here.</p>
          <Link href="/onboarding" className="mt-4 inline-block font-sans text-sm font-medium text-[#2a0f05] underline">
            Go to onboarding
          </Link>
        </div>
      </div>
    );
  }

  const displayName = `${profile.firstName} ${profile.lastName}`.trim() || user.name;
  const fullName = displayName;
  const categories = Array.isArray(profile.categories) ? profile.categories : [];

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeaderCard
        displayName={displayName}
        entityName={profile.entityName}
        entityType={profile.entityType}
        region={profile.region}
        memberSince={memberSince}
        profileImage={profile.profileImage}
        publicTagline={profile.publicTagline}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <div className="flex flex-col gap-4">
          <ProfilePublicShowcaseSection
            publicTagline={profile.publicTagline}
            businessDescription={profile.businessDescription}
            exportMarkets={profile.exportMarkets}
            valuesHighlight={profile.valuesHighlight}
            publicProfilePath={publicProfilePath}
          />
          <ProfilePersonalSection
            fullName={fullName}
            email={user.email}
            phone={profile.phone}
          />
          <ProfileBusinessSection
            entityName={profile.entityName}
            registrationNumber={profile.registrationNumber}
            region={profile.region}
            city={profile.city}
            yearEstablished={profile.yearEstablished}
            categories={categories}
            annualCapacity={profile.annualCapacity}
          />
        </div>
        <ProfileSideCards partnerId={partnerId} partnerSince={memberSince} />
      </div>
    </div>
  );
}

export { formatMemberSince };
