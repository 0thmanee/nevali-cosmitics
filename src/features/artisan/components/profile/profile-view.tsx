"use client";

import Link from "next/link";
import React from "react";
import type {
	ProfileViewProfile,
	ProfileViewUser,
} from "~/app/api/profile/schemas/profile.schema";
import { ProfileBusinessSection } from "./profile-business-section";
import { ProfileHeaderCard } from "./profile-header-card";
import { ProfilePersonalSection } from "./profile-personal-section";
import { ProfilePublicShowcaseSection } from "./profile-public-showcase-section";
import { ProfileSideCards } from "./profile-side-cards";

type Props = {
	user: ProfileViewUser;
	profile: ProfileViewProfile | null;
	memberSince: string;
	partnerId: string;
	publicProfilePath: string | null;
};

function formatMemberSince(date: Date): string {
	return new Intl.DateTimeFormat("en-GB", {
		month: "short",
		year: "numeric",
	}).format(date);
}

export function ProfileView({
	user,
	profile,
	memberSince,
	partnerId,
	publicProfilePath,
}: Props) {
	if (!profile) {
		return (
			<div>
				<div
					className="rounded-sm p-8 text-center"
					style={{
						background: "white",
						border: "1px solid var(--color-cream-dark)",
					}}
				>
					<p className="font-sans text-text-muted">
						No profile data yet. Complete onboarding to see your profile here.
					</p>
					<Link
						className="mt-4 inline-block font-medium font-sans text-sm text-text-dark underline"
						href="/onboarding"
					>
						Go to onboarding
					</Link>
				</div>
			</div>
		);
	}

	const displayName =
		`${profile.firstName} ${profile.lastName}`.trim() || user.name;
	const fullName = displayName;
	const categories = Array.isArray(profile.categories)
		? profile.categories
		: [];

	return (
		<div className="flex flex-col gap-4">
			<ProfileHeaderCard
				displayName={displayName}
				entityName={profile.entityName}
				entityType={profile.entityType}
				memberSince={memberSince}
				profileImage={profile.profileImage}
				publicTagline={profile.publicTagline}
				region={profile.region}
			/>

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
				<div className="flex flex-col gap-4">
					<ProfilePublicShowcaseSection
						businessDescription={profile.businessDescription}
						exportMarkets={profile.exportMarkets}
						publicProfilePath={publicProfilePath}
						publicTagline={profile.publicTagline}
						valuesHighlight={profile.valuesHighlight}
					/>
					<ProfilePersonalSection
						email={user.email}
						fullName={fullName}
						phone={profile.phone}
					/>
					<ProfileBusinessSection
						annualCapacity={profile.annualCapacity}
						categories={categories}
						city={profile.city}
						entityName={profile.entityName}
						region={profile.region}
						registrationNumber={profile.registrationNumber}
						yearEstablished={profile.yearEstablished}
					/>
				</div>
				<ProfileSideCards partnerId={partnerId} partnerSince={memberSince} />
			</div>
		</div>
	);
}

export { formatMemberSince };
