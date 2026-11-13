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
    name: 'Terras Alphaville',
    eyebrow: 'Terras Alphaville · Eixo Leste de Teresina',
    region: 'BR-343 · Eixo Leste Valorizado',
    developer: 'Alphaville Urbanismo',
    offerTitle: 'Entrada + 72x',
    offerBadge: 'TABELA DIRETA',
    offerBarText: 'Lotes prontos e na planta em até 72x',
    heroSubtitle:
      'Lotes residenciais a partir de 330 m² com clube privativo de 26 mil m², complexo de beach tennis e segurança perimetral inteligente 24h.',
    projectTitle: 'A assinatura Alphaville ao alcance da sua família.',
    projectLead:
      'Terras Alphaville Teresina combina o padrão construtivo consagrado da Alphaville Urbanismo com lotes versáteis, topografia privilegiada e infraestrutura de lazer entregue equipada e decorada.',
    projectBody:
      'Portaria com controle biométrico e reconhecimento facial, avenidas largas com ciclofaixa integrada e um clube completo pensado para o convívio seguro das crianças.',
    architect: 'Estúdio Alphaville Arquitetura',
    landscaper: 'Benedito Abbud Paisagismo',
    spaTitle: 'Bem-estar, esporte e contemplação.',
    spaLead:
      'Fitness center com vista para o parque linear, solarium junto à piscina adulto com raia de 25m e espaço zen arborizado.',
    locationTitle: 'Acesso duplicado no vetor de maior expansão.',
    locationLead:
      'Localizado no eixo leste da BR-343, a poucos minutos dos principais colégios, centros gastronômicos e hospitais da Zona Leste.',
    ctaTitle: 'Reserve seu lote no Terras Alphaville.',
    ctaLead:
      'Receba o mapa atualizado de disponibilidade, lotes de esquina e frente para a praça com simulação personalizada AltoPadrão.',
    footerDisclaimer:
      'AltoPadrão Imobiliária | CRECI 0481-PJ | Teresina - PI. Condições comerciais sujeitas à disponibilidade de unidades no quadro de vendas.',
    whatsappNumber: '5586900000000',
    accentColor: '#9b6234',
    deepColor: '#182c29',
    maxInstallments: 72,
    defaultLotPrice: 295000,
    defaultDownPayment: 59000,
    totalLots: 410,
    availableLots: 29,
    minAreaM2: 330,
    greenAreaText: '68 mil m²',
    heroImage: '/images/aldebaran/lazer-pool-island.jpg',
    projectImage: '/images/aldebaran/project-entrance.jpg',
    locationImage: '/images/aldebaran/location-pergola.jpg',
    ctaBgImage: '/images/aldebaran/cta-bg.jpg',
    factsJson: JSON.stringify([
      { value: '410', label: 'lotes residenciais exclusivos' },
      { value: '330 m²', label: 'metragem a partir de' },
      { value: '68 mil m²', label: 'de áreas verdes e clube' },
      { value: '26 mil m²', label: 'de clube privativo equipado' },
    ]),
    offerBulletsJson: JSON.stringify([
      'Financiamento direto em até 72 parcelas',
      'Clube privativo entregue equipado e climatizado',
      'Alto potencial de valorização patrimonial na Zona Leste',
    ]),
    mosaicJson: JSON.stringify([
      {
        cls: 'a',
        img: '/images/aldebaran/hero-pool.jpg',
        alt: 'Complexo Aquático Club House',
        title: 'Complexo Aquático Club House',
        subtitle: 'Piscina adulto com raia semiolímpica e deck solarium',
      },
      {
        cls: 'b',
        img: '/images/aldebaran/lazer-rooftop.jpg',
        alt: 'Salão Social Panorâmico',
        title: 'Salão Social Panorâmico',
        subtitle: 'Espaço para 180 convidados com cozinha industrial',
      },
      {
        cls: 'c',
        img: '/images/aldebaran/lazer-deck-gourmet.jpg',
        alt: 'Quiosques de Churrasco',
        title: 'Quiosques Gourmet',
        subtitle: 'Forno de pizza e churrasqueira parrillera',
      },
      {
        cls: 'd',
        img: '/images/aldebaran/lazer-kids-pool.jpg',
        alt: 'Acqua Kids',
        title: 'Acqua Kids',
        subtitle: 'Piscina infantil climatizada integrada ao espaço família',
      },
      {
        cls: 'e',
        img: '/images/aldebaran/lazer-games-room.jpg',
        alt: 'Teen Lounge',
        title: 'Teen Lounge & Jogos',
        subtitle: 'Ambiente climatizado para jovens e confraternizações',
      },
    ]),
    tagsJson: JSON.stringify([
      '3 Quadras de Beach Tennis',
      'Quadra de Tênis Rápida',
      'Campo Society Grama Natural',
      'Fitness Center Panorâmico',
      'Trilha Ecológica 2,4 km',
      'Brinquedoteca Montessoriana',
      'Mercado Autônomo 24h',
      'Segurança Armada 24h',
    ]),
    spaItemsJson: JSON.stringify([
      {
        img: '/images/aldebaran/spa-sauna.jpg',
        alt: 'Sauna e Relaxamento',
        text: 'Sauna integrada ao complexo aquático do Club House.',
      },
      {
        img: '/images/aldebaran/spa-massage.jpg',
        alt: 'Espaço Zen',
        text: 'Sala silenciosa para terapias corporais, leitura e pilates.',
      },
      {
        img: '/images/aldebaran/spa-shower.jpg',
        alt: 'Duchas Naturais',
        text: 'Duchas externas cercadas por paisagismo tropical nativo.',
      },
    ]),
    familyItemsJson: JSON.stringify([
      {
        img: '/images/aldebaran/fam-playground.jpg',
        alt: 'Vila das Crianças',
        title: 'Vila das Crianças',
        text: 'Praça temática com piso drenante seguro e brinquedos lúdicos em madeira de lei.',
      },
      {
        img: '/images/aldebaran/fam-petplace.jpg',
        alt: 'Dog Park Agility',
        title: 'Dog Park Agility',
        text: 'Gramado sombreado com circuito agility e hidratação para pets.',
      },
      {
        img: '/images/aldebaran/fam-redario.jpg',
        alt: 'Pomar & Redário',
        title: 'Pomar & Redário',
        text: 'Bosque de árvores frutíferas regionais com pontos de descanso.',
      },
    ]),
    locationBulletsJson: JSON.stringify([
      { title: 'Localização', text: 'Eixo Leste BR-343, Teresina - PI' },
      { title: 'Mobilidade', text: 'A 8 minutos do polo gastronômico do São Cristóvão e Fátima' },
      {
        title: 'Condições',
        text: 'Entrada facilitada + até 72x ou captação de imóvel como parte de negócio.',
      },
    ]),
    areaOptionsJson: JSON.stringify([
      '330 a 380 m²',
      '380 a 450 m²',
      'Lote de Esquina (> 450 m²)',
      'Casa Pronta no Condomínio',
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

