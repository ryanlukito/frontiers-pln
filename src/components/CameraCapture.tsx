"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

interface CameraCaptureProps {
  onCapture: (image: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCaptured(imageSrc);
      onCapture(imageSrc); // send back to parent
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between gap-3">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-[#51B5DD] hover:bg-[#429fc2] text-white rounded-md shadow"
        >
          Open Camera
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-md border"
            videoConstraints={{ facingMode: "environment" }}
          />
          <button
            type="button"
            onClick={capture}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            Capture
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Close
          </button>
        </div>
      )}

      {captured && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-1">Captured Image:</p>
          <img src={captured} alt="Captured" className="w-48 rounded-md border" />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
