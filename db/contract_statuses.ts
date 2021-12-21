const STATUSES = ["PREVIEWABLE", "SIGNED"];

export const dbIdByStatusName = Object.fromEntries(
  STATUSES.map((s, i) => [s, i])
);

export default STATUSES;
