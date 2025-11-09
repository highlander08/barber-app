'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function FeedbackPage() {
  const { addFeedback } = useLocalStorage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');

  const [likedService, setLikedService] = useState<boolean | null>(null);
  const [likedCut, setLikedCut] = useState<boolean | null>(null);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (likedService === null || likedCut === null || wouldRecommend === null) {
      alert('Por favor, responda a todas as perguntas de Sim/Não.');
      return;
    }
    if (!appointmentId) {
      alert('ID do agendamento não encontrado. Não é possível enviar o feedback.');
      return;
    }

    addFeedback({
      appointmentId,
      likedService,
      likedCut,
      wouldRecommend,
      comment,
    });
    
    setSubmitted(true);
    setTimeout(() => router.push('/dashboard'), 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center bg-slate-800 p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-amber-500 mb-4">Feedback Enviado!</h1>
          <p className="text-slate-300">Agradecemos por sua avaliação. Ela é muito importante para nós!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
            title="Voltar"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-500">Deixe seu Feedback</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 p-4 sm:p-6 rounded-lg space-y-6">
          {/* Pergunta 1 */}
          <div>
            <p className="font-semibold text-white mb-2">Você gostou do atendimento?</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setLikedService(true)} className={`flex-1 py-3 rounded font-semibold transition-colors ${likedService === true ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Sim</button>
              <button type="button" onClick={() => setLikedService(false)} className={`flex-1 py-3 rounded font-semibold transition-colors ${likedService === false ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Não</button>
            </div>
          </div>

          {/* Pergunta 2 */}
          <div>
            <p className="font-semibold text-white mb-2">Você gostou do corte/serviço?</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setLikedCut(true)} className={`flex-1 py-3 rounded font-semibold transition-colors ${likedCut === true ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Sim</button>
              <button type="button" onClick={() => setLikedCut(false)} className={`flex-1 py-3 rounded font-semibold transition-colors ${likedCut === false ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Não</button>
            </div>
          </div>

          {/* Pergunta 3 */}
          <div>
            <p className="font-semibold text-white mb-2">Recomendaria a barbearia para outras pessoas?</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setWouldRecommend(true)} className={`flex-1 py-3 rounded font-semibold transition-colors ${wouldRecommend === true ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Sim</button>
              <button type="button" onClick={() => setWouldRecommend(false)} className={`flex-1 py-3 rounded font-semibold transition-colors ${wouldRecommend === false ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Não</button>
            </div>
          </div>

          {/* Comentário */}
          <div>
            <label className="block font-semibold text-white mb-2">Deseja deixar algum comentário? (Opcional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500 resize-y"
              rows={4}
              placeholder="Sua opinião nos ajuda a melhorar..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded font-semibold transition-colors"
            >
              Enviar Feedback
            </button>
          </div>
        </form>
      </div>
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