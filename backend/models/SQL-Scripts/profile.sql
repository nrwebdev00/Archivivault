CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- Identity & Contact
  display_name TEXT,
  username TEXT,
  birth_date DATE,
  phone_number TEXT,

  -- Address
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  address_country TEXT,

  -- Profile & Social
  profile_picture_url TEXT,
  bio TEXT,
  social_links JSONB, -- e.g., {"twitter": "...", "discord": "..."}

  -- Preferences
  preferred_language TEXT,
  timezone TEXT,
  notification_preferences JSONB, -- e.g., {"email": true, "sms": false}
  theme TEXT, -- 'light' or 'dark'
  default_currency TEXT,
  default_view TEXT, -- 'grid' or 'list'

  -- Activity
  last_login TIMESTAMPTZ,
  last_known_ip TEXT,
  location_latlng POINT, -- optional geolocation

  -- Business Info
  is_business_account BOOLEAN NOT NULL DEFAULT FALSE,
  store_name TEXT,
  store_url TEXT,
  tax_id TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);