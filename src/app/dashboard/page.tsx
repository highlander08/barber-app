'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Appointment } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import {QRCodeSVG} from 'qrcode.react';

export default function Dashboard() {
  const { data, getDailyAppointments, processPixPayment } = useLocalStorage();
  const [activeTab, setActiveTab] = useState<'today' | 'future'>('today');
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const todayAppointments = getDailyAppointments(new Date()).filter(
    apt => apt.status !== 'paid' && apt.status !== 'completed' && apt.status !== 'cancelled'
  );
  const completedAppointments = data.appointments.filter(a => a.status === 'completed' || a.status === 'paid').length;
  const totalRevenue = data.appointments
    .filter(a => a.status === 'completed' || a.status === 'paid')
    .reduce((total, apt) => {
      const service = data.services.find(s => s.id === apt.serviceId);
      return total + (service?.price || 0);
    }, 0);

  const handleOpenPixModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setPixModalOpen(true);
  };

  const handleClosePixModal = () => {
    setPixModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleConfirmPixPayment = () => {
    if (selectedAppointment) {
      processPixPayment(selectedAppointment.id);
      handleClosePixModal();
    }
  };

  /**
   * Gera o payload para o QR Code PIX no padrão EMV-MPM.
   * @param apt O agendamento para o qual o pagamento está sendo gerado.
   * @returns A string do payload PIX.
   */
  const generatePixPayload = (apt: Appointment | null): string => {
    if (!apt) return '';

    const service = data.services.find(s => s.id === apt.serviceId);
    const price = service?.price || 0;

    const pixKey = "60785211365"; // SUA CHAVE PIX AQUI
    const merchantName = "Highlander"; // NOME DO RECEBEDOR
    const merchantCity = "FORTALEZA"; // CIDADE DO RECEBEDOR (sem acentos, maiúsculas)
    const txid = apt.id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 25); // ID da transação

    const formatValue = (id: string, value: string): string => {
      const length = value.length.toString().padStart(2, '0');
      return `${id}${length}${value}`;
    };

    const payload = [
      formatValue('00', '01'), // Payload Format Indicator
      formatValue('26', [
        formatValue('00', 'br.gov.bcb.pix'), // GUI
        formatValue('01', pixKey), // Chave PIX
        // formatValue('02', `Pagamento ${service?.name}`), // Descrição (opcional)
      ].join('')),
      formatValue('52', '0000'), // Merchant Category Code (0000 para não especificado)
      formatValue('53', '986'), // Transaction Currency (986 para BRL)
      formatValue('54', price.toFixed(2)), // Transaction Amount
      formatValue('58', 'BR'), // Country Code
      formatValue('59', merchantName.substring(0, 25)), // Merchant Name
      formatValue('60', merchantCity.substring(0, 15)), // Merchant City
      formatValue('62', formatValue('05', txid)), // Additional Data Field (txid)
    ].join('');

    const payloadWithCrc = `${payload}6304`;

    // Calcula o CRC16
    const crc16 = (data: string): string => {
      let crc = 0xFFFF;
      for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
          crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
        }
      }
      return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    };

    const crc = crc16(payloadWithCrc);

    return `${payloadWithCrc}${crc}`;
  };

  // Agendamentos futuros (excluindo hoje)
  const futureAppointments = data.appointments
    .filter(apt => {
      const appointmentDate = new Date(apt.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate > today && apt.status !== 'completed' && apt.status !== 'cancelled' && apt.status !== 'paid';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Próximos 7 dias - estatísticas
  const next7DaysAppointments = data.appointments
    .filter(apt => {
      const appointmentDate = new Date(apt.date);
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      today.setHours(0, 0, 0, 0);
      return appointmentDate >= today && appointmentDate <= nextWeek;
    })
    .length;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Mobile Otimizado */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-3 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-amber-500 w-8 h-8 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">BF</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-amber-500 leading-none">BarberFlow</h1>
                <p className="text-slate-400 text-xs">Dashboard</p>
              </div>
            </div>
            
            {/* Menu Mobile */}
            <nav className="flex gap-2">
              <Link 
                href="/agendamento" 
                className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                title="Agendamento"
              >
                <CalendarIcon className="w-4 h-4" />
              </Link>
              <Link 
                href="/clientes" 
                className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                title="Clientes"
              >
                <UsersIcon className="w-4 h-4" />
              </Link>
            </nav>
          </div>

          {/* Menu Expandido para Tablet/Desktop */}
          <nav className="hidden sm:flex gap-3 mt-3 pt-3 border-t border-slate-700">
            <Link href="/agendamento" className="text-slate-300 hover:text-white transition-colors text-sm">
              Agendamento
            </Link>
            <Link href="/clientes" className="text-slate-300 hover:text-white transition-colors text-sm">
              Clientes
            </Link>
            <Link href="/equipe" className="text-slate-300 hover:text-white transition-colors text-sm">
              Equipe
            </Link>
            <Link href="/services" className="text-slate-300 hover:text-white transition-colors text-sm">
              Serviços
            </Link>
            <Link href="/pagamentos-feitos" className="text-slate-300 hover:text-white transition-colors text-sm">
              Pagamentos
            </Link>
            <Link href="/list-feedback" className="text-slate-300 hover:text-white transition-colors text-sm">
              Feedbacks
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-3 py-4">
        {/* Stats Grid - Mobile First */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-xs font-medium mb-1">Clientes</h3>
            <p className="text-2xl font-bold text-white">{data.clients.length}</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-xs font-medium mb-1">Hoje</h3>
            <p className="text-2xl font-bold text-white">{todayAppointments.length}</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-xs font-medium mb-1">7 Dias</h3>
            <p className="text-2xl font-bold text-white">{next7DaysAppointments}</p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-xs font-medium mb-1">Faturamento</h3>
            <p className="text-xl font-bold text-amber-500">
              R$ {totalRevenue.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Stats Grid - Tablet/Desktop */}
        <div className="hidden md:grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Clientes Cadastrados</h3>
            <p className="text-3xl font-bold text-white">{data.clients.length}</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Agendamentos Hoje</h3>
            <p className="text-3xl font-bold text-white">{todayAppointments.length}</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Próximos 7 Dias</h3>
            <p className="text-3xl font-bold text-white">{next7DaysAppointments}</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Faturamento Total</h3>
            <p className="text-3xl font-bold text-amber-500">
              R$ {totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
          {/* Conteúdo Principal - Agendamentos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Mobile para Agendamentos */}
            <div className="sm:hidden">
              <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'today' 
                      ? 'bg-amber-500 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Hoje ({todayAppointments.length})
                </button>
                <button
                  onClick={() => setActiveTab('future')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'future' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Futuros ({futureAppointments.length})
                </button>
              </div>
            </div>

            {/* Agendamentos de Hoje - Mobile */}
            {activeTab === 'today' && (
              <div className="sm:hidden bg-slate-800 rounded-lg border border-slate-700 p-4">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-amber-500" />
                  Agendamentos de Hoje
                </h2>
                <div className="space-y-2">
                  {todayAppointments.map(apt => {
                    const client = data.clients.find(c => c.id === apt.clientId);
                    const service = data.services.find(s => s.id === apt.serviceId);
                    const barber = data.barbers.find(b => b.id === apt.barberId);
                    
                    return (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                            {client?.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-white text-sm truncate">{client?.name}</p>
                            <p className="text-xs text-slate-400 truncate">
                              {service?.name} • {barber?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="text-white font-medium text-sm">
                            {new Date(apt.date).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            apt.status === 'scheduled' ? 'bg-blue-500' :
                            apt.status === 'confirmed' ? 'bg-green-500' :
                            apt.status === 'paid' ? 'bg-emerald-500' :
                            apt.status === 'completed' ? 'bg-gray-500' :
                            'bg-red-500'
                          }`}>
                            {apt.status === 'scheduled' ? 'Agendado' :
                             apt.status === 'confirmed' ? 'Confirmado' :
                             apt.status === 'paid' ? 'Pago' :
                             apt.status === 'completed' ? 'Concluído' : 'Cancelado'}
                          </span>
                        </div>
                        {apt.status !== 'paid' && apt.status !== 'completed' && apt.status !== 'cancelled' && <button onClick={() => handleOpenPixModal(apt)} className="ml-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-xs">PIX</button>}
                      </div>
                    );
                  })}
                  {todayAppointments.length === 0 && (
                    <div className="text-center py-6 text-slate-400">
                      <div className="text-3xl mb-2">📅</div>
                      <p className="text-sm">Nenhum agendamento para hoje</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Próximos Agendamentos - Mobile */}
            {activeTab === 'future' && (
              <div className="sm:hidden bg-slate-800 rounded-lg border border-slate-700 p-4">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CalendarFutureIcon className="w-5 h-5 text-blue-500" />
                  Próximos Agendamentos
                </h2>
                <div className="space-y-2">
                  {futureAppointments.map(apt => {
                    const client = data.clients.find(c => c.id === apt.clientId);
                    const service = data.services.find(s => s.id === apt.serviceId);
                    const barber = data.barbers.find(b => b.id === apt.barberId);
                    const appointmentDate = new Date(apt.date);
                    const today = new Date();
                    const diffTime = appointmentDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                            {client?.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-white text-sm truncate">{client?.name}</p>
                            <p className="text-xs text-slate-400 truncate">
                              {service?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="text-white font-medium text-sm">
                            {appointmentDate.toLocaleDateString('pt-BR').slice(0, 5)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {appointmentDate.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          <span className="text-xs text-slate-400">
                            {diffDays === 1 ? 'Amanhã' : `${diffDays}d`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {futureAppointments.length === 0 && (
                    <div className="text-center py-6 text-slate-400">
                      <div className="text-3xl mb-2">📋</div>
                      <p className="text-sm">Nenhum agendamento futuro</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Agendamentos - Tablet/Desktop */}
            <div className="hidden sm:block space-y-6">
              {/* Agendamentos de Hoje */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-amber-500" />
                    Agendamentos de Hoje
                  </h2>
                  <span className="bg-amber-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    {todayAppointments.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {todayAppointments.map(apt => {
                    const client = data.clients.find(c => c.id === apt.clientId);
                    const service = data.services.find(s => s.id === apt.serviceId);
                    const barber = data.barbers.find(b => b.id === apt.barberId);
                    
                    return (
                      <div key={apt.id} className="flex items-center justify-between p-3 sm:p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                            {client?.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm sm:text-base">{client?.name}</p>
                            <p className="text-xs sm:text-sm text-slate-400">
                              {service?.name} • {barber?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium text-sm sm:text-base">
                            {new Date(apt.date).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            apt.status === 'scheduled' ? 'bg-blue-500' :
                            apt.status === 'confirmed' ? 'bg-green-500' :
                            apt.status === 'paid' ? 'bg-emerald-500' :
                            apt.status === 'completed' ? 'bg-gray-500' :
                            'bg-red-500'
                          }`}>
                            {apt.status === 'scheduled' ? 'Agendado' :
                             apt.status === 'confirmed' ? 'Confirmado' :
                             apt.status === 'paid' ? 'Pago' :
                             apt.status === 'completed' ? 'Concluído' : 'Cancelado'}
                          </span>
                        </div>
                        {apt.status !== 'paid' && apt.status !== 'completed' && apt.status !== 'cancelled' && <button onClick={() => handleOpenPixModal(apt)} className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm">Pagar com PIX</button>}
                      </div>
                    );
                  })}
                  {todayAppointments.length === 0 && (
                    <div className="text-center py-6 sm:py-8 text-slate-400">
                      <div className="text-3xl sm:text-4xl mb-2">📅</div>
                      <p className="text-sm sm:text-base">Nenhum agendamento para hoje</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Próximos Agendamentos Futuros */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                    <CalendarFutureIcon className="w-5 h-5 text-blue-500" />
                    Próximos Agendamentos
                  </h2>
                  <span className="bg-blue-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    {futureAppointments.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {futureAppointments.map(apt => {
                    const client = data.clients.find(c => c.id === apt.clientId);
                    const service = data.services.find(s => s.id === apt.serviceId);
                    const barber = data.barbers.find(b => b.id === apt.barberId);
                    const appointmentDate = new Date(apt.date);
                    const today = new Date();
                    const diffTime = appointmentDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={apt.id} className="flex items-center justify-between p-3 sm:p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                            {client?.name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm sm:text-base">{client?.name}</p>
                            <p className="text-xs sm:text-sm text-slate-400">
                              {service?.name} • {barber?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium text-sm sm:text-base">
                            {appointmentDate.toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-400">
                            {appointmentDate.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          <span className="text-xs text-slate-400">
                            {diffDays === 1 ? 'Amanhã' : `Em ${diffDays} dias`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {futureAppointments.length === 0 && (
                    <div className="text-center py-6 sm:py-8 text-slate-400">
                      <div className="text-3xl sm:text-4xl mb-2">📋</div>
                      <p className="text-sm sm:text-base">Nenhum agendamento futuro</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Ações Rápidas e Estatísticas */}
          <div className="space-y-4 sm:space-y-6">
            {/* Ações Rápidas */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Ações Rápidas</h2>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
                <Link 
                  href="/agendamento" 
                  className="bg-amber-500 hover:bg-amber-600 text-white p-3 sm:p-4 rounded-lg transition-colors flex items-center gap-2 sm:gap-3"
                >
                  <div className="text-xl sm:text-2xl">📅</div>
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">Novo Agendamento</div>
                    <div className="text-amber-100 text-xs sm:text-sm hidden sm:block">Agendar cliente</div>
                  </div>
                </Link>
                
                <Link 
                  href="/clientes" 
                  className="bg-slate-700 hover:bg-slate-600 text-white p-3 sm:p-4 rounded-lg transition-colors flex items-center gap-2 sm:gap-3"
                >
                  <div className="text-xl sm:text-2xl">👤</div>
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">Clientes</div>
                    <div className="text-slate-300 text-xs sm:text-sm hidden sm:block">Gerenciar clientes</div>
                  </div>
                </Link>
                
                <Link 
                  href="/equipe" 
                  className="bg-slate-700 hover:bg-slate-600 text-white p-3 sm:p-4 rounded-lg transition-colors flex items-center gap-2 sm:gap-3"
                >
                  <div className="text-xl sm:text-2xl">✂️</div>
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">Equipe</div>
                    <div className="text-slate-300 text-xs sm:text-sm hidden sm:block">Barbeiros</div>
                  </div>
                </Link>
                
                <Link 
                  href="/services" 
                  className="bg-slate-700 hover:bg-slate-600 text-white p-3 sm:p-4 rounded-lg transition-colors flex items-center gap-2 sm:gap-3"
                >
                  <div className="text-xl sm:text-2xl">💈</div>
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">Serviços</div>
                    <div className="text-slate-300 text-xs sm:text-sm hidden sm:block">Preços</div>
                  </div>
                </Link>

                <Link 
                  href="/pagamentos-feitos" 
                  className="bg-slate-700 hover:bg-slate-600 text-white p-3 sm:p-4 rounded-lg transition-colors flex items-center gap-2 sm:gap-3"
                >
                  <div className="text-xl sm:text-2xl">💰</div>
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">Pagamentos</div>
                    <div className="text-slate-300 text-xs sm:text-sm hidden sm:block">Histórico</div>
                  </div>
                </Link>

                <Link 
                  href="/list-feedback" 
                  className="bg-slate-700 hover:bg-slate-600 text-white p-3 sm:p-4 rounded-lg transition-colors flex items-center gap-2 sm:gap-3"
                >
                  <div className="text-xl sm:text-2xl">💬</div>
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">Feedbacks</div>
                    <div className="text-slate-300 text-xs sm:text-sm hidden sm:block">Ver avaliações</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Estatísticas</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Serviços Realizados:</span>
                  <span className="text-white font-semibold">{completedAppointments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Barbeiros Ativos:</span>
                  <span className="text-white font-semibold">
                    {data.barbers.filter(b => b.active).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Serviços Oferecidos:</span>
                  <span className="text-white font-semibold">
                    {data.services.filter(s => s.active).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Pagamento PIX */}
      {pixModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-sm w-full p-6 text-center border border-slate-700">
            <h2 className="text-xl font-bold text-amber-500 mb-2">Pagamento via PIX</h2>
            <p className="text-slate-400 mb-4">
              Escaneie o QR Code abaixo para pagar o serviço de <span className="font-semibold text-white">{data.services.find(s => s.id === selectedAppointment.serviceId)?.name}</span> no valor de <span className="font-semibold text-white">R$ {data.services.find(s => s.id === selectedAppointment.serviceId)?.price.toFixed(2)}</span>.
            </p>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <QRCodeSVG value={generatePixPayload(selectedAppointment)} size={200} />
            </div>
            <p className="text-xs text-slate-500 mb-6">Após o pagamento, clique em "Confirmar Pagamento" para atualizar o status.</p>
            <div className="flex gap-3">
              <button
                onClick={handleClosePixModal}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPixPayment}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ícones otimizados para mobile
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function CalendarFutureIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l2 2 4-4" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );
}