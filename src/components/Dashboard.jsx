import { useState } from "react";
import NewsTicker from "./NewsTicket";
import SalesChart from "./SalesChart";
import { useLast5DaysSales, useTodaySalesTotal } from "../shared/hooks/useDashboard";
import { useTranslation } from "react-i18next";

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);


export default function Dashboard() {
  const { t } = useTranslation();
  const [newsSelected, setNewsSelected] = useState("1");
  const [comingSoonSelected, setComingSoonSelected] = useState("1");
  const {
    data: todaySalesTotal = 0,
    isLoading: isTodaySalesLoading,
    isError: isTodaySalesError,
    isFetching: isTodaySalesFetching,
    refetch: refetchTodaySales,
  } = useTodaySalesTotal();
  const {
    data: salesData = [],
    isLoading: isSalesLoading,
    isError: isSalesError,
    isFetching: isSalesFetching,
    refetch: refetchSales,
  } = useLast5DaysSales();

  const news = [
    { label: "Descontos por porcentagem", value: "1", icon: "%" },
    { label: "Listagem de ocorrências", value: "2", icon: "📢" },
    { label: "Vendas até o limite", value: "4", icon: "⚠️" },
    { label: "Vendas além do limite do estoque", value: "3", icon: "🚨" },
  ];

  const comingSoon = [
    { label: "Aplicativo móvel", value: "1", icon: "📱" },
    { label: "Produtos por setor", value: "2", icon: "🏘" },
    { label: "Integração com POS", value: "3", icon: "🏧" },
    { label: "Inventário", value: "4", icon: "🔍" },
  ];

  const notifications = [
    "🚀 Em breve, notificações sobre validade e quantidade",
    "🙏🏻 Obrigado por usar Tipo",
    "🎨 Em breve, customização de visual",
    "💡 Para realizar vendas necessário ter produtos cadastrados",
  ];

  return (
    <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3">

      {/* Bem vindo */}
      <div className="flex flex-col bg-blue-100 p-4 rounded shadow border-l-4 border-l-blue-500 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Bem-vindo ao TIPO</h1>
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
        <h2 className="text-xl font-bold text-gray-800 mb-2"> {t("dashboard.sales.today")} </h2>
        {isTodaySalesLoading ? (
          <p className="text-gray-600" role="status">Carregando vendas de hoje...</p>
        ) : isTodaySalesError ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-700">Não foi possível carregar as vendas de hoje.</p>
            <button
              type="button"
              onClick={() => refetchTodaySales()}
              className="rounded bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <p className="text-5xl text-blue-500 font-bold">{formatCurrency(todaySalesTotal)}</p>
            {todaySalesTotal === 0 ? (
              <p className="mt-2 text-sm text-gray-600">Nenhuma venda registrada hoje.</p>
            ) : null}
            {isTodaySalesFetching ? (
              <p className="mt-2 text-sm text-green-700">Atualizando...</p>
            ) : null}
          </>
        )}
      </div>

      {/* Gráfico */}
      <div className="bg-purple-100 p-4 rounded shadow border-l-4 border-l-purple-500 sm:col-span-2 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-800">💲 Vendas Últimos 5 Dias</h2>
          {isSalesFetching && !isSalesLoading ? (
            <span className="text-sm text-purple-700">Atualizando...</span>
          ) : null}
        </div>

        {isSalesLoading ? (
          <div className="flex h-64 items-center justify-center rounded bg-white text-gray-600" role="status">
            Carregando vendas...
          </div>
        ) : isSalesError ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded bg-white p-4 text-center">
            <p className="text-gray-700">Não foi possível carregar as vendas dos últimos 5 dias.</p>
            <button
              type="button"
              onClick={() => refetchSales()}
              className="rounded bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : salesData.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded bg-white p-4 text-center text-gray-600">
            Nenhuma venda encontrada nos últimos 5 dias.
          </div>
        ) : (
          <div className="rounded bg-white p-4">
            <SalesChart data={salesData} />
          </div>
        )}
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
