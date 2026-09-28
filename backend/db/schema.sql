-- AuraDesk AI — Supabase PostgreSQL Schema
-- Run this in: https://supabase.com → SQL Editor

-- ─────────────────────────────────────────────────────────────
-- 1. CLIENTS (Multi-Tenant Organizations)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  industry        TEXT NOT NULL DEFAULT 'corporate',
  plan            TEXT NOT NULL DEFAULT 'Basic',
  status          TEXT NOT NULL DEFAULT 'Active',
  -- AI & Voice Config
  ai_name         TEXT NOT NULL DEFAULT 'Maya',
  voice_id        TEXT,
  language        TEXT NOT NULL DEFAULT 'en-US',
  greeting        TEXT,
  system_prompt   TEXT,
  -- Business Info (JSON blob for flexibility)
  company_info    JSONB NOT NULL DEFAULT '{}',
  branding        JSONB NOT NULL DEFAULT '{}',
  guardrails      JSONB NOT NULL DEFAULT '{}',
  -- Twilio
  twilio_number   TEXT,
  twilio_sid      TEXT,
  -- Google Calendar
  google_cal_id   TEXT,
  google_tokens   JSONB,
  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 2. KNOWLEDGE BASE (Per-Client FAQ & Business Info)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_base (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  category    TEXT NOT NULL DEFAULT 'General',
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  source      TEXT DEFAULT 'manual',  -- manual | pdf | website
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 3. CALLS (Every Inbound / Outbound Call)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calls (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  -- Caller Info
  caller_name         TEXT DEFAULT 'Unknown Caller',
  caller_number       TEXT NOT NULL,
  twilio_call_sid     TEXT UNIQUE,
  -- Call Metadata
  direction           TEXT NOT NULL DEFAULT 'inbound',  -- inbound | outbound
  started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at            TIMESTAMPTZ,
  duration_seconds    INTEGER DEFAULT 0,
  -- AI Analysis
  intent              TEXT,
  outcome             TEXT,  -- booked | lead_captured | resolved | transferred | missed | emergency
  sentiment           TEXT,  -- positive | neutral | negative | urgent
  ai_summary          TEXT,
  -- Full Data
  transcript          JSONB DEFAULT '[]',
  ai_actions          JSONB DEFAULT '[]',
  -- Recording
  recording_url       TEXT,
  recording_sid       TEXT,
  -- Lead / Appointment Links
  lead_id             UUID,
  appointment_id      UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast dashboard queries
CREATE INDEX IF NOT EXISTS calls_client_id_started_at_idx ON calls(client_id, started_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 4. LEADS (Qualified Prospects)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  call_id             UUID REFERENCES calls(id),
  -- Lead Identity
  name                TEXT NOT NULL,
  phone               TEXT NOT NULL,
  email               TEXT,
  -- Qualification Data
  requirement         TEXT,
  budget              TEXT,
  budget_numeric      NUMERIC,  -- For pipeline value calculation
  location            TEXT,
  timeline            TEXT,
  -- Scoring & Status
  status              TEXT NOT NULL DEFAULT 'WARM',  -- HOT | WARM | COLD
  score               INTEGER DEFAULT 50,            -- 0–100 AI qualification score
  source              TEXT DEFAULT 'inbound_call',
  -- AI Summary
  ai_summary          TEXT,
  -- Follow-Up
  follow_up_date      DATE,
  follow_up_time      TEXT,
  follow_up_status    TEXT DEFAULT 'Pending',  -- Pending | Scheduled | Completed
  -- Messaging
  sms_sent            BOOLEAN DEFAULT FALSE,
  whatsapp_sent       BOOLEAN DEFAULT FALSE,
  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_client_id_status_idx ON leads(client_id, status);
CREATE INDEX IF NOT EXISTS leads_client_id_created_at_idx ON leads(client_id, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 5. APPOINTMENTS (AI-Booked Calendar Slots)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  call_id               UUID REFERENCES calls(id),
  lead_id               UUID REFERENCES leads(id),
  -- Guest Info
  guest_name            TEXT NOT NULL,
  guest_email           TEXT,
  guest_phone           TEXT,
  -- Appointment Details
  host_name             TEXT,
  department            TEXT,
  purpose               TEXT,
  appointment_date      DATE NOT NULL,
  appointment_time      TEXT NOT NULL,
  duration_minutes      INTEGER DEFAULT 30,
  location_room         TEXT,
  -- Status
  status                TEXT NOT NULL DEFAULT 'Confirmed',  -- Confirmed | Cancelled | Rescheduled | Completed
  -- Google Calendar
  google_event_id       TEXT,
  -- Reminders Sent
  reminder_sms_sent     BOOLEAN DEFAULT FALSE,
  confirmation_sms_sent BOOLEAN DEFAULT FALSE,
  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS appointments_client_id_date_idx ON appointments(client_id, appointment_date);

-- ─────────────────────────────────────────────────────────────
-- 6. MESSAGES (Voicemails & Callback Requests)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  call_id         UUID REFERENCES calls(id),
  caller_name     TEXT,
  caller_company  TEXT,
  caller_contact  TEXT,
  recipient_name  TEXT,
  urgency         TEXT DEFAULT 'Normal',  -- Normal | High | Critical
  content         TEXT NOT NULL,
  status          TEXT DEFAULT 'Unread',  -- Unread | Read | Actioned
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 7. COMPUTED STATS VIEW (Real ROI Numbers)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW client_stats AS
SELECT
  c.id                                                          AS client_id,
  c.name                                                        AS client_name,
  COUNT(DISTINCT ca.id)                                         AS total_calls,
  COUNT(DISTINCT ca.id) FILTER (WHERE ca.outcome != 'missed')   AS answered_calls,
  COUNT(DISTINCT ca.id) FILTER (WHERE ca.outcome = 'missed')    AS missed_calls,
  COUNT(DISTINCT l.id)                                          AS leads_captured,
  COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'HOT')         AS hot_leads,
  COUNT(DISTINCT a.id)                                          AS appointments_booked,
  COUNT(DISTINCT ca.id) FILTER (WHERE ca.outcome = 'transferred') AS transfers_count,
  ROUND(AVG(ca.duration_seconds))                               AS avg_call_duration_secs,
  COALESCE(SUM(l.budget_numeric) FILTER (WHERE l.status IN ('HOT','WARM')), 0) AS pipeline_value,
  ROUND(
    100.0 * COUNT(DISTINCT ca.id) FILTER (WHERE ca.outcome != 'transferred' AND ca.outcome != 'missed')
    / NULLIF(COUNT(DISTINCT ca.id), 0),
    1
  )                                                              AS resolution_rate_pct,
  ROUND(SUM(ca.duration_seconds) / 60.0, 1)                    AS minutes_used
FROM clients c
LEFT JOIN calls ca        ON ca.client_id = c.id
LEFT JOIN leads l         ON l.client_id  = c.id
LEFT JOIN appointments a  ON a.client_id  = c.id
GROUP BY c.id, c.name;

-- ─────────────────────────────────────────────────────────────
-- 8. ROW LEVEL SECURITY (Important for multi-tenant safety)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE clients       ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls         ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
