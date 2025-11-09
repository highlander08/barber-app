export interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  commission: number; // porcentagem
  workingHours: {
    start: string;
    end: string;
    days: number[]; // 0-6 (domingo-sábado)
  };
  active: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate?: string;
  preferences?: string;
  photo?: string; // base64
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  price: number;
  category: string;
  active: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  date: string; // ISO string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'paid';
  notes?: string;
  beforePhoto?: string;
  afterPhoto?: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  appointmentId: string; // Para vincular ao agendamento
  likedService: boolean;
  likedCut: boolean;
  wouldRecommend: boolean;
  comment?: string;
  createdAt: string;
}

export interface BarbershopData {
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: {
    open: string;
    close: string;
  };
}

export interface StorageData {
  barbershop: BarbershopData;
  barbers: Barber[];
  clients: Client[];
  services: Service[];
  appointments: Appointment[];
  feedbacks: Feedback[];
}