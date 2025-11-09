"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";
import { Client } from "@/types";

export default function Clientes() {
  const { data, addClient, getClientHistory } = useLocalStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    preferences: "",
  });

  // Filtrar clientes baseado na busca
  const filteredClients = data.clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();

    if (newClient.name && newClient.phone) {
      addClient(newClient);
      setNewClient({
        name: "",
        phone: "",
        email: "",
        birthDate: "",
        preferences: "",
      });
      setShowAddModal(false);
      alert("Cliente cadastrado com sucesso!");
    } else {
      alert("Por favor, preencha pelo menos o nome e telefone do cliente.");
    }
  };

  const getLastVisit = (clientId: string) => {
    const history = getClientHistory(clientId);
    return history.length > 0 ? new Date(history[0].date) : null;
  };

  const getTotalSpent = (clientId: string) => {
    const history = getClientHistory(clientId);
    return history.reduce((total, apt) => {
      if (apt.status === "completed") {
        const service = data.services.find((s) => s.id === apt.serviceId);
        return total + (service?.price || 0);
      }
      return total;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Mobile Otimizado */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-3 py-3">
          <div className="flex items-center gap-3">
            {/* Botão Voltar */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700 flex-shrink-0"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Voltar</span>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="bg-amber-500 w-8 h-8 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">BF</span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-amber-500 leading-none truncate">
                    BarberFlow
                  </h1>
                  <p className="text-slate-400 text-xs">Clientes</p>
                </div>
              </div>
            </div>

            {/* Botão Novo Cliente Mobile */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center sm:hidden"
              title="Novo Cliente"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Expandido para Tablet/Desktop */}
          <nav className="hidden sm:flex gap-3 mt-3 pt-3 border-t border-slate-700">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/agendamento"
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              Agendamento
            </Link>
            <Link
              href="/equipe"
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              Equipe
            </Link>
            <Link
              href="/services"
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              Serviços
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-3 py-4">
        {/* Header da Página */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Clientes
            </h1>
            <p className="text-slate-400 text-sm">
              {data.clients.length} cliente
              {data.clients.length !== 1 ? "s" : ""} cadastrado
              {data.clients.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex gap-2 sm:gap-4 flex-shrink-0">
            {/* View Toggle - Mobile */}
            <div className="hidden sm:flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-md transition-colors text-sm ${
                  viewMode === "list"
                    ? "bg-amber-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-md transition-colors text-sm ${
                  viewMode === "grid"
                    ? "bg-amber-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Grade
              </button>
            </div>

            {/* View Toggle - Mobile Compact */}
            <div className="flex sm:hidden bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-amber-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Lista"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-amber-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Grade"
              >
                <GridIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Botão Novo Cliente Desktop */}
            <button
              onClick={() => setShowAddModal(true)}
              className="hidden sm:flex bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors items-center gap-2 text-sm sm:text-base"
            >
              <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Novo Cliente</span>
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Lista de Clientes - Mobile */}
        {viewMode === "list" ? (
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            {/* Header da Lista - Desktop */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-750 border-b border-slate-700 text-slate-400 font-medium text-sm">
              <div className="col-span-4">Cliente</div>
              <div className="col-span-2">Contato</div>
              <div className="col-span-2">Última Visita</div>
              <div className="col-span-2">Total Gasto</div>
              <div className="col-span-2 text-center">Ações</div>
            </div>

            <div className="divide-y divide-slate-700">
              {filteredClients.map((client) => {
                const lastVisit = getLastVisit(client.id);
                const totalSpent = getTotalSpent(client.id);
                const appointmentCount = getClientHistory(client.id).length;

                return (
                  <div
                    key={client.id}
                    className="p-4 sm:px-6 sm:py-4 hover:bg-slate-750 transition-colors"
                  >
                    {/* Layout Mobile */}
                    <div className="sm:hidden">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-sm mb-1">
                            {client.name}
                          </div>
                          <div className="text-xs text-slate-400 mb-2">
                            {client.phone} • {appointmentCount} visita
                            {appointmentCount !== 1 ? "s" : ""}
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">
                              {lastVisit
                                ? lastVisit.toLocaleDateString("pt-BR")
                                : "Nunca visitou"}
                            </span>
                            <span className="text-amber-500 font-semibold">
                              R$ {totalSpent.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-3 rounded text-xs transition-colors flex items-center gap-1"
                        >
                          <EyeIcon className="w-3 h-3" />
                          Ver
                        </button>
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs transition-colors flex items-center gap-1"
                        >
                          <EditIcon className="w-3 h-3" />
                          Editar
                        </button>
                      </div>
                    </div>

                    {/* Layout Desktop */}
                    <div className="hidden sm:grid sm:grid-cols-12 gap-4">
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {client.name}
                          </div>
                          <div className="text-sm text-slate-400">
                            {appointmentCount} visita
                            {appointmentCount !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="text-white">{client.phone}</div>
                        <div className="text-sm text-slate-400">
                          {client.email || "Não informado"}
                        </div>
                      </div>

                      <div className="col-span-2">
                        {lastVisit ? (
                          <div className="text-white">
                            {lastVisit.toLocaleDateString("pt-BR")}
                          </div>
                        ) : (
                          <div className="text-slate-400">Nunca visitou</div>
                        )}
                      </div>

                      <div className="col-span-2">
                        <div className="text-amber-500 font-semibold">
                          R$ {totalSpent.toFixed(2)}
                        </div>
                      </div>

                      <div className="col-span-2 flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="p-2 text-slate-400 hover:text-amber-500 transition-colors"
                          title="Ver detalhes"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                          title="Editar"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="text-slate-400 mb-4 text-sm sm:text-base">
                  {searchTerm
                    ? "Nenhum cliente encontrado"
                    : "Nenhum cliente cadastrado"}
                </div>
                {!searchTerm && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  >
                    Cadastrar Primeiro Cliente
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          // View em Grade
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredClients.map((client) => {
              const lastVisit = getLastVisit(client.id);
              const totalSpent = getTotalSpent(client.id);
              const appointmentCount = getClientHistory(client.id).length;

              return (
                <div
                  key={client.id}
                  className="bg-slate-800 rounded-lg border border-slate-700 p-4 sm:p-6 hover:border-amber-500 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm sm:text-base truncate">
                        {client.name}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 truncate">
                        {client.phone}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-400">Visitas:</span>
                      <span className="text-white">{appointmentCount}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-400">Total Gasto:</span>
                      <span className="text-amber-500 font-semibold">
                        R$ {totalSpent.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-400">Última Visita:</span>
                      <span className="text-white text-xs">
                        {lastVisit
                          ? lastVisit.toLocaleDateString("pt-BR")
                          : "Nunca"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-2 sm:px-3 rounded text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Ver</span>
                    </button>
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 sm:px-3 rounded text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <EditIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Editar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Adicionar Cliente */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-slate-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    Novo Cliente
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-400 hover:text-white transition-colors p-1"
                  >
                    <svg
                      className="w-6 h-6 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddClient} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) =>
                      setNewClient({ ...newClient, name: e.target.value })
                    }
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500 text-sm sm:text-base"
                    required
                    placeholder="Nome completo do cliente"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) =>
                      setNewClient({ ...newClient, phone: e.target.value })
                    }
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500 text-sm sm:text-base"
                    required
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) =>
                      setNewClient({ ...newClient, email: e.target.value })
                    }
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500 text-sm sm:text-base"
                    placeholder="cliente@email.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={newClient.birthDate}
                    onChange={(e) =>
                      setNewClient({ ...newClient, birthDate: e.target.value })
                    }
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    Preferências
                  </label>
                  <textarea
                    value={newClient.preferences}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        preferences: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500 resize-none text-sm sm:text-base"
                    rows={3}
                    placeholder="Ex: Gosta do lado direito mais curto, alérgico a talco..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded font-semibold transition-colors text-sm sm:text-base"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded font-semibold transition-colors text-sm sm:text-base"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detalhes do Cliente */}
        {selectedClient && (
          <ClientDetailsModal
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
          />
        )}
      </main>
    </div>
  );
}

// Componente Modal de Detalhes do Cliente (já otimizado anteriormente)
function ClientDetailsModal({
  client,
  onClose,
}: {
  client: Client;
  onClose: () => void;
}) {
  const { data, getClientHistory, updateClient } = useLocalStorage();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: client.name,
    phone: client.phone,
    email: client.email || "",
    birthDate: client.birthDate || "",
    preferences: client.preferences || "",
  });

  const clientHistory = getClientHistory(client.id);

  const handleSave = () => {
    updateClient(client.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: client.name,
      phone: client.phone,
      email: client.email || "",
      birthDate: client.birthDate || "",
      preferences: client.preferences || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-slate-700 sticky top-0 bg-slate-800">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              {isEditing ? "Editar Cliente" : "Detalhes do Cliente"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <svg
                className="w-6 h-6 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Informações Básicas */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-lg flex-shrink-0">
              {client.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)}
            </div>
            <div className="flex-1 space-y-2 sm:space-y-3">
              <div>
                <label className="block text-slate-400 text-xs sm:text-sm mb-1">
                  Nome
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white text-sm sm:text-base"
                  />
                ) : (
                  <div className="text-lg sm:text-2xl font-bold text-white">
                    {client.name}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-slate-400 text-xs sm:text-sm mb-1">
                    Telefone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                      className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white text-sm sm:text-base"
                    />
                  ) : (
                    <div className="text-white text-sm sm:text-base">
                      {client.phone}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 text-xs sm:text-sm mb-1">
                    E-mail
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white text-sm sm:text-base"
                    />
                  ) : (
                    <div className="text-white text-sm sm:text-base">
                      {client.email || "Não informado"}
                    </div>
                  )}
                </div>
              </div>

              {client.birthDate && (
                <div>
                  <label className="block text-slate-400 text-xs sm:text-sm mb-1">
                    Data de Nascimento
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.birthDate}
                      onChange={(e) =>
                        setEditData({ ...editData, birthDate: e.target.value })
                      }
                      className="w-full p-2 bg-slate-700 rounded border border-slate-600 text-white text-sm sm:text-base"
                    />
                  ) : (
                    <div className="text-white text-sm sm:text-base">
                      {new Date(client.birthDate).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Preferências */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-slate-400 text-xs sm:text-sm mb-2">
              Preferências
            </label>
            {isEditing ? (
              <textarea
                value={editData.preferences}
                onChange={(e) =>
                  setEditData({ ...editData, preferences: e.target.value })
                }
                className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white resize-none text-sm sm:text-base"
                rows={3}
                placeholder="Ex: Gosta do lado direito mais curto, alérgico a talco..."
              />
            ) : (
              <p className="text-slate-300 bg-slate-700 rounded p-3 text-sm sm:text-base">
                {client.preferences || "Nenhuma preferência registrada."}
              </p>
            )}
          </div>

          {/* Histórico de Agendamentos */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Histórico de Visitas
            </h4>
            {clientHistory.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {clientHistory.map((apt) => {
                  const service = data.services.find(
                    (s) => s.id === apt.serviceId
                  );
                  const barber = data.barbers.find(
                    (b) => b.id === apt.barberId
                  );

                  return (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-3 bg-slate-700 rounded text-sm sm:text-base"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">
                          {service?.name}
                        </div>
                        <div className="text-xs sm:text-sm text-slate-400 truncate">
                          {barber?.name} •{" "}
                          {new Date(apt.date).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-amber-500 font-semibold text-sm sm:text-base">
                          R$ {service?.price.toFixed(2)}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            apt.status === "completed"
                              ? "bg-green-500"
                              : apt.status === "cancelled"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {apt.status === "completed"
                            ? "Concluído"
                            : apt.status === "cancelled"
                            ? "Cancelado"
                            : "Agendado"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-slate-400 text-sm sm:text-base">
                Nenhuma visita registrada
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-700 flex gap-2 sm:gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 sm:py-3 rounded font-semibold transition-colors text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded font-semibold transition-colors text-sm sm:text-base"
              >
                Salvar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 sm:py-3 rounded font-semibold transition-colors text-sm sm:text-base"
              >
                Fechar
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 sm:py-3 rounded font-semibold transition-colors text-sm sm:text-base"
              >
                Editar Cliente
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Ícones
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );
}

function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  );
}
