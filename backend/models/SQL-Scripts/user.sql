CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  roles TEXT[] NOT NULL DEFAULT ARRAY['collector','user'],
  tenant_id TEXT NOT NULL,

  oauth_provider TEXT,
  oauth_id TEXT,

  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Email Confirmation
  email_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  email_confirmation_token TEXT,
  email_confirmation_expires TIMESTAMPTZ,

  -- Forgot Password
  password_reset_token TEXT,
  password_reset_expires TIMESTAMPTZ,

  -- Two-Factor Authentication
  is_2fa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  two_fa_secret TEXT,
  two_fa_recovery_codes TEXT[]
);