import React from "react";
// import { Plus } from "lucide-react"; // ícone opcional

export default function FloatingActionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
    >
      {/* <Plus size={24} /> */}
      <h1>+</h1>
    </button>
  );
}