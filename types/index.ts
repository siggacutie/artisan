import { Role, OrderType, TransactionType } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  emailVerified?: Date | null;
  avatarUrl?: string | null;
  walletBalance: number;
  currencyPreference: string;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  isActive: boolean;
  supplierName?: string | null;
  supplierBaseUrl?: string | null;
  supplierConfig: any; // Json
  inputFields: any; // Json
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  gameId: string;
  type: OrderType;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountApplied: number;
  cashbackCredited: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  playerInputs: any; // Json
  mlbbUsername?: string | null;
  couponCode?: string | null;
  supplierOrderId?: string | null;
  notes?: string | null;
  createdAt: Date;
  completedAt?: Date | null;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  method: string;
  referenceId?: string | null;
  status: string;
  description?: string | null;
  createdAt: Date;
}

export interface DiamondPackage {
  id: string;
  gameId: string;
  diamondAmount: number;
  basePriceInr: number;
  displayPrice?: number | null;
  isVisible: boolean;
  bonusDiamonds: number;
  bonusLabel?: string | null;
  supplierProductId: string;
  sortOrder: number;
  createdAt: Date;
}

export interface AccountListing {
  id: string;
  gameId: string;
  rank: string;
  server: string;
  heroCount: number;
  skinCount: number;
  priceInr: number;
  screenshots: any; // Json
  credentialEmail: string;
  credentialPassword?: string; // Should be handled carefully
  isSold: boolean;
  soldToUserId?: string | null;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  minOrderValue: number;
  expiryDate?: Date | null;
  applicableGameId?: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type PaymentMethod = "RAZORPAY" | "WALLET" | "UPI" | "PAYPAL" | "STRIPE" | "NOWPAYMENTS";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

export interface PlayerInput {
  label: string;
  name: string;
  type: "text" | "number" | "select";
  placeholder?: string;
  options?: { label: string; value: string }[];
  required: boolean;
}
