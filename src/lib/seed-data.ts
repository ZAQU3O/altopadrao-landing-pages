export interface SpaceFact {
  value: string;
  label: string;
}

export interface MosaicItem {
  cls: 'a' | 'b' | 'c' | 'd' | 'e';
  img: string;
  alt: string;
  title: string;
  subtitle: string;
}

export interface SpaItem {
  img: string;
  alt: string;
  text: string;
}

export interface FamilyItem {
  img: string;
  alt: string;
  title: string;
  text: string;
}

export interface LocationBullet {
  title: string;
  text: string;
}

export const INITIAL_SPACES = [
  {
    slug: 'aldebaran',
    subdomain: 'aldebaran.altopadraoreservas.com',
    name: 'Reserva Aldebaran',
    eyebrow: 'Reserva Aldebaran · Zona Leste de Teresina',
    region: 'Zona Leste · Av. Presidente Kennedy',
    developer: 'Mãe Rainha Urbanismo',
    offerTitle: 'Entrada + 60x',
    offerBadge: 'SEM JUROS',
    offerBarText: 'Entrada + 60x sem juros',
    heroSubtitle:
      '238 lotes a partir de 450 m², cercados por 49 mil m² de área verde e lazer. As unidades são limitadas.',
    projectTitle: 'Luxo está na beleza do essencial.',
    projectLead:
      'O Reserva Aldebaran, da Mãe Rainha Urbanismo, reúne lotes amplos, infraestrutura completa e contato diário com a natureza. É um bairro pensado para quem quer morar bem e ter o lazer a poucos passos de casa.',
    projectBody:
      'A entrada recebe você com porte-cochère, recepção e jardins. Dali, ruas arborizadas levam às quadras, às piscinas e aos jardins do condomínio.',
    architect: 'Lucas Novais',
    landscaper: 'Thiago Borges',
    spaTitle: 'Um spa com vista para a piscina.',
    spaLead:
      'Sauna úmida revestida em pastilhas, sala de massagem e chuveiro com bambu e seixos. Todos os ambientes foram desenhados para desacelerar.',
    locationTitle: 'Zona Leste, no final da Av. Kennedy.',
    locationLead:
      'Uma das regiões mais valorizadas de Teresina, com acesso rápido a serviços e vizinho do Aldebaran Ville.',
    ctaTitle: 'Garanta seu lote com entrada + 60x sem juros.',
    ctaLead:
      'Deixe seus dados e um corretor da AltoPadrão envia a tabela, o mapa de lotes disponíveis e a simulação da sua parcela. Com 238 lotes, os melhores saem primeiro.',
    footerDisclaimer:
      'AltoPadrão Imobiliária | CRECI 0481-PJ | Teresina - PI. Imagens ilustrativas de projeto, sujeitas a alterações. Condição de entrada + 60x sem juros sujeita a análise de crédito, disponibilidade e regras da incorporadora. Valores, metragens e condições podem mudar sem aviso prévio. Empreendimento da Mãe Rainha Urbanismo, em fase de obras.',
    whatsappNumber: '5586900000000',
    accentColor: '#a8582f',
    deepColor: '#16302e',
    maxInstallments: 60,
    defaultLotPrice: 350000,
    defaultDownPayment: 70000,
    totalLots: 238,
    availableLots: 38,
    minAreaM2: 450,
    greenAreaText: '49 mil m²',
    heroImage: '/images/aldebaran/hero-pool.jpg',
    projectImage: '/images/aldebaran/project-entrance.jpg',
    locationImage: '/images/aldebaran/location-pergola.jpg',
    ctaBgImage: '/images/aldebaran/cta-bg.jpg',
    factsJson: JSON.stringify([
      { value: '238', label: 'lotes em condomínio fechado' },
      { value: '450 m²', label: 'metragem a partir de' },
      { value: '49 mil m²', label: 'de área verde e lazer' },
      { value: 'Av. Kennedy', label: 'ao lado do Aldebaran Ville' },
    ]),
    offerBulletsJson: JSON.stringify([
      'Compra direta com a construtora',
      'Parcelas fixas, sem correção de juros',
      'Lotes de 450 m² em condomínio fechado',
    ]),
    mosaicJson: JSON.stringify([
      {
        cls: 'a',
        img: '/images/aldebaran/lazer-pool-island.jpg',
        alt: 'Piscina com ilha',
        title: 'Piscina com ilha',
        subtitle: 'Deck molhado, espreguiçadeiras e bar',
      },
      {
        cls: 'b',
        img: '/images/aldebaran/lazer-rooftop.jpg',
        alt: 'Lounge rooftop',
        title: 'Lounge rooftop',
        subtitle: 'Cozinha de apoio com vista aberta',
      },
      {
        cls: 'c',
        img: '/images/aldebaran/lazer-deck-gourmet.jpg',
        alt: 'Deck gourmet',
        title: 'Deck gourmet',
        subtitle: 'Para reunir família e amigos',
      },
      {
        cls: 'd',
        img: '/images/aldebaran/lazer-kids-pool.jpg',
        alt: 'Piscina infantil',
        title: 'Piscina infantil',
        subtitle: 'Raia rasa, vista para o deck',
      },
      {
        cls: 'e',
        img: '/images/aldebaran/lazer-games-room.jpg',
        alt: 'Sala de jogos',
        title: 'Sala de jogos',
        subtitle: 'Sinuca e tênis de mesa',
      },
    ]),
    tagsJson: JSON.stringify([
      'Campo de futebol',
      'Quadra poliesportiva',
      'Quadra de tênis',
      'Beach tênis',
      'Academia',
      'Salão de festas',
      'Pista de cooper',
      'Pet place',
    ]),
    spaItemsJson: JSON.stringify([
      {
        img: '/images/aldebaran/spa-sauna.jpg',
        alt: 'Sauna com janela para a piscina',
        text: 'Sauna com janela panorâmica para a piscina.',
      },
      {
        img: '/images/aldebaran/spa-massage.jpg',
        alt: 'Sala de massagem',
        text: 'Sala de massagem com iluminação indireta e pedra natural.',
      },
      {
        img: '/images/aldebaran/spa-shower.jpg',
        alt: 'Chuveiro do spa',
        text: 'Chuveiro externo em bambu e seixos.',
      },
    ]),
    familyItemsJson: JSON.stringify([
      {
        img: '/images/aldebaran/fam-playground.jpg',
        alt: 'Playground',
        title: 'Playground',
        text: 'Balanços, escorregadores e gira-gira em área de areia cercada de jardim.',
      },
      {
        img: '/images/aldebaran/fam-petplace.jpg',
        alt: 'Pet place',
        title: 'Pet place',
        text: 'Espaço cercado com túneis e obstáculos para seu cachorro correr solto.',
      },
      {
        img: '/images/aldebaran/fam-redario.jpg',
        alt: 'Redário',
        title: 'Redário',
        text: 'Rede ao ar livre entre árvores frutíferas, para a pausa da tarde.',
      },
    ]),
    locationBulletsJson: JSON.stringify([
      { title: 'Endereço', text: 'Av. Presidente Kennedy, Teresina - PI' },
      { title: 'Cinturão verde', text: 'Área preservada com caminhos para caminhada e cooper' },
      {
        title: 'Condições',
        text: 'Entrada + 60x sem juros, direto com a construtora. Fale com um corretor para a simulação do seu lote.',
      },
    ]),
    areaOptionsJson: JSON.stringify([
      '450 a 500 m²',
      '500 a 600 m²',
      'Acima de 600 m²',
      'Ainda não sei',
    ]),
    active: true,
    featuredOrder: 1,
  },
  {
    slug: 'terrasalphaville',
    subdomain: 'terrasalphaville.altopadraoreservas.com',
    name: 'Terras Alphaville Teresina 3',
    eyebrow: 'Terras Alphaville Teresina 3 · Um Novo Capítulo se Revela',
    region: 'Vetor Leste · Acesso Av. João XXIII / Jóquei',
    developer: 'Grupo Alphaville',
    offerTitle: 'Entrada + 72x',
    offerBadge: 'NOVA ETAPA 3B',
    offerBarText: 'Terras Alphaville Teresina 3 · Nova etapa com condições especiais de lançamento',
    heroSubtitle:
      'O Terras Alphaville Teresina 3 continua evoluindo e apresenta uma nova etapa, ampliando as formas de viver bem com novas experiências de lazer, mais áreas verdes e espaços de convivência.',
    projectTitle: 'A vida ganha novas possibilidades.',
    projectLead:
      'Com a nova etapa do Terras Alphaville Teresina 3, chegam novas experiências de lazer, mais áreas verdes e espaços de convivência, criando ainda mais possibilidades para aproveitar o dia a dia e viver com qualidade de vida.',
    projectBody:
      'Os residenciais do Grupo Alphaville contam com portaria monitorada 24h, plano de segurança desenvolvido em parceria com especialistas, controle de acesso informatizado, limite de velocidade nas vias e estacionamento com recarga para carro elétrico.',
    architect: 'Urbanismo & Arquitetura Grupo Alphaville',
    landscaper: 'Paisagismo Integrado à Fauna e Flora Nativa',
    spaTitle: 'Saúde, esporte e equilíbrio em meio ao verde.',
    spaLead:
      'Viver bem também é aproveitar o que a natureza tem de melhor. É encontrar tempo para caminhada, praticar atividades físicas na academia completa, brincar com as crianças ou sentir o equilíbrio nas novas praças e áreas de convivência.',
    locationTitle: 'Fácil acesso aos principais pontos da cidade.',
    locationLead:
      'O Terras Alphaville Teresina 3 está localizado em uma região com fácil acesso aos principais pontos da cidade, além de ser um vetor de crescimento de Teresina: a 5 km do Jockey Club, 7 km da UFPI, 9 km do Shopping Rio Poty e 10 km do Aeroporto.',
    ctaTitle: 'Um novo capítulo onde a vida ganha novas possibilidades.',
    ctaLead:
      'Esse pode ser o seu lugar. Deixe seus dados para receber a tabela da nova etapa do Terras Alphaville Teresina 3 e agendar seu atendimento exclusivo na AltoPadrão Imobiliária (Av. Lindolfo Monteiro, 1210 - Fátima).',
    footerDisclaimer:
      'AltoPadrão Imobiliária | CRECI 0481-PJ | Teresina - PI. O “Terras Alphaville Teresina 3” é um empreendimento imobiliário composto pelos loteamentos “Terras Alphaville Teresina 3A”, registrado sob o R-4 da matrícula nº 17.984, do 7° Oficial de Registro de Imóveis da Comarca de Teresina – PI, e “Terras Alphaville Teresina 3B”, em fase de aprovação final conforme Processo Administrativo n° 00097.000427/2026-48 (matrícula n° 23.364). Imagens e perspectivas artísticas meramente ilustrativas.',
    whatsappNumber: '5586900000000',
    accentColor: '#9b6234',
    deepColor: '#182c29',
    maxInstallments: 72,
    defaultLotPrice: 295000,
    defaultDownPayment: 59000,
    totalLots: 410,
    availableLots: 29,
    minAreaM2: 300,
    greenAreaText: 'Novas Praças & Áreas Verdes',
    heroImage: '/images/terrasalphaville/hero-banner.png',
    projectImage: '/images/terrasalphaville/galeria-21.png',
    locationImage: '/images/terrasalphaville/fotomontagem-aerea.jpg',
    ctaBgImage: '/images/terrasalphaville/galeria-11.png',
    factsJson: JSON.stringify([
      { value: 'Etapa 3B', label: 'novo capítulo Terras Alphaville' },
      { value: '300 m²+', label: 'lotes residenciais planejados' },
      { value: '5 a 9 km', label: 'do Jockey Club, UFPI e Rio Poty' },
      { value: 'Portaria 24h', label: 'segurança planejada Grupo Alphaville' },
    ]),
    offerBulletsJson: JSON.stringify([
      'Mais áreas verdes, novas praças e espaços de convivência',
      'Clube completo com Salão de Festas, Academia, Tênis e Quadra de Areia',
      'Estacionamento com recarga para carro elétrico e portaria monitorada 24h',
    ]),
    mosaicJson: JSON.stringify([
      {
        cls: 'a',
        img: '/images/terrasalphaville/galeria-01-salao-festas.png',
        alt: 'Piscina e Complexo Aquático do Clube',
        title: 'Complexo Aquático do Clube',
        subtitle: 'Piscina adulto com raia, deck molhado e solarium arborizado',
      },
      {
        cls: 'b',
        img: '/images/terrasalphaville/galeria-05-estar-tenis.png',
        alt: 'Salão de Festas',
        title: '01 · Salão de Festas',
        subtitle: 'Ambiente amplo e climatizado com vista para os jardins e ipês',
      },
      {
        cls: 'c',
        img: '/images/terrasalphaville/galeria-06-quadra-areia.png',
        alt: 'Espaço Gourmet do Salão de Festas',
        title: 'Espaço Gourmet & Churrasqueira',
        subtitle: 'Bancada gourmet equipada integrada ao salão social',
      },
      {
        cls: 'd',
        img: '/images/terrasalphaville/galeria-19.png',
        alt: 'Quadra de Tênis e Estar',
        title: '04 e 05 · Quadra de Tênis & Estar',
        subtitle: 'Quadra rápida iluminada com lounge pergolado de apoio',
      },
      {
        cls: 'e',
        img: '/images/terrasalphaville/galeria-03-academia.png',
        alt: 'Pista de Skate e Patins e Mini Quadra Esportiva',
        title: '07 e 08 · Pista de Skate, Patins & Mini Quadra',
        subtitle: 'Esportes ao ar livre integrados às novas praças de convivência',
      },
    ]),
    tagsJson: JSON.stringify([
      '01 · Salão de Festas',
      '02 · Brinquedoteca',
      '03 · Academia Completa',
      '04 · Quadra de Tênis',
      '05 · Estar Quadra de Tênis',
      '06 · Quadra de Areia',
      '07 · Mini Quadra Esportiva',
      '08 · Pista de Skate e Patins',
      '09 · Estar Teens',
      '10 · Recarga para Carro Elétrico',
    ]),
    spaItemsJson: JSON.stringify([
      {
        img: '/images/terrasalphaville/galeria-16.png',
        alt: '03 · Academia Terras Alphaville Teresina 3',
        text: '03 · Academia equipada com esteiras, simuladores de escada e vista para as áreas verdes.',
      },
      {
        img: '/images/terrasalphaville/galeria-15.png',
        alt: 'Studio Funcional e Pilates da Academia',
        text: 'Espaço de treino funcional, pesos livres e alongamento com iluminação arquitetônica.',
      },
      {
        img: '/images/terrasalphaville/galeria-10-carro-eletrico.png',
        alt: 'Redário e Praças de Convivência',
        text: 'Novas praças com redário sombreado para relaxar e sentir o equilíbrio em meio ao verde.',
      },
    ]),
    familyItemsJson: JSON.stringify([
      {
        img: '/images/terrasalphaville/galeria-14.png',
        alt: '02 · Brinquedoteca',
        title: '02 · Brinquedoteca',
        text: 'Ambiente lúdico climatizado com mezanino, escorregador de madeira e piscina de blocos.',
      },
      {
        img: '/images/terrasalphaville/galeria-12.png',
        alt: 'Acqua Play e Praça das Águas',
        title: 'Praça das Águas & Acqua Play',
        text: 'Fonte interativa com arcos d’água e cascata ao ar livre para refrescar a diversão em família.',
      },
      {
        img: '/images/terrasalphaville/galeria-08-pista-skate.png',
        alt: '10 · Estacionamento com Recarga para Carro Elétrico',
        title: '10 · Sustentabilidade & Carro Elétrico',
        text: 'Estacionamento do clube com ponto de recarga para veículo elétrico e preservação da flora nativa.',
      },
    ]),
    locationBulletsJson: JSON.stringify([
      {
        title: 'Proximidade e Acesso Rápido',
        text: 'Jockey Club Piauí (5 km) · Universidade Federal do Piauí - UFPI (7 km) · Shopping Rio Poty (9 km) · Aeroporto de Teresina (10 km)',
      },
      {
        title: 'Atendimento AltoPadrão Imobiliária',
        text: 'Avenida Lindolfo Monteiro, 1210 - Fátima, Teresina - PI',
      },
      {
        title: 'Sustentabilidade & Segurança 24h',
        text: 'Portaria monitorada 24h com controle informatizado e integração harmônica com a fauna e flora da região.',
      },
    ]),
    areaOptionsJson: JSON.stringify([
      'Lote Padrão Residencial (a partir de 300 m²)',
      'Lote Próximo ao Clube & Praças',
      'Lote de Esquina / Avenida Principal',
      'Desejo conhecer o Mapa Ilustrado completo',
    ]),
    active: true,
    featuredOrder: 2,
  },
  {
    slug: 'alphaville',
    subdomain: 'alphaville.altopadraoreservas.com',
    name: 'Alphaville Teresina',
    eyebrow: 'Alphaville Teresina · Alto Luxo Consolidado',
    region: 'Zona Leste · Região Alphaville',
    developer: 'Alphaville Urbanismo',
    offerTitle: 'Entrada + 60x',
    offerBadge: 'PRONTO PARA MORAR',
    offerBarText: 'Lotes selecionados e mansões exclusivas no Alphaville',
    heroSubtitle:
      'O endereço mais cobiçado do Piauí. Lotes amplos a partir de 480 m² e residências de alto padrão prontas para morar com vista para reserva ambiental permanente.',
    projectTitle: 'Onde a arquitetura autoral encontra a exclusividade.',
    projectLead:
      'Consolidado como referência máxima de urbanismo em Teresina, o Alphaville reúne residências assinadas pelos maiores arquitetos do país, fiação 100% subterrânea nos setores nobres e clube social completo.',
    projectBody:
      'Alamedas largas arborizadas com ipês e palmeiras imperiais garantem privacidade absoluta e conforto térmico em todas as quadras.',
    architect: 'Urbanismo Master Alphaville',
    landscaper: 'Burle Marx Inspiracional / Equipe Alphaville',
    spaTitle: 'Wellness Club & Tênis Center.',
    spaLead:
      'Sauna seca e a vapor, hidromassagem aquecida, vestiários boutique e atendimento exclusivo para moradores.',
    locationTitle: 'Conectado ao melhor da Zona Leste.',
    locationLead:
      'Vizinho aos melhores condomínios horizontais e com acesso expresso às avenidas Presidente Kennedy, Dom Severino e Nossa Senhora de Fátima.',
    ctaTitle: 'Consulte lotes e mansões disponíveis no Alphaville.',
    ctaLead:
      'Nossa diretoria de alto padrão apresenta unidades exclusivas off-market, lotes de ilha e projetos aprovados prontos para construir.',
    footerDisclaimer:
      'AltoPadrão Imobiliária | CRECI 0481-PJ | Teresina - PI. Especialistas em comercialização e captação no Alphaville Teresina.',
    whatsappNumber: '5586900000000',
    accentColor: '#8d4623',
    deepColor: '#122624',
    maxInstallments: 60,
    defaultLotPrice: 540000,
    defaultDownPayment: 108000,
    totalLots: 320,
    availableLots: 14,
    minAreaM2: 480,
    greenAreaText: '115 mil m²',
    heroImage: '/images/aldebaran/project-entrance.jpg',
    projectImage: '/images/aldebaran/hero-pool.jpg',
    locationImage: '/images/aldebaran/lazer-rooftop.jpg',
    ctaBgImage: '/images/aldebaran/cta-bg.jpg',
    factsJson: JSON.stringify([
      { value: '100%', label: 'condomínio consolidado e entregue' },
      { value: '480 m²', label: 'lotes amplos a partir de' },
      { value: '115 mil m²', label: 'de reserva ecológica nativa' },
      { value: '14 unid.', label: 'estoque seleto AltoPadrão' },
    ]),
    offerBulletsJson: JSON.stringify([
      'Lotes planos prontos para construir imediatamente',
      'Opções de parcelamento em até 60x ou financiamento bancário',
      'Avaliação prioritária para captação e permuta de imóveis',
    ]),
    mosaicJson: JSON.stringify([
      {
        cls: 'a',
        img: '/images/aldebaran/lazer-rooftop.jpg',
        alt: 'Restaurante & Lounge Privativo',
        title: 'Restaurante & Lounge Privativo',
        subtitle: 'Gastronomia de fim de semana exclusiva para condôminos',
      },
      {
        cls: 'b',
        img: '/images/aldebaran/hero-pool.jpg',
        alt: 'Piscina de Borda Infinita',
        title: 'Piscina de Borda Infinita',
        subtitle: 'Vista contemplativa para a mata preservada',
      },
      {
        cls: 'c',
        img: '/images/aldebaran/lazer-deck-gourmet.jpg',
        alt: 'Espaço Confraria & Adega',
        title: 'Espaço Confraria & Adega',
        subtitle: 'Climatizado para jantares intimistas',
      },
      {
        cls: 'd',
        img: '/images/aldebaran/lazer-kids-pool.jpg',
        alt: 'Complexo Aquático Infantil',
        title: 'Complexo Aquático Infantil',
        subtitle: 'Monitoria nos finais de semana e férias',
      },
      {
        cls: 'e',
        img: '/images/aldebaran/lazer-games-room.jpg',
        alt: 'Pro-Shop & Lounge Esportivo',
        title: 'Lounge do Tenista',
        subtitle: 'Apoio completo ao lado das quadras de saibro e rápida',
      },
    ]),
    tagsJson: JSON.stringify([
      'Quadras de Tênis Iluminadas',
      'Arena Beach Tennis Oficial',
      'Academia Technogym',
      'Restaurante Interno',
      'Capela Ecumênica',
      'Heliponto de Apoio Próximo',
      'Ronda Motorizada 24h',
      'Bosque de Caminhada',
    ]),
    spaItemsJson: JSON.stringify([
      {
        img: '/images/aldebaran/spa-sauna.jpg',
        alt: 'Sauna Panorâmica',
        text: 'Sauna revestida em pedras vulcânicas com vista para os jardins.',
      },
      {
        img: '/images/aldebaran/spa-massage.jpg',
        alt: 'Suíte de Massoterapia',
        text: 'Salas individuais climatizadas para estética e massoterapia.',
      },
      {
        img: '/images/aldebaran/spa-shower.jpg',
        alt: 'Solarium Privativo',
        text: 'Duchas escocesas e deck em madeira nobre certificada.',
      },
    ]),
    familyItemsJson: JSON.stringify([
      {
        img: '/images/aldebaran/fam-playground.jpg',
        alt: 'Parque Infantil',
        title: 'Parque Infantil Sombreado',
        text: 'Brinquedos importados sob a copa de árvores centenárias.',
      },
      {
        img: '/images/aldebaran/fam-petplace.jpg',
        alt: 'Espaço Pet',
        title: 'Pet Care & Agility',
        text: 'Área gramada exclusiva para socialização segura dos animais.',
      },
      {
        img: '/images/aldebaran/fam-redario.jpg',
        alt: 'Mirante do Pôr do Sol',
        title: 'Mirante do Pôr do Sol',
        text: 'Pergolado contemplativo voltado para o poente de Teresina.',
      },
    ]),
    locationBulletsJson: JSON.stringify([
      { title: 'Endereço', text: 'Complexo Alphaville, Zona Leste / BR-343 - Teresina - PI' },
      { title: 'Vizinhança', text: 'Alto padrão consolidado com valorização histórica acima do IPCA + 12% a.a.' },
      {
        title: 'Atendimento Private',
        text: 'Agende visita guiada em carro executivo com um especialista AltoPadrão.',
      },
    ]),
    areaOptionsJson: JSON.stringify([
      '480 a 550 m²',
      '550 a 750 m²',
      'Lote Duplo / Ilha (> 800 m²)',
      'Mansão Pronta para Morar',
    ]),
    active: true,
    featuredOrder: 3,
  },
  {
    slug: 'fazendareal',
    subdomain: 'fazendareal.altopadraoreservas.com',
    name: 'Fazenda Real Residence',
    eyebrow: 'Fazenda Real · Condomínio Haras & Lago',
    region: 'Eixo Leste · Teresina - PI',
    developer: 'Grupo Fazenda Real',
    offerTitle: 'Entrada + 60x',
    offerBadge: 'LOTES DE 1.000 m²',
    offerBarText: 'Chácaras de luxo e lotes de 1.000 m² em até 60x',
    heroSubtitle:
      'A amplitude de uma fazenda com a segurança e a sofisticação de um resort. Lotes a partir de 1.000 m² com haras completo, lago natural navegável e adega subterrânea.',
    projectTitle: 'O privilégio de viver cercado por horizontes abertos.',
    projectLead:
      'O Fazenda Real Residence oferece lotes de 1.000 m² a 2.400 m² para famílias que buscam construir verdadeiros refúgios particulares com pomar próprio, piscina borda infinita e total privacidade.',
    projectBody:
      'Conta com centro equestre completo, baias ventiladas, pista de hipismo, lago para esportes sem motor e restaurante rústico-contemporâneo.',
    architect: 'Ronaldo Veras Arquitetura',
    landscaper: 'Ateliê Botânico Nordeste',
    spaTitle: 'Termas do Campo & Descanso.',
    spaLead:
      'Ambiente inspirado nos grandes hotéis fazenda internacionais, com ofurô aquecido, sauna úmida e massagem ao som das águas.',
    locationTitle: 'Tranquilidade absoluta a 15 minutos da cidade.',
    locationLead:
      'Fácil acesso por pista duplicada na saída leste de Teresina, unindo a paz do campo à conveniência urbana.',
    ctaTitle: 'Solicite a tabela de lotes de 1.000 m².',
    ctaLead:
      'Unidades frente lago e próximas ao haras com condições especiais de parcelamento direto em até 60 meses.',
    footerDisclaimer:
      'AltoPadrão Imobiliária | CRECI 0481-PJ | Teresina - PI. Comercialização autorizada de lotes e residências no Fazenda Real Residence.',
    whatsappNumber: '5586900000000',
    accentColor: '#7c4d2b',
    deepColor: '#1b2e23',
    maxInstallments: 60,
    defaultLotPrice: 420000,
    defaultDownPayment: 84000,
    totalLots: 190,
    availableLots: 21,
    minAreaM2: 1000,
    greenAreaText: '240 mil m²',
    heroImage: '/images/aldebaran/location-pergola.jpg',
    projectImage: '/images/aldebaran/lazer-deck-gourmet.jpg',
    locationImage: '/images/aldebaran/fam-redario.jpg',
    ctaBgImage: '/images/aldebaran/cta-bg.jpg',
    factsJson: JSON.stringify([
      { value: '1.000 m²', label: 'lotes amplos a partir de' },
      { value: '240 mil m²', label: 'de mata nativa e lagos' },
      { value: 'Haras VIP', label: 'centro equestre completo' },
      { value: '60x fixas', label: 'parcelamento direto especial' },
    ]),
    offerBulletsJson: JSON.stringify([
      'Lotes de 1.000 m² a 2.400 m² com vista para o lago ou mata',
      'Haras privativo, trilha ecológica e restaurante fazenda',
      'Parcelamento direto em até 60x sem burocracia bancária',
    ]),
    mosaicJson: JSON.stringify([
      {
        cls: 'a',
        img: '/images/aldebaran/lazer-deck-gourmet.jpg',
        alt: 'Casarão Gourmet & Adega',
        title: 'Casarão Gourmet & Adega',
        subtitle: 'Arquitetura colonial contemporânea à beira do lago',
      },
      {
        cls: 'b',
        img: '/images/aldebaran/hero-pool.jpg',
        alt: 'Piscina Resort com Prainha',
        title: 'Piscina Resort com Prainha',
        subtitle: 'Integrada ao bar molhado e bangalôs de madeira',
      },
      {
        cls: 'c',
        img: '/images/aldebaran/lazer-rooftop.jpg',
        alt: 'Mirante do Lago',
        title: 'Mirante do Lago',
        subtitle: 'Deck suspenso para caiaque, stand-up paddle e pesca esportiva',
      },
      {
        cls: 'd',
        img: '/images/aldebaran/lazer-kids-pool.jpg',
        alt: 'Fazendinha Kids',
        title: 'Fazendinha & Lazer Infantil',
        subtitle: 'Contato direto com a natureza e animais dóceis',
      },
      {
        cls: 'e',
        img: '/images/aldebaran/lazer-games-room.jpg',
        alt: 'Salão de Sinuca & Charutaria',
        title: 'Salão de Jogos & Confraria',
        subtitle: 'Ambiente rústico em couro e madeira maciça',
      },
    ]),
    tagsJson: JSON.stringify([
      'Haras & Centro Equestre',
      'Lago Natural Navegável',
      'Pista de Hipismo',
      'Quadras de Tênis de Saibro',
      'Beach Tennis',
      'Adega Subterrânea',
      'Horta Orgânica Comunitária',
      'Segurança Monitorada 24h',
    ]),
    spaItemsJson: JSON.stringify([
      {
        img: '/images/aldebaran/spa-sauna.jpg',
        alt: 'Sauna do Bosque',
        text: 'Sauna úmida com aromaterapia de eucalipto colhido na fazenda.',
      },
      {
        img: '/images/aldebaran/spa-massage.jpg',
        alt: 'Bangalô de Massagem',
        text: 'Atendimento relaxante em bangalô reservado junto ao jardim.',
      },
      {
        img: '/images/aldebaran/spa-shower.jpg',
        alt: 'Ofurô & Duchas',
        text: 'Chuveiros naturais em pedra e bambu ao ar livre.',
      },
    ]),
    familyItemsJson: JSON.stringify([
      {
        img: '/images/aldebaran/fam-playground.jpg',
        alt: 'Casa na Árvore & Parque',
        title: 'Casa na Árvore & Parque',
        text: 'Aventura segura ao ar livre com tirolesa infantil e circuitos de madeira.',
      },
      {
        img: '/images/aldebaran/fam-petplace.jpg',
        alt: 'Espaço Livre Pet',
        title: 'Gramado Livre Pet',
        text: 'Mais de 3.000 m² cercados para cães de médio e grande porte.',
      },
      {
        img: '/images/aldebaran/fam-redario.jpg',
        alt: 'Alameda dos Cajueiros',
        title: 'Redário sob os Cajueiros',
        text: 'Sombra fresca o dia inteiro com brisa constante do lago.',
      },
    ]),
    locationBulletsJson: JSON.stringify([
      { title: 'Endereço', text: 'Rodovia BR-343, Eixo Leste - Teresina / Altos - PI' },
      { title: 'Estilo de Vida', text: 'Primeira moradia ou casa de campo de altíssimo padrão' },
      {
        title: 'Condições',
        text: 'Entrada parcelada + 60x direto ou avaliação do seu imóvel atual.',
      },
    ]),
    areaOptionsJson: JSON.stringify([
      '1.000 a 1.200 m²',
      '1.200 a 1.800 m²',
      'Acima de 1.800 m² (Frente Lago)',
      'Casa Construída no Condomínio',
    ]),
    active: true,
    featuredOrder: 4,
  },
];

