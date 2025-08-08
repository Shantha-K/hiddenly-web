import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';

const QrScannerScreen = () => {
  const [data, setData] = useState('Align QR within frame to scan');

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Scan QR Code</h2>
        <p className="text-gray-600 text-center mb-6">
          Align the QR code within the frame to scan. Ensure good lighting for best results.
        </p>

        <div className="relative mb-4">
          <BarcodeScannerComponent
            width={300}
            height={300}
            onUpdate={(err, result) => {
              if (result) setData(result.text);
            }}
          />
          {/* Overlay Frame */}
          <div className="absolute inset-0 border-4 border-blue-800 rounded-lg pointer-events-none"></div>
        </div>

        <p className="text-center font-medium">{data}</p>
        <button
          onClick={() => setData('Align QR within frame to scan')}
          className="mt-6 w-full bg-blue-800 text-white py-2 rounded-md"
        >
          Scan Now
        </button>
      </div>
    </div>
  );
};

export default QrScannerScreen;
