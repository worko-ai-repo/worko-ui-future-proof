export interface ScorePoint {
  heading: string;
  detail?: string | null;
  type?: "positive" | "negative";
}

export interface NewScoreFormat {
  RecruiterNote?: string;
  Strengths?: string[];
  "Areas of Concern"?: string[];
  AreasOfConcern?: string[]; // Added support for camelCase version
}

/**
 * Parses a feedback/score string into structured ScorePoint[]
 * @param raw - JSON string or object array (supports both old and new formats)
 * @param defaultType - If provided, applies type when it cannot be inferred
 */
export function parseScorePoints(
  raw: string | unknown,
  defaultType?: "positive" | "negative"
): { points: ScorePoint[]; recruiterNote?: string } {
  if (!raw) return { points: [] };

  let data: any = {};

  try {
    // Handle already-parsed object/array
    if (typeof raw !== "string") {
      data = raw;
    } else if (typeof raw === "string") {
      data = JSON.parse(raw);
    }
  } catch (error) {
    console.error("Failed to parse score points:", error);
    return { points: [] };
  }

  // Handle new format with RecruiterNote, Strengths, Areas of Concern
  if (data && typeof data === 'object' && !Array.isArray(data) && 
      (data.RecruiterNote || data.Strengths || data["Areas of Concern"] || data.AreasOfConcern)) {
    const points: ScorePoint[] = [];
    const recruiterNote = data.RecruiterNote;
    
    // Add strengths as positive points
    if (data.Strengths && Array.isArray(data.Strengths)) {
      data.Strengths.forEach((strength: string, index: number) => {
        points.push({
          heading: `Strength ${index + 1}`,
          detail: strength.trim(),
          type: "positive"
        });
      });
    }
    
    // Add areas of concern as negative points - check both property names
    const areasOfConcern = data["Areas of Concern"] || data.AreasOfConcern;
    if (areasOfConcern && Array.isArray(areasOfConcern)) {
      areasOfConcern.forEach((concern: string, index: number) => {
        points.push({
          heading: `Area of Concern ${index + 1}`,
          detail: concern.trim(),
          type: "negative"
        });
      });
    }
    
    return { points, recruiterNote };
  }

  // Handle old format (array of objects)
  if (Array.isArray(data)) {
    const points = data.map((item) => {
      const heading = String(item.heading ?? "").trim();
      const detail = item.detail ?? null;

      // Infer type: simple heuristic
      let type: "positive" | "negative" | undefined = defaultType;

      if (!type) {
        const headingLower = heading.toLowerCase();
        const detailLower = (detail ?? "").toLowerCase();

        if (
          headingLower.includes("missing") ||
          headingLower.includes("insufficient") ||
          headingLower.includes("absent") ||
          headingLower.includes("concern") ||
          headingLower.includes("area of concern") ||
          detailLower.includes("no ") ||
          detailLower.includes("lack") ||
          detailLower.includes("missing") ||
          detailLower.includes("concern")
        ) {
          type = "negative";
        } else {
          type = "positive";
        }
      }

      return { heading, detail, type };
    });
    
    return { points };
  }

  return { points: [] };
}