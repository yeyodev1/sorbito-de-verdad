export interface OrderItem {
  name?: string;
  quantity?: number;
  price?: number;
}

export interface ShippingAddress {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  mapsUrl?: string;
}

export interface TransferVerification {
  status: string;
  summary: string;
  detectedAmount: number;
  detectedDestination: string;
  analyzedAt: string;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  user?: { name?: string; email?: string };
  items?: OrderItem[];
  total?: number;
  status?: string;
  paymentStatus?: string;
  paymentReceiptUrl?: string;
  paymentMethod?: string;
  transferVerification?: TransferVerification;
  shippingAddress?: ShippingAddress;
  identificationNumber?: string;
  notes?: string;
  createdAt?: string;
  source?: string;
  payphoneLinkUrl?: string;
  payphoneLinkExpiresAt?: string;
  payphoneTransactionId?: string;
  clientTransactionId?: string;
  whatsappPhone?: string;
  remindersSent?: { r15min?: string; r1h?: string; r24h?: string };
}
