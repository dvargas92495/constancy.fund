const STAGES = [
  "INVITED",
  "NOT_SIGNED_YET",
  "CONFIRM_NEW_BACKER",
  "CONTRACTS_SIGNED",
  "REJECTED",
  "ARCHIVED",
] as const;

export const dbIdByStatusName = Object.fromEntries(
  STAGES.map((s, i) => [s, i])
);

export default STAGES;
