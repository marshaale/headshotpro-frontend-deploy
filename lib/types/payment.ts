export interface ICreditPackage {
  _id: string;
  _v: number;
  name: string;
  credits: number;
  price: number;
  description?: string;
  isActive: boolean;
  stripePriceId?: string;
  bonus?: number; // Extra credits for this package
  popular?: boolean; // Mark as popular for UI
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentPlatform {
  STRIPE = 'STRIPE',
  EVC = 'EVC',
  ZAAD = 'ZAAD',
  SAHAL = 'SAHAL',
  EBIR = 'EBIR',
  LOCAL = 'LOCAL', // For cash/local payments that need manual approval
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface StripeCheckoutConfig {
  packageId: string;
  platform: PaymentPlatform;
  successUrl: string;
  cancelUrl: string;
}

export interface IProcessPayment {
  packageId: string;
  platform: PaymentPlatform;
  phone?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface IPaymentResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
  sessionId?: string;
  orderId?: string;
  transactionId?: string;
  amount?: number;
  credits?: number;
  redirectUrl?: string;
  cancelUrl?: string;
  status?: PaymentStatus;
}

export interface IOrder {
  _id: string;
  user: any;
  package: ICreditPackage | any;
  amount: number;
  credits: number;
  platform: PaymentPlatform;
  phone?: string;
  status: PaymentStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  transactionId?: string;
  paymentDetails?: any;
  creditsAdded?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
