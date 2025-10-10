import { motion } from "framer-motion";

export default function TotalBalanceCard({ value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-indigo-600 text-white rounded-xl p-6 shadow-lg"
    >
      <p className="text-sm opacity-80">Saldo Atual</p>
      <h2 className="text-4xl font-bold mt-2">
        R$ {value.toFixed(2)}
      </h2>
    </motion.div>
  );
}