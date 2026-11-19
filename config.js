// @ts-nocheck  (avisa o VS Code para não mostrar alertas de tipo; não muda nada no funcionamento)
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

// SHA-256 escrito à mão. O navegador só libera o "crypto.subtle" em https:// ou localhost;
// abrindo o site por um endereço de rede (ex.: http://172.25.144.1:5500) ele não existe.
// Este plano B dá o MESMO resultado, então funciona em qualquer computador.
function sha256Manual(bytes) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  const bitLen = bytes.length * 8;
  const total = (((bytes.length + 9 + 63) >> 6) << 6);
  const m = new Uint8Array(total);
  m.set(bytes); m[bytes.length] = 0x80;
  const dv = new DataView(m.buffer);
  dv.setUint32(total - 8, Math.floor(bitLen / 0x100000000));
  dv.setUint32(total - 4, bitLen >>> 0);
  const w = new Uint32Array(64);
  for (let i = 0; i < total; i += 64) {
    for (let t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[t] + w[t]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }
  return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
}

// Versão embaralhada (SHA-256) do CPF, para o CPF não ficar escrito na tabela de logins.
async function hashCpf(cpf) {
  const bytes = new TextEncoder().encode('schedule-digital:' + cpf);
  if (globalThis.crypto?.subtle) {
    const h = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 40);
  }
  return sha256Manual(bytes).slice(0, 40); // plano B (site aberto por http:// com IP de rede)
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