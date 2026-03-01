import React from "react";
import NoDataPresent from "./NoDataPresent";
import { parseScorePoints } from "@Utils/DetailedAnalysis.utils";

interface ScorePoint {
  heading: string;
  detail?: string | null;
  type?: "positive" | "negative";
}

export interface ScorePointsModalProps {
  title: string;
  data: unknown;
  matchingScore: number;
  candidateName?: string;
  details?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
}

const ScorePointsModal: React.FC<ScorePointsModalProps> = ({
  title,
  data,
  matchingScore,
  candidateName = "Candidate",
  details = true,
  showCloseButton = false,
  onClose,
}) => {
  const [showDetails, setShowDetails] = React.useState(details);
  if (!data) return <NoDataPresent />;

  const { points: scorePoints, recruiterNote }: { points: ScorePoint[]; recruiterNote?: string } = parseScorePoints(data);

  // Get score rating based on percentage
  const getScoreRating = (score: number) => {
    if (score >= 90) return "EXCELLENT";
    if (score >= 80) return "VERY GOOD";
    if (score >= 70) return "GOOD";
    if (score >= 60) return "FAIR";
    return "POOR";
  };

  // Separate positive and negative points
  const strengths = scorePoints.filter((point) => point.type === "positive");
  const concerns = scorePoints.filter((point) => point.type === "negative");

  return (
    <section className="overflow-hidden min-w-[900px] max-w-[1000px] max-sm:min-w-[300px] max-sm:max-w-[400px]">
      <article className="w-full h-full">
        <div className="relative p-6">
          {/* Header */}
          <header className="mb-6">
            <h2 className="text-xl text-left font-semibold text-black font-['Poppins']">
              Matching score details
            </h2>
          </header>

          <div className="flex gap-6 text-left ">
            {/* Left Content */}
            <div className="flex-1">
              {/* Feedback Summary */}
              <div className="mb-6">
                <div className="mb-2">
                  <span className="text-gray-600 text-sm font-medium font-['Poppins']">
                    {title} for
                  </span>
                  <span className="text-blue-600 capitalize text-sm font-semibold font-['Poppins']">
                     &nbsp;{candidateName}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 min-h-[120px]">
                  <div className="text-gray-800 text-sm font-normal font-['Poppins'] leading-relaxed">
                    {recruiterNote || "No detailed feedback summary available."}
                  </div>
                </div>
              </div>

              {/* Details Dropdown */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors font-medium text-sm">
                  Details
                  <svg
                    className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

            </div>

            {/* Right Content - Score Card */}
            <div className="w-48 h-52 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl relative flex flex-col items-center justify-center p-6">
              <div className="text-white text-sm font-semibold font-['Poppins'] mb-4">
                Matching Score
              </div>

              {/* Circular Gauge */}
              <CircularGauge percentage={matchingScore} />

              <div className="text-white text-sm font-semibold font-['Poppins'] mt-4">
                {getScoreRating(matchingScore)}
              </div>
            </div>
          </div>
          
              {/* Collapsible Details */}
              {showDetails && (
                <div className="mt-2 space-y-4 text-left">
                  {/* Strengths */}
                  {strengths.length > 0 && (
                    <div>
                      <div className="text-gray-700 text-sm font-semibold font-['Poppins'] mb-2">
                        Strengths
                      </div>
                      <div className=" rounded-lg border border-green-400 p-4">
                        <div className="text-gray-800 text-sm font-normal font-['Poppins'] leading-relaxed">
                          {strengths.map((strength, index) => (
                            <div key={index} className="mb-2 last:mb-0">
                              • {strength.detail || strength.heading}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Areas of Concern */}
                  {concerns.length > 0 && (
                    <div>
                      <div className="text-gray-700 text-sm font-semibold font-['Poppins'] mb-2">
                        Areas of Concern
                      </div>
                      <div className="bg-red-50 rounded-lg border border-red-400 p-4">
                        <div className="text-gray-800 text-sm font-normal font-['Poppins'] leading-relaxed">
                          {concerns.map((concern, index) => (
                            <div key={index} className="mb-2 last:mb-0">
                              • {concern.detail || concern.heading}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
        </div>
      </article>
    </section>
  );
};

export default ScorePointsModal;

interface CircularGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({
  percentage,
  size = 112,
  strokeWidth = 8,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#22d3ee"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-3xl font-medium font-['Poppins']">{percentage}%</span>
      </div>
    </div>
  );
};
