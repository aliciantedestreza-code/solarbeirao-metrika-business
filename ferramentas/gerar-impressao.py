#!/usr/bin/env python3
"""MÉTRIKA ID · Solar do Marquês · pacote de impressão (gerado do config.js).
Uso: python3 ferramentas/gerar-impressao.py   → pasta impressao/
Enquanto precosConfirmados:false, as páginas levam a marca «PROVA · preços por confirmar»."""
import json,os,base64,segno,io
from playwright.sync_api import sync_playwright
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); P=lambda f: os.path.join(R,f)
s=open(P('config.js'),encoding='utf-8').read(); i=s.index('window.METRIKA_CONFIG = ')+24; C=json.loads(s[i:s.rindex(';')])
N=C['negocio'];U=C['url'];OUT=P('impressao');os.makedirs(OUT,exist_ok=True)
PROVA=not C['ementa']['precosConfirmados']
def qr(q,scale=10):
  b=io.BytesIO();segno.make(U+q,error='q').save(b,kind='png',scale=20,border=4,dark='#5e1726',light='#ffffff')
  return '<img class=qrimg alt="QR" src="data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()+'">'
def img(f): return 'data:image/webp;base64,'+base64.b64encode(open(P(f),'rb').read()).decode()
LOGO=img('assets/img/logo-600.webp')
def eur(v): return ('%.2f'%v).replace('.',',')+' €'
FONT=f"""@font-face{{font-family:PF;src:url(file://{R}/assets/fonts/playfair-display-latin-500-normal.woff2)}}
@font-face{{font-family:PF;font-style:italic;src:url(file://{R}/assets/fonts/playfair-display-latin-400-italic.woff2)}}
@font-face{{font-family:DM;src:url(file://{R}/assets/fonts/dm-sans-latin-400-normal.woff2)}}
@font-face{{font-family:DM;font-weight:700;src:url(file://{R}/assets/fonts/dm-sans-latin-700-normal.woff2)}}
*{{box-sizing:border-box}}body{{margin:0;font-family:DM,sans-serif;color:#2a1a1c;-webkit-print-color-adjust:exact;print-color-adjust:exact}}"""
LEG=["Nenhum prato, produto alimentar ou bebida, incluindo o couvert, pode ser cobrado se não for solicitado pelo cliente ou por este for inutilizado (art. 135.º do Decreto-Lei n.º 10/2015, de 16 de janeiro).",
 "Preços em euros, IVA incluído à taxa legal em vigor.","Alergias ou intolerâncias? Informe a equipa antes de pedir. Substâncias que provocam alergias ou intolerâncias (Reg. UE 1169/2011): glúten, crustáceos, ovos, peixes, amendoins, soja, leite/lactose, frutos de casca rija, aipo, mostarda, sementes de sésamo, dióxido de enxofre e sulfitos, tremoço e moluscos.",
 "Este estabelecimento dispõe de Livro de Reclamações (físico e eletrónico: www.livroreclamacoes.pt)."]
def ementa():
  cats=[];cur=''
  for c in C['ementa']['categorias']:
    if c['id'] in ('tacho',): cats.append(cur);cur=''
    rows=''.join(f"<li><span>{p[0]}</span><b>{(eur(p[8])+('/'+p[9] if len(p)>9 and p[9] else '')) if isinstance(p[8],(int,float)) else 'Sob consulta'}</b></li>" for p in c['pratos'])
    cur+=f"<section><h2>{c['nome'][0]}</h2><ul>{rows}</ul></section>"
  cats.append(cur)
  q=qr('/ementa.html?source=impressao',4)
  foot=f"<div class=ft><div>{N['nome']} · {N['morada']['rua']}, {N['morada']['cidade']} · {N['telefone'][4:7]} {N['telefone'][7:10]} {N['telefone'][10:]}{' · <i>PROVA · preços por confirmar</i>' if PROVA else ''}</div><div class=q>{q}<span>Ementa em 8 línguas</span></div></div>"
  return f"""<html><head><style>{FONT}
@page{{size:A4;margin:0}}
.pg{{width:210mm;height:297mm;overflow:hidden;padding:16mm 16mm 30mm;position:relative;page-break-after:always;background:#faf6ef}}
.cover{{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#5e1726;color:#faf6ef}}
.cover>img{{width:95mm;border-radius:50%}}.cover h1{{font:italic 400 22pt PF;margin:12mm 0 3mm}}.cover p{{margin:0;font-size:11pt;opacity:.9}}
.cols{{column-count:2;column-gap:10mm}}section{{break-inside:avoid;margin:0 0 7mm}}
h2{{font:500 15pt PF;color:#5e1726;margin:0 0 2.5mm;padding-bottom:1.5mm;border-bottom:.4mm solid #e2c48f}}
ul{{list-style:none;margin:0;padding:0}}li{{display:flex;justify-content:space-between;gap:4mm;font-size:9.6pt;padding:1.1mm 0;border-bottom:.2mm dotted #d9c9c0}}li b{{white-space:nowrap;color:#5e1726}}
.ft{{position:absolute;left:16mm;right:16mm;bottom:9mm;display:flex;justify-content:space-between;align-items:center;font-size:8pt;color:#6b5a5c}}.ft .q{{display:flex;align-items:center;gap:2mm}}.ft .qrimg{{width:20mm;height:20mm}}
.cover .ft{{color:#e2c48f}}.leg h2{{margin-top:0}}.leg p{{font-size:10pt;line-height:1.5}}
</style></head><body>
<div class="pg cover"><img src="{LOGO}"><h1>{N['slogan']['pt']}</h1><p>{N['morada']['rua']} · {N['morada']['cidade']}</p>{foot}</div>
{''.join('<div class=pg><div class=cols>'+x+'</div>'+foot+'</div>' for x in cats)}
<div class="pg leg"><h2>Informação ao cliente</h2>{''.join('<p>'+x+'</p>' for x in LEG)}{foot}</div></body></html>"""
def cartao():
  q=qr('/?source=cartao',4)
  return f"""<html><head><style>{FONT}@page{{size:85mm 55mm;margin:0}}.c{{width:85mm;height:55mm;page-break-after:always;display:flex;align-items:center;gap:4mm;padding:4mm 5mm;overflow:hidden}}
.f{{background:#5e1726;color:#faf6ef;justify-content:center;flex-direction:column;text-align:center;gap:1.5mm}}.f>img{{width:30mm;border-radius:50%}}.f p{{margin:0;font:italic 9pt PF}}
.b{{background:#faf6ef}}.b .qrimg{{width:30mm;height:30mm;flex:none}}.b div{{font-size:7.4pt;line-height:1.45}}.b b{{font:500 10.5pt PF;color:#5e1726;display:block;margin-bottom:1mm}}</style></head><body>
<div class="c f"><img src="{LOGO}"><p>{N['slogan']['pt']}</p></div>
<div class="c b">{q}<div><b>{N['nome']}</b>{N['morada']['rua'].replace(', ',',&nbsp;')}<br>{N['morada']['cidade']}<br>Tel. 265 409 322<br>WhatsApp 967 806 773<br>{N['email']}<br>Ementa em 8 línguas →</div></div></body></html>"""
def sinal(fmt,src,w,h,title):
  q=qr(f'/?source={src}',8)
  return f"""<html><head><style>{FONT}@page{{size:{fmt};margin:0}}.s{{width:{w}mm;height:{h}mm;background:#5e1726;color:#faf6ef;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:{h*0.025}mm}}
.s>img{{width:{w*0.32}mm;border-radius:50%}}.s h1{{font:500 {w*0.11}pt PF;margin:0}}.s .q{{background:#fff;padding:{w*0.02}mm;border-radius:{w*0.03}mm}}.s .qrimg{{width:{w*0.5}mm;height:{w*0.5}mm;display:block}}
.s p{{margin:0;font-size:{w*0.055}pt;letter-spacing:.04em}}.s small{{font-size:{w*0.04}pt;opacity:.85}}</style></head><body>
<div class=s><img src="{LOGO}"><h1>{title}</h1><div class=q>{q}</div><p>Ementa · Reservas · Contactos</p><small>Menu · Menú · Speisekarte · Menù · 菜单 · メニュー</small></div></body></html>"""
jobs=[('ementa-A4.pdf',ementa(),{'format':'A4'}),('cartao-85x55.pdf',cartao(),{'width':'85mm','height':'55mm'}),
 ('qr-porta-A4.pdf',sinal('A4','porta',210,297,'Veja a nossa ementa'),{'format':'A4'}),('qr-balcao-A5.pdf',sinal('A5','balcao',148,210,'Veja a nossa ementa'),{'format':'A5'})]
with sync_playwright() as p:
  b=p.chromium.launch();pg=b.new_page()
  for f,html,o in jobs:
    t=os.path.join(OUT,'_t.html');open(t,'w',encoding='utf-8').write(html);pg.goto('file://'+t);pg.evaluate('document.fonts.ready');pg.wait_for_timeout(300)
    pg.pdf(path=os.path.join(OUT,f),print_background=True,prefer_css_page_size=True,**o);print('ok',f)
  os.remove(t);b.close()
