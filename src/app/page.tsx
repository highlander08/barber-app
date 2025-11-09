// 'use client';

// import Link from 'next/link';
// import { useLocalStorage } from '@/hooks/useLocalStorage';

// export default function Home() {
//   const { data, isLoaded } = useLocalStorage();

//   if (!isLoaded) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-white">Carregando...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
//       {/* Header */}
//       <header className="bg-slate-800 border-b border-slate-700">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-amber-500">BarberFlow</h1>
//               <p className="text-slate-400">{data.barbershop.name}</p>
//             </div>
//             <nav>
//               <Link 
//                 href="/dashboard" 
//                 className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
//               >
//                 Acessar Sistema
//               </Link>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <main className="container mx-auto px-4 py-16">
//         <div className="text-center mb-16">
//           <h2 className="text-5xl font-bold mb-4">
//             Gestão Completa para sua{' '}
//             <span className="text-amber-500">Barbearia</span>
//           </h2>
//           <p className="text-xl text-slate-300 max-w-2xl mx-auto">
//             Agendamentos online, controle de clientes, gestão de equipe e 
//             relatórios financeiros em um só lugar.
//           </p>
//         </div>

//         {/* Features Grid */}
//         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
//             <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
//               <CalendarIcon />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Agendamento Online</h3>
//             <p className="text-slate-400">
//               Seus clientes agendam horários 24/7 pelo celular ou computador
//             </p>
//           </div>

//           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
//             <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
//               <UsersIcon />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Controle de Clientes</h3>
//             <p className="text-slate-400">
//               Ficha completa com histórico, preferências e fotos
//             </p>
//           </div>

//           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
//             <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
//               <BarChartIcon />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Gestão Financeira</h3>
//             <p className="text-slate-400">
//               Relatórios de vendas, comissões e desempenho da equipe
//             </p>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="mt-16 bg-slate-800 rounded-xl p-8 max-w-4xl mx-auto">
//           <div className="grid grid-cols-3 gap-8 text-center">
//             <div>
//               <div className="text-3xl font-bold text-amber-500">
//                 {data.barbers.length}
//               </div>
//               <div className="text-slate-400">Barbeiros</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-amber-500">
//                 {data.clients.length}
//               </div>
//               <div className="text-slate-400">Clientes</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-amber-500">
//                 {data.appointments.filter(a => a.status === 'completed').length}
//               </div>
//               <div className="text-slate-400">Serviços Realizados</div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// // Ícones simples (substitua por lucide-react depois)
// function CalendarIcon() {
//   return (
//     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//     </svg>
//   );
// }

// function UsersIcon() {
//   return (
//     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//     </svg>
//   );
// }

// function BarChartIcon() {
//   return (
//     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//     </svg>
//   );
// }

'use client';

import Link from 'next/link';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Home() {
  const { data, isLoaded } = useLocalStorage();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  // Garantir que os arrays existam mesmo se estiverem vazios
  const barbers = data.barbers || [];
  const clients = data.clients || [];
  const appointments = data.appointments || [];
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-amber-500">BarberFlow</h1>
              <p className="text-slate-400">{data.barbershop.name}</p>
            </div>
            <nav>
              <Link 
                href="/dashboard" 
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Acessar Sistema
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-white">
            Gestão Completa para sua{' '}
            <span className="text-amber-500">Barbearia</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Agendamentos online, controle de clientes, gestão de equipe e 
            relatórios financeiros em um só lugar.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
              <CalendarIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Agendamento Online</h3>
            <p className="text-slate-400">
              Seus clientes agendam horários 24/7 pelo celular ou computador
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
              <UsersIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Controle de Clientes</h3>
            <p className="text-slate-400">
              Ficha completa com histórico, preferências e fotos
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-4">
              <BarChartIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Gestão Financeira</h3>
            <p className="text-slate-400">
              Relatórios de vendas, comissões e desempenho da equipe
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 bg-slate-800 rounded-xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-500">
                {barbers.length}
              </div>
              <div className="text-slate-400">Barbeiros</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-500">
                {clients.length}
              </div>
              <div className="text-slate-400">Clientes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-500">
                {completedAppointments.length}
              </div>
              <div className="text-slate-400">Serviços Realizados</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link 
            href="/dashboard" 
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
          >
            Começar Agora - É Gratuito!
          </Link>
          <p className="text-slate-400 mt-4">
            Não precisa de cartão de crédito. Configure em minutos.
          </p>
        </div>
      </main>
    </div>
  );
}

// Ícones simples
function CalendarIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}