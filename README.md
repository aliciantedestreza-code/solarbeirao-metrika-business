# Solar Beirão · MÉTRIKA ID Pro (ID + Business)

Site estático (sem build). Publicado na Vercel a partir deste repositório.

- `index.html` · MÉTRIKA ID público · `ementa.html` · ementa digital · `painel.html` · MÉTRIKA Business (noindex)
- `config.js` · dados do restaurante e ementa base (8 línguas)
- `pro.js` · camada ao vivo: lê o que o dono publica (Supabase `idpro_public`, slug `solarbeirao-cacilhas`) e aplica antes do motor
- `grupos.js` · agrupa a ementa em ≤10 cartões com sub-cartões
- Base de dados: Supabase `dnwijjgefcxurdffabyq`, tabelas `idpro_*` (RLS sem acesso direto; só funções). Só a chave publishable está no código.
