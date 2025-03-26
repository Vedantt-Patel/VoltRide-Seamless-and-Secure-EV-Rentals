"use client"

import { useState } from "react"

const ImageViewer = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="max-w-4xl w-full mx-4 bg-white rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Pickup Images ({currentIndex + 1}/{images.length})
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Image Display */}
        <div className="relative">
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].caption}
            className="w-full h-[60vh] object-contain"
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Caption */}
        <div className="p-4 border-t">
          <p className="text-gray-600">{images[currentIndex].caption}</p>
        </div>

        {/* Thumbnails */}
        <div className="p-4 border-t overflow-x-auto">
          <div className="flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 ${currentIndex === index ? "ring-2 ring-blue-500" : ""}`}
              >
                <img src={image.url} alt={`Thumbnail ${index + 1}`} className="h-16 w-16 object-cover rounded" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageViewer

