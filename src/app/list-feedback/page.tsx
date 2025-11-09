// 'use client';

// import { useLocalStorage } from '@/hooks/useLocalStorage';
// import { useRouter } from 'next/navigation';

// export default function FeedbacksListPage() {
//   const { data } = useLocalStorage();
//   const router = useRouter();

//   const feedbacks = data.feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

//   return (
//     <div className="min-h-screen bg-slate-900 text-white">
//       <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
//         <div className="container mx-auto px-3 py-3 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => router.back()}
//               className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700"
//               title="Voltar"
//             >
//               <ArrowLeftIcon className="w-5 h-5" />
//             </button>
//             <div>
//               <h1 className="text-lg font-bold text-amber-500 leading-none">
//                 BarberFlow
//               </h1>
//               <p className="text-slate-400 text-xs">Feedbacks dos Clientes</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-3 py-6">
//         <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2">
//           <MessageSquareIcon className="w-6 h-6 text-amber-500" />
//           Resumo dos Feedbacks
//         </h2>

//         {feedbacks.length > 0 ? (
//           <div className="space-y-4">
//             {feedbacks.map((feedback) => {
//               const appointment = data.appointments.find(apt => apt.id === feedback.appointmentId);
//               const client = appointment ? data.clients.find(c => c.id === appointment.clientId) : null;

//               return (
//                 <div key={feedback.id} className="bg-slate-800 rounded-lg border border-slate-700 p-4">
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <p className="font-semibold text-white">{client?.name || 'Cliente anônimo'}</p>
//                       <p className="text-xs text-slate-400">{new Date(feedback.createdAt).toLocaleString('pt-BR')}</p>
//                     </div>
//                     <span className={`text-xs px-2 py-1 rounded ${feedback.wouldRecommend ? 'bg-green-500' : 'bg-red-500'}`}>
//                       {feedback.wouldRecommend ? 'Recomenda' : 'Não Recomenda'}
//                     </span>
//                   </div>

//                   {feedback.comment && (
//                     <blockquote className="border-l-4 border-amber-500 pl-3 my-3 text-slate-300 italic">
//                       {feedback.comment}
//                     </blockquote>
//                   )}

//                   <div className="grid grid-cols-2 gap-2 text-xs mt-4">
//                     <div className="flex items-center gap-2">
//                       <span className="text-slate-400">Atendimento:</span>
//                       <span className={`font-bold ${feedback.likedService ? 'text-green-400' : 'text-red-400'}`}>{feedback.likedService ? 'Gostou' : 'Não Gostou'}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-slate-400">Serviço:</span>
//                       <span className={`font-bold ${feedback.likedCut ? 'text-green-400' : 'text-red-400'}`}>{feedback.likedCut ? 'Gostou' : 'Não Gostou'}</span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="text-center py-16 text-slate-400 bg-slate-800 rounded-lg border border-slate-700">
//             <div className="text-4xl mb-4">📝</div>
//             <h3 className="text-lg font-semibold text-white">Nenhum feedback recebido</h3>
//             <p className="text-sm">As avaliações dos clientes aparecerão aqui.</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// // Ícones
// function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
//   return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
// }

// function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
//   return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
// }

'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FeedbacksListPage() {
  const { data } = useLocalStorage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const feedbacks = (data?.feedbacks ?? []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-slate-900 text-white">
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
              <p className="text-slate-400 text-xs">Feedbacks dos Clientes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 py-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2">
          <MessageSquareIcon className="w-6 h-6 text-amber-500" />
          Resumo dos Feedbacks
          <span className="ml-2 text-sm text-slate-400">({feedbacks.length})</span>
        </h2>

        {feedbacks.length > 0 ? (
          <div className="space-y-4">
            {feedbacks.map((feedback) => {
              const appointment = data?.appointments?.find(apt => apt.id === feedback.appointmentId);
              const client = appointment ? data?.clients?.find(c => c.id === appointment.clientId) : null;

              return (
                <div key={feedback.id} className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-white">{client?.name || 'Cliente anônimo'}</p>
                      <p className="text-xs text-slate-400">{formatDate(feedback.createdAt)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${feedback.wouldRecommend ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                      {feedback.wouldRecommend ? 'Recomenda' : 'Não Recomenda'}
                    </span>
                  </div>

                  {feedback.comment && (
                    <blockquote className="border-l-4 border-amber-500 pl-3 my-3 text-slate-300 italic">
                      {feedback.comment}
                    </blockquote>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Atendimento:</span>
                      <span className={`font-bold ${feedback.likedService ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {feedback.likedService ? 'Gostou' : 'Não Gostou'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Serviço:</span>
                      <span className={`font-bold ${feedback.likedCut ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {feedback.likedCut ? 'Gostou' : 'Não Gostou'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 bg-slate-800 rounded-lg border border-slate-700">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-white">Nenhum feedback recebido</h3>
            <p className="text-sm">As avaliações dos clientes aparecerão aqui.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}


