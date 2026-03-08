import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">
      
      <div className="text-6xl font-bold text-red-500 mb-4">
        403
      </div>

      <h1 className="text-2xl font-semibold mb-2">
        Acesso não autorizado
      </h1>

      <p className="text-gray-600 max-w-md mb-6">
        Você não possui permissão para acessar esta página.
        Caso precise deste acesso, fale com o administrador do sistema.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ir para o Dashboard
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 border rounded hover:bg-gray-100"
        >
          Voltar
        </button>
      </div>

    </div>
  );
}