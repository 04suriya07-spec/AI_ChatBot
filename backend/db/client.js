import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.warn('⚠️  SUPABASE_URL or SUPABASE_SERVICE_KEY not set. Database features disabled.');
}

// Service role key bypasses RLS — only used server-side, never exposed to client
export const supabase = createClient(
  process.env.SUPABASE_URL || 'http://localhost:54321',
  process.env.SUPABASE_SERVICE_KEY || 'local-dev-key'
);

// Helper: insert a call record and return the created row
export async function insertCall(data) {
  const { data: row, error } = await supabase
    .from('calls')
    .insert(data)
    .select()
    .single();
  if (error) console.error('DB insertCall error:', error);
  return row;
}

// Helper: update a call record
export async function updateCall(id, updates) {
  const { data: row, error } = await supabase
    .from('calls')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) console.error('DB updateCall error:', error);
  return row;
}

// Helper: insert a lead
export async function insertLead(data) {
  const { data: row, error } = await supabase
    .from('leads')
    .insert(data)
    .select()
    .single();
  if (error) console.error('DB insertLead error:', error);
  return row;
}

// Helper: insert an appointment
export async function insertAppointment(data) {
  const { data: row, error } = await supabase
    .from('appointments')
    .insert(data)
    .select()
    .single();
  if (error) console.error('DB insertAppointment error:', error);
  return row;
}

// Helper: fetch client by slug or ID
export async function getClient(idOrSlug) {
  const isUUID = /^[0-9a-f-]{36}$/.test(idOrSlug);
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq(isUUID ? 'id' : 'slug', idOrSlug)
    .single();
  if (error) console.error('DB getClient error:', error);
  return data;
}

// Helper: fetch client knowledge base as formatted context string
export async function getKnowledgeContext(clientId) {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('question, answer, category')
    .eq('client_id', clientId);
  if (error || !data?.length) return '';
  return data.map(kb => `Q: ${kb.question}\nA: ${kb.answer}`).join('\n\n');
}

// Helper: fetch computed stats from view
export async function getClientStats(clientId) {
  const { data, error } = await supabase
    .from('client_stats')
    .select('*')
    .eq('client_id', clientId)
    .single();
  if (error) console.error('DB getClientStats error:', error);
  return data;
}
