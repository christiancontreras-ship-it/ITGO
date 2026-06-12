-- Insert demo users
INSERT INTO users (id, email, full_name, role, is_verified, is_active, password_hash, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@itgo.com', 'Admin User', 'admin', true, true, 'hashed_password_admin', NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'cliente1@pyme.com', 'Cliente PyME 1', 'client', true, true, 'hashed_password_client1', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'cliente2@empresa.com', 'Cliente Empresa 2', 'client', true, true, 'hashed_password_client2', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'especialista1@itgo.com', 'Juan Pérez - Especialista', 'specialist', true, true, 'hashed_password_specialist1', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'especialista2@itgo.com', 'María García - Especialista', 'specialist', true, true, 'hashed_password_specialist2', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'partner1@itgo.com', 'Partner TI Solutions', 'partner', true, true, 'hashed_password_partner1', NOW());

-- Insert companies
INSERT INTO companies (id, name, industry, size, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440000', 'PyME Tech Solutions', 'Technology', 'pyme', NOW()),
('650e8400-e29b-41d4-a716-446655440001', 'Enterprise Corp', 'Finance', 'enterprise', NOW()),
('650e8400-e29b-41d4-a716-446655440002', 'StartUp Innovations', 'SaaS', 'startup', NOW());

-- Link users to companies
UPDATE users SET company_id = '650e8400-e29b-41d4-a716-446655440000' WHERE email = 'cliente1@pyme.com';
UPDATE users SET company_id = '650e8400-e29b-41d4-a716-446655440001' WHERE email = 'cliente2@empresa.com';

-- Insert specialists
INSERT INTO specialists (id, user_id, title, bio, hourly_rate, rating, total_reviews, is_certified, certifications, skills, languages, availability_status, response_time, completed_jobs, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'Senior Windows Administrator', 'Especialista en infraestructura Windows con 10+ años de experiencia', 150.00, 4.8, 42, true, '["Microsoft Certified Associate","CompTIA A+"]', '["Windows Server","Active Directory","Exchange","Azure"]', '["Español","Inglés"]', 'available', 30, 127, NOW()),
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'Cloud Solutions Architect', 'Especialista en AWS y Google Cloud Platform', 180.00, 4.9, 56, true, '["AWS Solutions Architect","Google Cloud Professional","Docker Certified"]', '["AWS","Google Cloud","Kubernetes","Terraform"]', '["Español","Inglés","Portugués"]', 'busy', 15, 89, NOW());

-- Insert partners
INSERT INTO partners (id, user_id, company_name, is_verified, total_specialists, created_at) VALUES
('850e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'TI Solutions Partner', true, 2, NOW());

-- Insert sample tickets
INSERT INTO tickets (id, client_id, title, description, category, priority, status, created_at) VALUES
('950e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Configurar Active Directory', 'Necesitamos migrar nuestro AD a una nueva versión de Windows Server 2022', 'windows_server', 'high', 'published', NOW()),
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Problemas de conexión en red', 'Los equipos no pueden acceder a los recursos compartidos', 'networking', 'medium', 'in_evaluation', NOW()),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Migración a Azure', 'Necesitamos migrar nuestros servidores on-premise a Azure', 'azure', 'critical', 'new', NOW()),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Backup y Disaster Recovery', 'Implementar solución de backup automático', 'windows_server', 'high', 'assigned', NOW()),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Seguridad en Firewall', 'Configurar reglas de seguridad avanzadas', 'firewall', 'high', 'in_progress', NOW());

-- Assign specialists to some tickets
UPDATE tickets SET specialist_id = '550e8400-e29b-41d4-a716-446655440003' WHERE id = '950e8400-e29b-41d4-a716-446655440003';
UPDATE tickets SET specialist_id = '550e8400-e29b-41d4-a716-446655440004' WHERE id = '950e8400-e29b-41d4-a716-446655440004';

-- Insert contracts
INSERT INTO contracts (id, client_id, specialist_id, title, description, type, amount, status, start_date, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Soporte técnico mensual', 'Contrato de soporte técnico para Windows Server', 'retainer', 2000.00, 'active', NOW(), NOW()),
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Consultoría en Cloud', 'Consultoría para migración a AWS', 'fixed', 15000.00, 'active', NOW(), NOW());

-- Insert managed services
INSERT INTO managed_services (id, contract_id, service_type, server_name, ip_address, status, uptime_percentage, created_at) VALUES
('b50e8400-e29b-41d4-a716-446655440000', 'a50e8400-e29b-41d4-a716-446655440000', 'windows_server', 'PROD-SERVER-01', '192.168.1.50'::inet, 'healthy', 99.95, NOW()),
('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440000', 'sql_server', 'PROD-DB-01', '192.168.1.51'::inet, 'healthy', 99.98, NOW()),
('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 'aws', 'AWS-EC2-PROD', '10.0.1.100'::inet, 'healthy', 99.99, NOW());

-- Insert sample payments
INSERT INTO payments (id, ticket_id, payer_id, payee_id, amount, commission_amount, status, payment_method, description, created_at) VALUES
('c50e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 1200.00, 240.00, 'completed', 'mercado_pago', 'Pago por ticket Windows Server', NOW()),
('c50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 1800.00, 360.00, 'completed', 'mercado_pago', 'Pago por Backup y DR', NOW());

-- Insert sample ratings
INSERT INTO ratings (id, ticket_id, rater_id, rated_user_id, score, comment, created_at) VALUES
('d50e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 5, 'Excelente trabajo, muy profesional', NOW()),
('d50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 5, 'Rápido y efectivo', NOW());

-- Insert monitoring assets
INSERT INTO monitoring_assets (id, contract_id, name, type, status, zabbix_host_id, created_at) VALUES
('e50e8400-e29b-41d4-a716-446655440000', 'a50e8400-e29b-41d4-a716-446655440000', 'PROD-SERVER-01', 'server', 'active', 'zabbix_host_1', NOW()),
('e50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440000', 'PROD-DB-01', 'database', 'active', 'zabbix_host_2', NOW()),
('e50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 'AWS-VPC-NETWORK', 'network', 'active', 'zabbix_host_3', NOW());

-- Insert sample alerts
INSERT INTO alerts (id, asset_id, severity, title, description, metric_name, current_value, threshold_value, is_resolved, created_at) VALUES
('f50e8400-e29b-41d4-a716-446655440000', 'e50e8400-e29b-41d4-a716-446655440000', 'warning', 'CPU Alto', 'CPU está en 85%', 'cpu_usage', 85.0, 80.0, false, NOW()),
('f50e8400-e29b-41d4-a716-446655440001', 'e50e8400-e29b-41d4-a716-446655440001', 'info', 'Backup completado', 'Backup diario completado exitosamente', 'backup_status', 100.0, 100.0, false, NOW());

-- Insert subscriptions
INSERT INTO subscriptions (id, user_id, plan, status, billing_cycle, price, started_at, ends_at, auto_renew, created_at) VALUES
('1a50e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'professional', 'active', 'monthly', 99.00, NOW(), NOW() + INTERVAL '1 month', true, NOW()),
('1a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'enterprise', 'active', 'yearly', 999.00, NOW(), NOW() + INTERVAL '1 year', true, NOW());

-- Insert notifications
INSERT INTO notifications (id, user_id, type, title, description, related_id, is_read, created_at) VALUES
('2a50e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'ticket', 'Nuevo ticket asignado', 'Se asignó un ticket a tu cuenta', '950e8400-e29b-41d4-a716-446655440000', false, NOW()),
('2a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'payment', 'Pago recibido', 'Se completó un pago de $1,200.00', 'c50e8400-e29b-41d4-a716-446655440000', false, NOW()),
('2a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'alert', 'Alerta crítica', 'CPU en servidor PROD-SERVER-01 está en 90%', 'f50e8400-e29b-41d4-a716-446655440000', false, NOW());

-- Insert chat conversations
INSERT INTO chat_conversations (id, ticket_id, participant_ids, last_message, last_message_at, created_at) VALUES
('3a50e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440000', ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'], 'Listo, empezamos el lunes', NOW(), NOW());

-- Insert chat messages
INSERT INTO chat_messages (id, conversation_id, sender_id, content, created_at) VALUES
('4a50e8400-e29b-41d4-a716-446655440000', '3a50e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '¿Cuándo puedes empezar con la migración?', NOW() - INTERVAL '1 hour'),
('4a50e8400-e29b-41d4-a716-446655440001', '3a50e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'Puedo empezar el lunes próximo', NOW() - INTERVAL '30 minutes'),
('4a50e8400-e29b-41d4-a716-446655440002', '3a50e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Perfecto, déjame coordinar con mi equipo', NOW() - INTERVAL '15 minutes');

-- Insert commissions
INSERT INTO commissions (id, ticket_id, percentage, amount, status, created_at) VALUES
('5a50e8400-e29b-41d4-a716-446655440000', '950e8400-e29b-41d4-a716-446655440000', 20.0, 240.00, 'paid', NOW()),
('5a50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440003', 20.0, 360.00, 'pending', NOW());
