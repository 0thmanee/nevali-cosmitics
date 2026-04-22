import type { PartnerRow } from "~/app/api/partners/schemas/partners.schema";
export { UsersList } from "./users-list";
export type { PartnerRow };
/** @deprecated Use PartnerRow from partners schema. */
export type UserRow = PartnerRow;
