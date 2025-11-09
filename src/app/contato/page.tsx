

'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRouter } from 'next/navigation';

const CONTACT_STORAGE_KEY = 'barberflow-contact-info';

export default function ContatoPage() {
  const { data } = useLocalStorage();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Carrega nome e telefone salvos no localStorage
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem(CONTACT_STORAGE_KEY);
      if (savedInfo) {
        const { name, phone } = JSON.parse(savedInfo);
        if (name) setName(name);
        if (phone) setPhone(phone);
      }
    } catch (error) {
      console.error("Failed to parse contact info from localStorage", error);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !message) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Salva nome e telefone para a próxima visita
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify({ name, phone }));

    const barbershopPhone = data.barbershop.phone.replace(/\D/g, '');
    const formattedMessage = `Olá! Meu nome é ${name}.\nTelefone: ${phone}.\nMensagem: ${message}.`;
    const whatsappUrl = `https://wa.me/${barbershopPhone}?text=${encodeURIComponent(formattedMessage)}`;

    window.open(whatsappUrl, '_blank');
  };

  // URL de embed do Google Maps (gerada pela opção "Partilhar" > "Incorporar um mapa")
  // Substitua o link abaixo pelo que você gerou para o seu endereço.
  // Este método NÃO precisa de chave de API.
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.188308829532!2d-43.177428385034!3d-22.90641318501214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f58a6a00001%3A0x7d84a6a00001!2sRua%20Exemplo%2C%20123%20-%20Centro%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2020000-000!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr`;


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
              <p className="text-slate-400 text-xs">Contato e Localização</p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-3 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna do Formulário */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2 text-white">
              <MessageCircleIcon className="w-6 h-6 text-amber-500" />
              Envie uma Mensagem
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Telefone</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-amber-500"
                  placeholder="(00) 90000-0000"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Mensagem</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:border-amber-500 resize-y"
                  rows={5}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <SendIcon className="w-5 h-5" />
                Enviar via WhatsApp
              </button>
            </form>
          </div>

          {/* Coluna do Mapa */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2 text-white">
              <MapPinIcon className="w-6 h-6 text-amber-500" />
              Nossa Localização
            </h2>
            <p className="text-slate-400 mb-4">{data.barbershop.address}</p>
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-700">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>; }
function MessageCircleIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>; }
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>; }
function SendIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>; }

