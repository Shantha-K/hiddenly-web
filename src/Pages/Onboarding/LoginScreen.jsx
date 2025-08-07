import React, { useState } from 'react';
import { Mail, Smartphone, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ import navigation

const InochatVerificationScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const navigate = useNavigate(); // ✅ initialize navigation

  const verificationMethods = [
    {
      id: 'email',
      title: 'Email Verification',
      description: 'Send code to your registered email address.',
      icon: Mail
    },
    {
      id: 'phone',
      title: 'Phone Verification',
      description: 'Send code to your registered phone number.',
      icon: Smartphone
    },
    {
      id: 'qr',
      title: 'QR Code Scan',
      description: 'Scan a QR code to verify your identity.',
      icon: QrCode,
      fullWidth: true
    }
  ];

  const handleSelect = (methodId) => {
    setSelectedMethod(methodId);

    // ✅ navigate based on method
    if (methodId === 'phone') {
      navigate('/verify/phone');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 flex flex-col items-center justify-center relative px-4">
      <div className="flex flex-col items-center space-y-8 max-w-2xl w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">IC</span>
          </div>
          <h1 className="text-blue-600 text-2xl font-light">Inochat</h1>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-gray-800 text-2xl font-semibold">Verify Your Identity</h2>
          <p className="text-gray-600 text-base">Choose a method to receive your verification code or link.</p>
        </div>

        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verificationMethods.slice(0, 2).map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  onClick={() => handleSelect(method.id)}
                  className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-lg ${
                      selectedMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-8 h-8 ${
                        selectedMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-gray-800 font-semibold text-lg mb-1">{method.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{method.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* QR Code Card */}
          <div
            onClick={() => handleSelect('qr')}
            className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMethod === 'qr'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`p-3 rounded-lg ${
                selectedMethod === 'qr' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <QrCode className={`w-8 h-8 ${
                  selectedMethod === 'qr' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-lg mb-1">QR Code Scan</h3>
                <p className="text-gray-600 text-sm">Scan a QR code to verify your identity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default InochatVerificationScreen;
