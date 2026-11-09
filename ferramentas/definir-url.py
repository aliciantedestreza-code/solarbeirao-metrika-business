#!/usr/bin/env python3
"""MÉTRIKA ID · Solar do Marquês · definir o endereço final.
Uso: python3 ferramentas/definir-url.py https://endereco-final
Atualiza config.js (url), canonical/og/JSON-LD (index e ementa), sitemap, contacto.vcf e os QR (png/svg)."""
import json,re,sys,os
import segno
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
U=sys.argv[1].rstrip('/')
p=lambda f: os.path.join(R,f)
s=open(p('config.js'),encoding='utf-8').read()
i=s.index('window.METRIKA_CONFIG = ')+len('window.METRIKA_CONFIG = ')
C=json.loads(s[i:s.rindex(';')]); C['url']=U
open(p('config.js'),'w',encoding='utf-8').write(s[:i]+json.dumps(C,ensure_ascii=False,indent=1)+';\n')
N=C['negocio'];M=N['morada'];D=C['horario']['dias']
EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
spec={}
for k,v in D.items():
  for a,b in v: spec.setdefault((a,'23:59' if b=='24:00' else b),[]).append(EN[int(k)])
ld={"@context":"https://schema.org","@type":"Restaurant","name":N['nome'],"url":U+"/","image":U+"/og.jpg","logo":U+"/icon-512.png",
 "telephone":N['telefone'],"email":N['email'] or None,"priceRange":N['precoMedio'] or None,
 "openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":d,"opens":a,"closes":b} for (a,b),d in spec.items()],
 "servesCuisine":["Portuguese","Seafood"],
 "address":{"@type":"PostalAddress","streetAddress":M['rua'],"postalCode":M['codigoPostal'] or None,"addressLocality":M['cidade'],"addressCountry":"PT"},
 "hasMenu":U+"/ementa.html","sameAs":[x for x in [C['links'].get('instagram'),C['links'].get('facebook'),C['links'].get('tripadvisor')] if x]}
def clean(o):
  if isinstance(o,dict): return {k:clean(v) for k,v in o.items() if v not in (None,'',[])}
  if isinstance(o,list): return [clean(x) for x in o]
  return o
ld=json.dumps(clean(ld),ensure_ascii=False)
for f,path in (('index.html','/'),('ementa.html','/ementa.html')):
  h=open(p(f),encoding='utf-8').read()
  h=re.sub(r'<link rel="canonical" href="[^"]*">',f'<link rel="canonical" href="{U}{path}">',h)
  h=re.sub(r'<meta property="og:url" content="[^"]*">',f'<meta property="og:url" content="{U}{path}">',h)
  h=re.sub(r'<meta property="og:image" content="[^"]*">',f'<meta property="og:image" content="{U}/og.jpg">',h)
  if f=='index.html': h=re.sub(r'<script type="application/ld\+json">.*?</script>',lambda m:f'<script type="application/ld+json">{ld}</script>',h,flags=re.S)
  open(p(f),'w',encoding='utf-8').write(h)
open(p('sitemap.xml'),'w').write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{U}/</loc></url><url><loc>{U}/ementa.html</loc></url></urlset>\n')
e=lambda x:x.replace('\\','\\\\').replace(',','\\,').replace(';',r'\;')
v=['BEGIN:VCARD','VERSION:3.0',f"N:;{e(N['nome'])};;;",f"FN:{e(N['nome'])}",f"ORG:{e(N['nomeCompleto'])}",f"TEL;TYPE=WORK,VOICE:{N['telefone']}"]
if N.get('telemovel'): v.append(f"TEL;TYPE=CELL:{N['telemovel']}"+(" (WhatsApp)" if False else ""))
if N.get('email'): v.append(f"EMAIL;TYPE=WORK:{N['email']}")
v+= [f"ADR;TYPE=WORK:;;{e(M['rua'])};{e(M['cidade'])};;{e(M['codigoPostal'])};{M['pais']}",f"URL:{U}/","NOTE:WhatsApp e reservas: "+(C['whatsapp']['numero'] if C['whatsapp'].get('confirmado') else N['telefone']),'END:VCARD']
open(p('contacto.vcf'),'w',encoding='utf-8',newline='\r\n').write('\n'.join(v)+'\n')
cor='#5e1726'
for nome,q in (('qr-ementa.png','/ementa.html?source=qr'),('qr-mesa.png','/?source=mesa'),('qr-porta.png','/?source=porta'),('qr-impressao.png','/?source=impressao')):
  segno.make(U+q,error='q',micro=False).save(p(nome),scale=12,border=4,dark=cor,light='#ffffff')
segno.make(U+'/?source=qr',error='q',micro=False).save(p('qr.svg'),scale=6,border=4,dark=cor,light='#ffffff')
print('URL definido:',U)
