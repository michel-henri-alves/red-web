const metadataLabels = {
  productId: "productId",
  salesId: "salesId",
  date: "date",
  quantity: "quantity",
  name: "name",
  vendor: "vendor",
};

const isPlainObject = (value) => (
  value !== null
  && typeof value === "object"
  && !Array.isArray(value)
);

export function formatIssueMetadataForDisplay(metadata) {
  if (metadata === null || metadata === undefined || metadata === "") {
    return "";
  }

  if (typeof metadata === "string" || typeof metadata === "number" || typeof metadata === "boolean") {
    return String(metadata);
  }

  if (Array.isArray(metadata)) {
    return metadata.map(formatIssueMetadataForDisplay).filter(Boolean).join(" | ");
  }

  if (isPlainObject(metadata)) {
    return Object.entries(metadata)
      .filter(([, value]) => value !== null && value !== undefined && value !== "")
      .map(([key, value]) => `${metadataLabels[key] || key}: ${formatIssueMetadataForDisplay(value)}`)
      .join(" | ");
  }

  return String(metadata);
}

export function formatIssueMetadataForInput(metadata) {
  if (metadata === null || metadata === undefined) {
    return "";
  }

  if (typeof metadata === "string") {
    return metadata;
  }

  if (typeof metadata === "number" || typeof metadata === "boolean") {
    return String(metadata);
  }

  return JSON.stringify(metadata);
}
