/**
 * AuraDesk AI — REST API Routes
 * 
 * Calls, Leads, Appointments, Clients, Stats
 * These are consumed by the React frontend dashboard.
 */

import { Router } from 'express';
import { supabase } from '../db/client.js';

const router = Router();

// ──────────────────────────────────────────────────────
// CALLS
// ──────────────────────────────────────────────────────
router.get('/calls', async (req, res) => {
  const { client_id, limit = 50, offset = 0, search } = req.query;
  if (!client_id) return res.status(400).json({ error: 'client_id required' });

  let query = supabase
    .from('calls')
    .select('*')
    .eq('client_id', client_id)
    .order('started_at', { ascending: false })
    .range(+offset, +offset + +limit - 1);

  if (search) {
    query = query.or(`caller_name.ilike.%${search}%,intent.ilike.%${search}%,outcome.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/calls/:id', async (req, res) => {
  const { data, error } = await supabase.from('calls').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Call not found' });
  res.json(data);
});

// ──────────────────────────────────────────────────────
// LEADS
// ──────────────────────────────────────────────────────
router.get('/leads', async (req, res) => {
  const { client_id, status, search, limit = 50 } = req.query;
  if (!client_id) return res.status(400).json({ error: 'client_id required' });

  let query = supabase
    .from('leads')
    .select('*')
    .eq('client_id', client_id)
    .order('created_at', { ascending: false })
    .limit(+limit);

  if (status && status !== 'ALL') query = query.eq('status', status);
  if (search) {
    query = query.or(`name.ilike.%${search}%,requirement.ilike.%${search}%,location.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch('/leads/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('leads')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ──────────────────────────────────────────────────────
// APPOINTMENTS
// ──────────────────────────────────────────────────────
router.get('/appointments', async (req, res) => {
  const { client_id, date } = req.query;
  if (!client_id) return res.status(400).json({ error: 'client_id required' });

  let query = supabase
    .from('appointments')
    .select('*')
    .eq('client_id', client_id)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  if (date) query = query.eq('appointment_date', date);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ──────────────────────────────────────────────────────
// STATS (Computed ROI — real numbers from DB view)
// ──────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  const { client_id } = req.query;
  if (!client_id) return res.status(400).json({ error: 'client_id required' });

  const { data, error } = await supabase
    .from('client_stats')
    .select('*')
    .eq('client_id', client_id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ──────────────────────────────────────────────────────
// CLIENTS
// ──────────────────────────────────────────────────────
router.get('/clients', async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .select('id, name, slug, industry, plan, status, branding, ai_name, twilio_number, created_at')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/clients/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Client not found' });
  res.json(data);
});

router.post('/clients', async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/clients/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ──────────────────────────────────────────────────────
// KNOWLEDGE BASE
// ──────────────────────────────────────────────────────
router.get('/knowledge', async (req, res) => {
  const { client_id } = req.query;
  if (!client_id) return res.status(400).json({ error: 'client_id required' });

  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('client_id', client_id)
    .order('category', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/knowledge', async (req, res) => {
  const { data, error } = await supabase
    .from('knowledge_base')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.delete('/knowledge/:id', async (req, res) => {
  const { error } = await supabase.from('knowledge_base').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ──────────────────────────────────────────────────────
// AVAILABLE CALENDAR SLOTS (for AI to check before booking)
// ──────────────────────────────────────────────────────
router.get('/calendar/slots', async (req, res) => {
  const { client_id, date } = req.query;
  if (!client_id || !date) return res.status(400).json({ error: 'client_id and date required' });

  const { data: client } = await supabase.from('clients').select('google_tokens, google_cal_id').eq('id', client_id).single();
  const slots = await (await import('../services/calendar.js')).getAvailableSlots(
    client?.google_tokens?.refresh_token,
    client?.google_cal_id,
    date
  );

  res.json({ date, slots });
});

// Google OAuth flow
router.get('/auth/google', async (req, res) => {
  const { getAuthUrl } = await import('../services/calendar.js');
  res.redirect(getAuthUrl());
});

router.get('/auth/google/callback', async (req, res) => {
  const { code, state: clientId } = req.query;
  const { exchangeCodeForTokens } = await import('../services/calendar.js');
  const tokens = await exchangeCodeForTokens(code);

  if (clientId) {
    await supabase.from('clients').update({ google_tokens: tokens }).eq('id', clientId);
  }

  res.send('<script>window.opener.postMessage("google_auth_success","*");window.close();</script>');
});

// SSE: Real-time dashboard events stream
router.get('/events', (req, res) => {
  const { client_id } = req.query;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');

  res.write(`data: ${JSON.stringify({ type: 'connected', clientId: client_id })}\n\n`);

  // Register this SSE connection
  if (!req.app.sseClients) req.app.sseClients = new Map();
  if (!req.app.sseClients.has(client_id)) req.app.sseClients.set(client_id, new Set());
  req.app.sseClients.get(client_id).add(res);

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    req.app.sseClients?.get(client_id)?.delete(res);
  });
});

export default router;
