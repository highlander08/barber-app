'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PortfolioPage() {
  const { data } = useLocalStorage();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-3 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700"
              title="Voltar"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-amber-500 leading-none">
                BarberFlow
              </h1>
              <p className="text-slate-400 text-xs">Portfólio de Cortes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-3 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
          <ScissorsIcon className="w-7 h-7 text-amber-500" />
          Nossos Estilos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.portfolioCuts.map((cut) => (
            <div
              key={cut.id}
              className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden group"
            >
              <div className="relative aspect-square">
                <Image
                  src={cut.imageUrl}
                  alt={`Corte ${cut.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  {cut.isPopular && (
                    <span
                      className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                      title="Popular entre os clientes"
                    >
                      ⭐ Popular
                    </span>
                  )}
                  {cut.isHype && (
                    <span
                      className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                      title="Está em alta!"
                    >
                      🔥 Hype
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-white">{cut.name}</h3>
                <p className="text-slate-400 text-sm mt-1">
                  {cut.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
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

function ScissorsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M6 18L18 6" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
    </svg>
  );
}