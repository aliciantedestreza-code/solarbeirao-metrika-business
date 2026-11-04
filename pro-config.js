/* MÉTRIKA ID Business · ligação deste restaurante ao painel.
   É o ÚNICO ficheiro que muda de cliente para cliente (além de config.js, alergenios/sugestões e imagens).
   slug  = identificador do restaurante na base de dados (tabela idpro_sites)
   key   = chave PUBLISHABLE do Supabase (pública por desenho; a base só se acede por funções com sessão)
   cores = cores do painel (iguais às do ID do restaurante) */
window.METRIKA_PRO = {
  slug: "o-tavira-setubal",
  api: "https://dnwijjgefcxurdffabyq.supabase.co/rest/v1/rpc/",
  key: "sb_publishable_Cb2obpnoRx-4W8DjCXKwkA_psuaaOgt",
  cores: { navy: "#122322", navy2: "#1f3b39", deep: "#0b1716", gold: "#d8b68c", goldD: "#8a6538" }
};
