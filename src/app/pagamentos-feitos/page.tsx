'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PagamentosFeitosPage() {
  const { data } = useLocalStorage();
  const router = useRouter();

  const paidAppointments = data.appointments
    .filter(apt => apt.status === 'paid')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
              <p className="text-slate-400 text-xs">Pagamentos Feitos</p>
            </div>
          </div>

          <nav className="flex gap-2">
            <Link
              href="/dashboard"
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
              title="Dashboard"
            >
              <LayoutDashboardIcon className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-3 py-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2">
          <DollarSignIcon className="w-6 h-6 text-green-500" />
          Histórico de Pagamentos
        </h2>

        {paidAppointments.length > 0 ? (
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="divide-y divide-slate-700">
              {paidAppointments.map((apt) => {
                const client = data.clients.find(c => c.id === apt.clientId);
                const service = data.services.find(s => s.id === apt.serviceId);

                return (
                  <div key={apt.id} className="p-4 sm:px-6 sm:py-4 grid grid-cols-3 sm:grid-cols-4 gap-4 items-center">
                    <div className="col-span-2 sm:col-span-2">
                      <p className="font-medium text-white truncate">{client?.name}</p>
                      <p className="text-sm text-slate-400 truncate">{service?.name}</p>
                    </div>
                    <div className="text-right sm:text-left">
                      <p className="text-sm text-slate-400">Data</p>
                      <p className="font-medium text-white">{new Date(apt.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Valor</p>
                      <p className="font-semibold text-green-500">
                        R$ {service?.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 bg-slate-800 rounded-lg border border-slate-700">
            <div className="text-4xl mb-4">💸</div>
            <h3 className="text-lg font-semibold text-white">Nenhum pagamento registrado</h3>
            <p className="text-sm">Os agendamentos pagos aparecerão aqui.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Ícones
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
}

function LayoutDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z" /></svg>;
}

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v22m5-18H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H7" /></svg>;
}