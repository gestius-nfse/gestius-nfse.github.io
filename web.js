'use strict';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const so = (s) => String(s ?? '').replace(/\D/g, '');
const brl = (c) => ((Number(c) || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDoc = (d) => { d = so(d);
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); return d; };
const fmtDH = (s) => { if (!s) return ''; const d = new Date(s); return isNaN(d) ? s : d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };
const fmtD = (s) => (s ? String(s).slice(0, 10).split('-').reverse().join('/') : '');
const fmtComp = (s) => (s ? s.slice(5, 7) + '/' + s.slice(0, 4) : '');
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
  if (/Password should be at least/i.test(m)) return 'A senha precisa de pelo menos 6 caracteres.';
  if (/rate limit/i.test(m)) return 'Muitas tentativas. Aguarde alguns minutos.';
  if (/Failed to fetch|NetworkError/i.test(m)) return 'Sem conexão com o servidor. Confira a internet.';
  return m;
}
const ok = (r) => { if (r.error) throw r.error; return r.data; };

const S = {
  user: null, membros: [], esc: guardado('esc', null), papel: null, superu: false,
  aba: guardado('abaWeb', 'notas'), empresas: [], empresaSel: guardado('empresaSelWeb', 'todas'), escInfo: null,
  notas: null, ordN: guardado('ordN', { c: 'dh_proc', d: -1 }),
  fN: guardado('fNWeb', { tipo: 'emitida', data: 'geracao', per: 'este_e_passado', ini: '', fim: '', sit: '', ret: '', regime: '', q: '' }),
  fE: guardado('fEWeb', { per: 'este_e_passado', ini: '', fim: '', q: '' }), eventos: null,
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
async function comando(tipo, dados = {}, msgEspera = 'Enviando ao conector…') {
  const c = ok(await sb.from('comandos').insert({ escritorio_id: S.esc, tipo, dados, criado_por: S.user.id }).select('id').single());
  if (conectorAqui()) chamarConector('/ponte/acordar', { method: 'POST', tempo: 5000 }).catch(() => {});
  toast(msgEspera);
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2500));
    const x = ok(await sb.from('comandos').select('status,resultado').eq('id', c.id).single());
    if (x.status === 'ok') return x.resultado || {};
    if (x.status === 'erro') throw new Error((x.resultado && x.resultado.erro) || 'O conector não conseguiu executar.');
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
function telaLogin(modo = 'login', aviso = '') {
  const cad = modo === 'cadastro', rec = modo === 'recuperar', nova = modo === 'novasenha';
  $('#app').innerHTML = `<div class="login"><form class="caixa" id="fLogin">
    <div class="wm"><b>GESTIUS</b><span>NFS-E</span></div>
    <h1>${cad ? 'Criar conta do escritório' : rec ? 'Recuperar a senha' : nova ? 'Nova senha' : 'Entrar'}</h1>
    <p>${cad ? 'Grátis. As NFS-e de todas as suas empresas, baixadas do Ambiente Nacional.' : rec ? 'Enviaremos um link para o seu e-mail.' : nova ? 'Escolha a nova senha.' : 'Notas fiscais de serviço de todas as suas empresas, num só lugar.'}</p>
    ${aviso ? `<div class="faixa" style="margin-bottom:12px">${esc(aviso)}</div>` : ''}
    ${cad ? '<label>Nome do escritório ou da empresa<input name="escritorio" required maxlength="120"></label><label>Seu nome<input name="nome" required autocomplete="name"></label>' : ''}
    ${nova ? '' : '<label>E-mail<input name="email" type="email" required autocomplete="email"></label>'}
    ${rec ? '' : `<label>Senha<input name="senha" type="password" required minlength="6" autocomplete="${cad || nova ? 'new-password' : 'current-password'}"></label>`}
    ${cad || nova ? '<label>Repita a senha<input name="senha2" type="password" required minlength="6" autocomplete="new-password"></label>' : ''}
    ${cad ? `<label class="termos"><input type="checkbox" name="aceite" required style="margin-top:2px"><span>Li e aceito: o serviço é gratuito e oferecido "como está"; os dados de visualização das notas ficam guardados no site para o meu escritório; os certificados, XML e PDF ficam no computador do escritório; confiro os valores antes de usá-los em obrigações fiscais.</span></label>` : ''}
    <div class="erro-txt" id="loginErro" style="min-height:18px;margin:-4px 0 8px"></div>
    <button class="btn ${cad ? 'ouro' : 'pri'}">${cad ? 'Criar conta grátis' : rec ? 'Enviar link' : nova ? 'Salvar senha' : 'Entrar'}</button>
    <div class="troca">${cad ? 'Já tem conta? <a data-ir="login">Entrar</a>' : rec || nova ? '<a data-ir="login">Voltar</a>' : 'Ainda não tem conta? <a data-ir="cadastro">Criar conta grátis</a><br><a data-ir="recuperar" style="font-weight:400">Esqueci a senha</a>'}</div>
    <div class="assin">DECISÕES SEGURAS, GESTÃO INTELIGENTE.</div>
  </form></div>`;
  $('#fLogin input')?.focus();
  $$('[data-ir]').forEach((x) => (x.onclick = () => telaLogin(x.dataset.ir)));
  $('#fLogin').onsubmit = async (ev) => {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(ev.target)), erro = (m) => ($('#loginErro').textContent = m);
    if ((cad || nova) && d.senha !== d.senha2) return erro('As senhas não conferem.');
    const bt = $('#fLogin .btn'); bt.disabled = true;
    try {
      if (cad) {
        const r = ok(await sb.auth.signUp({ email: d.email, password: d.senha, options: { data: { nome: d.nome, escritorio: d.escritorio }, emailRedirectTo: location.origin + location.pathname } }));
        if (!r.session) return telaLogin('login', 'Conta criada! Confirme o seu e-mail pelo link que enviamos e depois entre aqui.');
      } else if (rec) {
        ok(await sb.auth.resetPasswordForEmail(d.email, { redirectTo: location.origin + location.pathname }));
        return telaLogin('login', 'Se o e-mail tiver conta, enviamos o link para criar uma nova senha.');
      } else if (nova) {
        ok(await sb.auth.updateUser({ password: d.senha }));
        toast('Senha alterada.', 'ok');
      } else ok(await sb.auth.signInWithPassword({ email: d.email, password: d.senha }));
      await sb.rpc('registrar_acesso', { p_navegador: navigator.userAgent });
      iniciar();
    } catch (e) { erro(traduz(e)); bt.disabled = false; }
  };
}

// ---------------- início ----------------
async function iniciar() {
  if (!CFG.supabaseUrl || /COLE_AQUI/.test(CFG.supabaseUrl)) { $('#app').innerHTML = '<div class="vazio">Site ainda não configurado: preencha o arquivo config.js.</div>'; return; }
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return telaLogin();
  S.user = session.user;
  S.membros = ok(await sb.from('membros').select('escritorio_id,papel,nome,email').eq('user_id', S.user.id));
  S.superu = !!ok(await sb.rpc('eh_super'));
  const escs = S.membros.length ? ok(await sb.from('escritorios').select('id,nome,ativo,pc_visto_em,pc_versao,pc_host').in('id', S.membros.map((m) => m.escritorio_id))) : [];
  S.escritorios = escs.filter((e) => e.ativo);
  if (!S.escritorios.length) {
    $('#app').innerHTML = `<div class="login"><div class="caixa"><div class="wm"><b>GESTIUS</b><span>NFS-E</span></div><h1>Acesso suspenso</h1>
      <p>O seu escritório está suspenso ou você ainda não faz parte de um escritório. Fale com o administrador.</p><button class="btn pri" data-act="sair">Sair</button></div></div>`;
    return;
  }
  if (!S.escritorios.some((e) => e.id === S.esc)) S.esc = S.escritorios[0].id;
  guardar('esc', S.esc);
  S.escInfo = S.escritorios.find((e) => e.id === S.esc);
  S.papel = S.membros.find((m) => m.escritorio_id === S.esc)?.papel;
  montarShell();
  await carregarEmpresas();
  irPara(S.aba);
  detectarConector().then(() => {
    if (location.hash === '#conectar' && S.conector && !conectorAqui() && souAdmin()) { history.replaceState(null, '', location.pathname); ACOES.conectarPc(); }
  });
  clearInterval(S.tmCon); S.tmCon = setInterval(detectarConector, 60000);
}
sb.auth.onAuthStateChange((ev) => { if (ev === 'PASSWORD_RECOVERY') telaLogin('novasenha'); if (ev === 'SIGNED_OUT') telaLogin(); });

const abas = () => [['empresas', 'Empresas'], ['notas', 'Emitidas / Recebidas'], ['eventos', 'Eventos'], ['usuarios', 'Usuários'], ['apoie', 'Apoie'],
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
    + (conectorAqui() ? ' <span class="pill ok">este computador é o conector</span>' : S.conector && souAdmin() ? ' <button class="btn" style="height:24px" data-act="conectarPc">Conectar este computador</button>' : '');
}
async function carregarEmpresas() {
  S.empresas = ok(await sb.from('empresas').select('*').eq('escritorio_id', S.esc).order('nome'));
  const sel = $('#selEmp');
  if (S.empresaSel !== 'todas' && !S.empresas.some((e) => e.doc === S.empresaSel)) S.empresaSel = 'todas';
  sel.innerHTML = '<option value="todas">Todas as empresas</option>' + S.empresas.map((e) => `<option value="${e.doc}" ${e.doc === S.empresaSel ? 'selected' : ''}>${esc(e.nome)} — ${fmtDoc(e.doc)}</option>`).join('');
  $('#stEsq').textContent = `${S.escInfo?.nome || ''} · ${S.empresas.length} empresa(s).`;
}
function irPara(aba) {
  if (!abas().some(([k]) => k === aba)) aba = 'notas';
  S.aba = aba; guardar('abaWeb', aba);
  $$('.tab').forEach((b) => b.classList.toggle('on', b.dataset.aba === aba));
  tenta({ empresas: vEmpresas, notas: vNotas, eventos: vEventos, usuarios: vUsuarios, apoie: vApoie, admin: vAdmin }[aba])();
}
const souAdmin = () => S.papel === 'admin';

// ---------------- empresas ----------------
function vEmpresas() {
  const semPc = !S.escInfo?.pc_visto_em && !conectorAqui();
  $('#main').innerHTML = `${semPc && souAdmin() ? `<div class="faixa" style="display:block;line-height:1.7">
      <b>Falta instalar o conector</b> no computador do escritório que tem os certificados digitais (uma vez só):<br>
      1. Nesse computador, abra este site e clique em <a class="btn ouro" style="height:26px;margin:0 4px" href="${LINK_INSTALADOR}" download>Baixar o instalador</a><br>
      2. Abra o arquivo baixado. Se o Windows avisar, clique em <b>Mais informações → Executar assim mesmo</b>.<br>
      3. Volte ao site e clique em <b>Conectar este computador</b> (no rodapé). Se o navegador pedir acesso à rede local, clique em <b>Permitir</b>.</div>`
      : semPc ? '<div class="faixa">O administrador do escritório ainda não instalou o conector.</div>' : ''}
    ${souAdmin() && !semPc ? `<div class="filtros"><button class="btn pri" data-act="cadastrarCerts">${ico('certs')} Cadastrar pelos certificados</button>
      <button class="btn" data-act="syncTodas">${ico('sync')} Sincronizar agora</button><span class="dica">Os pedidos vão para o conector do escritório e levam alguns segundos.</span></div>` : ''}
    <div class="grade" id="gEmp">${S.empresas.length ? `<table><thead><tr><th style="width:44%">Empresa</th><th class="cen">Validade do certificado</th><th class="num">Notas</th><th>Última sincronização</th>${souAdmin() && (S.escInfo?.pc_visto_em || conectorAqui()) ? '<th style="width:96px"></th>' : ''}</tr></thead><tbody>
    ${S.empresas.map((e) => { const d = e.cert_validade ? diasAte(e.cert_validade) : null;
      const st = e.ult_status === 'erro' ? 'erro' : e.ult_status === 'aviso' ? 'aviso' : 'ok';
      return `<tr class="${e.ativo ? '' : 'inativo'}" data-doc="${e.doc}"><td><span style="display:inline-block;min-width:150px">${fmtDoc(e.doc)}</span>${esc(e.nome)}</td>
      <td class="cen">${d === null ? '—' : d < 0 ? `<span class="pill vencido">${fmtD(e.cert_validade)} · vencido</span>` : d <= 30 ? `<span class="pill vence">${fmtD(e.cert_validade)} · ${d} dia(s)</span>` : fmtD(e.cert_validade)}</td>
      <td class="num">${(e.qtd_notas || 0).toLocaleString('pt-BR')}</td>
      <td>${e.ult_sync ? `<span class="sinc ${st}" title="${esc(e.ult_msg || '')}">${ico(st, 'ico')} ${fmtDH(e.ult_sync)}${st === 'erro' ? ` <span class="erro-txt">${esc((e.ult_msg || '').slice(0, 70))}</span>` : ''}</span>` : '<span class="dica">nunca</span>'}</td></tr>`; }).join('')}
    </tbody></table>` : '<div class="vazio">Nenhuma empresa publicada ainda.</div>'}</div>`;
  $$('#gEmp tbody tr').forEach((tr) => (tr.ondblclick = () => { S.empresaSel = tr.dataset.doc; guardar('empresaSelWeb', S.empresaSel); carregarEmpresas(); irPara('notas'); }));
  if (souAdmin() && !semPc) $$('#gEmp tbody tr').forEach((tr) => {
    const e = S.empresas.find((x) => x.doc === tr.dataset.doc);
    tr.insertAdjacentHTML('beforeend', `<td><div class="acoes"><button data-sy="${e.doc}" title="Sincronizar esta empresa">${ico('sync')}</button>
      <button data-at="${e.doc}" title="${e.ativo ? 'Desativar' : 'Ativar'}">${ico(e.ativo ? 'erro' : 'ok')}</button><button data-ex="${e.doc}" title="Excluir">${ico('lixo')}</button></div></td>`);
  });
  $$('[data-sy]').forEach((b) => (b.onclick = tenta(async () => { const r = await comando('sync', { docs: [b.dataset.sy] }, 'Pedindo a sincronização…'); toast(r.enfileiradas ? 'Sincronizando. As notas novas aparecem em instantes.' : 'Já estava sincronizando.', 'ok'); atualizarDepois(); })));
  $$('[data-at]').forEach((b) => (b.onclick = tenta(async () => { const e = S.empresas.find((x) => x.doc === b.dataset.at); await comando('ativar_empresa', { doc: e.doc, ativo: !e.ativo }); toast(e.ativo ? 'Empresa desativada.' : 'Empresa ativada.', 'ok'); atualizarDepois(3000); })));
  $$('[data-ex]').forEach((b) => (b.onclick = () => { const e = S.empresas.find((x) => x.doc === b.dataset.ex);
    confirmar(`Excluir ${e.nome}?`, 'A empresa e as notas dela saem do site e do conector. Os XML já gravados no computador continuam na pasta.', 'Excluir',
      tenta(async () => { await comando('excluir_empresa', { doc: e.doc }); toast('Empresa excluída.', 'ok'); atualizarDepois(3000); })); }));
}
function atualizarDepois(ms = 8000) { setTimeout(async () => { await carregarEmpresas(); if (S.aba === 'empresas') vEmpresas(); }, ms); }
ACOES.syncTodas = async () => { const r = await comando('sync', {}, 'Pedindo a sincronização…'); toast(`Sincronizando ${r.enfileiradas || 0} empresa(s).`, 'ok'); atualizarDepois(); };
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
      <button class="btn pri" id="nFiltrar">${ico('filtro')} Filtrar</button><button class="btn" id="nLimpar">Limpar</button>
    </div>
    <div class="grade" id="gN"><div class="vazio">Carregando…</div></div>
    <div class="rodape"><button class="btn" data-act="planilhaN">${ico('excel')} Planilha</button><span class="cont" id="nCont"></span></div>
    <div class="totais" id="nTot"></div>`;
  const ler = () => { Object.assign(f, { tipo: $('#nTipo').value, data: $('#nData').value, per: $('#nPer').value, ini: $('#nIni').value, fim: $('#nFim').value,
    sit: $('#nSit').value, ret: $('#nRet').value, regime: $('#nReg').value, q: $('#nQ').value }); guardar('fNWeb', f); };
  $('#nPer').onchange = () => { ler(); if (f.per !== 'livre') { aplicaPeriodo(f); $('#nIni').value = f.ini; $('#nFim').value = f.fim; } carregarNotas(); };
  ['nIni', 'nFim'].forEach((i) => ($('#' + i).onchange = () => { $('#nPer').value = 'livre'; ler(); carregarNotas(); }));
  ['nTipo', 'nData', 'nSit', 'nRet', 'nReg'].forEach((i) => ($('#' + i).onchange = () => { ler(); carregarNotas(); }));
  $('#nQ').onkeydown = (e) => { if (e.key === 'Enter') { ler(); carregarNotas(); } };
  $('#nFiltrar').onclick = () => { ler(); carregarNotas(); };
  $('#nLimpar').onclick = () => { Object.assign(f, { sit: '', ret: '', regime: '', q: '', per: 'este_e_passado' }); guardar('fNWeb', f); vNotas(); };
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
  ['situacao', 'Situação', (n) => `<span class="pill ${n.situacao}">${SITN[n.situacao] || n.situacao}</span>`, null, 'cen'],
];
function desenharNotas() {
  const g = $('#gN'), N = S.notas; if (!g || !N) return;
  const tipo = S.fN.tipo, cols = COLN.filter((c) => !c[3] || tipo === 'todas' || c[3] === tipo);
  const { c: oc, d: od } = S.ordN;
  const linhas = [...N.linhas].sort((a, b) => { const x = a[oc] ?? '', y = b[oc] ?? ''; return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'pt-BR', { numeric: true })) * od; });
  g.innerHTML = linhas.length ? `<table><thead><tr>${cols.map(([k, t, , , cl]) => `<th data-ord="${k}" class="${cl || ''}">${t}${oc === k ? `<span class="ord">${od > 0 ? '▲' : '▼'}</span>` : ''}</th>`).join('')}${conectorAqui() ? '<th class="cen" style="width:76px">PDF/XML</th>' : ''}</tr></thead>
    <tbody>${linhas.map((n) => `<tr data-i="${N.linhas.indexOf(n)}">${cols.map(([, , fn, , cl]) => `<td class="${cl || ''}">${fn(n)}</td>`).join('')}${conectorAqui() ? `<td><div class="docbtns"><button data-pdf title="DANFSe (PDF)">${ico('pdf')}</button><button data-xml title="Baixar XML">${ico('xml')}</button></div></td>` : ''}</tr>`).join('')}</tbody></table>`
    : `<div class="vazio">${S.empresas.length ? 'Nenhuma nota no período.' : 'Nenhuma empresa publicada ainda pelo programa do PC.'}</div>`;
  $$('th[data-ord]', g).forEach((th) => (th.onclick = () => { const k = th.dataset.ord; S.ordN = { c: k, d: S.ordN.c === k ? -S.ordN.d : 1 }; guardar('ordN', S.ordN); desenharNotas(); }));
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
  p.innerHTML = `<div class="dlg-hd"><b>NFS-e ${esc(n.numero)} · ${n.tipo}</b><button class="x">×</button></div><div class="dlg-bd">
    ${conectorAqui() ? `<div class="linha" style="margin-bottom:12px"><button class="btn" data-dpdf>${ico('pdf')} DANFSe</button><button class="btn" data-dxml>${ico('xml')} XML</button></div>`
      : '<div class="faixa" style="margin-bottom:12px">O XML e o PDF desta nota ficam no computador do conector do escritório: abra o site nele para baixar.</div>'}
    <h3>Identificação</h3>${kv([['Empresa', esc(emp?.nome || n.empresa_doc)], ['Situação', `<span class="pill ${n.situacao}">${SITN[n.situacao]}</span>`], ['Chave de acesso', `<span class="mono">${esc(n.chave)}</span>`], ['Geração', fmtDH(n.dh_proc)], ['Emissão da DPS', fmtDH(n.dh_emi)], ['Competência', fmtD(n.d_compet)], ['Série / DPS', [n.serie, n.n_dps].filter(Boolean).join(' / ')], ['Município', esc(n.municipio)]])}
    <h3>Partes</h3>${kv([['Prestador', `${fmtDoc(n.prest_doc)} - ${esc(n.prest_nome)}`], ['Tomador', `${fmtDoc(n.toma_doc)} - ${esc(n.toma_nome)}`]])}
    <h3>Serviço</h3>${kv([['Cód. trib. nacional', esc(n.cod_trib)], ['Descrição do código', esc(n.x_trib_nac)], ['NBS', esc(n.c_nbs)], ['Descrição', esc(n.descricao)]])}
    <h3>Valores</h3>${kv([['Valor do serviço', 'R$ ' + brl(n.v_serv)], ['Base de cálculo', 'R$ ' + brl(n.v_bc)], ['Alíquota ISS', n.p_aliq ? String(n.p_aliq).replace('.', ',') + ' %' : ''], ['ISS', 'R$ ' + brl(n.v_iss) + (n.iss_retido ? ' (retido)' : '')],
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

// ---------------- usuários do escritório ----------------
async function vUsuarios() {
  const [mem, conv] = await Promise.all([sb.from('membros').select('*').eq('escritorio_id', S.esc).order('nome'), souAdmin() ? sb.from('convites').select('*').eq('escritorio_id', S.esc) : { data: [] }]);
  const membros = ok(mem), convites = conv.data || [];
  $('#main').innerHTML = `<div class="grade" style="flex:0 1 auto;min-height:0"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Último acesso</th><th></th></tr></thead><tbody>
    ${membros.map((m) => `<tr><td>${esc(m.nome || '')}</td><td>${esc(m.email || '')}</td><td>${m.papel === 'admin' ? 'Administrador' : 'Operador'}</td><td>${fmtDH(m.ult_acesso)}</td>
      <td class="num">${souAdmin() && m.user_id !== S.user.id ? `<button class="btn" style="height:26px" data-papel="${m.user_id}" data-p="${m.papel === 'admin' ? 'operador' : 'admin'}">Tornar ${m.papel === 'admin' ? 'operador' : 'administrador'}</button>
        <button class="btn perigo" style="height:26px" data-rem="${m.user_id}">Remover</button>` : ''}</td></tr>`).join('')}</tbody></table></div>
    ${souAdmin() ? `<div class="secao">Convidar pessoa</div>
      <div class="linha"><input id="cvEmail" type="email" placeholder="e-mail da pessoa" style="width:280px"><select id="cvPapel"><option value="operador">Operador</option><option value="admin">Administrador</option></select>
      <button class="btn pri" id="cvAdd">Convidar</button></div>
      <p class="dica">A pessoa cria a conta no site com esse e-mail e entra direto neste escritório. Operador só consulta; administrador também convida pessoas e conecta o programa do PC.</p>
      ${convites.length ? `<table class="hist">${convites.map((c) => `<tr><td>${esc(c.email)}</td><td>${c.papel}</td><td>aguardando cadastro</td><td><button class="btn" style="height:26px" data-cvrem="${esc(c.email)}">Cancelar</button></td></tr>`).join('')}</table>` : ''}` : ''}`;
  $('#cvAdd')?.addEventListener('click', tenta(async () => {
    const email = $('#cvEmail').value.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('E-mail inválido.');
    ok(await sb.from('convites').insert({ escritorio_id: S.esc, email, papel: $('#cvPapel').value }));
    toast('Convite registrado. Avise a pessoa para criar a conta com esse e-mail.', 'ok'); vUsuarios();
  }));
  $$('[data-cvrem]').forEach((b) => (b.onclick = tenta(async () => { ok(await sb.from('convites').delete().eq('escritorio_id', S.esc).eq('email', b.dataset.cvrem)); vUsuarios(); })));
  $$('[data-papel]').forEach((b) => (b.onclick = tenta(async () => { ok(await sb.from('membros').update({ papel: b.dataset.p }).eq('escritorio_id', S.esc).eq('user_id', b.dataset.papel)); vUsuarios(); })));
  $$('[data-rem]').forEach((b) => (b.onclick = () => confirmar('Remover pessoa do escritório?', 'Ela perde o acesso a este escritório. A conta dela continua existindo.', 'Remover',
    tenta(async () => { ok(await sb.from('membros').delete().eq('escritorio_id', S.esc).eq('user_id', b.dataset.rem)); vUsuarios(); }))));
}

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
  const r = ok(await sb.rpc('admin_resumo')), t = r.totais;
  const card = (k, v) => `<div class="card"><span>${k}</span><b>${v}</b></div>`;
  $('#main').innerHTML = `<div class="cards">${card('Escritórios', t.escritorios)}${card('Ativos em 7 dias', t.ativos7d)}${card('PCs enviando (2h)', t.pcs)}${card('Usuários', t.usuarios)}${card('Empresas', t.empresas)}${card('Notas', Number(t.notas).toLocaleString('pt-BR'))}</div>
    <div class="grade" style="flex:1 1 320px"><table><thead><tr><th>Escritório</th><th>E-mail</th><th>Criado</th><th class="num">Usuários</th><th class="num">Empresas</th><th class="num">Notas</th><th>Último acesso</th><th>PC</th><th>Última sincronização</th><th class="cen">Situação</th></tr></thead><tbody>
    ${r.escritorios.map((e) => { const on = e.pc_visto_em && Date.now() - new Date(e.pc_visto_em) < 2 * 3600000;
      return `<tr><td><b>${esc(e.nome)}</b></td><td>${esc(e.email || '')}</td><td>${fmtD(e.criado_em)}</td><td class="num">${e.usuarios}</td><td class="num">${e.empresas}</td><td class="num">${Number(e.notas).toLocaleString('pt-BR')}</td>
      <td>${fmtDH(e.ult_acesso)}</td><td><span class="agente-st ${on ? 'on' : 'off'}"><i></i>${e.pc_visto_em ? fmtDH(e.pc_visto_em) : 'nunca'}</span></td>
      <td>${fmtDH(e.ult_sync)}${e.com_erro ? ` <span class="pill erro">${e.com_erro} com erro</span>` : ''}</td>
      <td class="cen"><button class="btn" style="height:26px" data-esc="${e.id}" data-at="${e.ativo ? 0 : 1}">${e.ativo ? 'Suspender' : 'Reativar'}</button></td></tr>`; }).join('')}</tbody></table></div>
    <div class="secao" style="margin:4px 0 0">Últimos acessos</div>
    <div class="grade" style="flex:0 1 240px;min-height:160px"><table><thead><tr><th>Quando</th><th>Pessoa</th><th>Escritório</th><th>IP</th><th>Navegador</th></tr></thead><tbody>
    ${r.acessos.map((a) => `<tr><td>${fmtDH(a.quando)}</td><td>${esc(a.nome || '')} <span class="dica">${esc(a.email || '')}</span></td><td>${esc(a.escritorio || '')}</td><td class="mono">${esc(a.ip || '')}</td><td title="${esc(a.navegador)}">${esc((a.navegador || '').slice(0, 60))}</td></tr>`).join('')}</tbody></table></div>
    <div class="dica">Banco: ${t.banco_mb} MB de 500 MB do plano gratuito.</div>`;
  $$('[data-esc]').forEach((b) => (b.onclick = () => confirmar(b.dataset.at === '1' ? 'Reativar escritório?' : 'Suspender escritório?',
    b.dataset.at === '1' ? 'As pessoas voltam a entrar e o PC volta a publicar.' : 'As pessoas desse escritório não conseguem ver os dados e o PC para de publicar. Os dados ficam guardados.',
    b.dataset.at === '1' ? 'Reativar' : 'Suspender', tenta(async () => { ok(await sb.rpc('admin_definir_ativo', { p_escritorio: b.dataset.esc, p_ativo: b.dataset.at === '1' })); vAdmin(); }))));
}

// ---------------- histórico, menu ----------------
ACOES.historico = async () => {
  const h = ok(await sb.from('sincronizacoes').select('*').eq('escritorio_id', S.esc).order('inicio', { ascending: false }).limit(200));
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
  m.innerHTML = `<div style="padding:6px 14px 8px"><b>${esc(S.membros.find((x) => x.escritorio_id === S.esc)?.nome || '')}</b><div class="dica">${esc(S.user.email)} · ${souAdmin() ? 'administrador' : 'operador'}${S.superu ? ' · administrador do site' : ''}</div></div><hr>
    <button data-m="senha">Trocar minha senha</button><button data-m="sair">Sair</button>`;
  document.body.appendChild(m);
  setTimeout(() => document.addEventListener('click', function f(e) { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('click', f); } }), 0);
  $('[data-m=sair]', m).onclick = () => ACOES.sair();
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
