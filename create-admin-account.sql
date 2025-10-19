-- SQL Script to Create Admin Account
-- Run this in Supabase SQL Editor
-- 
-- Admin Account Details:
-- Email: duongmkqn001@gmail.com
-- Username: duongmkqn001
-- Password: duongmkqn1 (Base64 encoded)
-- Role: admin
-- User Type: admin

-- Insert admin account into user_accounts table
INSERT INTO user_accounts (
  email,
  username,
  password_hash,
  user_type,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  'duongmkqn001@gmail.com',
  'duongmkqn001',
  'ZHVvbmdta3FuMQ==',  -- Base64 encoded: duongmkqn1
  'admin',
  'admin',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  user_type = 'admin',
  is_active = true,
  updated_at = CURRENT_TIMESTAMP;

-- Verify the account was created
SELECT id, email, username, role, user_type, is_active, created_at 
FROM user_accounts 
WHERE email = 'duongmkqn001@gmail.com';

