// Planilha .xlsx no navegador (formato padrão do Excel: textos em sharedStrings; abre no celular e no WhatsApp).
// Mesmo gerador do programa do PC; aqui o .zip é gravado sem compressão (o Excel aceita normalmente).
(function () {
const TAB = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
function crc32(b) { let c = -1; for (let i = 0; i < b.length; i++) c = TAB[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; }
const enc = new TextEncoder();
function zip(arquivos) {
  const partes = [], central = []; let off = 0;
  const d = new Date(); const hora = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const data = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  for (const a of arquivos) {
    const dados = typeof a.dados === 'string' ? enc.encode(a.dados) : a.dados;
    const nome = enc.encode(a.nome); const crc = crc32(dados);
    const loc = new DataView(new ArrayBuffer(30));
    loc.setUint32(0, 0x04034b50, true); loc.setUint16(4, 20, true); loc.setUint16(6, 0x0800, true); loc.setUint16(8, 0, true);
    loc.setUint16(10, hora, true); loc.setUint16(12, data, true); loc.setUint32(14, crc, true);
    loc.setUint32(18, dados.length, true); loc.setUint32(22, dados.length, true); loc.setUint16(26, nome.length, true);
    partes.push(new Uint8Array(loc.buffer), nome, dados);
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true); cen.setUint16(4, 20, true); cen.setUint16(6, 20, true); cen.setUint16(8, 0x0800, true); cen.setUint16(10, 0, true);
    cen.setUint16(12, hora, true); cen.setUint16(14, data, true); cen.setUint32(16, crc, true);
    cen.setUint32(20, dados.length, true); cen.setUint32(24, dados.length, true); cen.setUint16(28, nome.length, true); cen.setUint32(42, off, true);
    central.push(new Uint8Array(cen.buffer), nome);
    off += 30 + nome.length + dados.length;
  }
  const tamCen = central.reduce((s, x) => s + x.length, 0);
  const fim = new DataView(new ArrayBuffer(22));
  fim.setUint32(0, 0x06054b50, true); fim.setUint16(8, arquivos.length, true); fim.setUint16(10, arquivos.length, true);
  fim.setUint32(12, tamCen, true); fim.setUint32(16, off, true);
  const todos = [...partes, ...central, new Uint8Array(fim.buffer)];
  const out = new Uint8Array(todos.reduce((s, x) => s + x.length, 0)); let p = 0;
  for (const x of todos) { out.set(x, p); p += x.length; }
  return out;
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
function colLetra(i) { let s = ''; i++; while (i) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }

// Uma ou várias abas: xlsx({ abas: [{ aba, titulo, colunas, linhas, totais, somaSe }] }) ou xlsx({ aba, colunas, linhas, ... })
// colunas: [{ titulo, tipo: 'texto'|'moeda'|'data'|'datahora'|'inteiro'|'mes'|'formula', largura }]; moeda em CENTAVOS (inteiro)
// somaSe: { col, valor } -> total só das linhas cuja coluna col = valor (ex.: situação REGULAR). O total usa SUBTOTAL: respeita o filtro do Excel.
function xlsx(opts) {
  const abas = opts.abas || [opts];
  const strings = [], idx = new Map();
  const ss = (v) => { const s = String(v ?? ''); if (!idx.has(s)) { idx.set(s, strings.length); strings.push(s); } return idx.get(s); };
  const ESTILO = { texto: 0, moeda: 2, data: 3, datahora: 4, inteiro: 0, mes: 8, formula: 2 };
  const serial = (d) => d / 86400000 + 25569;
  const nomes = [];
  const folhas = abas.map((A, ai) => {
    const { titulo, colunas, linhas, totais = true, somaSe = null } = A;
    const linhasXml = [];
    let r = 1;
    if (titulo) { linhasXml.push(`<row r="${r}"><c r="A${r}" s="5" t="s"><v>${ss(titulo)}</v></c></row>`); r += 2; }
    const rCab = r;
    linhasXml.push(`<row r="${r}">` + colunas.map((c, i) => `<c r="${colLetra(i)}${r}" s="1" t="s"><v>${ss(c.titulo)}</v></c>`).join('') + '</row>');
    const ini = r + 1;
    for (const lin of linhas) {
      r++;
      const cel = colunas.map((c, i) => {
        const v = lin[i], ref = `${colLetra(i)}${r}`;
        if (c.tipo === 'formula') return `<c r="${ref}" s="2"><f>${esc(String(c.formula).replace(/\{r\}/g, r))}</f>${v !== null && v !== undefined ? `<v>${(Number(v) / 100).toFixed(2)}</v>` : ''}</c>`;
        if (v === null || v === undefined || v === '') return '';
        if (c.tipo === 'moeda') return `<c r="${ref}" s="2"><v>${(Number(v) / 100).toFixed(2)}</v></c>`;
        if (c.tipo === 'inteiro') return `<c r="${ref}"><v>${Number(v)}</v></c>`;
        if (c.tipo === 'data' || c.tipo === 'datahora' || c.tipo === 'mes') {
          let d;
          if (/^\d{4}-\d{2}(-\d{2})?$/.test(v)) d = Date.UTC(+v.slice(0, 4), +v.slice(5, 7) - 1, c.tipo === 'mes' ? 1 : +(v.slice(8, 10) || 1));
          else { const x = new Date(v); if (isNaN(x)) return `<c r="${ref}" t="s"><v>${ss(v)}</v></c>`;
            d = x.getTime() - 3 * 3600000; if (c.tipo !== 'datahora') d = Math.floor(d / 86400000) * 86400000; } // hora de Brasília
          return `<c r="${ref}" s="${ESTILO[c.tipo]}"><v>${serial(d).toFixed(10)}</v></c>`;
        }
        return `<c r="${ref}" t="s"><v>${ss(v)}</v></c>`;
      }).join('');
      linhasXml.push(`<row r="${r}">${cel}</row>`);
    }
    const fimDados = r;
    if (totais && linhas.length) {
      r += 2;
      linhasXml.push(`<row r="${r}">` + colunas.map((c, i) => {
        const L = colLetra(i);
        if (i === 0) return `<c r="${L}${r}" s="7" t="s"><v>${ss(somaSe ? `Total (${somaSe.valor}, conforme o filtro)` : 'Total (conforme o filtro)')}</v></c>`;
        if (c.tipo === 'moeda' || c.tipo === 'formula' || (c.tipo === 'inteiro' && c.somar)) {
          const R = `${L}${ini}:${L}${fimDados}`;
          let f, val = null;
          if (somaSe) {
            const SL = colLetra(somaSe.col);
            f = `SUMPRODUCT(SUBTOTAL(109,OFFSET(${L}${ini},ROW(${R})-ROW(${L}${ini}),0)),--(${SL}${ini}:${SL}${fimDados}="${somaSe.valor}"))`;
          } else f = `SUBTOTAL(109,${R})`;
          if (c.tipo === 'moeda' || c.tipo === 'formula') val = (linhas.reduce((s, l) => s + (!somaSe || l[somaSe.col] === somaSe.valor ? Number(l[i]) || 0 : 0), 0) / 100).toFixed(2);
          if (c.tipo === 'inteiro') val = String(linhas.reduce((s, l) => s + (Number(l[i]) || 0), 0));
          return `<c r="${L}${r}" s="${c.tipo === 'inteiro' ? 9 : 6}"><f>${esc(f)}</f>${val !== null ? `<v>${val}</v>` : ''}</c>`;
        }
        return '';
      }).join('') + '</row>');
    }
    const cols = '<cols>' + colunas.map((c, i) => `<col min="${i + 1}" max="${i + 1}" width="${c.largura || 14}" customWidth="1"/>`).join('') + '</cols>';
    const ultima = `${colLetra(colunas.length - 1)}${fimDados}`;
    let nome = String(A.aba || `Planilha${ai + 1}`).replace(/[\\/?*[\]:]/g, '-').slice(0, 31);
    while (nomes.includes(nome)) nome = nome.slice(0, 28) + ' ' + (nomes.length + 1);
    nomes.push(nome);
    const filtro = linhas.length ? { ref: `A${rCab}:${ultima}`, def: `'${esc(nome).replace(/'/g, "''")}'!$A$${rCab}:$${colLetra(colunas.length - 1)}$${fimDados}` } : null;
    return { nome, filtro, xml: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetViews><sheetView workbookViewId="0"${ai === 0 ? ' tabSelected="1"' : ''}><pane ySplit="${rCab}" topLeftCell="A${rCab + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
${cols}<sheetData>${linhasXml.join('')}</sheetData>${filtro ? `<autoFilter ref="${filtro.ref}"/>` : ''}
<pageMargins left="0.5" right="0.5" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>` };
  });
  const sst = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">${strings.map((s) => `<si><t xml:space="preserve">${esc(s)}</t></si>`).join('')}</sst>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="4"><numFmt numFmtId="164" formatCode="#,##0.00"/><numFmt numFmtId="165" formatCode="dd/mm/yyyy"/><numFmt numFmtId="166" formatCode="dd/mm/yyyy hh:mm"/><numFmt numFmtId="167" formatCode="mm/yyyy"/></numFmts>
<fonts count="3"><font><sz val="10"/><name val="Arial"/><family val="2"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/><family val="2"/></font><font><b/><sz val="12"/><name val="Arial"/><family val="2"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F2A6B"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left/><right/><top style="thin"><color auto="1"/></top><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="10">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="164" fontId="2" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>
<xf numFmtId="167" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="1" fontId="2" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1"/>
</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  const sheetsWb = folhas.map((f, i) => `<sheet name="${esc(f.nome)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('');
  const defs = folhas.map((f, i) => (f.filtro ? `<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">${f.filtro.def}</definedName>` : '')).join('');
  const n = folhas.length;
  return zip([
    { nome: '[Content_Types].xml', dados: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${folhas.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>` },
    { nome: '_rels/.rels', dados: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>` },
    { nome: 'docProps/core.xml', dados: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>NFS-e Web</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().slice(0, 19)}Z</dcterms:created></cp:coreProperties>` },
    { nome: 'docProps/app.xml', dados: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Microsoft Excel</Application></Properties>` },
    { nome: 'xl/workbook.xml', dados: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView activeTab="0"/></bookViews><sheets>${sheetsWb}</sheets>${defs ? `<definedNames>${defs}</definedNames>` : ''}<calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>` },
    { nome: 'xl/_rels/workbook.xml.rels', dados: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${folhas.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${n + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId${n + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>` },
    ...folhas.map((f, i) => ({ nome: `xl/worksheets/sheet${i + 1}.xml`, dados: f.xml })),
    { nome: 'xl/styles.xml', dados: styles },
    { nome: 'xl/sharedStrings.xml', dados: sst },
  ]);
}

window.gerarXlsx = xlsx;
})();
