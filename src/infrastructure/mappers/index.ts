// infrastructure/mappers/index.ts
// Barrel export — import all mappers from a single entry point

export {
  mapUserToDomain,
  mapUserCreateToApi,
  mapUserUpdateToApi,
  type ApiUserResponse,
  type ApiUserCreateRequest,
  type ApiUserUpdateRequest,
  type ApiUserPasswordChangeRequest,
  type ApiUserAdminPasswordChangeRequest,
} from "./userMapper";

export {
  mapProjectSummaryToDomain,
  mapProjectDetailToDomain,
  mapProjectCreateToApi,
  mapProjectUpdateToApi,
  mapProjectUsersToApi,
  type ApiProjectSummaryResponse,
  type ApiProjectDetailResponse,
  type ApiProjectUserResponse,
  type ApiDevelopmentResponse,
  type ApiLinkResponse,
  type ApiProjectCreateRequest,
  type ApiProjectUpdateRequest,
  type ApiProjectUsersRequest,
} from "./projectMapper";

export {
  mapTimeEntryToDomain,
  mapUserTimeEntriesToDomain,
  mapTimeEntryCreateToApi,
  mapTimeEntryUpdateToApi,
  type ApiTimeEntryResponse,
  type ApiUserTimeEntriesResponse,
  type ApiTimeEntryCreateRequest,
  type ApiTimeEntryUpdateRequest,
} from "./timeEntryMapper";

export {
  mapClientSummaryToDomain,
  type ApiClientSummaryResponse,
} from "./clientMapper";
