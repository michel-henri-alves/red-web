export const BRASILIA_UTC_OFFSET_IN_MS = 3 * 60 * 60 * 1000;

export const toBrasiliaTimestamp = (date = new Date()) => {
  const parsedDate = date instanceof Date ? date : new Date(date);

  return parsedDate.getTime() - BRASILIA_UTC_OFFSET_IN_MS;
};

export const toBrasiliaISOString = (date = new Date()) => (
  new Date(toBrasiliaTimestamp(date)).toISOString()
);
