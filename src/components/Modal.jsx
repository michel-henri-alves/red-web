import React from "react";
import { motion, AnimatePresence } from "framer-motion";



export default function Modal({ title, isOpen, onClose, closeButtonRef, children }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded shadow-lg w-full relative "
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            ref={closeButtonRef}
          >
            ✖️
          </button>
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <div className="p-6 overflow-y-auto max-h-[80vh]">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
