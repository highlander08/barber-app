"use client";

import { useState, useEffect } from "react";
import { StorageData, type Appointment, type Client, type Barber, type Feedback } from "@/types";

const STORAGE_KEY = "barberflow-data";

const initialData: StorageData = {
  barbershop: {
    name: "Barbearia Modelo",
    address: "Rua Exemplo, 123",
    phone: "(11) 99999-9999",
    email: "contato@barbearia.com",
    workingHours: {
      open: "09:00",
      close: "19:00",
    },
  },
  barbers: [
    {
      id: "1",
      name: "João Silva",
      email: "joao@barbearia.com",
      phone: "(11) 98888-8888",
      specialty: "Cortes Clássicos",
      commission: 60,
      workingHours: {
        start: "09:00",
        end: "18:00",
        days: [1, 2, 3, 4, 5],
      },
      active: true,
    },
  ],
  clients: [],
  services: [
    {
      id: "1",
      name: "Corte Social",
      description: "Corte tradicional masculino",
      duration: 30,
      price: 35,
      category: "corte",
      active: true,
    },
    {
      id: "2",
      name: "Barba",
      description: "Aparar e modelar barba",
      duration: 20,
      price: 25,
      category: "barba",
      active: true,
    },
  ],
  appointments: [],
  feedbacks: [],
  portfolioCuts: [
    {
      id: 'p1',
      name: 'Low Fade',
      description: 'Um degradê suave que começa baixo, próximo à orelha, ideal para um visual limpo e discreto.',
      imageUrl: '/low-fade.jpg',
      isPopular: true,
      isHype: false,
    },
    {
      id: 'p2',
      name: 'Degradê Navalhado',
      description: 'O corte começa na pele (zero) com a navalha, criando um contraste intenso e um acabamento impecável.',
      imageUrl: '/degrade.jpg',
      isPopular: true,
      isHype: true,
    },
    {
      id: 'p3',
      name: 'Crop Moderno',
      description: 'Corte texturizado no topo com uma franja reta e curta. Perfeito para um estilo arrojado e contemporâneo.',
      imageUrl: '/MODERNO.png',
      isPopular: false,
      isHype: true,
    },
    {
      id: 'p4',
      name: 'Buzz Cut',
      description: 'Um corte clássico e prático, todo feito na máquina, com um comprimento uniforme e muito curto.',
      imageUrl: '/buzz.jpg',
      isPopular: true,
      isHype: false,
    },
  ],
};

export function useLocalStorage() {
  const [data, setData] = useState<StorageData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const storedData = JSON.parse(stored);
      // Mescla os dados do localStorage com os dados iniciais
      // para garantir que novas chaves (como 'feedbacks') existam.
      const mergedData = { ...initialData, ...storedData };
      setData(mergedData);
    }
    setIsLoaded(true);
  }, []);

  const updateStorage = (newData: StorageData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  // 🧾 Adicionar novo cliente
  const addClient = (client: Omit<Client, "id" | "createdAt">) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const newData = {
      ...data,
      clients: [...data.clients, newClient],
    };
    updateStorage(newData);
    return newClient;
  };

  // 💈 Adicionar novo barbeiro
  const addBarber = (barber: Omit<Barber, "id">) => {
    const newBarber: Barber = {
      ...barber,
      id: Date.now().toString(),
    };
    const newData = {
      ...data,
      barbers: [...data.barbers, newBarber],
    };
    updateStorage(newData);
    return newBarber;
  };

  // 📅 Adicionar novo agendamento
  const addAppointment = (
    appointment: Omit<Appointment, "id" | "createdAt">
  ) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const newData = {
      ...data,
      appointments: [...data.appointments, newAppointment],
    };
    updateStorage(newData);
    return newAppointment;
  };

  const updateAppointmentStatus = (
    id: string,
    status: Appointment["status"]
  ) => {
    const newData = {
      ...data,
      appointments: data.appointments.map((apt) =>
        apt.id === id ? { ...apt, status } : apt
      ),
    };
    updateStorage(newData);
  };

  // 💬 Adicionar novo feedback
  const addFeedback = (feedback: Omit<Feedback, "id" | "createdAt">) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const newData = {
      ...data,
      feedbacks: [...data.feedbacks, newFeedback],
    };
    updateStorage(newData);
    alert('Obrigado pelo seu feedback!');
    return newFeedback;
  };

  // 💸 Processar pagamento PIX
  const processPixPayment = (appointmentId: string) => {
    const appointment = data.appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    const newData = {
      ...data,
      appointments: data.appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'paid' as const } : apt
      ),
    };
    updateStorage(newData);
    alert('Pagamento confirmado e agendamento atualizado para "Pago"!');
  };

  const getBarberAppointments = (barberId: string, date?: Date) => {
    let appointments = data.appointments.filter(
      (apt) => apt.barberId === barberId
    );

    if (date) {
      const targetDate = date.toISOString().split("T")[0];
      appointments = appointments.filter((apt) =>
        apt.date.startsWith(targetDate)
      );
    }

    return appointments.sort((a, b) => a.date.localeCompare(b.date));
  };

  const getClientHistory = (clientId: string) => {
    return data.appointments
      .filter((apt) => apt.clientId === clientId)
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  const getDailyAppointments = (date: Date) => {
    const targetDate = date.toISOString().split("T")[0];
    return data.appointments
      .filter((apt) => apt.date.startsWith(targetDate))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    const newData = {
      ...data,
      clients: data.clients.map((client) =>
        client.id === clientId ? { ...client, ...updates } : client
      ),
    };
    updateStorage(newData);
  };

  const deleteClient = (clientId: string) => {
    const newData = {
      ...data,
      clients: data.clients.filter((client) => client.id !== clientId),
      appointments: data.appointments.filter(
        (apt) => apt.clientId !== clientId
      ),
    };
    updateStorage(newData);
  };

  return {
    data,
    isLoaded,
    updateStorage,
    addClient,
    addBarber, // ✅ agora disponível para uso
    addFeedback,
    addAppointment,
    updateClient,
    deleteClient,
    updateAppointmentStatus,
    getBarberAppointments,
    processPixPayment,
    getClientHistory,
    getDailyAppointments,
  };
}
