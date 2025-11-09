"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";
import { type Service } from "@/types";
import { ArrowLeft } from "lucide-react";

export default function ServicesPage() {
  const { data, updateStorage } = useLocalStorage();

  const [form, setForm] = useState<Omit<Service, "id">>({
    name: "",
    description: "",
    duration: 30,
    price: 0,
    category: "",
    active: true,
  });

  const handleAddService = () => {
    if (!form.name.trim() || !form.category.trim()) {
      alert("Preencha nome e categoria.");
      return;
    }

    const newService: Service = {
      ...form,
      id: Date.now().toString(),
    };

    updateStorage({
      ...data,
      services: [...data.services, newService],
    });

    setForm({
      name: "",
      description: "",
      duration: 30,
      price: 0,
      category: "",
      active: true,
    });
  };

  const handleDeleteService = (id: string) => {
    if (!confirm("Tem certeza que deseja remover este serviço?")) return;
    updateStorage({
      ...data,
      services: data.services.filter((s) => s.id !== id),
    });
  };

  const toggleActive = (id: string) => {
    updateStorage({
      ...data,
      services: data.services.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      ),
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 w-8 h-8 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">BF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-amber-500 leading-none">
                BarberFlow
              </h1>
              <p className="text-slate-400 text-xs">Serviços</p>
            </div>
          </div>

          <nav className="flex gap-2">
            <Link
              href="/"
              className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/equipe"
              className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg text-white"
            >
              Equipe
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-3 py-6">
        {/* 🔙 Botão de voltar */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>

        {/* Conteúdo principal */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          {/* Formulário de adicionar serviço */}
          <div className="w-full md:w-96 bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-sm text-slate-400 mb-3 uppercase tracking-wide">
              Adicionar Serviço
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome do serviço"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <input
                type="text"
                placeholder="Categoria"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {/* Inputs de preço e duração */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-slate-400 mb-1 block">
                    💰 Preço (R$)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-xs text-slate-400 mb-1 block">
                    ⏱ Duração (min)
                  </label>
                  <input
                    type="number"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: Number(e.target.value) })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <textarea
                placeholder="Descrição (opcional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleAddService}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Lista de serviços */}
          <section className="flex-1 space-y-4">
            {data.services.length === 0 ? (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center text-slate-400">
                <div className="text-4xl mb-2">🧾</div>
                <p>Nenhum serviço cadastrado.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col justify-between hover:bg-slate-700 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {service.name}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 truncate">
                        {service.description}
                      </p>

                      <div className="mt-3 text-sm text-slate-300 space-y-1">
                        <div>
                          💰{" "}
                          <span className="text-amber-500 font-medium">
                            R$ {service.price}
                          </span>
                        </div>
                        <div>⏱ {service.duration} min</div>
                        <div>🏷 {service.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          service.active ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {service.active ? "Ativo" : "Inativo"}
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleActive(service.id)}
                          className="text-sm px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          {service.active ? "Desativar" : "Ativar"}
                        </button>

                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="text-sm px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
