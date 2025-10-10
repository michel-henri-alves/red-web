import { useState } from 'react';
import { useTranslation } from 'react-i18next'
import NewsTicker from './NewsTicket';
import SalesChart from './SalesChart';


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
    "💡 Para realizar vendas necessário ter produtos cadastrados"
  ];

  const salesData = [
    { day: "10/08", sales: 120 },
    { day: "11/08", sales: 98 },
    { day: "12/08", sales: 150 },
    { day: "13/08", sales: 170 },
    { day: "14/08", sales: 130 },
  ];

  return (
    <div className="grid grid-cols-3 grid-rows-4 gap-4 p-2">

      <div className="flex flex-col bg-blue-100 p-4 rounded shadow items-center justify-center border-l-4 border-l-blue-500">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Bem-vindo ao TYPPO</h1>
        <h4 className="text-center text-center">versão de degustação</h4>
      </div>


      <div className="bg-purple-100 p-4 rounded shadow row-span-2 border-l-4 border-l-purple-500">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🚨 Novidades</h1>
        {news.map((option) => (
          <div
            key={option.value}
            onMouseOver={() => setNewsSelected(option.value)}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all text-white md:font-bold
                            bg-purple-400 hover:bg-purple-600
                            ${newsSelected === option.value ? "ring-2 ring-offset-2 ring-blue-500 scale-105" : ""}
                        `}
          >
            <input
              type="radio"
              name="payment"
              value={option.value}
              checked={newsSelected === option.value}
              onChange={() => { }}
              className="hidden"
            />
            <span className="font-medium">{option.icon} {option.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-orange-100 p-4 rounded shadow row-span-2 border-l-4 border-l-orange-500">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">👀 Em Breve</h1>
        {comingSoon.map((option) => (
          <div
            key={option.value}
            onMouseOver={() => setComingSoonSelected(option.value)}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all text-white md:font-bold
                            bg-orange-400 hover:bg-orange-600
                            ${comingSoonSelected === option.value ? "ring-2 ring-offset-2 ring-blue-500 scale-105" : ""}
                        `}
          >
            <input
              type="radio"
              name="payment"
              value={option.value}
              checked={comingSoonSelected === option.value}
              onChange={() => { }}
              className="hidden"
            />
            <span className="font-medium">{option.icon} {option.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-green-100 p-4 rounded shadow  border-l-4 border-l-green-500">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Vendas do dia</h1>
        <h4 className="text-6xl text-blue-500">R$ 5350.32</h4>
      </div>

      <div className="bg-purple-100 p-4 rounded shadow col-span-2 row-span-2 border-l-4 border-l-purple-500">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">💲 Vendas Últimos 5 Dias</h1>
        <SalesChart data={salesData} />
      </div>

      <div className="bg-yellow-100 p-4 rounded shadow row-span-2 border-l-4 border-l-yellow-500">
        <div className="mb-4">
          <a href="#" className="text-6xl text-red-500">0</a>
          <h1>produtos com validade vencida</h1>
        </div>
        <div className="mb-4">
          <a href="#" className="text-6xl text-yellow-500">5</a>
          <h1>produtos com vencimento próximo</h1>
        </div>
        <div className="mb-4">
          <a href="#" className="text-6xl text-green-500">12</a>
          <h1>produtos abaixo da quantidade mínima</h1>
        </div>
      </div>

      <div className="p-4 rounded shadow col-span-3 border-l-4 border-l-cyan-500">
        <NewsTicker messages={notifications} speed={20} />
      </div>

    </div>
  );
}
