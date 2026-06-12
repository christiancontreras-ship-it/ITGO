-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'client', 'specialist', 'partner');
CREATE TYPE ticket_status AS ENUM ('new', 'published', 'in_evaluation', 'assigned', 'in_progress', 'waiting_client', 'resolved', 'closed', 'canceled');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE ticket_category AS ENUM ('end_user', 'microsoft_365', 'windows_server', 'linux', 'sql_server', 'postgresql', 'oracle', 'vmware', 'networking', 'firewall', 'azure', 'aws', 'google_cloud', 'cybersecurity', 'erp', 'artificial_intelligence');
CREATE TYPE mfa_method AS ENUM ('totp', 'sms', 'email');
CREATE TYPE company_size AS ENUM ('startup', 'pyme', 'enterprise');
CREATE TYPE specialist_availability AS ENUM ('available', 'busy', 'offline');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('mercado_pago', 'bank_transfer', 'credit_card');
CREATE TYPE contract_type AS ENUM ('hourly', 'fixed', 'retainer');
CREATE TYPE contract_status AS ENUM ('draft', 'active', 'paused', 'ended');
CREATE TYPE service_type AS ENUM ('windows_server', 'linux', 'sql_server', 'postgresql', 'oracle', 'firewall', 'azure', 'aws', 'google_cloud');
CREATE TYPE subscription_plan AS ENUM ('free', 'professional', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'canceled');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE asset_type AS ENUM ('server', 'database', 'network', 'service');
CREATE TYPE asset_status AS ENUM ('active', 'inactive');
CREATE TYPE notification_type AS ENUM ('ticket', 'payment', 'alert', 'system', 'message');
CREATE TYPE commission_status AS ENUM ('pending', 'paid', 'withheld');
CREATE TYPE managed_service_status AS ENUM ('healthy', 'warning', 'critical', 'offline');
CREATE TYPE report_type AS ENUM ('tickets', 'payments', 'performance', 'sla', 'specialists');

-- USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'client',
  company_id UUID,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_method mfa_method,
  mfa_secret TEXT,
  last_login TIMESTAMP,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- COMPANIES TABLE
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website VARCHAR(255),
  industry VARCHAR(100),
  size company_size,
  tax_id VARCHAR(50),
  billing_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SPECIALISTS TABLE
CREATE TABLE specialists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_id UUID,
  title VARCHAR(255) NOT NULL,
  bio TEXT,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_certified BOOLEAN DEFAULT false,
  certifications TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  availability_status specialist_availability DEFAULT 'offline',
  response_time INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  portfolio_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PARTNERS TABLE
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website VARCHAR(255),
  tax_id VARCHAR(50),
  bank_account VARCHAR(50),
  is_verified BOOLEAN DEFAULT false,
  total_specialists INTEGER DEFAULT 0,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TICKETS TABLE
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialist_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category ticket_category NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'new',
  estimated_hours INTEGER,
  estimated_cost DECIMAL(15, 2),
  actual_hours INTEGER,
  actual_cost DECIMAL(15, 2),
  sla_deadline TIMESTAMP,
  attachments TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP
);

-- TICKET MESSAGES TABLE
CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  file_urls TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TICKET FILES TABLE
CREATE TABLE ticket_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CHAT CONVERSATIONS TABLE
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  participant_ids UUID[] NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CHAT MESSAGES TABLE
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  file_urls TEXT[],
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PAYMENTS TABLE
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  contract_id UUID,
  payer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  commission_amount DECIMAL(15, 2) DEFAULT 0,
  status payment_status DEFAULT 'pending',
  payment_method payment_method,
  mercado_pago_id VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COMMISSIONS TABLE
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  percentage DECIMAL(5, 2) NOT NULL DEFAULT 20,
  amount DECIMAL(15, 2) NOT NULL,
  status commission_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SUBSCRIPTIONS TABLE
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status DEFAULT 'active',
  billing_cycle billing_cycle,
  price DECIMAL(10, 2),
  started_at TIMESTAMP,
  ends_at TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RATINGS TABLE
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONTRACTS TABLE
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialist_id UUID REFERENCES users(id) ON DELETE SET NULL,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type contract_type NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status contract_status DEFAULT 'draft',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  terms TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MANAGED SERVICES TABLE
CREATE TABLE managed_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  service_type service_type NOT NULL,
  server_name VARCHAR(255) NOT NULL,
  ip_address INET,
  status managed_service_status DEFAULT 'healthy',
  last_health_check TIMESTAMP,
  uptime_percentage DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MONITORING ASSETS TABLE
CREATE TABLE monitoring_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type asset_type NOT NULL,
  status asset_status DEFAULT 'active',
  zabbix_host_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALERTS TABLE
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID NOT NULL REFERENCES monitoring_assets(id) ON DELETE CASCADE,
  severity alert_severity DEFAULT 'info',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metric_name VARCHAR(255),
  current_value DECIMAL(15, 4),
  threshold_value DECIMAL(15, 4),
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  related_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REPORTS TABLE
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generated_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  period_start TIMESTAMP,
  period_end TIMESTAMP,
  file_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_specialists_user_id ON specialists(user_id);
CREATE INDEX idx_specialists_partner_id ON specialists(partner_id);
CREATE INDEX idx_specialists_rating ON specialists(rating DESC);
CREATE INDEX idx_tickets_client_id ON tickets(client_id);
CREATE INDEX idx_tickets_specialist_id ON tickets(specialist_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_category ON tickets(category);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_ticket_id ON payments(ticket_id);
CREATE INDEX idx_ratings_rated_user_id ON ratings(rated_user_id);
CREATE INDEX idx_contracts_client_id ON contracts(client_id);
CREATE INDEX idx_contracts_specialist_id ON contracts(specialist_id);
CREATE INDEX idx_managed_services_contract_id ON managed_services(contract_id);
CREATE INDEX idx_alerts_asset_id ON alerts(asset_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ROW LEVEL SECURITY (RLS)

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE managed_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id OR (auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Specialists RLS
CREATE POLICY "Specialists are viewable by all"
  ON specialists FOR SELECT
  USING (true);

CREATE POLICY "Specialists can update their own profile"
  ON specialists FOR UPDATE
  USING (auth.uid() = user_id);

-- Tickets RLS
CREATE POLICY "Clients can view their tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = specialist_id);

CREATE POLICY "Specialists can view assigned tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = specialist_id);

CREATE POLICY "Clients can create tickets"
  ON tickets FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their tickets"
  ON tickets FOR UPDATE
  USING (auth.uid() = client_id);

-- Payments RLS
CREATE POLICY "Users can view their payments"
  ON payments FOR SELECT
  USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Ratings RLS
CREATE POLICY "Ratings are viewable by all"
  ON ratings FOR SELECT
  USING (true);

-- Notifications RLS
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- FUNCTIONS

-- Function to update specialists rating
CREATE OR REPLACE FUNCTION update_specialist_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE specialists
  SET 
    rating = (SELECT AVG(score) FROM ratings WHERE rated_user_id = NEW.rated_user_id),
    total_reviews = (SELECT COUNT(*) FROM ratings WHERE rated_user_id = NEW.rated_user_id)
  WHERE user_id = NEW.rated_user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_specialist_rating
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_specialist_rating();

-- Function to create automatic alert when critical ticket
CREATE OR REPLACE FUNCTION handle_critical_ticket()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.priority = 'critical' AND NEW.status = 'published' THEN
    INSERT INTO notifications (user_id, type, title, description, related_id)
    SELECT u.id, 'ticket'::notification_type, 'Ticket Crítico', NEW.title, NEW.id
    FROM users u
    WHERE u.role = 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_critical_ticket
AFTER INSERT OR UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION handle_critical_ticket();

-- Function to create automatic ticket from alert
CREATE OR REPLACE FUNCTION create_ticket_from_alert()
RETURNS TRIGGER AS $$
DECLARE
  v_contract_id UUID;
BEGIN
  IF NEW.severity = 'critical' THEN
    SELECT ma.contract_id INTO v_contract_id
    FROM monitoring_assets ma
    WHERE ma.id = NEW.asset_id;
    
    IF v_contract_id IS NOT NULL THEN
      INSERT INTO tickets (
        client_id,
        title,
        description,
        category,
        priority,
        status,
        created_at
      ) SELECT
        c.client_id,
        'Alert: ' || NEW.title,
        NEW.description,
        'infrastructure'::ticket_category,
        'critical'::ticket_priority,
        'new'::ticket_status,
        CURRENT_TIMESTAMP
      FROM contracts c
      WHERE c.id = v_contract_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_alert_to_ticket
AFTER INSERT ON alerts
FOR EACH ROW
EXECUTE FUNCTION create_ticket_from_alert();

-- Function to log audit
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    changes,
    created_at
  ) VALUES (
    auth.uid(),
    TG_ARGV[0],
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    to_jsonb(NEW),
    CURRENT_TIMESTAMP
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for important tables
CREATE TRIGGER audit_users
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes('UPDATE');

CREATE TRIGGER audit_tickets
AFTER UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes('UPDATE');

CREATE TRIGGER audit_payments
AFTER INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION audit_log_changes('INSERT');

-- Function to handle updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specialists_updated_at BEFORE UPDATE ON specialists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_managed_services_updated_at BEFORE UPDATE ON managed_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
