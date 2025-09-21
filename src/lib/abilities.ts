// src/lib/abilities.ts
import { AbilityBuilder, createMongoAbility } from "@casl/ability";

export type Actions = "manage" | "read" | "create" | "update" | "delete";
// ✅ Updated with new subjects
export type Subjects = "all" | "sa_dashboard" | "oa_dashboard" | "os_dashboard" | "organization-setup" | "setup_error" | "post" | "user";

export default function defineAbilitiesFor(role: string) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (role === "sys_admin") {
    can("read", "sa_dashboard");
    can("manage", "all");
  } else if (role === "org_admin") {
    // ✅ Org admin can read their dashboard and access setup pages
    can("read", "oa_dashboard");
    can("read", "organization-setup");
    can("read", "setup_error");
    can("manage", "organizations");
    can("manage", "org_staff");
  } else if (role === "org_staff") {
    // ✅ Org staff can read their dashboard and access setup pages
    can("read", "os_dashboard");
    can("read", "organization-setup");
    can("read", "setup_error");
    can("read", "organizations");
    can("read", "profile");
  } else {
    // Guest/default permissions
    can("read", "login");
    can("read", "/");
  }

  return build({
    detectSubjectType: (object) => object!.type,
  });
}