function getNestedValue(obj: any, path: string | string[]): any {
  const paths = Array.isArray(path) ? path : [path];

  for (const p of paths) {
    const value = p.split(".").reduce((acc, key) => acc?.[key], obj);
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
}

export type DashboardTableSortOrder = "asc" | "desc";
export function SortTable<T>(
  data: T[],
  key: string | string[], // can be "name" or ["name", "applicantDetails.name"]
  order: DashboardTableSortOrder = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const valA = getNestedValue(a, key);
    const valB = getNestedValue(b, key);

    // Handle undefined/null values - push them to the end
    if ((valA === undefined || valA === null) && (valB === undefined || valB === null)) {
      return 0; // Both undefined/null, keep original order
    }
    if (valA === undefined || valA === null) {
      return 1; // a is undefined, push to end
    }
    if (valB === undefined || valB === null) {
      return -1; // b is undefined, push to end
    }

    // Handle number comparisons
    if (typeof valA === "number" && typeof valB === "number") {
      return order === "asc" ? valA - valB : valB - valA;
    }

    // Handle string comparisons
    if (typeof valA === "string" && typeof valB === "string") {
      return order === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    // Handle mixed types - try to convert to strings for comparison
    const strA = String(valA);
    const strB = String(valB);
    return order === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });
}
