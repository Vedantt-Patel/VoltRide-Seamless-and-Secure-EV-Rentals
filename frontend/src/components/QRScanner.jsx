"use client"

import { useState, useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"

const QRScanner = ({ onResult, onClose }) => {
  const [error, setError] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [scannedResult, setScannedResult] = useState(null)
  const [showDebug, setShowDebug] = useState(false)
  const [loading, setLoading] = useState(false)
  const scannerRef = useRef(null)
  const qrBoxSize = 280

  const destroyScanner = async () => {
    try {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current = null;
      }
      
      const qrReader = document.getElementById("qr-reader");
      if (qrReader) {
        qrReader.innerHTML = "";
      }
      
      document.querySelectorAll("video").forEach(video => video.remove());
      document.querySelectorAll(".html5-qrcode-element").forEach(el => el.remove());
    } catch (err) {
      console.error("Error destroying scanner:", err);
    }
  }

  const startScanner = async () => {
    await destroyScanner();
    
    try {
      setError(null);
      setScanning(true);
      
      scannerRef.current = new Html5Qrcode("qr-reader");

      const loadingElements = document.querySelectorAll(".qr-loading-text");
      loadingElements.forEach(el => el.remove());

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: qrBoxSize, height: qrBoxSize },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
              setScannedResult(decodedText);
              setShowDebug(true);
              setScanning(false);
            }).catch(err => {
              console.error("Error stopping scanner after success:", err);
            });
          }
        },
        (errorMessage) => {
          console.log(errorMessage);
        }
      );
      
      setTimeout(() => {
        setScanning(false);
      }, 1500);
      
    } catch (err) {
      console.error("Error starting QR scanner:", err);
      setError("Could not access camera. Please ensure camera permissions are granted.");
      setScanning(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      startScanner();
    }, 500);

    return () => {
      clearTimeout(timer);
      destroyScanner();
    };
  }, []);

  const handleClose = () => {
    destroyScanner().then(() => {
      onClose();
    });
  }

  const fetchContractDetails = async (qrData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/contracts/qr-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode: qrData }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const contractData = await response.json();
      onResult(contractData);
    } catch (err) {
      console.error("Error fetching contract details:", err);
      setError("Failed to fetch contract details. Please try again.");
      setLoading(false);
      onResult(scannedResult);
    }
  }

  const handleConfirm = () => {
    if (scannedResult) {
      fetchContractDetails(scannedResult);
    }
  }

  const handleRescan = async () => {
    setShowDebug(false);
    setScannedResult(null);
    setError(null);
    await destroyScanner();
    
    setTimeout(() => {
      startScanner();
    }, 500);
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4">Scan QR Code</h3>
      
      {showDebug && scannedResult ? (
        <div className="mb-6">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2">Scanned QR Code Value:</h4>
            <div className="bg-white p-3 rounded border overflow-x-auto">
              <pre className="text-left text-sm whitespace-pre-wrap break-all">{scannedResult}</pre>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <button 
              onClick={handleRescan}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              disabled={loading}
            >
              Scan Again
            </button>
            <button 
              onClick={handleConfirm}
              className={`px-4 py-2 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition duration-200 flex items-center justify-center`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Confirm & Continue'
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ height: "450px" }}>
            <div id="qr-reader" className="w-full h-full" style={{ position: "relative" }}></div>
          </div>
          
          {(error) && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {scanning && (
            <div className="mb-4 text-blue-600">
              <div className="flex justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Initializing camera...</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mb-4">
            <button 
              onClick={handleClose} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            
            <button 
              onClick={handleRescan}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Try Again
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Position the QR code within the frame to scan</p>
          </div>
        </>
      )}
    </div>
  )
}

export default QRScanner