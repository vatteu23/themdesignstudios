"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface GalleryImage {
  src: string;
  caption?: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeLightbox = () => {
    setModalOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!modalOpen) return;

      switch (event.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

  return (
    <div className="gallery-container">
      {/* Gallery Grid */}
      <div className="flex flex-wrap -mx-1">
        {images.map((image, index) => (
          <div
            key={`gallery-item-${index}`}
            className="w-1/3 px-1 pb-2 md:w-1/3 sm:w-1/2 xs:w-full"
            onClick={() => openLightbox(index)}
          >
            <div className="relative h-48 overflow-hidden rounded cursor-pointer group">
              <div
                className="absolute inset-0 bg-center bg-cover transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${image.src})` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
            onClick={closeLightbox}
          >
            <motion.div
              className="relative flex flex-col items-center max-w-[90vw] max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <img
                  src={images[currentIndex].src}
                  alt={images[currentIndex].caption || "Gallery image"}
                  className="max-w-full max-h-[70vh] rounded object-contain"
                />
              </motion.div>

              {images[currentIndex].caption && (
                <div className="mt-4 p-2 w-full text-center text-white bg-black bg-opacity-50 rounded">
                  <p className="m-0">{images[currentIndex].caption}</p>
                </div>
              )}

              {/* Image Counter */}
              <div className="absolute top-[-30px] left-0 text-white">
                {currentIndex + 1} / {images.length}
              </div>

              {/* Navigation Controls */}
              <button
                className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black bg-opacity-30 flex items-center justify-center text-white text-2xl cursor-pointer hover:bg-opacity-50 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous image"
              >
                &#10094;
              </button>

              <button
                className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black bg-opacity-30 flex items-center justify-center text-white text-2xl cursor-pointer hover:bg-opacity-50 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next image"
              >
                &#10095;
              </button>

              <button
                className="absolute top-[-40px] right-0 w-8 h-8 rounded-full bg-black bg-opacity-30 flex items-center justify-center text-white cursor-pointer hover:bg-opacity-50 focus:outline-none"
                onClick={closeLightbox}
                aria-label="Close gallery"
              >
                &#10005;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive adjustments for controls on small screens */}
      <style jsx>{`
        @media (max-width: 640px) {
          .left-[-60px] {
            left: 10px !important;
          }
          .right-[-60px] {
            right: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Gallery;
