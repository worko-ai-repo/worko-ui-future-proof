import { Check, CircleAlert } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface NoDuplicateModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const NoDuplicateModal: FC<NoDuplicateModalProps> = ({
  onClose,
  isOpen,
}) => {
  const [visible, setVisible] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const timer = setTimeout(() => setIsAnimatingIn(true), 10);
      const messageTimer = setTimeout(() => onClose(), 3000);
      return () => {
        clearTimeout(timer)
        clearTimeout(messageTimer)
      };
    } else {
      setIsAnimatingIn(false);
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-end transition-opacity duration-300 ease-in-out ${
        isAnimatingIn ? "bg-black bg-opacity-50" : "bg-opacity-0 bg-black"
      } ${visible ? "visible" : "invisible"}`}>
      <div
        className={`bg-white rounded-l-lg p-6 w-full max-w-md relative transform transition-transform duration-300 ease-in-out self-auto max-h-[80vh] overflow-y-auto ${
          isAnimatingIn ? "translate-x-0" : "translate-x-full"
        }`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4 text-left text-green-500 flex flex-row gap-1 justify-start items-center">
          <Check/>No Profile found
        </h2>
        <p className="text-start">Candidate details is not present for the selected job</p>
      </div>
    </div>
  );
};

export default NoDuplicateModal;
