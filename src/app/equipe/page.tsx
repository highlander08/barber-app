"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";
import { useState } from "react";
import { PlusIcon, UsersIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EquipePage() {
  const { data, addBarber } = useLocalStorage();
  const [isAdding, setIsAdding] = useState(false);
  const [newBarber, setNewBarber] = useState({ name: "", specialty: "" });
  const router = useRouter();

  const handleAddBarber = () => {
    if (!newBarber.name.trim()) return;
    addBarber({
      name: newBarber.name,
      specialty: newBarber.specialty || "Corte masculino",
      active: true,
      phone: "",
      email: "",
      commission: 0,
      workingHours: {
        start: "09:00",
        end: "18:00",
        days: [1, 2, 3, 4, 5, 6]
      }
    });
    setNewBarber({ name: "", specialty: "" });
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-3 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 w-8 h-8 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">BF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-amber-500 leading-none">
                BarberFlow
              </h1>
              <p className="text-slate-400 text-xs">Equipe</p>
            </div>
          </div>

          <nav className="flex gap-2">
            <Link
              href="/dashboard"
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
              title="Dashboard"
            >
              📊
            </Link>
            <Link
              href="/agendamento"
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
              title="Agendamentos"
            >
              📅
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-3 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              title="Voltar"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-amber-500" />
              Equipe de Barbeiros
            </h2>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <PlusIcon className="w-4 h-4" /> Novo Barbeiro
          </button>
        </div>

        {/* Lista de Barbeiros */}
        {data.barbers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.barbers.map((barber) => (
              <div
                key={barber.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-lg font-bold">
                    {barber.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{barber.name}</h3>
                    <p className="text-slate-400 text-sm">{barber.specialty}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-slate-400">Atendimentos:</p>
                  <span className="text-amber-500 font-semibold">
                    {(barber as any).completedServices || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <p className="text-slate-400">Status:</p>
                  <span
                    className={`font-semibold ${
                      barber.active ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {barber.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">✂️</div>
            <p className="text-sm">Nenhum barbeiro cadastrado ainda.</p>
          </div>
        )}
      </main>

      {/* Modal de Novo Barbeiro */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-80">
            <h3 className="text-lg font-semibold mb-4 text-amber-500">
              Adicionar Barbeiro
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome do barbeiro"
                value={newBarber.name}
                onChange={(e) =>
                  setNewBarber({ ...newBarber, name: e.target.value })
                }
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="text"
                placeholder="Especialidade (opcional)"
                value={newBarber.specialty}
                onChange={(e) =>
                  setNewBarber({ ...newBarber, specialty: e.target.value })
                }
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddBarber}
                  className="bg-amber-500 hover:bg-amber-600 px-3 py-2 rounded-lg text-sm font-semibold text-white"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}