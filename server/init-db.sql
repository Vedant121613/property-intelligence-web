-- Pureframe PostgreSQL Schema & Single User Initialization
-- Database: pureframe_db

-- 1. Users Table (Strict Single User Architecture)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    free_attempts_left INTEGER NOT NULL DEFAULT 999,
    free_attempts_used INTEGER NOT NULL DEFAULT 0,
    is_payment_done BOOLEAN NOT NULL DEFAULT TRUE,
    selected_plan VARCHAR(50) NOT NULL DEFAULT 'enterprise',
    plan_activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unlocked_deeds JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Delete any old non-authorized users to strictly maintain single-user integrity
DELETE FROM users WHERE phone != 'user@123';

-- Seed the single authorized user (user@123) with full unlocked privileges
INSERT INTO users (phone, name, free_attempts_left, free_attempts_used, is_payment_done, selected_plan, plan_activated_at, unlocked_deeds)
VALUES 
    ('user@123', 'Authorized User', 999, 0, TRUE, 'enterprise', CURRENT_TIMESTAMP, '["11089052"]'::jsonb)
ON CONFLICT (phone) DO UPDATE 
SET name = 'Authorized User',
    free_attempts_left = 999,
    is_payment_done = TRUE,
    selected_plan = 'enterprise',
    updated_at = CURRENT_TIMESTAMP;

-- 2. Plans Reference Table
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    period VARCHAR(20) NOT NULL DEFAULT 'monthly',
    badge VARCHAR(50),
    description TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Insert or Update default pricing plans
INSERT INTO plans (id, name, price, period, badge, description, features)
VALUES 
    (
        'starter', 
        'Starter Explorer', 
        999, 
        'monthly', 
        'Basic', 
        'Ideal for individual home buyers checking 1-2 localities',
        '["25 Verified Deed Unlocks", "Standard IGR Stamp Records", "30-Day Historical Trend Charts", "Email Support"]'::jsonb
    ),
    (
        'investor', 
        'Investor Pro', 
        2499, 
        'monthly', 
        'Most Popular', 
        'Full unlimited intelligence for serious home buyers and investors',
        '["Unlimited Certified Deed Unlocks", "Instant PDF Agreement Copies", "AI Negotiation Price Predictor", "Direct Sub-Registrar Sync", "Priority WhatsApp Support"]'::jsonb
    ),
    (
        'enterprise', 
        'Broker & Enterprise', 
        5999, 
        'monthly', 
        'Full Power', 
        'For real estate brokerages, lawyers, and wealth managers',
        '["Unlimited Deeds for Up to 5 Team Members", "Bulk CSV / Excel Export", "Full MahaRERA Litigation Intelligence", "Dedicated Account Manager", "REST API Access"]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- 3. Audit Log for Unlocks
CREATE TABLE IF NOT EXISTS unlock_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(50) NOT NULL,
    method VARCHAR(20) NOT NULL DEFAULT 'enterprise_plan',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Pune Real Estate Projects Table
CREATE TABLE IF NOT EXISTS pune_projects (
    id SERIAL PRIMARY KEY,
    rera_id VARCHAR(100),
    project_id VARCHAR(100),
    project_name VARCHAR(255) NOT NULL,
    project_slug VARCHAR(255),
    registration_number VARCHAR(100),
    date_of_registration VARCHAR(50),
    proposed_completion_date VARCHAR(50),
    taluka VARCHAR(100),
    taluka_slug VARCHAR(100),
    village VARCHAR(100),
    village_slug VARCHAR(100),
    address TEXT,
    street_name VARCHAR(255),
    locality VARCHAR(255),
    pin_code VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
