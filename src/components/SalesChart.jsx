import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatSales = (value) => Number(value ?? 0).toFixed(2);

const SalesChart = ({ data }) => {
  return (
    <div className="w-full h-64" role="img" aria-label="Sales Last 5 Days line chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={formatSales} />
          <Tooltip formatter={(value) => [`R$ ${formatSales(value)}`, "Vendas"]} />
          <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
