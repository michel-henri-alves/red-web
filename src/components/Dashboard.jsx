import { useState } from "react";
import { useTranslation } from "react-i18next";
import NewsTicker from "./NewsTicket";
import SalesChart from "./SalesChart";

export default function Dashboard() {
  const { t } = useTranslation();
  const [newsSelected, setNewsSelected] = useState("1");
  const [comingSoonSelected, setComingSoonSelected] = useState("1");

  const news = [
    { label: "Cadastro de Produtos", value: "1", icon: "📦" },
    { label: "Cadastro de Locais", value: "2", icon: "🏘️" },
    { label: "Ponto de vendas", value: "3", icon: "💲" },
    { label: "Leitura de código de barras", value: "4", icon: "𝄃𝄃𝄂𝄀𝄁𝄃" },
  ];

  const comingSoon = [
    { label: "Cadastro de Usuários", value: "1", icon: "🪪" },
    { label: "Cadastro de Clientes", value: "2", icon: "👩🏻‍💼" },
    { label: "Modo de venda 'Caderneta'", value: "3", icon: "📝" },
    { label: "Inventário", value: "4", icon: "🔍" },
  ];

  const notifications = [
    "🚀 Em breve, notificações sobre validade e quantidade",
    "🙏🏻 Obrigado por usar Typpo",
    "🎨 Em breve, customização de visual",
    "💡 Para realizar vendas necessário ter produtos cadastrados",
  ];

  const salesData = [
    { day: "10/08", sales: 120 },
    { day: "11/08", sales: 98 },
    { day: "12/08", sales: 150 },
    { day: "13/08", sales: 170 },
    { day: "14/08", sales: 130 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3">

      {/* Bem vindo */}
      <div className="flex flex-col bg-blue-100 p-4 rounded shadow border-l-4 border-l-blue-500 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Bem-vindo ao TYPPO</h1>
        <p className="text-gray-600">versão de degustação</p>
      </div>

      {/* Novidades */}
      <div className="bg-purple-100 p-4 rounded shadow border-l-4 border-l-purple-500 lg:row-span-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🚨 Novidades</h2>
        <div className="space-y-3">
          {news.map((option) => (
            <div
              key={option.value}
              onClick={() => setNewsSelected(option.value)}
              className={`flex items-center p-3 rounded cursor-pointer text-white bg-purple-400 hover:bg-purple-600 transition ${
                newsSelected === option.value ? "ring-2 ring-offset-2 ring-blue-500 scale-[1.02]" : ""
              }`}
            >
              {option.icon} <span className="ml-2">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-orange-100 p-4 rounded shadow border-l-4 border-l-orange-500 lg:row-span-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">👀 Em breve</h2>
        <div className="space-y-3">
          {comingSoon.map((option) => (
            <div
              key={option.value}
              onClick={() => setComingSoonSelected(option.value)}
              className={`flex items-center p-3 rounded cursor-pointer text-white bg-orange-400 hover:bg-orange-600 transition ${
                comingSoonSelected === option.value ? "ring-2 ring-offset-2 ring-blue-500 scale-[1.02]" : ""
              }`}
            >
              {option.icon} <span className="ml-2">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vendas do dia */}
      <div className="bg-green-100 p-4 rounded shadow border-l-4 border-l-green-500 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Vendas do dia</h2>
        <p className="text-5xl text-blue-500 font-bold">R$ 5.350,32</p>
      </div>

      {/* Gráfico */}
      <div className="bg-purple-100 p-4 rounded shadow border-l-4 border-l-purple-500 sm:col-span-2 lg:col-span-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">💲 Vendas Últimos 5 Dias</h2>
        <SalesChart data={salesData} />
      </div>

      {/* Estoque */}
      <div className="bg-yellow-100 p-4 rounded shadow border-l-4 border-l-yellow-500">
        <div className="space-y-4">
          <div>
            <p className="text-4xl text-red-500 font-bold">0</p>
            <p>produtos com validade vencida</p>
          </div>
          <div>
            <p className="text-4xl text-yellow-500 font-bold">5</p>
            <p>produtos com vencimento próximo</p>
          </div>
          <div>
            <p className="text-4xl text-green-500 font-bold">12</p>
            <p>produtos abaixo da quantidade mínima</p>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="p-4 rounded shadow border-l-4 border-l-cyan-500 sm:col-span-2 lg:col-span-3">
        <NewsTicker messages={notifications} speed={20} />
      </div>
    </div>
  );
}
