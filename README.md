# Solar do Marquês (Setúbal) · MÉTRIKA ID Business

Site estático (sem build), motor MÉTRIKA padrão Solar Beirão (cópia do ramo `o-tavira-setubal`).
Estado: **DEMO + noindex** até o dono confirmar a carta (`modo:"demo"`, `precosConfirmados:false`, `robots.txt` Disallow).

- `index.html` ID público · `ementa.html` ementa digital (8 línguas) · `painel.html` painel do dono (noindex)
- `config.js` dados + ementa (60 artigos, 6 cartões) · `pro-config.js` slug `solar-do-marques-setubal` + cores
- Base de dados: Supabase `dnwijjgefcxurdffabyq`, tabela `idpro_sites`, slug `solar-do-marques-setubal`
- Fotos: originais do cliente com tratamento conservador (níveis/cor/nitidez), sem IA. Logótipo = reconstrução provisória do símbolo da parede.

## Mudar o endereço
`python3 ferramentas/definir-url.py https://endereco-final` → `python3 ferramentas/gerar-impressao.py`

## Passar a produção (depois de o dono validar)
1. Preços confirmados → `precosConfirmados:true`, `atualizadaEm`.
2. `modo:"normal"`, tirar `<meta name="robots" content="noindex">` de index/ementa e pôr `Allow: /` + `Sitemap:` no robots.txt.
3. Refazer o pacote de impressão (a marca «PROVA» desaparece sozinha).
