'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Link from 'next/link';

export default function Agendamento() {
  const { data, addAppointment, addClient } = useLocalStorage();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceId: '',
    barberId: '',
    date: '',
    time: '',
    notes: ''
  });

  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Encontrar ou criar cliente
    let client = data.clients.find(c => c.phone === formData.clientPhone);
    if (!client) {
      client = addClient({
        name: formData.clientName,
        phone: formData.clientPhone,
        email: formData.clientEmail
      });
    }

    // Criar agendamento
    const appointmentDate = new Date(`${formData.date}T${formData.time}`);
    addAppointment({
      clientId: client.id,
      barberId: formData.barberId,
      serviceId: formData.serviceId,
      date: appointmentDate.toISOString(),
      status: 'scheduled',
      notes: formData.notes
    });

    alert('Agendamento realizado com sucesso!');
    setFormData({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      serviceId: '',
      barberId: '',
      date: '',
      time: '',
      notes: ''
    });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header com Botão Voltar */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-500">Novo Agendamento</h1>
        </div>
        
        {/* Progress Steps */}
        <div className="flex mb-6 sm:mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                step >= num ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`flex-1 h-1 mx-1 sm:mx-2 ${
                  step > num ? 'bg-amber-500' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 p-4 sm:p-6 rounded-lg">
          {step === 1 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Dados do Cliente</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Nome completo *</label>
                  <input
                    type="text"
                    placeholder="Digite o nome do cliente"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Telefone *</label>
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">E-mail (opcional)</label>
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Link 
                  href="/dashboard"
                  className="flex-1 sm:flex-none bg-slate-700 hover:bg-slate-600 text-white px-4 sm:px-6 py-3 rounded font-semibold transition-colors text-center"
                >
                  Cancelar
                </Link>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-6 py-3 rounded font-semibold transition-colors"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Serviço e Profissional</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Serviço *</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="">Selecione um serviço</option>
                    {data.services.filter(s => s.active).map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - R$ {service.price}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Barbeiro *</label>
                  <select
                    value={formData.barberId}
                    onChange={(e) => setFormData({...formData, barberId: e.target.value})}
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="">Selecione um barbeiro</option>
                    {data.barbers.filter(b => b.active).map(barber => (
                      <option key={barber.id} value={barber.id}>
                        {barber.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 sm:px-6 py-3 rounded font-semibold transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 sm:px-6 py-3 rounded font-semibold transition-colors"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">Data e Horário</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Data *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Horário *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData({...formData, time})}
                        className={`p-3 rounded border text-sm sm:text-base transition-colors ${
                          formData.time === time 
                            ? 'bg-amber-500 border-amber-500 text-white' 
                            : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Observações (opcional)</label>
                  <textarea
                    placeholder="Alguma observação importante..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-3 bg-slate-700 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 sm:px-6 py-3 rounded font-semibold transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 rounded font-semibold transition-colors"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Indicador de Progresso Mobile */}
        <div className="mt-4 text-center sm:hidden">
          <div className="text-slate-400 text-sm">
            Passo {step} de 3
          </div>
        </div>
      </div>
    </div>
  );
}

// Ícone de Voltar
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}