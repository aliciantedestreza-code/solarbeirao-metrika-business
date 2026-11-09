/* MÉTRIKA ID Business · ligação deste restaurante ao painel.
   É o ÚNICO ficheiro que muda de cliente para cliente (além de config.js, alergenios/sugestões e imagens).
   slug  = identificador do restaurante na base de dados (tabela idpro_sites)
   key   = chave PUBLISHABLE do Supabase (pública por desenho; a base só se acede por funções com sessão)
   cores = cores do painel (iguais às do ID do restaurante) */
window.METRIKA_PRO = {
  slug: "solar-do-marques-setubal",
  api: "https://dnwijjgefcxurdffabyq.supabase.co/rest/v1/rpc/",
  key: "sb_publishable_Cb2obpnoRx-4W8DjCXKwkA_psuaaOgt",
  cores: { navy: "#5e1726", navy2: "#7a2133", deep: "#3a0d16", gold: "#e2c48f", goldD: "#8f5a2b" }
};
