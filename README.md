# Solar Beirão · MÉTRIKA ID Business (ID + painel do dono)

Site estático (sem build). Publicado na Vercel; para publicar, arrastar o conteúdo desta pasta (ou o ZIP) para o projeto.

- `index.html` · MÉTRIKA ID público · `ementa.html` · ementa digital · `painel.html` · painel do dono (noindex)
- `config.js` · dados do restaurante e ementa base (8 línguas) · `razaoSocial` e `nif` no rodapé e na Política de Privacidade
- `pro-config.js` · ligação ao painel (slug `solarbeirao-cacilhas`, chave publishable, cores). É o ficheiro que muda de cliente para cliente
- `pro.js` · camada ao vivo: lê o que o dono publica (Supabase `idpro_public`) e aplica antes do motor
- `alergenios.js` · os 14 alergénios em 8 línguas · `sugestoes-alergenios.js` · sugestões só para o painel (nunca aparecem ao cliente sem o dono validar)
- `grupos.js` · agrupa a ementa em ≤10 cartões com sub-cartões
- Base de dados: Supabase `dnwijjgefcxurdffabyq`, tabelas `idpro_*` (RLS sem acesso direto; só funções com sessão). Tradução: função `idpro-traduzir` (segredo `ANTHROPIC_API_KEY`). Só a chave publishable está no código.
