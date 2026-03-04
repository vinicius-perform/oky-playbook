export const appData = {
  title: "Reunião Estratégica",
  subtitle: "Checkpoint de OKRs",
  sections: [
    {
      id: "1",
      title: "ENCAMINHAMENTOS DA REUNIÃO ANTERIOR",
      items: [
        "Verificar encaminhamentos"
      ]
    },
    {
      id: "2",
      title: "VISÃO DO ANALISTA DE DADOS",
      items: [
        "Investimento",
        "Quantidade de leads",
        "Custo por Lead",
        "Taxa de Conversão do Comercial",
        "Tempo Médio de Resposta",
        "Closer",
        "Produção de Conteúdo"
      ],
      requiresDiagnostic: true,
      diagnosticPrompt: "Diagnóstico claro em 1 frase. Ex: 'O gargalo está na conversão comercial (12%), apesar do CPL saudável.'",
      requiresReason: true
    },
    {
      id: "3",
      title: "CONGRUÊNCIA DO FUNIL COMPLETO",
      items: [
        "Distribuição da Kommo",
        "Link Bio Kommo",
        "Instagram Kommo",
        "Link Bio > Número das Campanhas > Conexão Kommo"
      ],
      requiresDiagnostic: true,
      diagnosticPrompt: "Ajuste necessário no funil (sim ou não + onde)",
      requiresReason: true
    },
    {
      id: "4",
      title: "RESULTADO GERAL DO TIME COMERCIAL",
      items: [
        "Volume de Oportunidades",
        "Média de Leads",
        "Taxa de Conversão",
        "Gap da Meta",
        "Distribuição Funil de Venda"
      ],
      requiresDiagnostic: true,
      diagnosticPrompt: "Decisão clara para melhorar a conversão.",
      requiresReason: true
    },
    {
      id: "5",
      title: "PRODUÇÃO DE CONTEÚDO ORGÂNICO",
      items: [
        "Quantidade de posts feitos",
        "Stories diários foram cumpridos?",
        "Engajamento",
        "Crescimento de seguidores",
        "Investimento em Vis.Perfil / Quantidade Leads Link Bio",
        "Custo por Leads Link Bio",
        "Quantidade de Consulta Vendida pelo Instagram"
      ],
      requiresDiagnostic: true,
      diagnosticPrompt: "O orgânico está alinhado com o tráfego ou está desconectado?",
      requiresReason: true
    },
    {
      id: "6",
      title: "INVESTIMENTO EM TRÁFEGO",
      items: [
        "Valor Investido",
        "Calculadora de Investimento",
        "Distribuição por Campanha",
        "Público Congruente?",
        "Criativos Ativos",
        "Teste de Criativos Rodando?",
        "Número de Whatsapp Correto com a Kommo"
      ],
      requiresDiagnostic: true,
      diagnosticPrompt: "Estamos escalando o que funciona ou insistindo no que não funciona?",
      requiresReason: true
    },
    {
      id: "7",
      title: "ACOMPANHAMENTO DAS NEGOCIAÇÕES",
      items: [
        "Orçamentos Novos",
        "Valor dos Orçamentos Novos",
        "Quantidade Orçamento Fechado",
        "Valor do Contrato",
        "Valor Recebido",
        "Quantidade de Follow",
        "Valor em Follow",
        "Quantidade Orçamento Fechado",
        "Valor do Contrato",
        "Valor Recebido"
      ],
      requiresDiagnostic: true,
      diagnosticPrompt: "Organização obrigatória para não perder leads quentes"
    },
    {
      id: "8",
      title: "CONCLUSÃO DE RESULTADOS GERAL DO PROJETO",
      items: [
        "O que temos que fazer para escalar esse projeto ou melhorar?"
      ],
      requiresReason: true
    }
  ]
};
