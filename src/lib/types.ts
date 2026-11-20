export type Role = "customer" | "vendor" | "admin";
export type ServiceStatus = "pending" | "approved" | "rejected";
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type SubscriptionPlan = "free" | "premium";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  isBlocked: boolean;
  businessName?: string | null;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
  createdAt?: string;
}

export interface ServiceVendor {
  id: string;
  name: string;
  contactName?: string;
  image?: string | null;
  businessName?: string;
  premium?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  contactName?: string;
  image?: string | null;
  /** Up to four portfolio frames for the card mosaic. */
  images?: string[];
  premium: boolean;
  categories: string[];
  locations: string[];
  serviceCount: number;
  fromPrice: number | null;
}

export interface Service {
  id: string;
  vendorId: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  isActive: boolean;
  createdAt: string;
  vendor?: ServiceVendor | null;
}

export interface Booking {
  id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  serviceName: string;
  serviceImage?: string | null;
  serviceCategory?: string | null;
  vendorName?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerImage?: string | null;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail?: string | null;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  isBlocked: boolean;
  businessName?: string | null;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
  createdAt?: string;
  services?: number;
  bookings?: number;
}

export interface VendorStats {
  totalServices: number;
  activeServices: number;
  approvedServices: number;
  pendingServices: number;
  pendingBookings: number;
  acceptedBookings: number;
  rejectedBookings: number;
  totalBookings: number;
}

export interface CustomerStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
}

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  totalTransactions: number;
  premiumTransactions: number;
  revenue: number;
}
