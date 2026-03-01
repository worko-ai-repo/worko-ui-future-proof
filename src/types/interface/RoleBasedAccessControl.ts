/**
 * UserRole
 *
 * @description   This enum defines the different user roles in the application.
 */
export enum UserRole {
  GENERAL_USER = "general-user",
  CORPORATE = "corporate",
  CORPORATE_ADMIN = "corporate-admin",
  CORPORATE_RECRUITER = "corporate-recruiter",
  ADMIN = "admin",
  LINKEDIN = "linkedin",
  EVALUATOR = "evaluator",
  AGENCY = "agency",
}

/**
 * UserRolesActions
 *
 * @description   This type refer to user roles to their respective actions in the application.
 */
export type UserRolesActions =
  | "view_jobs"
  | "apply_jobs"
  | "create_jobs"
  | "delete_jobs"
  | "manage_users"
  | "evaluate_candidates"
  | "push_to_recruiter"
  | "play_admin"
  | "play_corporate"
  | "play_corporate_recruiter"
  | "play_corporate_admin"
  | "play_evaluator"
  | "play_general_user"
  | "play_linkedin";

/**
 * RolePermissions
 *
 * @enum {UserRole} - UserRole
 * @type {string} - actions that each role can perform
 * @description   This object defines the permissions associated with each user role in the application.
 */
export const RolePermissions: Record<UserRole, UserRolesActions[]> = {
  [UserRole.ADMIN]: [
    "view_jobs",
    "create_jobs",
    "delete_jobs",
    "manage_users",
    "apply_jobs",
    "push_to_recruiter",
    "play_admin",
  ],
  [UserRole.CORPORATE]: ["play_corporate","view_jobs", "create_jobs", "delete_jobs", "manage_users", "apply_jobs"],
  [UserRole.CORPORATE_ADMIN]: [
    "play_corporate_admin",
    "view_jobs",
    "create_jobs",
    "delete_jobs",
    "manage_users",
  ],
  [UserRole.EVALUATOR]: ["play_evaluator", "view_jobs", "evaluate_candidates"],
  [UserRole.CORPORATE_RECRUITER]: ["play_corporate_recruiter", "view_jobs", "create_jobs","manage_users"],
  [UserRole.LINKEDIN]: ["play_linkedin", "view_jobs", "apply_jobs"],
  [UserRole.GENERAL_USER]: ["play_general_user", "view_jobs", "apply_jobs"],
  [UserRole.AGENCY]: ["view_jobs", "apply_jobs", "play_general_user"],
};

//@TODO: For corp_rec and admin permusion not working as expected need to check it once again
//@TODO: For agency role permissions maybe changed
