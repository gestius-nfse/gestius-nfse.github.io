'use strict';
if (window.top !== window.self) { try { window.top.location = window.self.location; } catch { document.documentElement.innerHTML = ''; } }
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const so = (s) => String(s ?? '').replace(/\D/g, '');
const brl = (c) => ((Number(c) || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDoc = (d) => { d = so(d);
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); return esc(d); };
const fmtDH = (s) => { if (!s) return ''; const d = new Date(s); return isNaN(d) ? esc(s) : d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };
const fmtD = (s) => (s ? esc(String(s).slice(0, 10).split('-').reverse().join('/')) : '');
const fmtComp = (s) => (s ? esc(String(s).slice(5, 7) + '/' + String(s).slice(0, 4)) : '');
const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const diasAte = (s) => Math.floor((new Date(s) - new Date()) / 86400000);
const guardado = (k, padrao) => { try { const v = JSON.parse(localStorage.getItem('nfse.' + k)); return v ?? padrao; } catch { return padrao; } };
const guardar = (k, v) => { try { localStorage.setItem('nfse.' + k, JSON.stringify(v)); } catch {} };

// ---------- ícones ----------
const I = {
  empresas: '<path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"/><path d="M4 21c.6-4 3.9-6.5 8-6.5s7.4 2.5 8 6.5"/>',
  notas: '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21H12"/><path d="M14 3l4 4v4"/><path d="M8 8h5M8 12h5M8 16h3"/><path d="M17 14v7m-2.5-2.5L17 21l2.5-2.5M21 17.5V10m-2.5 2.5L21 10"/>',
  eventos: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
  prefs: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  sync: '<path d="M20 11a8 8 0 0 0-14.6-4.5L4 8"/><path d="M4 3.5V8h4.5"/><path d="M4 13a8 8 0 0 0 14.6 4.5L20 16"/><path d="M20 20.5V16h-4.5"/>',
  addUser: '<path d="M10 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M3 20.5c.5-3.6 3.4-5.8 7-5.8 1.4 0 2.7.3 3.8.9"/><path d="M18 14v6M15 17h6"/>',
  certs: '<rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M7 8.5h6M7 12h4"/><circle cx="16.5" cy="12.5" r="2.5"/><path d="m15 15-1 5 2.5-1.3L19 20l-1-5"/>',
  editar: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  lixo: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  ok: '<circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="m8 12.3 2.7 2.7L16 9.7" stroke="#fff" stroke-width="2.2"/>',
  erro: '<circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="M9 9l6 6M15 9l-6 6" stroke="#fff" stroke-width="2.2"/>',
  aviso: '<path d="M12 3 2 20h20L12 3Z" fill="currentColor" stroke="none"/><path d="M12 10v4M12 17v.5" stroke="#fff" stroke-width="2.2"/>',
  relogio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  excel: '<rect x="3" y="3" width="18" height="18" rx="2" fill="#1d7044" stroke="none"/><path d="m8 7.5 8 9M16 7.5l-8 9" stroke="#fff" stroke-width="2.2"/>',
  zip: '<path d="M6 3h8l4 4v14H6z"/><path d="M10 3v2h2v2h-2v2h2v2h-2v2h2"/><rect x="9.5" y="14" width="3" height="4" rx=".5"/>',
  pdf: '<path d="M6 2.5h8.5L19 7v14.5H6z" fill="#fff" stroke="#999"/><rect x="2.5" y="11" width="14" height="6.5" rx="1" fill="#d9342b" stroke="none"/><text x="9.5" y="16.3" font-size="5.2" font-family="Arial" font-weight="700" fill="#fff" stroke="none" text-anchor="middle">PDF</text>',
  xml: '<path d="M6 2.5h8.5L19 7v14.5H6z" fill="#fff" stroke="#7a8db5"/><path d="m10.5 11-2.5 2.5 2.5 2.5M14.5 11l2.5 2.5-2.5 2.5" stroke="#2b5fb3" stroke-width="1.6"/>',
  sair: '<path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15M10 16l-4-4 4-4M6 12h10"/>',
  olho: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  coracao: '<path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 3.8 4 7.2 4c2 0 3.4 1.1 4.8 2.8C13.4 5.1 14.8 4 16.8 4c3.4 0 5.6 3.3 4.4 6.7C19.5 15.4 12 20 12 20Z"/>',
  filtro: '<path d="M4 5h16l-6.5 7.5V19l-3 1.5v-8z" fill="currentColor"/>',
};
I.apoie = I.coracao;
I.certs = '<rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M7 8.5h6M7 12h4"/><circle cx="16.5" cy="12.5" r="2.5"/><path d="m15 15-1 5 2.5-1.3L19 20l-1-5"/>';
I.admin = '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>';
const ico = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;

// ============================================================
// Gestius NFS-e — site (lê o Supabase; o download do ADN é feito pelo programa do PC)
// ============================================================
I.apoie = I.coracao || '<path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.3 3.8 4 7.2 4c2 0 3.4 1.1 4.8 2.8C13.4 5.1 14.8 4 16.8 4c3.4 0 5.6 3.3 4.4 6.7C19.5 15.4 12 20 12 20Z"/>';
I.admin = '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>';
I.pasta = '<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2h9A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/>';
I.conferir = '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/><path d="m8 11 2 2 4-4"/>';
I.alteracoes = '<path d="M4 8h13l-3-3M20 16H7l3 3"/>';
I.colunas = '<path d="M4 5h16v14H4zM9.5 5v14M14.5 5v14"/>';
I.usuarios = '<path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M2.5 20c.5-3.4 3.2-5.5 6.5-5.5s6 2.1 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.6c2 .7 3.3 2.6 3.5 5.4"/>';
const CFG = window.GESTIUS || {};
const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnon, { auth: { persistSession: true, autoRefreshToken: true } });

function toast(msg, tipo = '') {
  const t = document.createElement('div'); t.className = 'toast ' + tipo; t.textContent = msg;
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), tipo === 'erro' ? 7000 : 3500);
}
const tenta = (fn) => async (...a) => { try { return await fn(...a); } catch (e) { toast(traduz(e), 'erro'); } };
function traduz(e) {
  const m = (e && (e.message || e.error_description)) || String(e);
  if (/Invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.';
  if (/Email not confirmed/i.test(m)) return 'Confirme o seu e-mail pelo link que enviamos antes de entrar.';
  if (/already registered|already been registered/i.test(m)) return 'Este e-mail já tem conta. Use "Entrar" ou "Esqueci a senha".';
  if (/Password should be at least|weak password|password.*(characters|contain)/i.test(m)) return 'Senha fraca: use pelo menos 8 caracteres, com letras e números.';
  if (/same.*password|different from the old/i.test(m)) return 'A nova senha precisa ser diferente da atual.';
  if (/JWT expired|invalid JWT|session.*missing/i.test(m)) return 'A sua sessão expirou. Entre de novo.';
  if (/row-level security|permission denied/i.test(m)) return 'Você não tem permissão para isso. Fale com o administrador do site.';
  if (/rate limit/i.test(m)) return 'Muitas tentativas. Aguarde alguns minutos.';
  if (/Failed to fetch|NetworkError/i.test(m)) return 'Sem conexão com o servidor. Confira a internet.';
  return m;
}
const ok = (r) => { if (r.error) throw r.error; return r.data; };

const S = {
  user: null, membros: [], esc: guardado('esc', null), papel: null, superu: false,
  aba: guardado('abaWeb', 'notas'), empresas: [], empresaSel: guardado('empresaSelWeb', 'todas'), escInfo: null,
  notas: null, ordN: guardado('ordN', { c: 'dh_proc', d: -1 }),
  fN: { ...guardado('fNWeb', { tipo: 'emitida', data: 'geracao', sit: '', ret: '', regime: '', q: '' }), per: 'mes_passado', ini: '', fim: '' },
  fE: { ...guardado('fEWeb', { q: '' }), per: 'mes_passado', ini: '', fim: '' }, eventos: null,
};
const PERIODOS = { este_mes: 'Este mês', mes_passado: 'Mês passado', este_e_passado: 'Este mês e o passado', ult3: 'Últimos 3 meses', este_ano: 'Este ano', ano_passado: 'Ano passado', livre: 'Personalizado' };
function periodo(p) {
  const h = new Date(), y = h.getFullYear(), m = h.getMonth(), r = (a, b) => [iso(a), iso(b)];
  return { este_mes: r(new Date(y, m, 1), new Date(y, m + 1, 0)), mes_passado: r(new Date(y, m - 1, 1), new Date(y, m, 0)),
    este_e_passado: r(new Date(y, m - 1, 1), new Date(y, m + 1, 0)), ult3: r(new Date(y, m - 2, 1), new Date(y, m + 1, 0)),
    este_ano: r(new Date(y, 0, 1), new Date(y, 11, 31)), ano_passado: r(new Date(y - 1, 0, 1), new Date(y - 1, 11, 31)) }[p] || null;
}
const aplicaPeriodo = (f) => { const p = periodo(f.per); if (p) [f.ini, f.fim] = p; };
const opcoes = (obj, sel) => Object.entries(obj).map(([v, t]) => `<option value="${esc(v)}" ${String(v) === String(sel) ? 'selected' : ''}>${esc(t)}</option>`).join('');
const ACOES = {};
document.addEventListener('click', (ev) => { const el = ev.target.closest('[data-act]'); if (el && !el.disabled && ACOES[el.dataset.act]) { ev.preventDefault(); tenta(ACOES[el.dataset.act])(el, ev); } });

// ---------------- conector (programa no computador com os certificados) ----------------
const CONECTOR = 'http://127.0.0.1:37420';
const LINK_INSTALADOR = 'conector/Instalar-Conector-Gestius.cmd';
async function recarregarEscritorio() {
  const { data } = await sb.from('escritorios').select('id,nome,ativo,pc_visto_em,pc_versao,pc_host').eq('id', S.esc).maybeSingle();
  if (data) { S.escInfo = data; const i = S.escritorios.findIndex((e) => e.id === data.id); if (i >= 0) S.escritorios[i] = data; }
}
async function detectarConector() {
  try { const r = await fetch(CONECTOR + '/ponte/status', { signal: AbortSignal.timeout(2500) }); S.conector = r.ok ? await r.json() : null; }
  catch { S.conector = null; }
  await recarregarEscritorio().catch(() => {});
  statusPc();
  return S.conector;
}
const conectorAqui = () => !!(S.conector && S.conector.conectado && S.conector.escritorio_id === S.esc);
async function chamarConector(caminho, opcoes = {}) {
  const r = await fetch(CONECTOR + caminho, { ...opcoes, signal: AbortSignal.timeout(opcoes.tempo || 120000) });
  if (!r.ok) { let j = null; try { j = await r.json(); } catch {} throw new Error((j && j.erro) || `Conector respondeu ${r.status}`); }
  return r;
}
ACOES.conectarPc = () => {
  const d = dialogo({ titulo: 'Conectar este computador', tamanho: 'sm',
    corpo: `<p style="margin:0 0 12px">O conector deste computador vai baixar as notas com os certificados instalados aqui e enviar para o escritório <b>${esc(S.escInfo?.nome || '')}</b>.</p>
      <div class="form" style="grid-template-columns:90px 1fr"><label>E-mail</label><input id="cxEmail" value="${esc(S.user.email)}" readonly>
      <label>Senha</label><input id="cxSenha" type="password" autocomplete="current-password"></div>
      <p class="dica">Confirme a sua senha do site. Ela vai só para o conector deste computador, que abre a sessão dele e não a guarda.</p>`,
    rodape: '<button class="btn" data-fechar>Cancelar</button><button class="btn pri" data-ok>Conectar</button>' });
  $('#cxSenha', d.el).focus();
  const ir = tenta(async () => {
    const r = await chamarConector('/ponte/conectar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: S.user.email, senha: $('#cxSenha', d.el).value }) });
    const st = await r.json();
    if (st.escritorio_id && st.escritorio_id !== S.esc) toast(`Conectado ao escritório ${st.escritorio}.`, 'ok'); else toast('Computador conectado! Os certificados aparecem em instantes.', 'ok');
    d.fechar(); await detectarConector(); irPara(S.aba);
    setTimeout(async () => { await detectarConector(); await carregarEmpresas(); irPara(S.aba); }, 5000);
  });
  $('[data-ok]', d.el).onclick = ir; $('#cxSenha', d.el).onkeydown = (e) => { if (e.key === 'Enter') ir(); };
};
// pede ao conector do escritório (que pode estar em outro computador) e espera o resultado
// versão do conector que este site precisa (pasta, Zip, DANFSe em lote, atualização automática)
const CONECTOR_MIN = '3.6.0';
const versaoMaior = (a, b) => { const x = String(a || '0').split('.').map(Number), y = String(b || '0').split('.').map(Number); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };
const conectorDesatualizado = (v) => !!v && versaoMaior(CONECTOR_MIN, v);
const versaoConector = () => (conectorAqui() ? S.conector?.versao : S.cfgConector?.versao) || '';
function exigirConectorNovo() {
  const v = versaoConector();
  if (!v || conectorDesatualizado(v)) throw new Error(`O conector do escritório está desatualizado${v ? ` (versão ${v})` : ''}. No computador dos certificados, abra este site e clique em "Atualizar o conector" (aba Empresas). Depois disso ele se atualiza sozinho.`);
}
async function comando(tipo, dados = {}, msgEspera = 'Enviando ao conector…') {
  const c = ok(await sb.from('comandos').insert({ escritorio_id: S.esc, tipo, dados, criado_por: S.user.id }).select('id').single());
  if (conectorAqui()) chamarConector('/ponte/acordar', { method: 'POST', tempo: 5000 }).catch(() => {});
  toast(msgEspera);
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2500));
    const x = ok(await sb.from('comandos').select('status,resultado').eq('id', c.id).single());
    if (x.status === 'ok') return x.resultado || {};
    if (x.status === 'erro') { const m = (x.resultado && x.resultado.erro) || 'O conector não conseguiu executar.'; throw new Error(/desconhecido/i.test(m) ? 'O conector do escritório está desatualizado: atualize-o pela aba Empresas, no computador dos certificados.' : m); }
  }
  throw new Error('O conector não respondeu. Confira se o computador com os certificados está ligado.');
}
async function baixarDoConector(n, tipo) {
  const { data: { session } } = await sb.auth.getSession();
  const r = await chamarConector(`/ponte/arquivo?doc=${n.empresa_doc}&chave=${n.chave}&tipo=${tipo}`, { headers: { Authorization: 'Bearer ' + session.access_token } });
  const blob = await r.blob(), url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; if (tipo === 'pdf') a.target = '_blank'; else a.download = n.chave + '.xml';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ---------------- login / cadastro ----------------
const fmtTel = (t) => { t = so(t).slice(0, 11); if (t.length <= 2) return t ? `(${t}` : '';
  return t.length <= 6 ? `(${t.slice(0, 2)}) ${t.slice(2)}` : t.length <= 10 ? `(${t.slice(0, 2)}) ${t.slice(2, 6)}-${t.slice(6)}` : `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}`; };
const telOk = (t) => /^\d{10,11}$/.test(so(t)) && Number(so(t).slice(0, 2)) >= 11;
const senhaFraca = (s) => (s.length < 8 ? 'A senha precisa de pelo menos 8 caracteres.' : !/[A-Za-z]/.test(s) || !/\d/.test(s) ? 'Use letras e números na senha.' : '');
const linkWhats = (tel, txt = '') => `https://wa.me/55${so(tel)}${txt ? '?text=' + encodeURIComponent(txt) : ''}`;
// link de convite: #convite=<código secreto>&e=<e-mail>
const conviteLink = () => null; // convites foram retirados: cada cadastro cria o próprio escritório
const limparHash = () => history.replaceState(null, '', location.pathname);
function campoSenha(nome, rotulo, auto) {
  return `<label>${rotulo}<span class="senha-campo"><input name="${nome}" type="password" required minlength="${auto === 'current-password' ? 6 : 8}" autocomplete="${auto}"><button type="button" class="olho" tabindex="-1" title="Mostrar a senha">${ico('olho')}</button></span></label>`;
}
function telaLogin(modo = 'login', aviso = '') {
  const cl = conviteLink(), convite = cl?.email || '';
  if (cl && modo === 'login' && !aviso) modo = 'convidado';
  if (modo === 'convidado' && !cl) modo = 'cadastro';
  const cad = modo === 'cadastro' || modo === 'convidado', conv = modo === 'convidado', rec = modo === 'recuperar', nova = modo === 'novasenha';
  $('#app').innerHTML = `<div class="login"><form class="caixa" id="fLogin" novalidate>
    <div class="wm"><b>GESTIUS</b><span>NFS-E</span></div>
    <h1>${conv ? 'Entrar no escritório' : cad ? 'Criar conta grátis' : rec ? 'Recuperar a senha' : nova ? 'Nova senha' : 'Entrar'}</h1>
    <p>${conv ? (cl ? 'Você recebeu um convite. Crie a sua senha para acessar as notas do escritório.' : 'Crie a sua conta. O administrador do site inclui você no escritório (ou use o link de convite que recebeu).')
      : cad ? 'As NFS-e de todas as suas empresas, baixadas do Ambiente Nacional, num só lugar.' : rec ? 'Enviaremos um link para o seu e-mail.' : nova ? 'Escolha a nova senha.' : 'Notas fiscais de serviço de todas as suas empresas, num só lugar.'}</p>
    ${aviso ? `<div class="faixa ok-faixa" style="margin-bottom:12px">${esc(aviso)}</div>` : ''}
    ${cad && !conv ? '<label>Nome do escritório ou da empresa<input name="escritorio" required maxlength="120" autocomplete="organization"></label>' : ''}
    ${cad ? `<label>Seu nome completo<input name="nome" required maxlength="120" autocomplete="name"></label>
      <label>Telefone com DDD (WhatsApp)<input name="telefone" required inputmode="tel" autocomplete="tel-national" placeholder="(79) 99999-9999" maxlength="15"></label>` : ''}
    ${nova ? '' : `<label>E-mail<input name="email" type="email" required autocomplete="email" maxlength="160" value="${esc(conv && convite ? convite : '')}"></label>${conv && cl ? '<p class="dica" style="margin:-6px 0 12px">Já tem conta? <a data-ir="login" style="cursor:pointer;font-weight:600">Entre</a> com este e-mail para aceitar o convite.</p>' : ''}`}
    ${rec ? '' : campoSenha('senha', cad || nova ? 'Crie uma senha' : 'Senha', cad || nova ? 'new-password' : 'current-password')}
    ${cad || nova ? `<div class="forca" id="forca"><i></i><span>Mínimo de 8 caracteres, com letras e números.</span></div>${campoSenha('senha2', 'Repita a senha', 'new-password')}` : ''}
    ${cad ? `<label class="termos"><input type="checkbox" name="aceite" required style="margin-top:2px"><span>Li e aceito: o serviço é gratuito e oferecido "como está"; os dados de visualização das notas ficam guardados no site para o meu escritório; os certificados, XML e PDF ficam no computador do escritório; confiro os valores antes de usá-los em obrigações fiscais.</span></label>` : ''}
    <div class="erro-txt" id="loginErro" style="min-height:18px;margin:-4px 0 8px"></div>
    <button class="btn ${cad ? 'ouro' : 'pri'}" type="submit">${conv ? 'Criar conta e entrar no escritório' : cad ? 'Criar conta grátis' : rec ? 'Enviar link' : nova ? 'Salvar senha' : 'Entrar'}</button>
    <div class="troca">${cad ? 'Já tem conta? <a data-ir="login">Entrar</a>' : rec || nova ? '<a data-ir="login">Voltar</a>' : 'Ainda não tem conta? <a data-ir="cadastro">Criar conta grátis</a><br><a data-ir="recuperar" style="font-weight:400">Esqueci a senha</a>'}</div>
    <div class="assin">DECISÕES SEGURAS, GESTÃO INTELIGENTE.</div>
  </form></div>`;
  const f = $('#fLogin');
  [...f.querySelectorAll('input')].find((i) => !i.value && i.type !== 'checkbox')?.focus();
  $$('[data-ir]', f).forEach((x) => (x.onclick = () => { if (!['convidado', 'login'].includes(x.dataset.ir) && conviteLink()) limparHash(); telaLogin(x.dataset.ir, x.dataset.ir === 'login' && conviteLink() ? 'Entre com a sua conta para aceitar o convite.' : ''); }));
  $$('.olho', f).forEach((b) => (b.onclick = () => { const i = b.previousElementSibling; i.type = i.type === 'password' ? 'text' : 'password'; b.classList.toggle('on', i.type === 'text'); }));
  const tel = f.elements.telefone; if (tel) tel.oninput = () => { tel.value = fmtTel(tel.value); };
  const s1 = f.elements.senha, fz = $('#forca', f);
  if (fz && s1) s1.oninput = () => { const v = s1.value, n = (v.length >= 8) + /[a-z]/.test(v) + /[A-Z]/.test(v) + /\d/.test(v) + /[^A-Za-z0-9]/.test(v) + (v.length >= 12);
    fz.dataset.n = v ? Math.min(3, Math.max(1, Math.floor(n / 2))) : 0; $('span', fz).textContent = !v ? 'Mínimo de 8 caracteres, com letras e números.' : senhaFraca(v) || ['', 'Senha razoável', 'Senha boa', 'Senha forte'][fz.dataset.n]; };
  f.addEventListener('input', () => { const e = $('#loginErro'); if (e) e.textContent = ''; });
  f.onsubmit = async (ev) => {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(f)), erro = (m, campo) => { $('#loginErro').textContent = m; if (campo && f.elements[campo]) f.elements[campo].focus(); };
    if (cad && !conv && String(d.escritorio || '').trim().length < 2) return erro('Informe o nome do escritório.', 'escritorio');
    if (cad && String(d.nome || '').trim().split(/\s+/).length < 2) return erro('Informe o nome e o sobrenome.', 'nome');
    if (cad && !telOk(d.telefone)) return erro('Telefone inválido: informe o DDD e o número.', 'telefone');
    if (!nova && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(String(d.email || '').trim())) return erro('E-mail inválido.', 'email');
    if ((cad || nova) && senhaFraca(d.senha)) return erro(senhaFraca(d.senha), 'senha');
    if ((cad || nova) && d.senha !== d.senha2) return erro('As senhas não conferem.', 'senha2');
    if (!rec && !d.senha) return erro('Informe a senha.', 'senha');
    if (cad && !d.aceite) return erro('Marque que leu e aceita os termos.', 'aceite');
    const bt = $('button[type=submit]', f); bt.disabled = true; const txt = bt.textContent; bt.textContent = 'Aguarde…';
    try {
      const email = String(d.email || '').trim().toLowerCase();
      if (cad) {
        const meta = { nome: d.nome.trim(), telefone: so(d.telefone), ...(conv ? { convidado: 'true', ...(cl ? { convite: cl.token } : {}) } : { escritorio: d.escritorio.trim() }) };
        const r = ok(await sb.auth.signUp({ email, password: d.senha, options: { data: meta, emailRedirectTo: location.origin + location.pathname } }));
        if (r.user && Array.isArray(r.user.identities) && !r.user.identities.length) throw new Error('Este e-mail já tem conta. Use "Entrar" ou "Esqueci a senha".');
        limparHash();
        if (!r.session) return telaLogin('login', `Quase lá! Enviamos um link para ${email}. Abra o e-mail, clique no link para confirmar e depois entre aqui. Confira também a caixa de spam.`);
      } else if (rec) {
        ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname }));
        return telaLogin('login', 'Se o e-mail tiver conta, enviamos o link para criar uma nova senha.');
      } else if (nova) {
        ok(await sb.auth.updateUser({ password: d.senha }));
        toast('Senha alterada.', 'ok');
      } else ok(await sb.auth.signInWithPassword({ email, password: d.senha }));
      await sb.rpc('registrar_acesso', { p_navegador: navigator.userAgent });
      iniciar();
    } catch (e) { erro(traduz(e)); bt.disabled = false; bt.textContent = txt; }
  };
}

// sem escritório: aguardando convite (ou cria o próprio)
async function telaSemEscritorio() {
  $('#app').innerHTML = `<div class="login"><div class="caixa"><div class="wm"><b>GESTIUS</b><span>NFS-E</span></div>
    <h1>Sem escritório</h1><p>A sua conta está pronta, mas ainda não está em nenhum escritório (ou o escritório está suspenso).</p>
    <p>Crie o seu escritório para começar, ou peça ao administrador do site para incluir <b>${esc(S.user.email)}</b> num escritório.</p>
    <details open style="margin-top:6px"><summary class="dica" style="cursor:pointer">Criar o meu escritório</summary>
      <div class="linha" style="margin-top:8px"><input id="novoEsc" placeholder="Nome do escritório" maxlength="120" style="flex:1"><button class="btn ouro" id="criarEsc">Criar</button></div></details>
    <button class="btn" style="width:100%;margin-top:14px" data-act="sair">Sair</button></div></div>`;
  $('#criarEsc').onclick = tenta(async () => { S.esc = ok(await sb.rpc('criar_escritorio', { p_nome: $('#novoEsc').value })); guardar('esc', S.esc); iniciar(); });
}

// ---------------- início ----------------
async function iniciar() {
  if (!CFG.supabaseUrl || /COLE_AQUI/.test(CFG.supabaseUrl)) { $('#app').innerHTML = '<div class="vazio">Site ainda não configurado: preencha o arquivo config.js.</div>'; return; }
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return telaLogin();
  S.user = session.user;
  const cl = conviteLink();
  if (cl) {
    limparHash();
    const r = await sb.rpc('aceitar_convite', { p_token: cl.token });
    if (r.error) toast(traduz(r.error), 'erro'); else { S.esc = r.data; guardar('esc', S.esc); toast('Convite aceito! Bem-vindo ao escritório.', 'ok'); }
  }
  S.membros = ok(await sb.from('membros').select('escritorio_id,papel,nome,email,telefone').eq('user_id', S.user.id));
  S.superu = !!ok(await sb.rpc('eh_super'));
  const escs = S.membros.length ? ok(await sb.from('escritorios').select('id,nome,ativo,pc_visto_em,pc_versao,pc_host').in('id', S.membros.map((m) => m.escritorio_id))) : [];
  S.escritorios = escs.filter((e) => e.ativo);
  if (!S.escritorios.length) return telaSemEscritorio();
  if (!S.escritorios.some((e) => e.id === S.esc)) S.esc = S.escritorios[0].id;
  guardar('esc', S.esc);
  S.escInfo = S.escritorios.find((e) => e.id === S.esc);
  S.papel = S.membros.find((m) => m.escritorio_id === S.esc)?.papel;
  montarShell();
  await carregarEmpresas();
  irPara(S.aba);
  detectarConector().then(() => {
    if (location.hash === '#conectar' && S.conector && !conectorAqui() && podeOperar()) { history.replaceState(null, '', location.pathname); ACOES.conectarPc(); }
  });
  clearInterval(S.tmCon); S.tmCon = setInterval(() => { detectarConector(); contarAlteracoesNovas().catch(() => {}); }, 60000);
  contarAlteracoesNovas().catch(() => {});
}
sb.auth.onAuthStateChange((ev) => { if (ev === 'PASSWORD_RECOVERY') telaLogin('novasenha'); if (ev === 'SIGNED_OUT') telaLogin(); });

const abas = () => [['empresas', 'Empresas'], ['notas', 'Emitidas / Recebidas'], ['eventos', 'Eventos'], ['conferir', 'Conferir'], ['alteracoes', 'Alterações'], ['usuarios', 'Usuários'], ['apoie', 'Apoie'],
  ...(S.superu ? [['admin', 'Administração']] : [])];
function montarShell() {
  const nome = S.membros.find((m) => m.escritorio_id === S.esc)?.nome || S.user.email;
  const ini = nome.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  $('#app').innerHTML = `<div class="shell">
    <header class="toolbar">
      <div class="marca"><b>GESTIUS</b><span>NFS-E</span></div>
      ${abas().map(([k, t]) => `<button class="tab" data-aba="${k}">${ico(k === 'usuarios' ? 'usuarios' : k)}<span>${t}</span></button>`).join('')}
      <div class="sp"></div>
      <div class="tools">
        ${S.escritorios.length > 1 ? `<select class="selemp" id="selEsc" style="min-width:200px">${S.escritorios.map((e) => `<option value="${e.id}" ${e.id === S.esc ? 'selected' : ''}>${esc(e.nome)}</option>`).join('')}</select>` : ''}
        <select class="selemp" id="selEmp"></select>
        <button class="usuario" data-act="menuUsuario" title="${esc(nome)}"><span class="avatar">${esc(ini)}</span></button>
      </div>
    </header>
    <main class="main" id="main"></main>
    <footer class="status"><span id="stEsq"></span><span id="stPc"></span><span class="sp"></span><button class="linkbtn" data-act="historico">${ico('relogio')}<span>Histórico</span></button></footer>
  </div>`;
  $$('.tab').forEach((b) => (b.onclick = () => irPara(b.dataset.aba)));
  $('#selEmp').onchange = (e) => { S.empresaSel = e.target.value; guardar('empresaSelWeb', S.empresaSel); if (S.aba !== 'empresas') irPara(S.aba); };
  $('#selEsc')?.addEventListener('change', (e) => { S.esc = e.target.value; guardar('esc', S.esc); S.empresaSel = 'todas'; iniciar(); });
  statusPc();
}
function statusPc() {
  const e = S.escInfo, el = $('#stPc');
  if (!el) return;
  const min = e?.pc_visto_em ? Math.round((Date.now() - new Date(e.pc_visto_em)) / 60000) : null;
  const on = min !== null && min <= 30;
  el.innerHTML = `<span class="agente-st ${on ? 'on' : 'off'}" title="${e?.pc_host ? 'Computador: ' + esc(e.pc_host) : ''}"><i></i>${min === null ? 'Conector ainda não instalado' : on ? 'Conector do escritório ativo' : 'Conector sem enviar há ' + (min < 120 ? min + ' min' : Math.round(min / 60) + ' h')}</span>`
    + (conectorAqui() ? ' <span class="pill ok">este computador é o conector</span>' : S.conector && podeOperar() ? ' <button class="btn" style="height:24px" data-act="conectarPc">Conectar este computador</button>' : '');
}
async function carregarEmpresas() {
  S.empresas = ok(await sb.from('empresas').select('*').eq('escritorio_id', S.esc).order('nome'));
  carregarCfgConector().catch(() => {});
  const sel = $('#selEmp');
  if (S.empresaSel !== 'todas' && !S.empresas.some((e) => e.doc === S.empresaSel)) S.empresaSel = 'todas';
  sel.innerHTML = '<option value="todas">Todas as empresas</option>' + S.empresas.map((e) => `<option value="${e.doc}" ${e.doc === S.empresaSel ? 'selected' : ''}>${esc(e.nome)} — ${fmtDoc(e.doc)}</option>`).join('');
  $('#stEsq').textContent = `${S.escInfo?.nome || ''} · ${S.empresas.length} empresa(s).`;
}
function irPara(aba) {
  if (!abas().some(([k]) => k === aba)) aba = 'notas';
  S.aba = aba; guardar('abaWeb', aba);
  $$('.tab').forEach((b) => b.classList.toggle('on', b.dataset.aba === aba));
  tenta({ empresas: vEmpresas, notas: vNotas, eventos: vEventos, conferir: vConferir, alteracoes: vAlteracoes, usuarios: vUsuarios, apoie: vApoie, admin: vAdmin }[aba])();
}
const podeOperar = () => !!S.esc; // todas as pessoas do escritório operam (empresas, conector, sincronização); gestão de pessoas é só do administrador do site

// ---------------- empresas ----------------
function vEmpresas() {
  const semPc = !S.escInfo?.pc_visto_em && !conectorAqui();
  $('#main').innerHTML = `${semPc && podeOperar() ? `<div class="faixa" style="display:block;line-height:1.7">
      <b>Falta instalar o conector</b> no computador do escritório que tem os certificados digitais (uma vez só):<br>
      1. Nesse computador, abra este site e clique em <a class="btn ouro" style="height:26px;margin:0 4px" href="${LINK_INSTALADOR}" download>Baixar o instalador</a><br>
      2. Abra o arquivo baixado. Se o Windows avisar, clique em <b>Mais informações → Executar assim mesmo</b>.<br>
      3. Volte ao site e clique em <b>Conectar este computador</b> (no rodapé). Se o navegador pedir acesso à rede local, clique em <b>Permitir</b>.</div>`
      : semPc ? '<div class="faixa">O conector ainda não foi instalado no computador do escritório que tem os certificados.</div>'
      : conectorDesatualizado(versaoConector()) ? `<div class="faixa" style="display:block;line-height:1.7"><b>O conector ${conectorAqui() ? 'deste computador' : 'do escritório'} está desatualizado (versão ${esc(versaoConector())}).</b> Pasta dos XML, Preferências, Zip e DANFSe em lote precisam da versão ${CONECTOR_MIN}.<br>
          ${conectorAqui() ? `Clique em <a class="btn ouro" style="height:26px;margin:0 4px" href="${LINK_INSTALADOR}" download>Atualizar o conector</a>, abra o arquivo baixado e depois clique em <b>Conectar este computador</b>. É a última vez: a partir dessa versão ele se atualiza sozinho.` : 'No computador que tem os certificados, abra este site e clique em "Atualizar o conector".'}</div>` : ''}
    ${!semPc ? `<div class="filtros">${podeOperar() ? `<button class="btn pri" data-act="cadastrarCerts">${ico('certs')} Cadastrar pelos certificados</button>` : ''}
      <button class="btn" data-act="syncTodas">${ico('sync')} Sincronizar agora</button><button class="btn" data-act="prefsConector">${ico('pasta')} Preferências</button>
      ${conectorAqui() ? `<button class="btn" data-act="abrirPasta">${ico('pasta')} Abrir pasta dos XML</button>` : ''}<span class="dica">Os pedidos vão para o conector do escritório e levam alguns segundos.</span></div>` : ''}
    <div class="grade" id="gEmp">${S.empresas.length ? `<table><thead><tr><th style="width:44%">Empresa</th><th class="cen">Validade do certificado</th><th class="num">Notas</th><th>Última sincronização</th>${podeOperar() && (S.escInfo?.pc_visto_em || conectorAqui()) ? '<th style="width:130px"></th>' : ''}</tr></thead><tbody>
    ${S.empresas.map((e) => { const d = e.cert_validade ? diasAte(e.cert_validade) : null;
      const st = e.ult_status === 'erro' ? 'erro' : e.ult_status === 'aviso' ? 'aviso' : 'ok';
      return `<tr class="${e.ativo ? '' : 'inativo'}" data-doc="${e.doc}"><td><span style="display:inline-block;min-width:150px">${fmtDoc(e.doc)}</span>${esc(e.nome)}</td>
      <td class="cen">${d === null ? '—' : d < 0 ? `<span class="pill vencido">${fmtD(e.cert_validade)} · vencido</span>` : d <= 30 ? `<span class="pill vence">${fmtD(e.cert_validade)} · ${d} dia(s)</span>` : fmtD(e.cert_validade)}</td>
      <td class="num">${(e.qtd_notas || 0).toLocaleString('pt-BR')}</td>
      <td>${e.ult_sync ? `<span class="sinc ${st}" title="${esc(e.ult_msg || '')}">${ico(st, 'ico')} ${fmtDH(e.ult_sync)}${st === 'erro' ? ` <span class="erro-txt">${esc((e.ult_msg || '').slice(0, 70))}</span>` : ''}</span>` : '<span class="dica">nunca</span>'}</td></tr>`; }).join('')}
    </tbody></table>` : '<div class="vazio">Nenhuma empresa publicada ainda.</div>'}</div>`;
  $$('#gEmp tbody tr').forEach((tr) => (tr.oncontextmenu = (ev) => menuEmpresa(ev, S.empresas.find((x) => x.doc === tr.dataset.doc))));
  $$('#gEmp tbody tr').forEach((tr) => (tr.ondblclick = () => { S.empresaSel = tr.dataset.doc; guardar('empresaSelWeb', S.empresaSel); carregarEmpresas(); irPara('notas'); }));
  if (podeOperar() && !semPc) $$('#gEmp tbody tr').forEach((tr) => {
    const e = S.empresas.find((x) => x.doc === tr.dataset.doc);
    tr.insertAdjacentHTML('beforeend', `<td><div class="acoes"><button data-sy="${e.doc}" title="Sincronizar esta empresa">${ico('sync')}</button>${conectorAqui() ? `<button data-pa="${e.doc}" title="Abrir a pasta desta empresa">${ico('pasta')}</button>` : ''}
      <button data-at="${e.doc}" title="${e.ativo ? 'Desativar' : 'Ativar'}">${ico(e.ativo ? 'erro' : 'ok')}</button><button data-ex="${e.doc}" title="Excluir">${ico('lixo')}</button></div></td>`);
  });
  $$('[data-sy]').forEach((b) => (b.onclick = tenta(async () => { const r = await comando('sync', { docs: [b.dataset.sy] }, 'Pedindo a sincronização…'); toast(r.enfileiradas ? 'Sincronizando. As notas novas aparecem em instantes.' : 'Já estava sincronizando.', 'ok'); atualizarDepois(); })));
  $$('[data-pa]').forEach((b) => (b.onclick = tenta(() => abrirPastaConector(b.dataset.pa))));
  $$('[data-at]').forEach((b) => (b.onclick = tenta(async () => { const e = S.empresas.find((x) => x.doc === b.dataset.at); await comando('ativar_empresa', { doc: e.doc, ativo: !e.ativo }); toast(e.ativo ? 'Empresa desativada.' : 'Empresa ativada.', 'ok'); atualizarDepois(3000); })));
  $$('[data-ex]').forEach((b) => (b.onclick = () => { const e = S.empresas.find((x) => x.doc === b.dataset.ex);
    confirmar(`Excluir ${e.nome}?`, 'A empresa e as notas dela saem do site e do conector. Os XML já gravados no computador continuam na pasta.', 'Excluir',
      tenta(async () => { await comando('excluir_empresa', { doc: e.doc }); toast('Empresa excluída.', 'ok'); atualizarDepois(3000); })); }));
}
function atualizarDepois(ms = 8000) { setTimeout(async () => { await carregarEmpresas(); if (S.aba === 'empresas') vEmpresas(); }, ms); }
ACOES.syncTodas = async () => { const r = await comando('sync', {}, 'Pedindo a sincronização…'); toast(`Sincronizando ${r.enfileiradas || 0} empresa(s).`, 'ok'); atualizarDepois(); };
// ---------- pasta dos XML e preferências do conector ----------
async function abrirPastaConector(doc) {
  exigirConectorNovo();
  const { data: { session } } = await sb.auth.getSession();
  const r = await chamarConector('/ponte/abrir' + (doc ? `?doc=${doc}` : ''), { method: 'POST', headers: { Authorization: 'Bearer ' + session.access_token }, tempo: 10000 });
  const j = await r.json(); toast(`Pasta aberta: ${j.pasta}`, 'ok');
}
ACOES.abrirPasta = () => abrirPastaConector('');
const SUBPASTAS = { 'empresa/ano/mes/tipo': 'Empresa / AAAA / MM / Tipo', 'empresa/tipo/ano/mes': 'Empresa / Tipo / AAAA / MM', 'empresa/ano/mes': 'Empresa / AAAA / MM', 'empresa/tipo': 'Empresa / Tipo' };
const FREQ = { 0: 'Só quando pedir', 30: 'A cada 30 minutos', 60: 'A cada 1 hora', 120: 'A cada 2 horas', 240: 'A cada 4 horas', diario: 'Uma vez por dia' };
async function carregarCfgConector() {
  const { data } = await sb.from('conector_config').select('cfg,atualizado_em').eq('escritorio_id', S.esc).maybeSingle();
  S.cfgConector = data ? { ...data.cfg, atualizado_em: data.atualizado_em } : null;
  return S.cfgConector;
}
// Preferências (mesma organização do programa do PC: Arquivos XML · Download · Conector)
ACOES.prefsConector = async (secao) => {
  if (!['xml', 'download', 'conector'].includes(secao)) secao = 'xml';
  const c = await carregarCfgConector();
  if (!c && !conectorAqui()) throw new Error('O conector ainda não enviou as preferências. Ele envia ao conectar; se o conector for antigo, atualize-o pela aba Empresas no computador dos certificados.');
  if (!c || conectorDesatualizado(c.versao)) exigirConectorNovo();
  const d = dialogo({ titulo: 'Preferências', tamanho: 'lg', corpo: `<div class="prefs">
    <nav>${[['xml', 'Arquivos XML'], ['download', 'Download'], ['conector', 'Conector']].map(([k, t]) => `<button data-sec="${k}" class="${secao === k ? 'on' : ''}">${t}</button>`).join('')}</nav>
    <div class="prefs-corpo">
      <section data-s="xml"><div class="secao" style="margin-top:0">Arquivos XML</div>
        <div class="form" style="grid-template-columns:120px 1fr"><label>Pasta geral</label><input id="pcPasta" value="${esc(c.pasta_xml || '')}" placeholder="C:\\Gestius NFS-e\\XML">
          <span></span><p class="dica" style="margin:0">Cada empresa ganha uma pasta dentro desta, com o nome do cadastro dela. A pasta fica no computador do conector${c.host ? ` (${esc(c.host)})` : ''}.</p></div>
        <div class="secao">Organização</div>
        <div class="form" style="grid-template-columns:120px 1fr 1fr"><label>Subpastas</label><select id="pcSub" style="grid-column:span 2">${opcoes(SUBPASTAS, c.subpastas)}</select>
          <label>Emitidas</label><input id="pcEm" value="${esc(c.pasta_emitidas || 'Emitidas')}" maxlength="60"><span class="dica">Chave de acesso</span>
          <label>Recebidas</label><input id="pcRe" value="${esc(c.pasta_recebidas || 'Recebidas')}" maxlength="60"><span class="dica">Chave de acesso</span>
          <label>Eventos</label><input id="pcEv" value="${esc(c.pasta_eventos || 'Eventos')}" maxlength="60"><span class="dica">Chave do evento</span>
          <label>Ano/mês pela</label><div style="grid-column:span 2" class="linha"><label class="chk"><input type="radio" name="pcAm" value="competencia" ${c.anomes_pela !== 'geracao' ? 'checked' : ''}> Data de competência</label>
            <label class="chk"><input type="radio" name="pcAm" value="geracao" ${c.anomes_pela === 'geracao' ? 'checked' : ''}> Data de geração</label><span class="dica">Eventos: pela data do evento</span></div>
          <label>Exemplo</label><pre class="mono exemplo" id="pcEx" style="grid-column:span 2"></pre></div>
        <div class="secao">PDF (DANFSe)</div>
        <label class="chk"><input type="checkbox" id="pcPdf" ${c.gravar_pdf === '1' ? 'checked' : ''}> Gravar também o PDF ao lado de cada XML de nota</label>
        <p class="dica">Vale para as notas baixadas daqui em diante. Para as que já estão na pasta: aba Conector → "Regravar arquivos". O PDF ocupa mais espaço que o XML.</p></section>
      <section data-s="download" hidden><div class="secao" style="margin-top:0">Baixar sozinho</div>
        <div class="form" style="grid-template-columns:120px 220px"><label>Frequência</label><select id="pcFreq">${opcoes(FREQ, c.frequencia)}</select>
          <label>Horário</label><input id="pcHora" type="time" value="${esc(c.horario || '18:00')}"></div>
        <p class="dica">O conector baixa as notas de todas as empresas ativas sozinho, com o computador ligado. Com o computador desligado no horário, ele baixa assim que for ligado. "Sincronizar agora" (aba Empresas) baixa na hora, a qualquer momento.</p>
        <p class="dica">Se outro sistema também consulta o Ambiente Nacional com o mesmo certificado, escolha um intervalo maior: os dois juntos podem passar do limite de acessos.</p></section>
      <section data-s="conector" hidden><div class="secao" style="margin-top:0">Conector do escritório</div>
        <div class="form" style="grid-template-columns:150px 1fr"><label>Computador</label><b>${esc(c.host || '—')}</b><label>Versão</label><span>${esc(c.versao || '—')} <span class="dica">(o site precisa da ${CONECTOR_MIN} ou mais nova)</span></span>
          <label>Atualizado em</label><span>${fmtDH(c.atualizado_em)}</span></div>
        <p class="dica">O conector confere sozinho, a cada 6 horas, se há versão nova e se atualiza sem precisar de nada.</p>
        <div class="linha" style="flex-wrap:wrap;gap:8px"><button class="btn" data-atualizar>${ico('sync')} Procurar atualização agora</button><button class="btn" data-regravar>Regravar arquivos na pasta</button><button class="btn" data-reproc>Reprocessar notas</button></div>
        <p class="dica"><b>Regravar arquivos:</b> grava de novo os XML (e PDFs já baixados) com a pasta e a organização atuais. <b>Reprocessar:</b> relê os XML guardados e corrige os valores mostrados no site.</p></section>
    </div></div>`,
    rodape: '<button class="btn" data-fechar>Cancelar</button><button class="btn pri" data-ok>Salvar</button>' });
  const mostrar = (k) => { $$('[data-sec]', d.el).forEach((b) => b.classList.toggle('on', b.dataset.sec === k)); $$('[data-s]', d.el).forEach((x) => (x.hidden = x.dataset.s !== k)); };
  $$('[data-sec]', d.el).forEach((b) => (b.onclick = () => mostrar(b.dataset.sec))); mostrar(secao);
  const ex = () => {
    const sep = /^[a-zA-Z]:|^\\\\/.test($('#pcPasta', d.el).value) ? '\\' : '/', base = $('#pcPasta', d.el).value.replace(/[\\/]+$/, '');
    const am = $('input[name=pcAm]:checked', d.el).value === 'geracao' ? ['2026', '10'] : ['2026', '09'];
    const caminho = (tipo, ano, mes) => $('#pcSub', d.el).value.split('/').slice(1).map((x) => ({ ano, mes, tipo })[x]).join(sep);
    $('#pcEx', d.el).textContent = [`${base}${sep}EMPRESA LTDA${sep}${caminho($('#pcEm', d.el).value, ...am)}${sep}42054001…000001230.xml`,
      `${base}${sep}EMPRESA LTDA${sep}${caminho($('#pcRe', d.el).value, ...am)}${sep}42054001…000000770.xml`, `${base}${sep}EMPRESA LTDA${sep}${caminho($('#pcEv', d.el).value, '2026', '10')}${sep}42054001…101101001.xml`].join('\n');
    $('#pcHora', d.el).disabled = $('#pcFreq', d.el).value !== 'diario';
  };
  $$('input,select', d.el).forEach((i) => (i.oninput = i.onchange = ex)); ex();
  $('[data-ok]', d.el).onclick = tenta(async () => {
    const dados = { pasta_xml: $('#pcPasta', d.el).value.trim(), subpastas: $('#pcSub', d.el).value, pasta_emitidas: $('#pcEm', d.el).value, pasta_recebidas: $('#pcRe', d.el).value,
      pasta_eventos: $('#pcEv', d.el).value, anomes_pela: $('input[name=pcAm]:checked', d.el).value, gravar_pdf: $('#pcPdf', d.el).checked ? '1' : '0', frequencia: $('#pcFreq', d.el).value, horario: $('#pcHora', d.el).value };
    if (!dados.pasta_xml) throw new Error('Informe a pasta geral.');
    const r = await comando('config', dados, 'Enviando as preferências ao conector…'); d.fechar();
    toast('Preferências salvas no conector.', 'ok');
    if (r.alteradas?.some((k) => ['pasta_xml', 'subpastas', 'pasta_emitidas', 'pasta_recebidas', 'pasta_eventos', 'anomes_pela'].includes(k)) && c.pasta_xml)
      confirmar('Regravar os arquivos já baixados?', 'A pasta ou a organização mudou. Os XML já baixados continuam no lugar antigo; posso gravá-los também na nova estrutura.', 'Regravar',
        tenta(async () => { const x = await comando('regravar', {}, 'Regravando os arquivos…'); toast(`${x.arquivos || 0} arquivo(s) gravados na pasta.`, 'ok'); }));
  });
  $('[data-atualizar]', d.el).onclick = tenta(async () => { const r = await comando('atualizar', {}, 'Procurando atualização…'); toast(r.atualizado ? `Conector atualizado para a versão ${r.para}. Ele reinicia sozinho em alguns segundos.` : `O conector já está na versão mais nova (${r.versao}).`, 'ok'); });
  $('[data-regravar]', d.el).onclick = tenta(async () => { const r = await comando('regravar', {}, 'Regravando os arquivos na pasta…'); toast(`${r.arquivos || 0} arquivo(s) gravados na pasta${r.erros ? ` · ${r.erros} com erro` : ''}.`, r.erros ? 'erro' : 'ok'); });
  $('[data-reproc]', d.el).onclick = tenta(async () => { const r = await comando('reprocessar', {}, 'Relendo os XML guardados…'); toast(`${r.notas || 0} nota(s) relidas a partir do XML.`, 'ok'); });
};
ACOES.cadastrarCerts = async () => {
  const lista = ok(await sb.from('certificados').select('*').eq('escritorio_id', S.esc).order('titular'));
  const cad = new Set(S.empresas.map((e) => e.doc));
  const marcados = new Set();
  const d = dialogo({ titulo: 'Cadastrar pelos certificados do Windows', tamanho: 'lg',
    corpo: lista.length ? `<div class="linha" style="margin-bottom:10px"><input id="lBusca" placeholder="Procurar certificado" style="flex:1"><button class="btn" data-todas>Selecionar todas as válidas</button></div>
      <div class="lista-certs" id="lLista"></div><p class="dica" style="margin:8px 0 0">Certificados instalados no computador do conector. Só os dados públicos (titular, CNPJ e validade) chegam ao site.</p>`
      : '<div class="vazio">O conector ainda não enviou a lista de certificados. Ele envia ao conectar e a cada 30 minutos.</div>',
    rodape: `<button class="btn" data-fechar>Cancelar</button>${lista.length ? '<button class="btn pri" data-cad>Cadastrar</button>' : ''}` });
  if (!lista.length) return;
  const desenhar = () => {
    const q = $('#lBusca', d.el).value.trim().toLowerCase(), qd = so(q);
    $('#lLista', d.el).innerHTML = `<table><thead><tr><th style="width:32px"></th><th>Titular</th><th>CNPJ/CPF</th><th>Validade</th><th>Emissor</th><th></th></tr></thead><tbody>
      ${lista.filter((c) => !q || (c.titular || '').toLowerCase().includes(q) || (qd && (c.doc || '').includes(qd))).map((c) => { const off = cad.has(c.doc) || c.vencido || !c.doc;
        return `<tr class="${off ? 'off' : ''}"><td><input type="checkbox" data-t="${esc(c.thumb)}" ${marcados.has(c.thumb) ? 'checked' : ''} ${off ? 'disabled' : ''}></td><td>${esc(c.titular)}</td><td>${fmtDoc(c.doc)}</td><td>${fmtD(c.validade)}</td><td>${esc(c.emissor || '')}</td>
        <td>${cad.has(c.doc) ? '<span class="pill info">já cadastrada</span>' : c.vencido ? '<span class="pill vencido">vencido</span>' : ''}</td></tr>`; }).join('')}</tbody></table>`;
    $$('[data-t]', d.el).forEach((x) => (x.onchange = () => { x.checked ? marcados.add(x.dataset.t) : marcados.delete(x.dataset.t); $('[data-cad]', d.el).textContent = marcados.size ? `Cadastrar ${marcados.size}` : 'Cadastrar'; }));
  };
  $('#lBusca', d.el).oninput = desenhar;
  $('[data-todas]', d.el).onclick = () => { const vistos = new Set(); lista.filter((c) => !cad.has(c.doc) && !c.vencido && c.doc).sort((a, b) => String(b.validade).localeCompare(String(a.validade)))
    .forEach((c) => { if (!vistos.has(c.doc)) { vistos.add(c.doc); marcados.add(c.thumb); } }); desenhar(); $('[data-cad]', d.el).textContent = `Cadastrar ${marcados.size}`; };
  $('[data-cad]', d.el).onclick = tenta(async () => {
    if (!marcados.size) throw new Error('Selecione pelo menos um certificado.');
    d.fechar();
    const r = await comando('cadastrar', { thumbs: [...marcados] }, 'Cadastrando no conector…');
    toast(`${r.criadas || 0} empresa(s) cadastrada(s). Baixando as notas…`, 'ok'); atualizarDepois(6000); atualizarDepois(30000);
  });
  desenhar();
};

// ---------------- notas ----------------
function vNotas() {
  const f = S.fN;
  if (f.per !== 'livre') aplicaPeriodo(f);
  $('#main').innerHTML = `
    <div class="filtros">
      <select id="nTipo">${opcoes({ emitida: 'Emitidas', recebida: 'Recebidas', todas: 'Emitidas e recebidas' }, f.tipo)}</select>
      <select id="nData">${opcoes({ geracao: 'Data de geração', competencia: 'Competência' }, f.data)}</select>
      <select id="nPer">${opcoes(PERIODOS, f.per)}</select>
      <input type="date" class="data" id="nIni" value="${f.ini}"><input type="date" class="data" id="nFim" value="${f.fim}">
    </div>
    <div class="filtros">
      <select id="nSit">${opcoes({ '': 'Todas as situações', regular: 'Regular', cancelada: 'Cancelada', substituida: 'Substituída' }, f.sit)}</select>
      <select id="nRet">${opcoes({ '': 'Com e sem ret., desc. e ded.', com: 'Com retenção, desconto ou dedução', sem: 'Sem retenção, desconto ou dedução' }, f.ret)}</select>
      <select id="nReg">${opcoes({ '': 'Todos os regimes', 1: 'Não optante', 2: 'Optante - MEI', 3: 'Optante - ME/EPP' }, f.regime)}</select>
      <input class="busca" id="nQ" placeholder="Procurar por número, nome, CNPJ, chave de acesso ou descrição do serviço" value="${esc(f.q)}">
      <button class="btn pri" id="nFiltrar">${ico('filtro')} Filtrar</button><button class="btn" id="nLimpar">Limpar</button><button class="btn" data-act="colunasN" style="margin-left:auto">${ico('colunas')} Colunas</button>
    </div>
    <div class="grade" id="gN"><div class="vazio">Carregando…</div></div>
    <div class="rodape"><button class="btn" data-act="planilhaN">${ico('excel')} Planilha</button><button class="btn" data-act="relacaoN">${ico('pdf')} Relação</button><button class="btn" data-act="danfseLote">${ico('pdf')} DANFSe…</button>
      <button class="btn" data-act="zipN" ${conectorAqui() ? '' : 'title="Os XML e PDF ficam no computador do conector: abra o site nele para baixar o Zip."'}>${ico('zip')} Zip (XML e PDF)</button><span class="cont" id="nCont"></span></div>
    <div class="totais" id="nTot"></div>`;
  const ler = () => { Object.assign(f, { tipo: $('#nTipo').value, data: $('#nData').value, per: $('#nPer').value, ini: $('#nIni').value, fim: $('#nFim').value,
    sit: $('#nSit').value, ret: $('#nRet').value, regime: $('#nReg').value, q: $('#nQ').value }); guardar('fNWeb', f); };
  $('#nPer').onchange = () => { ler(); if (f.per !== 'livre') { aplicaPeriodo(f); $('#nIni').value = f.ini; $('#nFim').value = f.fim; } carregarNotas(); };
  ['nIni', 'nFim'].forEach((i) => ($('#' + i).onchange = () => { $('#nPer').value = 'livre'; ler(); carregarNotas(); }));
  ['nTipo', 'nData', 'nSit', 'nRet', 'nReg'].forEach((i) => ($('#' + i).onchange = () => { ler(); carregarNotas(); }));
  $('#nQ').onkeydown = (e) => { if (e.key === 'Enter') { ler(); carregarNotas(); } };
  $('#nFiltrar').onclick = () => { ler(); carregarNotas(); };
  $('#nLimpar').onclick = () => { Object.assign(f, { sit: '', ret: '', regime: '', q: '', per: 'mes_passado' }); guardar('fNWeb', f); vNotas(); };
  carregarNotas();
}
const filtroAtual = (extra = {}) => ({ escritorio: S.esc, empresa: S.empresaSel, ...S.fN, ...extra });
const carregarNotas = tenta(async () => {
  if (!$('#gN')) return;
  S.notas = ok(await sb.rpc('consultar_notas', { p: filtroAtual() }));
  desenharNotas();
});
const SITN = { regular: 'Regular', cancelada: 'Cancelada', substituida: 'Substituída' };
const COLN = [
  ['dh_proc', 'Geração', (n) => fmtDH(n.dh_proc)], ['d_compet', 'Competência', (n) => fmtComp(n.d_compet)],
  ['prest_nome', 'Emitida por', (n) => `<span class="tag">P</span>${fmtDoc(n.prest_doc)} - ${esc(n.prest_nome)}`, 'recebida'],
  ['toma_nome', 'Emitida para', (n) => `<span class="tag t">T</span>${fmtDoc(n.toma_doc)} - ${esc(n.toma_nome)}`, 'emitida'],
  ['numero', 'NFS-e', (n) => esc(n.numero)], ['v_serv', 'Preço Serviço (R$)', (n) => brl(n.v_serv), null, 'num'],
  ['v_iss', 'ISS (R$)', (n) => brl(n.v_iss) + (n.iss_retido ? ' <span class="pill aviso" title="ISS retido">ret</span>' : ''), null, 'num'],
  ['situacao', 'Situação', (n) => `<span class="pill ${esc(n.situacao)}">${SITN[n.situacao] || esc(n.situacao)}</span>`, null, 'cen'],
  // colunas opcionais (botão "Colunas")
  ['cod_trib', 'cTribNac', (n) => esc(n.cod_trib || ''), null, '', true], ['c_nbs', 'NBS', (n) => esc(n.c_nbs || ''), null, '', true],
  ['v_liq', 'Valor líquido (R$)', (n) => brl(n.v_liq), null, 'num', true], ['v_total_ret', 'Total retido (R$)', (n) => brl(n.v_total_ret), null, 'num', true],
  ['v_ret_irrf', 'IRRF (R$)', (n) => brl(n.v_ret_irrf), null, 'num', true], ['v_ret_csll', 'CSLL (R$)', (n) => brl(n.v_ret_csll), null, 'num', true],
  ['v_ret_cp', 'INSS/CP (R$)', (n) => brl(n.v_ret_cp), null, 'num', true], ['v_pis', 'PIS (R$)', (n) => brl(n.v_pis), null, 'num', true], ['v_cofins', 'COFINS (R$)', (n) => brl(n.v_cofins), null, 'num', true],
  ['v_cbs', 'CBS (R$)', (n) => brl(n.v_cbs), null, 'num', true], ['v_ibs_mun', 'IBS Mun. (R$)', (n) => brl((n.v_ibs_mun || 0)), null, 'num', true],
  ['p_aliq', 'Alíq. ISS', (n) => (n.p_aliq ? esc(String(n.p_aliq).replace('.', ',')) + '%' : ''), null, 'num', true], ['chave', 'Chave de acesso', (n) => `<span class="mono" style="font-size:11px">${esc(n.chave)}</span>`, null, '', true],
];
const colsVisiveis = () => { const v = guardado('colsN', null); return COLN.filter((c) => (v ? v.includes(c[0]) : !c[5])); };
ACOES.colunasN = () => {
  const vis = colsVisiveis().map((c) => c[0]);
  const d = dialogo({ titulo: 'Colunas', tamanho: 'sm', corpo: `<div class="cols-lista">${COLN.map((c) => `<label class="chk"><input type="checkbox" data-col="${c[0]}" ${vis.includes(c[0]) ? 'checked' : ''}> ${c[1]}</label>`).join('')}</div>`,
    rodape: '<button class="btn" data-padrao style="margin-right:auto">Padrão</button><button class="btn" data-fechar>Cancelar</button><button class="btn pri" data-ok>OK</button>' });
  $('[data-padrao]', d.el).onclick = () => { guardar('colsN', null); d.fechar(); desenharNotas(); };
  $('[data-ok]', d.el).onclick = () => { const sel = $$('[data-col]', d.el).filter((x) => x.checked).map((x) => x.dataset.col); if (!sel.length) return; guardar('colsN', sel); d.fechar(); desenharNotas(); };
};
function desenharNotas() {
  const g = $('#gN'), N = S.notas; if (!g || !N) return;
  const tipo = S.fN.tipo, cols = colsVisiveis().filter((c) => !c[3] || tipo === 'todas' || c[3] === tipo);
  const { c: oc, d: od } = S.ordN;
  const linhas = [...N.linhas].sort((a, b) => { const x = a[oc] ?? '', y = b[oc] ?? ''; return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'pt-BR', { numeric: true })) * od; });
  g.innerHTML = linhas.length ? `<table><thead><tr>${cols.map(([k, t, , , cl]) => `<th data-ord="${k}" class="${cl || ''}">${t}${oc === k ? `<span class="ord">${od > 0 ? '▲' : '▼'}</span>` : ''}</th>`).join('')}${conectorAqui() ? '<th class="cen" style="width:76px">PDF/XML</th>' : ''}</tr></thead>
    <tbody>${linhas.map((n) => `<tr data-i="${N.linhas.indexOf(n)}">${cols.map(([, , fn, , cl]) => `<td class="${cl || ''}">${fn(n)}</td>`).join('')}${conectorAqui() ? `<td><div class="docbtns"><button data-pdf title="DANFSe (PDF)">${ico('pdf')}</button><button data-xml title="Baixar XML">${ico('xml')}</button></div></td>` : ''}</tr>`).join('')}</tbody></table>`
    : `<div class="vazio">${S.empresas.length ? 'Nenhuma nota no período.' : 'Nenhuma empresa publicada ainda pelo programa do PC.'}</div>`;
  $$('th[data-ord]', g).forEach((th) => (th.onclick = () => { const k = th.dataset.ord; S.ordN = { c: k, d: S.ordN.c === k ? -S.ordN.d : 1 }; guardar('ordN', S.ordN); desenharNotas(); }));
  $$('tbody tr', g).forEach((tr) => (tr.oncontextmenu = (ev) => { $$('tbody tr', g).forEach((x) => x.classList.toggle('sel', x === tr)); menuNota(ev, N.linhas[tr.dataset.i]); }));
  $$('tbody tr', g).forEach((tr) => { tr.onclick = (ev) => { if (ev.target.closest('.docbtns')) return; $$('tbody tr', g).forEach((x) => x.classList.toggle('sel', x === tr)); }; tr.ondblclick = (ev) => { if (!ev.target.closest('.docbtns')) detalheNota(N.linhas[tr.dataset.i]); }; });
  $$('[data-pdf],[data-xml]', g).forEach((b) => (b.onclick = tenta(async () => { const n = N.linhas[b.closest('tr').dataset.i]; await baixarDoConector(n, b.hasAttribute('data-pdf') ? 'pdf' : 'xml'); })));
  const t = N.totais;
  $('#nCont').textContent = `${t.total.toLocaleString('pt-BR')} registro(s) · ${t.empresas} empresa(s)${t.total > N.linhas.length ? ` · mostrando ${N.linhas.length}` : ''}`;
  const bloco = (titulo, pares, total) => `<fieldset><legend>${titulo}</legend><dl>${pares.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}${total !== undefined ? `<dt class="tot">Total</dt><dd class="tot">${total}</dd>` : ''}</dl></fieldset>`;
  const vRet = t.v_iss_retido + t.v_ret_cp + t.v_ret_irrf + t.v_ret_csll;
  $('#nTot').innerHTML = bloco('Documentos', [['Regular', t.regular], ['Cancelada', t.cancelada], ['Substituída', t.substituida]], t.total) +
    bloco('Totais (só Regular)', [['vServ', brl(t.v_serv)], ['vDescIncond', brl(t.v_desc_incond)], ['vDescCond', brl(t.v_desc_cond)], ['vDR', brl(t.v_dr)], ['vTotalRet', brl(t.v_total_ret)], ['vLiq', brl(t.v_liq)]]) +
    bloco('Retenções (só Regular)', [['vISSQN retido', brl(t.v_iss_retido)], ['vRetCP', brl(t.v_ret_cp)], ['vRetIRRF', brl(t.v_ret_irrf)], ['vRetCSLL', brl(t.v_ret_csll)]], brl(vRet)) +
    bloco('Impostos (só Regular)', [['vISSQN', brl(t.v_iss)], ['vPis', brl(t.v_pis)], ['vCofins', brl(t.v_cofins)]], brl(t.v_iss + t.v_pis + t.v_cofins)) +
    bloco('IBS/CBS (só Regular)', [['vIBSUF', brl(t.v_ibs_uf)], ['vIBSMun', brl(t.v_ibs_mun)], ['vCBS', brl(t.v_cbs)], ['vIBSSN', brl(t.v_ibs_sn)], ['vCBSSN', brl(t.v_cbs_sn)]], brl(t.v_ibs_uf + t.v_ibs_mun + t.v_cbs + t.v_ibs_sn + t.v_cbs_sn));
}
function detalheNota(n) {
  const ov = document.createElement('div'); ov.className = 'lado-ov';
  const p = document.createElement('aside'); p.className = 'lado';
  const kv = (pares) => '<dl class="kv">' + pares.filter((x) => x[1] !== '' && x[1] != null).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('') + '</dl>';
  const emp = S.empresas.find((e) => e.doc === n.empresa_doc);
  p.innerHTML = `<div class="dlg-hd"><b>NFS-e ${esc(n.numero)} · ${esc(n.tipo)}</b><button class="x">×</button></div><div class="dlg-bd">
    ${conectorAqui() ? `<div class="linha" style="margin-bottom:12px"><button class="btn" data-dpdf>${ico('pdf')} DANFSe</button><button class="btn" data-dxml>${ico('xml')} XML</button></div>`
      : '<div class="faixa" style="margin-bottom:12px">O XML e o PDF desta nota ficam no computador do conector do escritório: abra o site nele para baixar.</div>'}
    <h3>Identificação</h3>${kv([['Empresa', esc(emp?.nome || n.empresa_doc)], ['Situação', `<span class="pill ${n.situacao}">${SITN[n.situacao]}</span>`], ['Chave de acesso', `<span class="mono">${esc(n.chave)}</span>`], ['Geração', fmtDH(n.dh_proc)], ['Emissão da DPS', fmtDH(n.dh_emi)], ['Competência', fmtD(n.d_compet)], ['Série / DPS', esc([n.serie, n.n_dps].filter(Boolean).join(' / '))], ['Município', esc(n.municipio)]])}
    <h3>Partes</h3>${kv([['Prestador', `${fmtDoc(n.prest_doc)} - ${esc(n.prest_nome)}`], ['Tomador', `${fmtDoc(n.toma_doc)} - ${esc(n.toma_nome)}`]])}
    <h3>Serviço</h3>${kv([['Cód. trib. nacional', esc(n.cod_trib)], ['Descrição do código', esc(n.x_trib_nac)], ['NBS', esc(n.c_nbs)], ['Descrição', esc(n.descricao)]])}
    <h3>Valores</h3>${kv([['Valor do serviço', 'R$ ' + brl(n.v_serv)], ['Base de cálculo', 'R$ ' + brl(n.v_bc)], ['Alíquota ISS', n.p_aliq ? esc(String(n.p_aliq).replace('.', ',')) + ' %' : ''], ['ISS', 'R$ ' + brl(n.v_iss) + (n.iss_retido ? ' (retido)' : '')],
      ['Ret. CP / IRRF / CSLL', n.v_ret_cp + n.v_ret_irrf + n.v_ret_csll ? `${brl(n.v_ret_cp)} / ${brl(n.v_ret_irrf)} / ${brl(n.v_ret_csll)}` : ''], ['PIS / COFINS', n.v_pis + n.v_cofins ? `${brl(n.v_pis)} / ${brl(n.v_cofins)}` : ''],
      ['IBS UF / Mun / CBS', n.v_ibs_uf + n.v_ibs_mun + n.v_cbs ? `${brl(n.v_ibs_uf)} / ${brl(n.v_ibs_mun)} / ${brl(n.v_cbs)}` : ''], ['Total retido', 'R$ ' + brl(n.v_total_ret)], ['Valor líquido', '<b>R$ ' + brl(n.v_liq) + '</b>']])}
    <h3>Eventos</h3><div id="dEv"><span class="dica">Carregando…</span></div></div>`;
  document.body.append(ov, p);
  const fechar = () => { ov.remove(); p.remove(); document.removeEventListener('keydown', tecla); };
  const tecla = (e) => e.key === 'Escape' && fechar();
  ov.onclick = fechar; $('.x', p).onclick = fechar; document.addEventListener('keydown', tecla);
  $('[data-dpdf]', p)?.addEventListener('click', tenta(() => baixarDoConector(n, 'pdf'))); $('[data-dxml]', p)?.addEventListener('click', tenta(() => baixarDoConector(n, 'xml')));
  sb.from('eventos').select('*').eq('escritorio_id', S.esc).eq('chave_nfse', n.chave).order('nsu').then(({ data }) => {
    $('#dEv', p).innerHTML = data && data.length ? `<table class="hist">${data.map((e) => `<tr><td>${fmtDH(e.dh_evento)}</td><td>${esc(e.descricao)}<div class="dica">${esc(e.motivo || '')}</div></td></tr>`).join('')}</table>` : '<span class="dica">Nenhum evento.</span>';
  });
}

// planilha (mesmas abas e colunas do programa do PC)
const RET_ISS = { 1: '1 - Não Retido', 2: '2 - Retido pelo Tomador', 3: '3 - Retido pelo Intermediário' };
const COLS_X = [['situacao', 12, (n) => (n.situacao || '').toUpperCase()], ['serie', 8, (n) => n.serie], ['nDPS', 15, (n) => n.n_dps], ['nNFSe', 15, (n) => n.numero],
  ['dhEmi', 16, (n) => n.dh_emi, 'datahora'], ['dCompet', 11, (n) => n.d_compet, 'data'], ['emit_CNPJ/CPF', 19, (n) => fmtDoc(n.prest_doc)], ['emit_xNome', 38, (n) => n.prest_nome],
  ['toma_CNPJ/CPF/NIF', 19, (n) => fmtDoc(n.toma_doc)], ['toma_xNome', 38, (n) => n.toma_nome], ['xLocIncid', 18, (n) => n.municipio],
  ['vServ', 14, (n) => n.v_serv, 'moeda'], ['vDescIncond', 14, (n) => n.v_desc_incond || null, 'moeda'], ['vDescCond', 14, (n) => n.v_desc_cond || null, 'moeda'], ['vDR', 14, (n) => n.v_dr || null, 'moeda'],
  ['tpRetISSQN', 22, (n) => RET_ISS[n.tp_ret_iss] || n.tp_ret_iss], ['pAliqAplic', 10, (n) => n.p_aliq], ['vISSQN retido', 14, (n) => (n.iss_retido ? n.v_iss : null), 'moeda'],
  ['vRetCP', 14, (n) => n.v_ret_cp || null, 'moeda'], ['vRetIRRF', 14, (n) => n.v_ret_irrf || null, 'moeda'], ['tpRetPisCofins', 12, (n) => n.tp_ret_piscofins],
  ['vRetCSLL (PIS/COFINS/CSLL)', 16, (n) => n.v_ret_csll || null, 'moeda'], ['vTotalRet', 14, (n) => n.v_total_ret || null, 'moeda'], ['vLiq', 14, (n) => n.v_liq, 'moeda'],
  ['vPis', 14, (n) => n.v_pis || null, 'moeda'], ['vCofins', 14, (n) => n.v_cofins || null, 'moeda'], ['vISSQN', 14, (n) => n.v_iss || null, 'moeda'],
  ['vIBSUF', 14, (n) => n.v_ibs_uf || null, 'moeda'], ['vIBSMun', 14, (n) => n.v_ibs_mun || null, 'moeda'], ['vCBS', 14, (n) => n.v_cbs || null, 'moeda'],
  ['vIBSSN', 14, (n) => n.v_ibs_sn || null, 'moeda'], ['vCBSSN', 14, (n) => n.v_cbs_sn || null, 'moeda'], ['cTribNac', 10, (n) => n.cod_trib], ['xTribNac', 40, (n) => n.x_trib_nac],
  ['cNBS', 13, (n) => n.c_nbs], ['xDescServ', 50, (n) => n.descricao], ['dhProc (geração)', 16, (n) => n.dh_proc, 'datahora'], ['Chave de acesso', 52, (n) => n.chave],
  ['Empresa', 34, (n) => (S.empresas.find((e) => e.doc === n.empresa_doc) || {}).nome]];
ACOES.planilhaN = async () => {
  if (!S.notas?.totais.total) throw new Error('Nenhuma nota no filtro.');
  const tipo = S.fN.tipo, marc = guardado('abasPlan', ['emitidas', 'recebidas']);
  const op = [['emitidas', 'Emitidas', tipo !== 'recebida'], ['recebidas', 'Recebidas', tipo !== 'emitida'], ['mes', 'Total por mês (emitidas − recebidas)', true], ['ctn', 'Total por código de serviço (cTribNac/NBS)', true]];
  const d = dialogo({ titulo: 'Planilha', tamanho: 'sm', corpo: `<div class="dica">${fmtD(S.fN.ini)} a ${fmtD(S.fN.fim)} (por ${S.fN.data === 'competencia' ? 'competência' : 'data de geração'})</div>
    <div style="margin:12px 0 6px">Abas da planilha:</div>${op.map(([k, t, o]) => `<label class="chk" style="display:flex;margin:6px 0"><input type="checkbox" data-ab="${k}" ${o && marc.includes(k) ? 'checked' : ''} ${o ? '' : 'disabled'}> ${t}</label>`).join('')}
    <p class="dica">Totais somam só as notas regulares e respeitam o filtro do Excel.</p>`, rodape: '<button class="btn" data-fechar>Cancelar</button><button class="btn pri" data-ok>Salvar</button>' });
  $('[data-ok]', d.el).onclick = tenta(async () => {
    const pedidas = $$('[data-ab]', d.el).filter((x) => x.checked).map((x) => x.dataset.ab);
    if (!pedidas.length) throw new Error('Escolha pelo menos uma aba.');
    guardar('abasPlan', pedidas); d.fechar();
    const r = ok(await sb.rpc('consultar_notas', { p: filtroAtual({ tipo: 'todas', limite: 5000 }) }));
    if (r.totais.total > r.linhas.length) toast(`A planilha traz as primeiras ${r.linhas.length} notas. Para mais, use um período menor.`, 'erro');
    const rows = r.linhas, abasX = [], col = COLS_X.map(([titulo, largura, , tipoC]) => ({ titulo, largura, tipo: tipoC }));
    for (const [t, nome] of [['emitida', 'Emitidas'], ['recebida', 'Recebidas']]) {
      if (!pedidas.includes(t + 's') || (tipo !== 'todas' && tipo !== t)) continue;
      abasX.push({ aba: nome, colunas: col, linhas: rows.filter((n) => n.tipo === t).sort((a, b) => String(a.dh_proc).localeCompare(String(b.dh_proc))).map((n) => COLS_X.map((c) => c[2](n))), somaSe: { col: 0, valor: 'REGULAR' } });
    }
    const reg = rows.filter((n) => n.situacao === 'regular'), nomeE = (doc) => (S.empresas.find((e) => e.doc === doc) || {}).nome || doc;
    const ref = (n) => (S.fN.data === 'competencia' ? n.d_compet : new Date(n.dh_proc).toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' })) || '';
    if (pedidas.includes('mes')) {
      const m = new Map();
      for (const n of reg) { const k = n.empresa_doc + '|' + ref(n).slice(0, 7); const o = m.get(k) || { emp: nomeE(n.empresa_doc), mes: ref(n).slice(0, 7), e: 0, r: 0 }; o[n.tipo === 'emitida' ? 'e' : 'r'] += n.v_serv; m.set(k, o); }
      abasX.push({ aba: 'Total por mês', colunas: [{ titulo: 'Empresa', largura: 40 }, { titulo: 'Mês', tipo: 'mes', largura: 10 }, { titulo: 'Emitidas (vServ)', tipo: 'moeda', largura: 16 }, { titulo: 'Recebidas (vServ)', tipo: 'moeda', largura: 16 }, { titulo: 'Diferença', tipo: 'formula', formula: 'C{r}-D{r}', largura: 16 }],
        linhas: [...m.values()].sort((a, b) => a.emp.localeCompare(b.emp) || a.mes.localeCompare(b.mes)).map((o) => [o.emp, o.mes, o.e, o.r, o.e - o.r]) });
    }
    if (pedidas.includes('ctn')) {
      const m = new Map(), fc = (c) => (/^\d{6}$/.test(c || '') ? `${c.slice(0, 2)}.${c.slice(2, 4)}.${c.slice(4)}` : c);
      for (const n of reg) { const k = [n.empresa_doc, n.cod_trib, n.c_nbs].join('|'); const o = m.get(k) || { emp: nomeE(n.empresa_doc), c: n.cod_trib, x: n.x_trib_nac, nbs: n.c_nbs, en: 0, ev: 0, rn: 0, rv: 0 };
        if (n.tipo === 'emitida') { o.en++; o.ev += n.v_serv; } else { o.rn++; o.rv += n.v_serv; } m.set(k, o); }
      abasX.push({ aba: 'Total por CTN-NBS', colunas: [{ titulo: 'Empresa', largura: 40 }, { titulo: 'cTribNac', largura: 10 }, { titulo: 'xTribNac', largura: 60 }, { titulo: 'cNBS', largura: 14 },
        { titulo: 'Emitidas (notas)', tipo: 'inteiro', somar: true, largura: 10 }, { titulo: 'Emitidas (vServ)', tipo: 'moeda', largura: 16 }, { titulo: 'Recebidas (notas)', tipo: 'inteiro', somar: true, largura: 10 }, { titulo: 'Recebidas (vServ)', tipo: 'moeda', largura: 16 }],
        linhas: [...m.values()].sort((a, b) => a.emp.localeCompare(b.emp) || String(a.c).localeCompare(String(b.c))).map((o) => [o.emp, fc(o.c), o.x, o.nbs || 'Sem código', o.en, o.ev, o.rn, o.rv]) });
    }
    if (!abasX.length) throw new Error('Nenhuma aba com notas para o tipo escolhido.');
    const emp = S.empresaSel === 'todas' ? 'Todas' : nomeE(S.empresaSel);
    salvarArquivo(window.gerarXlsx({ abas: abasX }), `NFSe_${emp}_${fmtD(S.fN.ini).replace(/\//g, '-')}_a_${fmtD(S.fN.fim).replace(/\//g, '-')}.xlsx`.replace(/[\\/:*?"<>|]+/g, ' '),
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
};
function salvarArquivo(bytes, nome, tipo) {
  const url = URL.createObjectURL(new Blob([bytes], { type: tipo }));
  const a = document.createElement('a'); a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ---------------- eventos ----------------
function vEventos() {
  const f = S.fE; if (f.per !== 'livre') aplicaPeriodo(f);
  $('#main').innerHTML = `<div class="filtros"><select id="ePer">${opcoes(PERIODOS, f.per)}</select>
    <input type="date" class="data" id="eIni" value="${f.ini}"><input type="date" class="data" id="eFim" value="${f.fim}">
    <input class="busca" style="flex:0 1 420px" id="eQ" placeholder="Procurar por evento, chave ou motivo" value="${esc(f.q)}"><button class="btn pri" id="eFiltrar">${ico('filtro')} Filtrar</button></div>
    <div class="grade" id="gE"><div class="vazio">Carregando…</div></div><div class="rodape"><span class="cont" id="eCont"></span></div>`;
  const ler = () => { Object.assign(f, { per: $('#ePer').value, ini: $('#eIni').value, fim: $('#eFim').value, q: $('#eQ').value }); guardar('fEWeb', f); };
  $('#ePer').onchange = () => { ler(); if (f.per !== 'livre') { aplicaPeriodo(f); $('#eIni').value = f.ini; $('#eFim').value = f.fim; } carregarEventos(); };
  ['eIni', 'eFim'].forEach((i) => ($('#' + i).onchange = () => { $('#ePer').value = 'livre'; ler(); carregarEventos(); }));
  $('#eFiltrar').onclick = () => { ler(); carregarEventos(); }; $('#eQ').onkeydown = (e) => { if (e.key === 'Enter') { ler(); carregarEventos(); } };
  carregarEventos();
}
const carregarEventos = tenta(async () => {
  const f = S.fE;
  let q = sb.from('eventos').select('*').eq('escritorio_id', S.esc).order('dh_evento', { ascending: false }).limit(3000);
  if (S.empresaSel !== 'todas') q = q.eq('empresa_doc', S.empresaSel);
  if (f.ini) q = q.gte('dh_evento', f.ini + 'T00:00:00-03:00');
  if (f.fim) q = q.lte('dh_evento', f.fim + 'T23:59:59-03:00');
  let l = ok(await q);
  const t = (f.q || '').trim().toLowerCase();
  if (t) l = l.filter((e) => [e.descricao, e.chave_nfse, e.motivo, e.numero, e.autor].join(' ').toLowerCase().includes(t));
  $('#eCont').textContent = `${l.length} evento(s)`;
  const nomeE = (doc) => (S.empresas.find((e) => e.doc === doc) || {}).nome || doc;
  $('#gE').innerHTML = l.length ? `<table><thead><tr><th>Evento</th><th>Data</th><th>NFS-e</th><th>Empresa</th><th>Autor</th><th>Motivo</th></tr></thead><tbody>
    ${l.map((e) => `<tr><td>${esc(e.descricao)}</td><td>${fmtDH(e.dh_evento)}</td><td>${esc(e.numero || (e.chave_nfse || '').slice(-15))}</td><td>${esc(nomeE(e.empresa_doc))}</td><td>${fmtDoc(e.autor)}</td><td title="${esc(e.motivo)}">${esc(e.motivo)}</td></tr>`).join('')}</tbody></table>`
    : '<div class="vazio">Nenhum evento no período.</div>';
});

// ---------------- Zip (XML/PDF pelo conector) e Relação (PDF pelo navegador) ----------------
const nomeEmp = (doc) => (S.empresas.find((e) => e.doc === doc) || {}).nome || fmtDoc(doc);
ACOES.zipN = async () => {
  if (!conectorAqui()) throw new Error('Os XML e PDF ficam no computador do conector. Abra o site nele para baixar o Zip (ou use a pasta dos XML desse computador).');
  exigirConectorNovo();
  if (!S.notas?.totais.total) throw new Error('Nenhuma nota no filtro.');
  const tipo = S.fN.tipo, z = guardado('zipOp', { emitidas: true, recebidas: true, eventos: true, pdf: false, subpastas: true });
  const d = dialogo({ titulo: 'Zip com os arquivos', tamanho: 'sm', corpo: `<div class="dica">${fmtD(S.fN.ini)} a ${fmtD(S.fN.fim)} · ${S.empresaSel === 'todas' ? 'todas as empresas' : esc(nomeEmp(S.empresaSel))} · filtro atual</div>
    <div style="margin:12px 0 6px">Incluir:</div>
    <label class="chk" style="display:flex;margin:6px 0"><input type="checkbox" id="zEm" ${z.emitidas && tipo !== 'recebida' ? 'checked' : ''} ${tipo === 'recebida' ? 'disabled' : ''}> Emitidas</label>
    <label class="chk" style="display:flex;margin:6px 0"><input type="checkbox" id="zRe" ${z.recebidas && tipo !== 'emitida' ? 'checked' : ''} ${tipo === 'emitida' ? 'disabled' : ''}> Recebidas</label>
    <label class="chk" style="display:flex;margin:6px 0"><input type="checkbox" id="zEv" ${z.eventos ? 'checked' : ''}> Eventos das notas (cancelamento, substituição…)</label>
    <label class="chk" style="display:flex;margin:6px 0"><input type="checkbox" id="zPdf" ${z.pdf ? 'checked' : ''}> PDF (DANFSe) de cada nota</label>
    <label class="chk" style="display:flex;margin:6px 0"><input type="checkbox" id="zSub" ${z.subpastas ? 'checked' : ''}> Separar em pastas de ano/mês</label>
    <p class="dica">Os PDFs que ainda não foram baixados são buscados no Ambiente Nacional agora (pode demorar alguns minutos).</p>`,
    rodape: '<button class="btn" data-fechar>Cancelar</button><button class="btn pri" data-ok>Gerar Zip</button>' });
  $('[data-ok]', d.el).onclick = tenta(async () => {
    const op = { emitidas: $('#zEm', d.el).checked, recebidas: $('#zRe', d.el).checked, eventos: $('#zEv', d.el).checked, pdf: $('#zPdf', d.el).checked, subpastas: $('#zSub', d.el).checked };
    if (!op.emitidas && !op.recebidas) throw new Error('Escolha emitidas e/ou recebidas.');
    guardar('zipOp', op); d.fechar();
    const r = ok(await sb.rpc('consultar_notas', { p: filtroAtual({ tipo: op.emitidas && op.recebidas ? 'todas' : op.emitidas ? 'emitida' : 'recebida', limite: 5000 }) }));
    if (r.totais.total > r.linhas.length) toast(`O Zip traz as primeiras ${r.linhas.length} notas. Para mais, use um período menor.`, 'erro');
    toast(`Montando o Zip com ${r.linhas.length} nota(s)…`);
    const { data: { session } } = await sb.auth.getSession();
    const resp = await chamarConector('/ponte/zip', { method: 'POST', tempo: 900000, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token },
      body: JSON.stringify({ itens: r.linhas.map((n) => ({ doc: n.empresa_doc, chave: n.chave })), eventos: op.eventos, pdf: op.pdf, subpastas: op.subpastas }) });
    salvarArquivo(await resp.arrayBuffer(), `NFSe_${S.empresaSel === 'todas' ? 'Todas' : nomeEmp(S.empresaSel)}_${fmtD(S.fN.ini).replace(/\//g, '-')}_a_${fmtD(S.fN.fim).replace(/\//g, '-')}.zip`.replace(/[\\/:*?"<>|]+/g, ' '), 'application/zip');
  });
};
ACOES.relacaoN = async () => {
  if (!S.notas?.totais.total) throw new Error('Nenhuma nota no filtro.');
  const d = dialogo({ titulo: 'Relação de notas (PDF)', tamanho: 'sm', corpo: `<div class="dica">${fmtD(S.fN.ini)} a ${fmtD(S.fN.fim)} (por ${S.fN.data === 'competencia' ? 'competência' : 'data de geração'}) · filtro atual</div>
    <div style="margin:12px 0 6px">Organização:</div>
    <label class="chk" style="display:flex;margin:6px 0"><input type="radio" name="rOrg" value="emp" checked> Uma página por empresa</label>
    <label class="chk" style="display:flex;margin:6px 0"><input type="radio" name="rOrg" value="junto"> Tudo junto</label>
    <p class="dica">Abre a relação pronta para imprimir. Para gerar o PDF, escolha <b>Salvar como PDF</b> na impressora.</p>`,
    rodape: '<button class="btn" data-fechar>Cancelar</button><button class="btn pri" data-ok>Gerar</button>' });
  $('[data-ok]', d.el).onclick = () => {
    const porEmp = $('input[name=rOrg]:checked', d.el).value === 'emp'; d.fechar();
    const w = window.open('', '_blank'); if (!w) return toast('O navegador bloqueou a janela. Permita pop-ups para este site.', 'erro');
    w.document.write('<p style="font:14px Arial;padding:20px">Montando a relação…</p>');
    tenta(async () => {
      const r = ok(await sb.rpc('consultar_notas', { p: filtroAtual({ limite: 5000 }) }));
      w.document.open(); w.document.write(htmlRelacao(r.linhas, porEmp)); w.document.close(); setTimeout(() => w.print(), 400);
    })();
  };
};
function htmlRelacao(linhas, porEmp) {
  const SIT = { regular: 'Regular', cancelada: 'Cancelada', substituida: 'Substituída' };
  const grupos = new Map();
  for (const n of [...linhas].sort((a, b) => nomeEmp(a.empresa_doc).localeCompare(nomeEmp(b.empresa_doc)) || a.tipo.localeCompare(b.tipo) || String(a.dh_proc).localeCompare(String(b.dh_proc)))) {
    const k = porEmp ? n.empresa_doc : 'todas'; if (!grupos.has(k)) grupos.set(k, []); grupos.get(k).push(n);
  }
  const tot = (l) => { const r = l.filter((n) => n.situacao === 'regular'); const s = (c) => r.reduce((a, n) => a + (Number(n[c]) || 0), 0);
    return { q: l.length, reg: r.length, v: s('v_serv'), iss: s('v_iss'), issr: r.reduce((a, n) => a + (n.iss_retido ? n.v_iss : 0), 0), fed: s('v_ret_cp') + s('v_ret_irrf') + s('v_ret_csll'), liq: s('v_liq') }; };
  const tabela = (l) => ['emitida', 'recebida'].map((t) => { const x = l.filter((n) => n.tipo === t); if (!x.length) return ''; const o = tot(x);
    return `<h3>${t === 'emitida' ? 'Emitidas' : 'Recebidas'}</h3><table><thead><tr><th>Geração</th><th>Comp.</th><th>NFS-e</th><th>${t === 'emitida' ? 'Tomador' : 'Prestador'}</th><th>Situação</th><th class="n">Valor serviço</th><th class="n">ISS</th><th class="n">ISS retido</th><th class="n">Ret. federais</th><th class="n">Valor líquido</th></tr></thead><tbody>
      ${x.map((n) => `<tr class="${n.situacao === 'regular' ? '' : 'canc'}"><td>${fmtDH(n.dh_proc)}</td><td>${fmtComp(n.d_compet)}</td><td>${esc(n.numero)}</td><td>${t === 'emitida' ? `${fmtDoc(n.toma_doc)} ${esc(n.toma_nome)}` : `${fmtDoc(n.prest_doc)} ${esc(n.prest_nome)}`}</td><td>${SIT[n.situacao] || esc(n.situacao)}</td>
        <td class="n">${brl(n.v_serv)}</td><td class="n">${brl(n.v_iss)}</td><td class="n">${n.iss_retido ? brl(n.v_iss) : ''}</td><td class="n">${brl(n.v_ret_cp + n.v_ret_irrf + n.v_ret_csll)}</td><td class="n">${brl(n.v_liq)}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td colspan="5">${o.q} nota(s) · totais só das ${o.reg} regulares</td><td class="n">${brl(o.v)}</td><td class="n">${brl(o.iss)}</td><td class="n">${brl(o.issr)}</td><td class="n">${brl(o.fed)}</td><td class="n">${brl(o.liq)}</td></tr></tfoot></table>`; }).join('');
  const cab = `${esc(S.escInfo?.nome || '')} · ${fmtD(S.fN.ini)} a ${fmtD(S.fN.fim)} (por ${S.fN.data === 'competencia' ? 'competência' : 'data de geração'}) · emitido em ${new Date().toLocaleString('pt-BR')}`;
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relação de NFS-e</title><style>
    body{font:10px Arial,sans-serif;color:#111;margin:18px} h1{font-size:15px;margin:0 0 2px;color:#0F2C48} h2{font-size:12.5px;margin:14px 0 4px;color:#0F2C48;border-bottom:2px solid #CFA04B;padding-bottom:3px}
    h3{font-size:11px;margin:10px 0 4px} .cab{color:#555;margin-bottom:8px} table{width:100%;border-collapse:collapse;margin-bottom:6px} th,td{border-bottom:1px solid #ddd;padding:3px 4px;text-align:left;vertical-align:top}
    th{background:#f1f2f5;font-size:9.5px} .n{text-align:right;white-space:nowrap} tfoot td{font-weight:bold;border-top:1.5px solid #333;background:#fafafa} tr.canc td{color:#999;text-decoration:line-through}
    .quebra{page-break-before:always} @page{size:A4 landscape;margin:12mm}</style></head><body>
    ${[...grupos.entries()].map(([k, l], i) => `<div class="${i ? 'quebra' : ''}"><h1>Relação de NFS-e</h1><div class="cab">${cab}</div><h2>${k === 'todas' ? 'Todas as empresas' : `${fmtDoc(k)} - ${esc(nomeEmp(k))}`}</h2>${tabela(l)}</div>`).join('')}
    <p style="color:#777;margin-top:10px">Gerado pelo Gestius NFS-e a partir das notas do Ambiente Nacional. Notas canceladas/substituídas aparecem riscadas e não entram nos totais.</p></body></html>`;
}

ACOES.danfseLote = async () => {
  if (!conectorAqui()) throw new Error('Os PDFs ficam no computador do conector. Abra o site nele para gerar o DANFSe em lote.');
  exigirConectorNovo();
  if (!S.notas?.totais.total) throw new Error('Nenhuma nota no filtro.');
  const d = dialogo({ titulo: 'DANFSe em lote', tamanho: 'sm', corpo: `<div class="dica">${fmtD(S.fN.ini)} a ${fmtD(S.fN.fim)} · ${S.empresaSel === 'todas' ? 'todas as empresas' : esc(nomeEmp(S.empresaSel))} · ${S.notas.totais.total} nota(s), uma por página</div>
    <div style="margin:12px 0 6px">Arquivos:</div>
    <label class="chk" style="display:flex;margin:6px 0"><input type="radio" name="dOrg" value="emp" checked> Um arquivo por empresa</label>
    <label class="chk" style="display:flex;margin:6px 0"><input type="radio" name="dOrg" value="um"> Um arquivo só</label>
    <p class="dica">Os DANFSe que ainda não foram baixados são buscados no Ambiente Nacional agora (pode demorar alguns minutos).</p>`,
    rodape: '<button class="btn" data-fechar>Cancelar</button><button class="btn pri" data-ok>Gerar…</button>' });
  $('[data-ok]', d.el).onclick = tenta(async () => {
    const umPorEmpresa = $('input[name=dOrg]:checked', d.el).value === 'emp'; d.fechar();
    const r = ok(await sb.rpc('consultar_notas', { p: filtroAtual({ limite: 3000 }) }));
    toast(`Gerando o DANFSe de ${r.linhas.length} nota(s)…`);
    const { data: { session } } = await sb.auth.getSession();
    const resp = await chamarConector('/ponte/danfse-lote', { method: 'POST', tempo: 900000, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token },
      body: JSON.stringify({ itens: r.linhas.map((n) => ({ doc: n.empresa_doc, chave: n.chave })), umPorEmpresa }) });
    const tipo = resp.headers.get('content-type') || '', nome = /filename="?([^";]+)/.exec(resp.headers.get('content-disposition') || '')?.[1] || (tipo.includes('pdf') ? 'DANFSe.pdf' : 'DANFSe.zip');
    salvarArquivo(await resp.arrayBuffer(), decodeURIComponent(nome), tipo.includes('pdf') ? 'application/pdf' : 'application/zip');
  });
};

// menu do botão direito (como no programa do PC)
function menuContexto(ev, itens) {
  ev.preventDefault();
  $$('.ctx').forEach((x) => x.remove());
  const m = document.createElement('div'); m.className = 'ctx';
  m.innerHTML = itens.map((it) => (it === '-' ? '<hr>' : `<button ${it.off ? 'disabled' : ''} title="${esc(it.dica || '')}">${it.ico ? ico(it.ico) : '<i class="ico-vazio"></i>'}${esc(it.t)}</button>`)).join('');
  document.body.appendChild(m);
  const r = m.getBoundingClientRect();
  m.style.left = Math.min(ev.clientX, innerWidth - r.width - 8) + 'px'; m.style.top = Math.min(ev.clientY, innerHeight - r.height - 8) + 'px';
  const fns = itens.filter((it) => it !== '-');
  $$('button', m).forEach((b, i) => (b.onclick = () => { m.remove(); tenta(fns[i].fn)(); }));
  setTimeout(() => { const fechar = (e) => { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('mousedown', fechar); } }; document.addEventListener('mousedown', fechar); }, 0);
}
async function salvarDoConector(n, tipos) {
  const { data: { session } } = await sb.auth.getSession();
  for (const tipo of tipos) {
    const r = await chamarConector(`/ponte/arquivo?doc=${n.empresa_doc}&chave=${n.chave}&tipo=${tipo}`, { headers: { Authorization: 'Bearer ' + session.access_token } });
    salvarArquivo(await r.arrayBuffer(), `${n.chave}.${tipo}`, tipo === 'pdf' ? 'application/pdf' : 'application/xml');
  }
}
function menuNota(ev, n) {
  const aqui = conectorAqui(), dica = aqui ? '' : 'Os arquivos ficam no computador do conector';
  menuContexto(ev, [
    { t: 'Ver XML', ico: 'xml', off: !aqui, dica, fn: () => baixarDoConector(n, 'xml') },
    { t: 'Ver DANFSe', ico: 'pdf', off: !aqui, dica, fn: () => baixarDoConector(n, 'pdf') }, '-',
    { t: 'Salvar XML como…', off: !aqui, dica, fn: () => salvarDoConector(n, ['xml']) },
    { t: 'Salvar DANFSe como…', off: !aqui, dica, fn: () => salvarDoConector(n, ['pdf']) },
    { t: 'Salvar DANFSe e XML', off: !aqui, dica, fn: () => salvarDoConector(n, ['pdf', 'xml']) }, '-',
    { t: 'Copiar chave de acesso', fn: async () => { await navigator.clipboard.writeText(n.chave); toast('Chave copiada.', 'ok'); } },
    { t: 'Ver eventos desta nota', ico: 'eventos', fn: () => { S.fE = { ...(S.fE || {}), q: n.chave, per: 'livre', ini: '2020-01-01', fim: new Date().toLocaleDateString('sv-SE') }; irPara('eventos'); } },
    { t: 'Detalhes da nota', fn: () => detalheNota(n) },
  ]);
}
function menuEmpresa(ev, e) {
  const aqui = conectorAqui();
  menuContexto(ev, [
    { t: 'Sincronizar só esta empresa', ico: 'sync', fn: async () => { const r = await comando('sync', { docs: [e.doc] }, 'Pedindo a sincronização…'); toast(r.enfileiradas ? 'Sincronizando. As notas novas aparecem em instantes.' : 'Já estava sincronizando.', 'ok'); atualizarDepois(); } },
    { t: 'Ver notas desta empresa', ico: 'notas', fn: () => { S.empresaSel = e.doc; guardar('empresaSelWeb', S.empresaSel); carregarEmpresas(); irPara('notas'); } },
    { t: 'Abrir pasta da empresa', ico: 'pasta', off: !aqui, dica: aqui ? '' : 'Só no computador do conector', fn: () => abrirPastaConector(e.doc) },
    { t: 'Histórico desta empresa', fn: () => ACOES.historico(e.doc) }, '-',
    { t: e.ativo ? 'Desativar' : 'Ativar', fn: async () => { await comando('ativar_empresa', { doc: e.doc, ativo: !e.ativo }); toast(e.ativo ? 'Empresa desativada.' : 'Empresa ativada.', 'ok'); atualizarDepois(3000); } },
    { t: 'Excluir empresa…', ico: 'lixo', fn: () => confirmar(`Excluir ${e.nome}?`, 'A empresa e as notas dela saem do site e do conector. Antes, o conector guarda um zip com os XML na pasta de dados dele.', 'Excluir',
      tenta(async () => { await comando('excluir_empresa', { doc: e.doc }); toast('Empresa excluída.', 'ok'); atualizarDepois(3000); })) },
  ]);
}

// ---------------- Conferir ----------------
// regras objetivas, conferidas nota a nota; o contador marca como conferida depois de olhar
const REGRAS = {
  nbs: { t: 'Sem código NBS', d: 'A nota não informa o código NBS (cNBS), exigido no leiaute da NFS-e Nacional para a apuração do IBS/CBS.', f: (n) => !n.c_nbs },
  competencia: { t: 'Emitida depois do mês da competência', d: 'A nota foi gerada em mês posterior ao da competência: confira se a receita/despesa está no período certo.', f: (n) => n.d_compet && n.dh_proc && new Date(n.dh_proc).toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }).slice(0, 7) > n.d_compet.slice(0, 7) },
  aliquota: { t: 'Alíquota de ISS fora de 2% a 5%', d: 'A LC 116/2003 fixa alíquota mínima de 2% (art. 8º-A, com exceções para alguns subitens) e máxima de 5% (art. 8º, II). Confira o enquadramento.', f: (n) => { const a = Number(String(n.p_aliq || '').replace(',', '.')); return n.p_aliq && n.v_iss > 0 && (a < 2 || a > 5); } },
  retido_sem_iss: { t: 'ISS marcado como retido sem valor de ISS', d: 'A nota indica retenção do ISS pelo tomador/intermediário, mas o valor do ISS está zerado.', f: (n) => n.iss_retido && !(n.v_iss > 0) },
  liquido: { t: 'Valor líquido não fecha', d: 'Valor líquido diferente de: valor do serviço − descontos (incondicionado e condicionado) − total retido. Diferença acima de R$ 0,01.', f: (n) => Math.abs((n.v_serv - n.v_desc_incond - n.v_desc_cond - n.v_total_ret) - n.v_liq) > 1 },
  cancelada: { t: 'Cancelada ou substituída', d: 'Nota cancelada ou substituída no período: confira se foi retirada da apuração e da escrituração.', f: (n) => n.situacao !== 'regular' },
};
async function vConferir() {
  const f = S.fC || (S.fC = { ...guardado('fCWeb', { tipo: 'emitida', regra: '', st: 'pendentes', q: '' }), per: 'mes_passado', ini: '', fim: '' });
  if (f.per !== 'livre') aplicaPeriodo(f);
  $('#main').innerHTML = `<div class="filtros"><select id="cTipo">${opcoes({ emitida: 'Emitidas', recebida: 'Recebidas', todas: 'Emitidas e recebidas' }, f.tipo)}</select>
      <select id="cPer">${opcoes(PERIODOS, f.per)}</select><input type="date" class="data" id="cIni" value="${f.ini}"><input type="date" class="data" id="cFim" value="${f.fim}">
      <select id="cRegra">${opcoes({ '': 'Todas as regras', ...Object.fromEntries(Object.entries(REGRAS).map(([k, r]) => [k, r.t])) }, f.regra)}</select>
      <select id="cSt">${opcoes({ pendentes: 'Não conferidas', conferidas: 'Conferidas', todas: 'Todas' }, f.st)}</select>
      <input class="busca" id="cQ" placeholder="Procurar por número, nome ou chave" value="${esc(f.q)}" style="flex:0 1 260px"></div>
    <div class="grade" id="gC"><div class="vazio">Conferindo…</div></div>
    <div class="rodape"><button class="btn pri" id="cMarcar" disabled>${ico('ok')} Marcar como conferida</button><button class="btn" id="cDesm" disabled>Desfazer</button><button class="btn" id="cPlan">${ico('excel')} Gerar relação</button><span class="cont" id="cCont"></span></div>
    <p class="dica" id="cDica"></p>`;
  const ler = () => { Object.assign(f, { tipo: $('#cTipo').value, per: $('#cPer').value, ini: $('#cIni').value, fim: $('#cFim').value, regra: $('#cRegra').value, st: $('#cSt').value, q: $('#cQ').value }); guardar('fCWeb', f); };
  $('#cPer').onchange = () => { ler(); if (f.per !== 'livre') { aplicaPeriodo(f); $('#cIni').value = f.ini; $('#cFim').value = f.fim; } carregarConferir(); };
  ['cIni', 'cFim'].forEach((i) => ($('#' + i).onchange = () => { $('#cPer').value = 'livre'; ler(); carregarConferir(); }));
  ['cTipo', 'cRegra', 'cSt'].forEach((i) => ($('#' + i).onchange = () => { ler(); carregarConferir(); }));
  $('#cQ').onkeydown = (e) => { if (e.key === 'Enter') { ler(); carregarConferir(); } };
  carregarConferir();
}
const carregarConferir = tenta(async () => {
  const f = S.fC; if (!$('#gC')) return;
  const [r, conf] = await Promise.all([sb.rpc('consultar_notas', { p: { escritorio: S.esc, empresa: S.empresaSel, tipo: f.tipo, data: 'geracao', ini: f.ini, fim: f.fim, q: f.q, limite: 5000 } }).then(ok),
    sb.from('conferencias').select('chave,regra,conferido_nome,conferido_em').eq('escritorio_id', S.esc).then(ok)]);
  const feito = new Map(conf.map((c) => [c.chave + '|' + c.regra, c]));
  const ocorr = [];
  for (const n of r.linhas) for (const [k, rg] of Object.entries(REGRAS)) {
    if (f.regra && f.regra !== k) continue;
    if (!rg.f(n)) continue;
    const c = feito.get(n.chave + '|' + k);
    if (f.st === 'pendentes' && c) continue; if (f.st === 'conferidas' && !c) continue;
    ocorr.push({ n, k, c });
  }
  S.ocorr = ocorr;
  $('#cCont').textContent = `${ocorr.length} ocorrência(s)${r.totais.total > r.linhas.length ? ` · conferidas as primeiras ${r.linhas.length} notas do período` : ''}`;
  $('#cDica').textContent = f.regra ? REGRAS[f.regra].d : 'Escolha uma regra para ver a explicação. As regras são objetivas; o contador decide se há ajuste e marca a nota como conferida.';
  $('#gC').innerHTML = ocorr.length ? `<table><thead><tr><th style="width:28px"><input type="checkbox" id="cTodos"></th><th>Geração</th><th>Competência</th><th>Empresa</th><th>Emitida por / para</th><th>NFS-e</th><th class="num">Valor (R$)</th><th>Regra</th><th>Conferida</th></tr></thead><tbody>
    ${ocorr.map((o, i) => `<tr data-i="${i}"><td><input type="checkbox" data-ci="${i}"></td><td>${fmtDH(o.n.dh_proc)}</td><td>${fmtComp(o.n.d_compet)}</td><td>${esc(nomeEmp(o.n.empresa_doc))}</td>
      <td>${o.n.tipo === 'emitida' ? `<span class="tag t">T</span>${fmtDoc(o.n.toma_doc)} - ${esc(o.n.toma_nome)}` : `<span class="tag">P</span>${fmtDoc(o.n.prest_doc)} - ${esc(o.n.prest_nome)}`}</td><td>${esc(o.n.numero)}</td>
      <td class="num">${brl(o.n.v_serv)}</td><td class="${o.c ? '' : 'erro-txt'}" title="${esc(REGRAS[o.k].d)}">${esc(REGRAS[o.k].t)}</td><td>${o.c ? `${ico('ok', 'ico ok-ico')} ${esc(o.c.conferido_nome || '')} <span class="dica">${fmtDH(o.c.conferido_em)}</span>` : ''}</td></tr>`).join('')}</tbody></table>`
    : `<div class="vazio">${f.st === 'pendentes' ? 'Nenhuma pendência nas regras escolhidas. ✔' : 'Nenhuma ocorrência.'}</div>`;
  const sel = () => $$('[data-ci]').filter((x) => x.checked).map((x) => ocorr[x.dataset.ci]);
  const upd = () => { const s = sel(); $('#cMarcar').disabled = !s.some((o) => !o.c); $('#cDesm').disabled = !s.some((o) => o.c); };
  $$('[data-ci]').forEach((x) => (x.onchange = upd));
  $('#cTodos')?.addEventListener('change', (e) => { $$('[data-ci]').forEach((x) => (x.checked = e.target.checked)); upd(); });
  $$('#gC tbody tr').forEach((tr) => (tr.ondblclick = () => detalheNota(ocorr[tr.dataset.i].n)));
  const eu = S.membros.find((m) => m.escritorio_id === S.esc)?.nome || S.user.email;
  $('#cMarcar').onclick = tenta(async () => { const s = sel().filter((o) => !o.c);
    ok(await sb.from('conferencias').upsert(s.map((o) => ({ escritorio_id: S.esc, empresa_doc: o.n.empresa_doc, chave: o.n.chave, regra: o.k, conferido_nome: eu })), { onConflict: 'escritorio_id,empresa_doc,chave,regra' }));
    toast(`${s.length} ocorrência(s) marcadas como conferidas.`, 'ok'); carregarConferir(); });
  $('#cDesm').onclick = tenta(async () => { for (const o of sel().filter((x) => x.c)) ok(await sb.from('conferencias').delete().eq('escritorio_id', S.esc).eq('empresa_doc', o.n.empresa_doc).eq('chave', o.n.chave).eq('regra', o.k)); carregarConferir(); });
  $('#cPlan').onclick = tenta(() => {
    if (!ocorr.length) throw new Error('Nenhuma ocorrência para a relação.');
    const col = [['Geração', 'datahora', 16], ['Competência', 'data', 11], ['Empresa', '', 34], ['Tipo', '', 10], ['NFS-e', '', 15], ['Prestador', '', 38], ['Tomador', '', 38], ['Valor (vServ)', 'moeda', 14], ['Regra', '', 38], ['Explicação', '', 60], ['Conferida por', '', 20], ['Conferida em', 'datahora', 16], ['Chave de acesso', '', 52]];
    salvarArquivo(window.gerarXlsx({ abas: [{ aba: 'Conferência', colunas: col.map(([titulo, tipo, largura]) => ({ titulo, tipo, largura })),
      linhas: ocorr.map((o) => [o.n.dh_proc, o.n.d_compet, nomeEmp(o.n.empresa_doc), o.n.tipo === 'emitida' ? 'Emitida' : 'Recebida', o.n.numero, `${fmtDoc(o.n.prest_doc)} - ${o.n.prest_nome || ''}`, `${fmtDoc(o.n.toma_doc)} - ${o.n.toma_nome || ''}`,
        o.n.v_serv, REGRAS[o.k].t, REGRAS[o.k].d, o.c?.conferido_nome || '', o.c?.conferido_em || null, o.n.chave]) }] }),
      `Conferencia_NFSe_${fmtD(S.fC.ini).replace(/\//g, '-')}_a_${fmtD(S.fC.fim).replace(/\//g, '-')}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});

// ---------------- Alterações de situação ----------------
const SITX = { regular: 'Regular', cancelada: 'Cancelada', substituida: 'Substituída' };
async function vAlteracoes() {
  const f = S.fA || (S.fA = { ...guardado('fAWeb', { para: '', q: '', data: 'geracao' }), per: 'mes_passado', ini: '', fim: '' });
  if (f.per !== 'livre') aplicaPeriodo(f);
  $('#main').innerHTML = `<div class="filtros"><select id="aData">${opcoes({ geracao: 'Data de geração da nota', competencia: 'Competência da nota', mudanca: 'Data da mudança' }, f.data || 'geracao')}</select><select id="aPer">${opcoes(PERIODOS, f.per)}</select><input type="date" class="data" id="aIni" value="${f.ini}"><input type="date" class="data" id="aFim" value="${f.fim}">
      <select id="aPara">${opcoes({ '': 'Todas as mudanças', cancelada: 'Passou a cancelada', substituida: 'Passou a substituída', regular: 'Voltou a regular' }, f.para)}</select>
      <input class="busca" id="aQ" placeholder="Procurar por número, nome ou chave" value="${esc(f.q)}" style="flex:0 1 300px"></div>
    <div class="grade" id="gA"><div class="vazio">Carregando…</div></div>
    <div class="rodape"><button class="btn" id="aPlan">${ico('excel')} Planilha</button><span class="cont" id="aCont"></span></div>`;
  const ler = () => { Object.assign(f, { data: $('#aData').value, per: $('#aPer').value, ini: $('#aIni').value, fim: $('#aFim').value, para: $('#aPara').value, q: $('#aQ').value }); guardar('fAWeb', { para: f.para, q: f.q, data: f.data }); };
  $('#aPer').onchange = () => { ler(); if (f.per !== 'livre') { aplicaPeriodo(f); $('#aIni').value = f.ini; $('#aFim').value = f.fim; } carregarAlteracoes(); };
  ['aIni', 'aFim'].forEach((i) => ($('#' + i).onchange = () => { $('#aPer').value = 'livre'; ler(); carregarAlteracoes(); }));
  $('#aPara').onchange = $('#aData').onchange = () => { ler(); carregarAlteracoes(); };
  $('#aQ').onkeydown = (e) => { if (e.key === 'Enter') { ler(); carregarAlteracoes(); } };
  guardar('altVistas', new Date().toISOString()); marcarAbaAlteracoes(0);
  carregarAlteracoes();
}
const carregarAlteracoes = tenta(async () => {
  const f = S.fA; if (!$('#gA')) return;
  let q = sb.from('mudancas_situacao').select('*').eq('escritorio_id', S.esc).order('detectado_em', { ascending: false }).limit(3000);
  if (S.empresaSel !== 'todas') q = q.eq('empresa_doc', S.empresaSel);
  const col = f.data === 'competencia' ? 'd_compet' : f.data === 'mudanca' ? 'detectado_em' : 'dh_proc';
  if (f.ini) q = q.gte(col, col === 'd_compet' ? f.ini : f.ini + 'T00:00:00-03:00');
  if (f.fim) q = q.lte(col, col === 'd_compet' ? f.fim : f.fim + 'T23:59:59-03:00');
  if (f.para) q = q.eq('para', f.para);
  let l = ok(await q);
  const t = (f.q || '').trim().toLowerCase(), td = so(t);
  if (t) l = l.filter((x) => [x.numero, x.prest_nome, x.toma_nome].join(' ').toLowerCase().includes(t) || (td.length >= 3 && [x.chave, x.prest_doc, x.toma_doc].join(' ').includes(td)));
  const chaves = [...new Set(l.map((x) => x.chave))].slice(0, 300);
  const evs = chaves.length ? ok(await sb.from('eventos').select('chave_nfse,descricao,motivo,dh_evento,codigo').eq('escritorio_id', S.esc).in('chave_nfse', chaves).order('nsu', { ascending: false })) : [];
  const evPor = new Map(); for (const e of evs) if (!evPor.has(e.chave_nfse)) evPor.set(e.chave_nfse, e);
  S.alts = l.map((x) => ({ ...x, ev: evPor.get(x.chave) }));
  $('#aCont').textContent = `${l.length} mudança(s)`;
  $('#gA').innerHTML = l.length ? `<table><thead><tr><th>Detectada em</th><th>Empresa</th><th>Tipo</th><th>NFS-e</th><th>Competência</th><th>Emitida por / para</th><th class="num">Valor (R$)</th><th>Situação</th><th>Evento / motivo</th></tr></thead><tbody>
    ${S.alts.map((x, i) => `<tr data-i="${i}"><td>${fmtDH(x.detectado_em)}</td><td>${esc(nomeEmp(x.empresa_doc))}</td><td>${x.tipo === 'emitida' ? 'Emitida' : 'Recebida'}</td><td>${esc(x.numero || '')}</td><td>${fmtComp(x.d_compet)}</td>
      <td>${x.tipo === 'emitida' ? `<span class="tag t">T</span>${fmtDoc(x.toma_doc)} - ${esc(x.toma_nome)}` : `<span class="tag">P</span>${fmtDoc(x.prest_doc)} - ${esc(x.prest_nome)}`}</td><td class="num">${brl(x.v_serv)}</td>
      <td>${x.de ? `<span class="pill ${esc(x.de)}">${SITX[x.de] || esc(x.de)}</span> → ` : '<span class="dica">já chegou</span> '}<span class="pill ${esc(x.para)}">${SITX[x.para] || esc(x.para)}</span></td>
      <td>${x.ev ? `${esc(x.ev.descricao)} <span class="dica">${fmtDH(x.ev.dh_evento)}</span>${x.ev.motivo ? `<div class="dica">${esc(x.ev.motivo)}</div>` : ''}` : ''}</td></tr>`).join('')}</tbody></table>`
    : '<div class="vazio">Nenhuma nota mudou de situação no período.</div>';
  $$('#gA tbody tr').forEach((tr) => (tr.ondblclick = tenta(async () => { const x = S.alts[tr.dataset.i];
    const n = ok(await sb.from('notas').select('*').eq('escritorio_id', S.esc).eq('empresa_doc', x.empresa_doc).eq('chave', x.chave).maybeSingle()); if (n) detalheNota(n); })));
  $('#aPlan').onclick = tenta(() => {
    if (!S.alts.length) throw new Error('Nenhuma mudança para a planilha.');
    const col = [['Detectada em', 'datahora', 16], ['Empresa', '', 34], ['Tipo', '', 10], ['NFS-e', '', 15], ['Competência', 'data', 11], ['Prestador', '', 38], ['Tomador', '', 38], ['Valor (vServ)', 'moeda', 14], ['De', '', 12], ['Para', '', 12], ['Evento', '', 30], ['Data do evento', 'datahora', 16], ['Motivo', '', 50], ['Chave de acesso', '', 52]];
    salvarArquivo(window.gerarXlsx({ abas: [{ aba: 'Alterações', colunas: col.map(([titulo, tipo, largura]) => ({ titulo, tipo, largura })),
      linhas: S.alts.map((x) => [x.detectado_em, nomeEmp(x.empresa_doc), x.tipo === 'emitida' ? 'Emitida' : 'Recebida', x.numero, x.d_compet, `${fmtDoc(x.prest_doc)} - ${x.prest_nome || ''}`, `${fmtDoc(x.toma_doc)} - ${x.toma_nome || ''}`,
        x.v_serv, x.de ? SITX[x.de] : 'Já chegou', SITX[x.para] || x.para, x.ev?.descricao || '', x.ev?.dh_evento || null, x.ev?.motivo || '', x.chave]) }] }),
      `Alteracoes_situacao_NFSe_${fmtD(S.fA.ini).replace(/\//g, '-')}_a_${fmtD(S.fA.fim).replace(/\//g, '-')}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });
});
// aviso na aba: quantas mudanças desde a última visita
async function contarAlteracoesNovas() {
  const desde = guardado('altVistas', new Date(Date.now() - 7 * 86400000).toISOString());
  const { data } = await sb.from('mudancas_situacao').select('id').eq('escritorio_id', S.esc).gt('detectado_em', desde).limit(100);
  marcarAbaAlteracoes(S.aba === 'alteracoes' ? 0 : (data || []).length);
}
function marcarAbaAlteracoes(n) {
  const b = $('.tab[data-aba=alteracoes] span'); if (!b) return;
  b.innerHTML = 'Alterações' + (n ? ` <i class="badge">${n > 99 ? '99+' : n}</i>` : '');
}

// ---------------- usuários do escritório ----------------
const SITE = location.origin + location.pathname;
async function vUsuarios() {
  const membros = ok(await sb.from('membros').select('*').eq('escritorio_id', S.esc).order('nome'));
  $('#main').innerHTML = `<div class="secao" style="margin-top:0">Equipe de ${esc(S.escInfo?.nome || '')}</div>
    <div class="grade" style="flex:0 1 auto;min-height:0"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Último acesso</th><th></th></tr></thead><tbody>
    ${membros.map((m) => `<tr><td>${esc(m.nome || '')}${m.user_id === S.user.id ? ' <span class="pill info">você</span>' : ''}</td><td>${esc(m.email || '')}</td>
      <td>${m.telefone ? `<a class="tel" href="${linkWhats(m.telefone)}" target="_blank" rel="noopener" title="Abrir no WhatsApp">${esc(fmtTel(m.telefone))}</a>` : '<span class="dica">—</span>'}</td>
      <td>${fmtDH(m.ult_acesso) || '<span class="dica">nunca</span>'}</td>
      <td class="num">${m.user_id === S.user.id ? '<button class="btn" style="height:26px" data-act="meusDados">Meus dados</button>' : S.superu ? `<button class="btn perigo" style="height:26px" data-rem="${esc(m.user_id)}" data-nome="${esc(m.nome || m.email)}">Remover</button>` : ''}</td></tr>`).join('')}</tbody></table></div>
    ${S.superu ? '<p class="dica" style="margin-top:12px">Contas e escritórios: aba <b>Administração → Pessoas</b>.</p>' : ''}`;
  $$('[data-rem]').forEach((b) => (b.onclick = () => confirmar(`Remover ${b.dataset.nome}?`, 'A pessoa perde o acesso a este escritório na hora. A conta dela continua existindo.', 'Remover',
    tenta(async () => { ok(await sb.rpc('admin_desvincular', { p_user: b.dataset.rem, p_escritorio: S.esc })); toast('Pessoa removida.', 'ok'); vUsuarios(); }))));
}
ACOES.meusDados = () => {
  const eu = S.membros.find((m) => m.escritorio_id === S.esc) || {};
  const d = dialogo({ titulo: 'Meus dados', tamanho: 'sm', corpo: `<div class="form" style="grid-template-columns:110px 1fr"><label>Nome</label><input id="mdNome" maxlength="120" value="${esc(eu.nome || '')}">
      <label>Telefone</label><input id="mdTel" inputmode="tel" maxlength="15" placeholder="(79) 99999-9999" value="${esc(fmtTel(eu.telefone || ''))}"><label>E-mail</label><input value="${esc(S.user.email)}" readonly></div>
      <p class="dica">Para trocar o e-mail, crie uma conta nova e peça ao administrador do site para incluir a nova conta no escritório.</p>`,
    rodape: '<button class="btn" data-fechar>Cancelar</button><button class="btn pri" data-ok>Salvar</button>' });
  $('#mdTel', d.el).oninput = (e) => { e.target.value = fmtTel(e.target.value); };
  $('[data-ok]', d.el).onclick = tenta(async () => {
    const tel = $('#mdTel', d.el).value;
    if (tel && !telOk(tel)) throw new Error('Telefone inválido: informe o DDD e o número.');
    ok(await sb.rpc('atualizar_perfil', { p_nome: $('#mdNome', d.el).value, p_telefone: tel }));
    S.membros = ok(await sb.from('membros').select('escritorio_id,papel,nome,email,telefone').eq('user_id', S.user.id));
    d.fechar(); toast('Dados salvos.', 'ok'); if (S.aba === 'usuarios') vUsuarios();
  });
};

// ---------------- apoie (Pix) ----------------
function crc16(s) { let c = 0xffff; for (const b of new TextEncoder().encode(s)) { c ^= b << 8; for (let i = 0; i < 8; i++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff; } return c.toString(16).toUpperCase().padStart(4, '0'); }
function pixPayload(cent) {
  const tlv = (id, v) => id + String(v.length).padStart(2, '0') + v;
  const limpa = (s, m) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9 .-]/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase().slice(0, m);
  const P = CFG.pix || {};
  let p = tlv('00', '01') + tlv('26', tlv('00', 'br.gov.bcb.pix') + tlv('01', P.chave)) + tlv('52', '0000') + tlv('53', '986');
  if (cent > 0) p += tlv('54', (cent / 100).toFixed(2));
  p += tlv('58', 'BR') + tlv('59', limpa(P.nome, 25)) + tlv('60', limpa(P.cidade, 15)) + tlv('62', tlv('05', '***')) + '6304';
  return p + crc16(p);
}
let valorPix = guardado('valorPix', 0);
function vApoie() {
  const p = pixPayload(valorPix), qr = qrcode(0, 'M'); qr.addData(p); qr.make();
  const vals = [0, 1000, 2000, 5000, 10000];
  $('#main').innerHTML = `<div class="apoie"><div class="apoie-card"><div class="apoie-txt"><h2>${ico('coracao', 'ico-g')} Apoie o Gestius NFS-e</h2><p>${esc(CFG.textoApoio || '')}</p>
    <div class="dica" style="margin:14px 0 6px">Escolha um valor (ou deixe em aberto e digite no app do banco):</div>
    <div class="linha">${vals.map((v) => `<button class="btn ${v === valorPix ? 'pri' : ''}" data-v="${v}">${v ? 'R$ ' + brl(v) : 'Valor livre'}</button>`).join('')}</div>
    <div class="dica" style="margin:16px 0 6px">Pix copia e cola:</div><div class="linha"><input id="pixCod" readonly value="${esc(p)}" style="flex:1" class="mono"><button class="btn pri" id="pixCp">Copiar código</button></div>
    <dl class="kv" style="margin-top:16px"><dt>Chave Pix (e-mail)</dt><dd><b>${esc(CFG.pix?.chave)}</b></dd><dt>Recebedor</dt><dd>${esc(CFG.pix?.nome)}</dd></dl>
    <p class="dica" style="margin-top:14px">Confira o nome do recebedor no app do banco antes de confirmar. Obrigado!</p></div>
    <div class="apoie-qr"><div class="qr">${qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true }).replace('<svg ', '<svg shape-rendering="crispEdges" ')}</div><div class="dica">Abra o app do banco → Pix → Ler QR Code${valorPix ? `<br><b>R$ ${brl(valorPix)}</b>` : ''}</div></div></div></div>`;
  $$('[data-v]').forEach((b) => (b.onclick = () => { valorPix = Number(b.dataset.v); guardar('valorPix', valorPix); vApoie(); }));
  $('#pixCp').onclick = async (e) => { try { await navigator.clipboard.writeText(p); } catch { $('#pixCod').select(); document.execCommand('copy'); } e.target.textContent = 'Copiado!'; };
}

// ---------------- administração do site ----------------
async function vAdmin() {
  $('#main').innerHTML = '<div class="vazio">Carregando…</div>';
  const [r, pes] = await Promise.all([sb.rpc('admin_resumo').then(ok), sb.rpc('admin_usuarios').then(ok)]);
  const t = r.totais, aba = S.admAba || 'pessoas', aguard = pes.filter((u) => !u.escritorios.length && !u.super);
  const card = (k, v) => `<div class="card"><span>${k}</span><b>${v}</b></div>`;
  const escOpts = r.escritorios.map((e) => `<option value="${esc(e.id)}">${esc(e.nome)}${e.ativo ? '' : ' (suspenso)'}</option>`).join('');
  const seg = `<div class="seg-tabs">${[['pessoas', `Pessoas${aguard.length ? ` <span class="pill vence">${aguard.length} aguardando</span>` : ''}`], ['escritorios', 'Escritórios'], ['acessos', 'Últimos acessos']]
    .map(([k, txt]) => `<button class="${aba === k ? 'on' : ''}" data-adm="${k}">${txt}</button>`).join('')}</div>`;
  let corpo = '';
  if (aba === 'pessoas') {
    const f = (S.admQ || '').toLowerCase();
    const lista = pes.filter((u) => !f || [u.nome, u.email, u.telefone, u.escritorio_informado, ...u.escritorios.map((e) => e.nome)].join(' ').toLowerCase().includes(f))
      .sort((x, y) => (!x.escritorios.length && !x.super ? 0 : 1) - (!y.escritorios.length && !y.super ? 0 : 1));
    corpo = `<div class="filtros"><input class="busca" id="admQ" placeholder="Procurar por nome, e-mail, telefone ou escritório" value="${esc(S.admQ || '')}" style="flex:0 1 420px">
      <button class="btn" id="admNovoEsc">Novo escritório</button><span class="dica">Todas as contas novas são operadoras: consultam, sincronizam, cadastram empresas e usam o conector. Só você gerencia contas e escritórios.</span></div>
      <div class="grade" style="flex:1 1 320px"><table><thead><tr><th>Pessoa</th><th>Telefone</th><th>Escritório</th><th>Cadastro</th><th>Último login</th><th style="width:360px"></th></tr></thead><tbody>
      ${lista.map((u) => `<tr><td><b>${esc(u.nome || '')}</b>${u.super ? ' <span class="pill ok">administrador do site</span>' : ''}<div class="dica">${esc(u.email)}</div></td>
        <td>${u.telefone ? `<a class="tel" href="${linkWhats(u.telefone)}" target="_blank" rel="noopener">${esc(fmtTel(u.telefone))}</a>` : '<span class="dica">—</span>'}</td>
        <td>${u.escritorios.length ? u.escritorios.map((e) => `<span class="pill ${e.ativo ? 'info' : 'cinza'}" style="margin:1px 4px 1px 0">${esc(e.nome)}${u.super ? '' : ` <a class="x-mini" title="Tirar deste escritório" data-desv="${esc(u.user_id)}" data-esc="${esc(e.id)}" data-nome="${esc(u.nome || u.email)}" data-escn="${esc(e.nome)}">×</a>`}</span>`).join('')
          : `<span class="pill vence">aguardando</span>${u.escritorio_informado ? `<div class="dica">informou: ${esc(u.escritorio_informado)}</div>` : ''}`}</td>
        <td>${fmtD(u.criado_em)}</td><td>${fmtDH(u.ult_login) || '<span class="dica">nunca</span>'}</td>
        <td class="num">${u.super ? '' : `<select class="selemp" data-vsel="${esc(u.user_id)}" style="width:170px;min-width:0"><option value="">Incluir no escritório…</option>${escOpts}</select>
          ${!u.escritorios.length ? `<button class="btn" style="height:26px" data-criar="${esc(u.user_id)}" data-sug="${esc(u.escritorio_informado || '')}">Criar escritório</button>` : ''}`}</td></tr>`).join('')}</tbody></table></div>`;
  } else if (aba === 'escritorios') {
    corpo = `<div class="grade" style="flex:1 1 320px"><table><thead><tr><th>Escritório</th><th>Quem cadastrou</th><th>Contato</th><th>Criado</th><th class="num">Pessoas</th><th class="num">Empresas</th><th class="num">Notas</th><th>Último acesso</th><th>Conector</th><th>Última sincronização</th><th class="cen" style="width:230px"></th></tr></thead><tbody>
    ${r.escritorios.map((e) => { const on = e.pc_visto_em && Date.now() - new Date(e.pc_visto_em) < 2 * 3600000;
      return `<tr class="${e.ativo ? '' : 'inativo'}"><td><b>${esc(e.nome)}</b></td><td>${esc(e.responsavel || '')}<div class="dica">${esc(e.email || '')}</div></td><td>${e.telefone ? `<a class="tel" href="${linkWhats(e.telefone)}" target="_blank" rel="noopener">${esc(fmtTel(e.telefone))}</a>` : '<span class="dica">—</span>'}</td><td>${fmtD(e.criado_em)}</td><td class="num">${e.usuarios}</td><td class="num">${e.empresas}</td><td class="num">${Number(e.notas).toLocaleString('pt-BR')}</td>
      <td>${fmtDH(e.ult_acesso)}</td><td><span class="agente-st ${on ? 'on' : 'off'}"><i></i>${e.pc_visto_em ? fmtDH(e.pc_visto_em) : 'nunca'}</span></td>
      <td>${fmtDH(e.ult_sync)}${e.com_erro ? ` <span class="pill erro">${e.com_erro} com erro</span>` : ''}</td>
      <td class="cen"><button class="btn" style="height:26px" data-ren="${esc(e.id)}" data-escn="${esc(e.nome)}">Renomear</button>
        <button class="btn" style="height:26px" data-esc-at="${esc(e.id)}" data-at="${e.ativo ? 0 : 1}">${e.ativo ? 'Suspender' : 'Reativar'}</button></td></tr>`; }).join('')}</tbody></table></div>`;
  } else {
    corpo = `<div class="grade" style="flex:1 1 320px"><table><thead><tr><th>Quando</th><th>Pessoa</th><th>Escritório</th><th>IP</th><th>Navegador</th></tr></thead><tbody>
    ${r.acessos.map((a) => `<tr><td>${fmtDH(a.quando)}</td><td>${esc(a.nome || '')} <span class="dica">${esc(a.email || '')}</span></td><td>${esc(a.escritorio || '')}</td><td class="mono">${esc(a.ip || '')}</td><td title="${esc(a.navegador)}">${esc((a.navegador || '').slice(0, 60))}</td></tr>`).join('')}</tbody></table></div>`;
  }
  $('#main').innerHTML = `<div class="cards">${card('Escritórios', t.escritorios)}${card('Ativos em 7 dias', t.ativos7d)}${card('Conectores ativos (2h)', t.pcs)}${card('Pessoas', pes.length)}${card('Empresas', t.empresas)}${card('Notas', Number(t.notas).toLocaleString('pt-BR'))}</div>
    ${seg}${corpo}<div class="dica">Banco: ${t.banco_mb} MB de 500 MB do plano gratuito.</div>`;
  $$('[data-adm]').forEach((b) => (b.onclick = () => { S.admAba = b.dataset.adm; vAdmin(); }));
  const q = $('#admQ'); if (q) q.oninput = () => { clearTimeout(S.tmAdm); S.tmAdm = setTimeout(() => { S.admQ = q.value; vAdmin().then(() => { const n = $('#admQ'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }); }, 350); };
  $('#admNovoEsc')?.addEventListener('click', () => pedirTexto('Novo escritório', 'Nome do escritório', '', tenta(async (nome) => { ok(await sb.rpc('admin_criar_escritorio', { p_nome: nome })); toast('Escritório criado.', 'ok'); vAdmin(); })));
  $$('[data-vsel]').forEach((sel) => (sel.onchange = tenta(async () => { if (!sel.value) return; ok(await sb.rpc('admin_vincular', { p_user: sel.dataset.vsel, p_escritorio: sel.value })); toast('Pessoa incluída no escritório.', 'ok'); vAdmin(); })));
  $$('[data-criar]').forEach((b) => (b.onclick = () => pedirTexto('Criar escritório para esta pessoa', 'Nome do escritório', b.dataset.sug, tenta(async (nome) => { ok(await sb.rpc('admin_criar_escritorio', { p_nome: nome, p_user: b.dataset.criar })); toast('Escritório criado e pessoa incluída.', 'ok'); vAdmin(); }))));
  $$('[data-desv]').forEach((b) => (b.onclick = () => confirmar(`Tirar ${b.dataset.nome} de ${b.dataset.escn}?`, 'A pessoa perde o acesso a esse escritório na hora. A conta continua existindo.', 'Tirar',
    tenta(async () => { ok(await sb.rpc('admin_desvincular', { p_user: b.dataset.desv, p_escritorio: b.dataset.esc })); vAdmin(); }))));
  $$('[data-ren]').forEach((b) => (b.onclick = () => pedirTexto('Renomear escritório', 'Nome do escritório', b.dataset.escn, tenta(async (nome) => { ok(await sb.rpc('admin_renomear_escritorio', { p_escritorio: b.dataset.ren, p_nome: nome })); vAdmin(); }))));
  $$('[data-esc-at]').forEach((b) => (b.onclick = () => confirmar(b.dataset.at === '1' ? 'Reativar escritório?' : 'Suspender escritório?',
    b.dataset.at === '1' ? 'As pessoas voltam a entrar e o conector volta a publicar.' : 'As pessoas desse escritório não conseguem ver os dados e o conector para de publicar. Os dados ficam guardados.',
    b.dataset.at === '1' ? 'Reativar' : 'Suspender', tenta(async () => { ok(await sb.rpc('admin_definir_ativo', { p_escritorio: b.dataset.escAt, p_ativo: b.dataset.at === '1' })); vAdmin(); }))));
}
function pedirTexto(titulo, rotulo, valor, fn) {
  const d = dialogo({ titulo, tamanho: 'sm', corpo: `<label style="display:grid;gap:6px">${esc(rotulo)}<input id="ptVal" maxlength="160" value="${esc(valor || '')}"></label>`,
    rodape: '<button class="btn" data-fechar>Cancelar</button><button class="btn pri" data-ok>OK</button>' });
  const i = $('#ptVal', d.el); i.focus(); i.select();
  const ir = async () => { if (!i.value.trim()) return; d.fechar(); await fn(i.value.trim()); };
  $('[data-ok]', d.el).onclick = ir; i.onkeydown = (e) => { if (e.key === 'Enter') ir(); };
}

// ---------------- histórico, menu ----------------
ACOES.historico = async (doc) => {
  let q = sb.from('sincronizacoes').select('*').eq('escritorio_id', S.esc).order('inicio', { ascending: false }).limit(200);
  if (typeof doc === 'string' && doc) q = q.eq('empresa_doc', doc);
  const h = ok(await q);
  const st = { ok: 'ok', aviso: 'aviso', erro: 'erro', rodando: 'info' };
  dialogo({ titulo: 'Histórico de sincronização', tamanho: 'lg', rodape: '<button class="btn pri" data-fechar>Fechar</button>',
    corpo: h.length ? `<table class="hist"><thead><tr><th style="text-align:left">Início</th><th style="text-align:left">Empresa</th><th>Situação</th><th class="num">Novas</th><th style="text-align:left">Mensagem</th></tr></thead><tbody>
      ${h.map((x) => `<tr><td>${fmtDH(x.inicio)}<div class="dica">${esc(x.origem || '')}</div></td><td>${esc(x.empresa_nome || '')}</td><td class="cen"><span class="pill ${st[x.status] || 'cinza'}">${esc(x.status)}</span></td><td class="num">${x.novas ?? ''}</td><td style="white-space:normal">${esc(x.msg || '')}</td></tr>`).join('')}</tbody></table>`
      : '<div class="vazio">Nenhuma sincronização publicada ainda.</div>' });
};
ACOES.menuUsuario = (el) => {
  $('.menu')?.remove();
  const r = el.getBoundingClientRect(), m = document.createElement('div'); m.className = 'menu';
  m.style.top = r.bottom + 4 + 'px'; m.style.right = innerWidth - r.right + 'px';
  m.innerHTML = `<div style="padding:6px 14px 8px"><b>${esc(S.membros.find((x) => x.escritorio_id === S.esc)?.nome || '')}</b><div class="dica">${esc(S.user.email)} · operador${S.superu ? ' · administrador do site' : ''}</div></div><hr>
    <button data-m="prefs">Preferências…</button><button data-m="dados">Meus dados</button><button data-m="senha">Trocar minha senha</button><button data-m="sair">Sair</button>`;
  document.body.appendChild(m);
  setTimeout(() => document.addEventListener('click', function f(e) { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('click', f); } }), 0);
  $('[data-m=sair]', m).onclick = () => ACOES.sair();
  $('[data-m=dados]', m).onclick = () => { m.remove(); ACOES.meusDados(); };
  $('[data-m=prefs]', m).onclick = () => { m.remove(); tenta(ACOES.prefsConector)(); };
  $('[data-m=senha]', m).onclick = () => { m.remove(); telaLogin('novasenha'); };
};
ACOES.sair = async () => { await sb.auth.signOut(); location.reload(); };

function dialogo({ titulo, corpo, rodape = '', tamanho = '' }) {
  const ov = document.createElement('div'); ov.className = 'ov';
  ov.innerHTML = `<div class="dlg ${tamanho}"><div class="dlg-hd"><b>${esc(titulo)}</b><button class="x" data-fechar>×</button></div><div class="dlg-bd">${corpo}</div>${rodape ? `<div class="dlg-ft">${rodape}</div>` : ''}</div>`;
  document.body.appendChild(ov);
  const fechar = () => { ov.remove(); document.removeEventListener('keydown', tecla); };
  const tecla = (e) => e.key === 'Escape' && fechar();
  document.addEventListener('keydown', tecla); $$('[data-fechar]', ov).forEach((b) => (b.onclick = fechar));
  return { el: ov, fechar };
}
function confirmar(titulo, texto, botao, fn) {
  const d = dialogo({ titulo, tamanho: 'sm', corpo: `<p style="margin:0">${esc(texto)}</p>`, rodape: `<button class="btn" data-fechar>Cancelar</button><button class="btn pri" data-sim>${esc(botao)}</button>` });
  $('[data-sim]', d.el).onclick = async () => { d.fechar(); await fn(); };
}

iniciar().catch((e) => { $('#app').innerHTML = `<div class="vazio">Não foi possível abrir: ${esc(traduz(e))}</div>`; });
