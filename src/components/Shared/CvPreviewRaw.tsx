import { Download, ExpandIcon, Maximize } from "lucide-react";
import React, { useEffect } from "react";

interface CVPreviewRawProps {
  heading?:string;
  pdfUrl: string;
  onClose?: () => void;
  candidateFullDetails?:any;
  showDownload?:boolean;
  isContractCopy?:boolean;
}

const CVPreviewRaw: React.FC<CVPreviewRawProps> = ({ pdfUrl, onClose,heading,candidateFullDetails,showDownload,isContractCopy }) => {
  useEffect(() => {
    // console.log(candidateFullDetails);
  }, [candidateFullDetails]);

  const handleDownload = () => {
          fetch(pdfUrl)
            .then((response) => response.blob())
            .then((blob) => {
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.href = url;
            const candidateName = isContractCopy ? candidateFullDetails?.name.replace(/\s+/g, "_") : candidateFullDetails?.name.replace(/\s+/g, "_");

            const totalYOE = isContractCopy ? "" : candidateFullDetails?.YOE;

            const companyName = isContractCopy ? candidateFullDetails?.agencyName.replace(/\s+/g, "_"): (candidateFullDetails?.currentCompany || "Company").replace(/\s+/g, "_");

            const date = new Date().toISOString().split("T")[0];
            link.download = `Worko_${candidateName}_${totalYOE}_${companyName}_${date}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            })
            .catch((error) => console.error("Error downloading the file:", error));
  }

  return (
    <div className="flex flex-col gap-4 p-4 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{heading ?? "CV Preview"}</h2>
        <div>
        {showDownload &&
        <button
          onClick={handleDownload}
          className="border bg-blue-200 px-3 py-2 rounded-md shadow text-blue-600 mx-2">
          <Download className="w-4 h-4" />
        </button>}
        <button
          onClick={() => window.open(pdfUrl, "_blank")}
          className=" border bg-blue-200 text-blue px-3 py-2 rounded shadow-lg hover:text-blue-600"
        >
          <Maximize className="w-4 h-4" />
        </button>
        </div>
      </div>

      <div className="flex-1 border-2 border-gray-400 w-full min-h-[80vh] rounded-xl overflow-hidden relative gap-2">
        <iframe
          src={pdfUrl}
          title="CV Preview"
          className="w-full min-h-[80vh] h-full"
        />
          {/* {showDownload && candidateFullDetails &&
              <button
              onClick={() => {
              fetch(pdfUrl)
                .then((response) => response.blob())
                .then((blob) => {
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.href = url;
                const candidateName = isContractCopy ? candidateFullDetails?.name.replace(/\s+/g, "_") : candidateFullDetails?.candidateParsedCvDetails?.name.replace(/\s+/g, "_");

                const totalYOE = isContractCopy ? "" : candidateFullDetails?.candidateParsedCvDetails?.totalYOE;

                const companyName = isContractCopy ? candidateFullDetails?.agencyName.replace(/\s+/g, "_"): (candidateFullDetails?.candidateParsedCvDetails?.currentCompany || "Company").replace(/\s+/g, "_");

                const date = new Date().toISOString().split("T")[0];
                link.download = `Worko_${candidateName}_${totalYOE}_${companyName}_${date}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                })
                .catch((error) => console.error("Error downloading the file:", error));
              }}
              className="absolute bottom-4 right-16 border bg-blue-200 px-3 py-2 rounded-md shadow text-blue-600 mx-2">
              <Download className="w-4 h-4" />
            </button>}
        <button
          onClick={() => window.open(pdfUrl, "_blank")}
          className="absolute bottom-4 right-4 bg-white text-blue px-4 py-2 rounded shadow hover:text-blue-600"
        >
          <Maximize className="w-4 h-4" />
        </button> */}
      </div>
    </div>
  );
};

export default CVPreviewRaw;
