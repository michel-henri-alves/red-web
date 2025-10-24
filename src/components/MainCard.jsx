import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";


export default function TotalBalanceCard({ amount }) {
  const { t } = useTranslation();
  const bgColor = amount < 0 ? "bg-red-600" : "bg-green-600";


  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} text-white rounded-xl p-6 shadow-lg`}
    >
      <p className="text-sm opacity-80">{t("current.balance")}</p>
      <h2 className="text-4xl font-bold mt-2">
        {t("currency")} {amount.toFixed(2)}
      </h2>
    </motion.div>
  );
}