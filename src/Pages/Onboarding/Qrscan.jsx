import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const QrScannerScreen = () => {
  const [data, setData] = useState("Align QR within frame to scan");
  const [imageSrc, setImageSrc] = useState(null);

  // Convert scanned URL → image blob → local object URL
  const fetchImageFromDrive = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };

  // Download image from scanned link
  const downloadImage = async () => {
    try {
      const response = await fetch(data);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "qr-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Scan QR Code</h2>
        <p className="text-gray-600 text-center mb-6">
          Align the QR code within the frame to scan. Ensure good lighting for
          best results.
        </p>

        <div className="relative mb-4">
          <BarcodeScannerComponent
            width={300}
            height={300}
            onUpdate={(err, result) => {
              if (result) {
                setData(result.text);
                // If scanned text is a Google Drive direct image link, fetch image
                fetchImageFromDrive(result.text);
              }
            }}
          />
          {/* Overlay Frame */}
          <div className="absolute inset-0 border-4 border-blue-800 rounded-lg pointer-events-none"></div>
        </div>

        <p className="text-center font-medium break-all">{data}</p>

        {imageSrc && (
          <div className="mt-4">
            <img
              src={imageSrc}
              alt="Scanned QR Image"
              className="w-full rounded-md shadow"
            />
            <button
              onClick={downloadImage}
              className="mt-3 w-full bg-green-600 text-white py-2 rounded-md"
            >
              Download Image
            </button>
          </div>
        )}

        <button
          onClick={() => {
            setData("Align QR within frame to scan");
            setImageSrc(null);
          }}
          className="mt-6 w-full bg-blue-800 text-white py-2 rounded-md"
        >
          Scan Again
        </button>
      </div>
    </div>
  );
};

export default QrScannerScreen;
