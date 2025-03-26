"use client"

import { useRef } from "react"
import Webcam from "react-webcam"

const FaceVerification = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null)

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    onCapture(imageSrc)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Face Verification</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full rounded-lg" />
        <button onClick={capture} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Capture Photo
        </button>
      </div>
    </div>
  )
}

export default FaceVerification

