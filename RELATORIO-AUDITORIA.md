# Solar do Marquês · Auditoria MÉTRIKA Business · 09/11/2026

**Estado: APROVADO COM RESERVAS · nota interna 8,5/10 · DEMO + noindex**
Publicado: https://solar-do-marques-metrika.vercel.app (Vercel metrik, projeto `solar-do-marques-setubal`, dpl_9kXJrtDWCTXZce3r54AbiAzKMr7M, ramo `solar-do-marques-setubal` commit 1f10fad).

## Estado inicial do ZIP recebido: BLOQUEADO (4/10)
- P0 Sem Business real: painel em localStorage, sem login, RLS nem publicação.
- P0 Fotos geradas/alteradas por IA: sala-logotipo, balcão e esplanada recriadas; pratos 01/03/04/05 regenerados em fundo branco; **06-camarão era outro prato** (original: camarão em barro; site: camarão com batata e grelos).
- P0 Ementa sem preços (todos null) e só PT; sem aviso legal (couvert, IVA, 14 alergénios).
- P1 Logótipo = recorte desfocado (texto ilegível). Sem OG/JSON-LD/canonical/sitemap/robots. «Avaliar Google» substituído por reserva.
- P2 Motor diferente do aprovado (não reutilizava `idpro_*`).

## O que foi feito
- Reconstruído sobre o motor aprovado (Solar Beirão / O Tavira): ID + Business no mesmo link, 8 línguas, aviso legal, alergénios validados pelo dono, tradução automática dos pratos novos.
- Ementa: 60 artigos em 6 cartões, transcrita das 8 fotos da carta física, preços da carta (por confirmar), kg e doses separados, linguado sem preço.
- Fotos de espaço: 5 versões tratadas enviadas pelo João a 09/11 (pedido expresso; parecem tratadas com IA, pedir originais). Comida: 9 fotos enviadas pelo João a 09/11 (pedido expresso; várias tratadas com IA).
- Logótipo provisório: símbolo do peixe vetorizado da parede + tipografia.
- Reservas: só horas em que a casa está aberta (terça sem horas; 11:00–15:00 / 19:00–23:00).
- Business: slug `solar-do-marques-setubal` criado (bcrypt), password inicial entregue ao João.
- Correção no motor do painel: erro `replaceWith` ao mudar preço e tocar «Esgotado» logo a seguir.
- CLS: estado aberto/fechado e subtítulo reservam espaço.
- Pacote de impressão (marca PROVA até confirmar preços): ementa A4 (4 págs), cartão 85×55, QR porta A4, balcão A5.

## Testes (com evidência)
- Playwright 375/390/414/430: 40/40 (sem scroll horizontal, 6 ações, toques ≥44 px, sem IDs duplicados, alt, 0 erros, 0 404).
- E2E: 36/36 (8 línguas, 60 pratos, aviso legal, horas de reserva por dia, estado aberto/fechado em 5 horas simuladas incl. meia-noite, Business: password errada/certa, publicar Hoje, preço, esgotado, público PT/EN, refresh, 2.ª entrada, sair). Backend simulado.
- Servidor real (SQL como anon): login errado/certo, password de outro slug recusada, gravação, conflito de rev, isolamento (Tavira sem dados do Solar), token falso, bloqueio após 8 falhas, RLS 4/4, 0 privilégios anon. Tudo em transação revertida: 0 sessões, 0 tentativas, 0 histórico.
- Lighthouse mobile (local): ID 86/100/100/69* · ementa 96/100/100/69* (*SEO baixo só por noindex intencional).
- QR: 12/12 lidos a 300 dpi com o endereço final.
- Publicado: vcf, pro-config 200; ferramentas/ 404 (fora do deploy); painel noindex.

## Não feito / limites
- Teste no iPhone real e login no domínio publicado pelo browser (rede da sessão bloqueia supabase.co).
- Tradução automática real (simulada); depende do segredo ANTHROPIC_API_KEY no Supabase.
- CLS 0,16 no Lighthouse em rede lenta (troca de fonte/hero); local 0,02.
