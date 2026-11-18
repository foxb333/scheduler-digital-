// =====================================================================
// config.js - Liga o site ao Supabase (banco de dados na nuvem)
// Fica na MESMA pasta dos arquivos .html.
// Aqui só entram a URL e a chave PÚBLICA (publishable).
// NUNCA coloque aqui a chave secreta nem a senha do banco.
// =====================================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

export const SUPABASE_URL = 'https://wpjhhvojrwgvglgljsdq.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_txpfaSEwcqaxGeEEDIn8cQ_Dzz23sbB';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
});

// ---------------------------------------------------------------------
// Como cada tipo de usuário vira um "login" interno do Supabase.
// O usuário nunca vê isso: ele só digita o usuário/CPF e a senha.
// (A Edge Function que cria as contas usa as MESMAS regras.)
// ---------------------------------------------------------------------
export const DOMINIO_ALUNO = 'aluno.schedule.invalid';
export const DOMINIO_EQUIPE = 'equipe.schedule.invalid';

// Administrador: entra digitando "adm.com". Por trás, a conta do Supabase usa este e-mail interno.
// (O mesmo e-mail precisa estar na conta do admin; o SQL do passo "admin" faz isso.)
export const ADMIN_USUARIO = 'adm.com';
export const ADMIN_EMAIL_INTERNO = 'adm@admin.schedule.invalid';

// Aluno: usuário tipo 000110939352SP. Aceita 3 ou 4 zeros no começo e SP maiúsculo/minúsculo.
// Resultado padronizado: minúsculo e sempre com 4 zeros (0000110939352sp).
// Qualquer outra quantidade de zeros não é ajustada (e por isso não entra).
export function normalizarAcesso(texto) {
  const t = String(texto || '').trim().toLowerCase().replace(/\s+/g, '');
  return t.replace(/^0{3,4}(?=[1-9])/, '0000');
}

// CPF: aceita com ou sem pontos e traço. Devolve só os 11 números (ou '' se não tiver 11).
export function somenteCpf(texto) {
  const n = String(texto || '').replace(/[.\-\s]/g, '');
  return /^[0-9]{11}$/.test(n) ? n : '';
}

// Versão embaralhada (SHA-256) do CPF, para o CPF não ficar escrito na tabela de logins.
async function hashCpf(cpf) {
  const bytes = new TextEncoder().encode('schedule-digital:' + cpf);
  const h = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 40);
}

// Recebe o que a pessoa digitou no campo "usuário" e devolve o login interno e o tipo.
//   adm.com        -> administrador (usuário fixo)
//   com "@"        -> administrador (também aceita o e-mail real da conta)
//   11 números     -> equipe (professor, gestão, diretor) pelo CPF
//   o resto        -> aluno pelo código de acesso
export async function loginInterno(digitado) {
  const t = String(digitado || '').trim();
  if (!t) return null;
  if (t.toLowerCase() === ADMIN_USUARIO) return { tipo: 'admin', email: ADMIN_EMAIL_INTERNO };
  if (t.includes('@')) return { tipo: 'admin', email: t.toLowerCase() };
  const cpf = somenteCpf(t);
  if (cpf) return { tipo: 'equipe', email: (await hashCpf(cpf)) + '@' + DOMINIO_EQUIPE };
  const acesso = normalizarAcesso(t);
  return { tipo: 'aluno', email: acesso + '@' + DOMINIO_ALUNO };
}