// USERS & AUTHENTICATION
export type UserRole = 'admin' | 'client' | 'specialist' | 'partner';
export type MFAMethod = 'totp' | 'sms' | 'email';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  company_id: string | null;
  is_verified: boolean;
  is_active: boolean;
  mfa_enabled: boolean;
  mfa_method: MFAMethod | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  size: 'startup' | 'pyme' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface Specialist {
  id: string;
  user_id: string;
  partner_id: string | null;
  title: string;
  bio: string | null;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  is_certified: boolean;
  certifications: string[];
  skills: string[];
  languages: string[];
  availability_status: 'available' | 'busy' | 'offline';
  response_time: number;
  completed_jobs: number;
  created_at: string;
  updated_at: string;
}

// TICKETS
export type TicketStatus = 
  | 'new' 
  | 'published' 
  | 'in_evaluation' 
  | 'assigned' 
  | 'in_progress' 
  | 'waiting_client' 
  | 'resolved' 
  | 'closed' 
  | 'canceled';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type TicketCategory = 
  | 'end_user' 
  | 'microsoft_365' 
  | 'windows_server' 
  | 'linux' 
  | 'sql_server' 
  | 'postgresql' 
  | 'oracle' 
  | 'vmware' 
  | 'networking' 
  | 'firewall' 
  | 'azure' 
  | 'aws' 
  | 'google_cloud' 
  | 'cybersecurity' 
  | 'erp' 
  | 'artificial_intelligence';

export interface Ticket {
  id: string;
  client_id: string;
  specialist_id: string | null;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  estimated_hours: number | null;
  estimated_cost: number | null;
  actual_hours: number | null;
  actual_cost: number | null;
  sla_deadline: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface TicketFile {
  id: string;
  ticket_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

// CHAT
export interface ChatConversation {
  id: string;
  ticket_id: string | null;
  participant_ids: string[];
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  file_urls: string[];
  read_at: string | null;
  created_at: string;
}

// PAYMENTS & BILLING
export interface Payment {
  id: string;
  ticket_id: string | null;
  contract_id: string | null;
  payer_id: string;
  payee_id: string;
  amount: number;
  commission_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method: 'mercado_pago' | 'bank_transfer' | 'credit_card';
  mercado_pago_id: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Commission {
  id: string;
  ticket_id: string | null;
  percentage: number;
  amount: number;
  status: 'pending' | 'paid' | 'withheld';
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'canceled';
  billing_cycle: 'monthly' | 'yearly';
  price: number;
  started_at: string;
  ends_at: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

// RATINGS & REVIEWS
export interface Rating {
  id: string;
  ticket_id: string;
  rater_id: string;
  rated_user_id: string;
  score: number;
  comment: string | null;
  created_at: string;
}

// SERVICES
export type ServiceType = 
  | 'windows_server' 
  | 'linux' 
  | 'sql_server' 
  | 'postgresql' 
  | 'oracle' 
  | 'firewall' 
  | 'azure' 
  | 'aws' 
  | 'google_cloud';

export interface ManagedService {
  id: string;
  contract_id: string;
  service_type: ServiceType;
  server_name: string;
  ip_address: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  last_health_check: string;
  uptime_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  client_id: string;
  specialist_id: string | null;
  partner_id: string | null;
  title: string;
  description: string;
  type: 'hourly' | 'fixed' | 'retainer';
  amount: number;
  status: 'draft' | 'active' | 'paused' | 'ended';
  start_date: string;
  end_date: string | null;
  terms: string | null;
  created_at: string;
  updated_at: string;
}

// MONITORING & ALERTS
export interface MonitoringAsset {
  id: string;
  contract_id: string;
  name: string;
  type: 'server' | 'database' | 'network' | 'service';
  status: 'active' | 'inactive';
  zabbix_host_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  asset_id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  metric_name: string;
  current_value: number;
  threshold_value: number;
  is_resolved: boolean;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MetricData {
  timestamp: string;
  value: number;
  unit: string;
}

// DASHBOARD
export interface DashboardStats {
  total_tickets: number;
  open_tickets: number;
  closed_tickets: number;
  sla_breaches: number;
  monthly_spend: number;
  active_services: number;
  specialist_count: number;
  average_rating: number;
}

// NOTIFICATIONS
export interface Notification {
  id: string;
  user_id: string;
  type: 'ticket' | 'payment' | 'alert' | 'system' | 'message';
  title: string;
  description: string;
  related_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

// REPORTS
export interface Report {
  id: string;
  generated_by: string;
  report_type: 'tickets' | 'payments' | 'performance' | 'sla' | 'specialists';
  period_start: string;
  period_end: string;
  file_url: string;
  created_at: string;
}

// API RESPONSES
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: string | null;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// PARTNER
export interface Partner {
  id: string;
  user_id: string;
  company_name: string;
  logo_url: string | null;
  website: string | null;
  tax_id: string | null;
  bank_account: string | null;
  is_verified: boolean;
  total_specialists: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
}

// AI/ML
export interface TicketAnalysis {
  detected_category: TicketCategory;
  detected_priority: TicketPriority;
  detected_complexity: 'low' | 'medium' | 'high';
  estimated_hours: number;
  estimated_cost: number;
  recommended_specialists: string[];
  technical_recommendations: string[];
  confidence_score: number;
}

export interface SpecialistMatch {
  specialist_id: string;
  match_score: number;
  reasoning: string;
  estimated_completion_time: number;
}

// FILTER & SEARCH
export interface SpecialistFilters {
  specialty?: TicketCategory;
  certification?: string;
  minRating?: number;
  maxHourlyRate?: number;
  availabilityStatus?: 'available' | 'busy';
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
}
