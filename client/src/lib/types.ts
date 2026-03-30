export interface StatsCard {
  title: string;
  description: string;
  value?: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  lastUpdate: string;
  chartData: number[];
  chartLabels: string[];
}

export interface ProjectMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
}



export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  status: 'online' | 'offline';
  employed: string;
}

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export interface Message {
  id: string;
  sender: string;
  avatar: string;
  preview: string;
  time: string;
}

export interface SettingsState {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  TrackingPrefix: string;
}



export interface Shipment {
  id: string;
  packageName?: string;
  packageType?: string;
  packageDescription?: string;
  weight?: string;
  dimensions?: string;
  trackingNumber?: string;
  status?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  deliveryInstructions?: string;
  deliveryDate?: string;
  deliveryfee?: number;
  receivedAt?: string;
  toBeDeliveredAt?: string;
  senderFullName?: string;
  senderEmail?: string;
  senderPhoneNo?: string;
  senderAddress?: string;
  receiverFullName?: string;
  receiverEmail?: string;
  receiverPhoneNo?: string;
  receiverAddress?: string;
  createdAt?: string;
}