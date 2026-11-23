'use client';

import React, { useState, useEffect } from 'react';
import SubdomainBar, { SpaceNavInfo } from './SubdomainBar';
import PropertyCaptureModal from './PropertyCaptureModal';
import TrackingPixels, { trackLeadConversion } from './TrackingPixels';
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Award,
  KeyRound,
  Handshake,
  Menu,
  X,
} from 'lucide-react';

interface PortalHomeViewProps {
  spaces: any[];
  sysConfig?: any;
  stats: {
    totalSpaces: number;
    totalConfirmedVgv: number;
    totalReservations: number;
    totalCaptures: number;
  };
}

export default function PortalHomeView({
  spaces,
  sysConfig,
}: PortalHomeViewProps) {
  const globalWhatsapp = sysConfig?.globalWhatsapp || '5586900000000';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [captureModalOpen, setCaptureModalOpen] = useState(false);
  const [quickReserveSpace, setQuickReserveSpace] = useState<any | null>(null);

  // Quick Reservation Modal state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [lotPreference, setLotPreference] = useState(
    'Melhor Lote Disponível (Nascente)'
  );
  const [submitting, setSubmitting] = useState(false);
  const [confirmedRes, setConfirmedRes] = useState<any | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navSpaces: SpaceNavInfo[] = spaces.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    subdomain: s.subdomain,
  }));

  const filteredSpaces = spaces.filter((sp) => {
    if (selectedSlug !== 'ALL' && sp.slug !== selectedSlug) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        sp.name.toLowerCase().includes(q) ||
        sp.region.toLowerCase().includes(q) ||
        sp.developer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSpaceHref = (slug: string) => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      if (host.includes('.localhost:')) {
        const port = host.split(':')[1] || '3000';
        return `http://${slug}.localhost:${port}`;
      }
    }
    return `/espaco/${slug}`;
  };

  const getReserveCtaLabel = (name: string) => {
    const clean = String(name || '').replace(/^Reservas?\s+/i, '').trim();
    return `Reservas ${clean || name}, clique aqui`;
  };

  const minAreaActive =
    spaces.length > 0
      ? Math.min(...spaces.map((s) => Number(s.minAreaM2) || 450))
      : 330;
  const maxInstActive =
    spaces.length > 0
      ? Math.max(...spaces.map((s) => Number(s.maxInstallments) || 60))
      : 60;
  const spaceNamesList =
    spaces.length > 1
      ? `${spaces
          .slice(0, -1)
          .map((s) => s.name)
          .join(', ')} ou ${spaces[spaces.length - 1].name}`
      : spaces[0]?.name || 'condomínios fechados de alto padrão';

  const handleQuickReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReserveSpace) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId: quickReserveSpace.id,
          spaceSlug: quickReserveSpace.slug,
          clientName,
          clientPhone,
          clientEmail,
          areaInterest: `A partir de ${quickReserveSpace.minAreaM2} m²`,
          lotPreference,
          lotValue: quickReserveSpace.defaultLotPrice,
          downPayment: quickReserveSpace.defaultDownPayment,
          installments: quickReserveSpace.maxInstallments,
          status: 'CONFIRMADA',
          sourceHost: quickReserveSpace.subdomain,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmedRes(data.reservation);
        trackLeadConversion({
          type: 'RESERVA',
          spaceName: quickReserveSpace.name,
          value: quickReserveSpace.defaultLotPrice,
          protocol: data.reservation?.protocol,
        });
        if (quickReserveSpace.autoOpenWhatsapp !== false && data.reservation) {
          const targetWa =
            quickReserveSpace.whatsappNumber || globalWhatsapp;
          const text = `Olá! Sou ${data.reservation.clientName} (${data.reservation.clientPhone}). Solicitei a tabela e reserva (${data.reservation.protocol}) para o ${quickReserveSpace.name}.`;
          window.open(
            `https://wa.me/${targetWa}?text=${encodeURIComponent(text)}`,
            '_blank'
          );
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <TrackingPixels
        metaPixelId={sysConfig?.globalMetaPixelId}
        gtmId={sysConfig?.globalGtmId}
      />
      <header className={`lp-header ${scrolled ? 's' : ''}`}>
        <div className="bar">
          Condições especiais de lançamento · Entrada parcelada + até 72x direto com a construtora{' '}
          <a href="#espacos">Ver condomínios</a>
        </div>
        <div className="wrap">
          <a className="logo" href="#topo" aria-label="AltoPadrão Imobiliária">
            <img
              src="/images/aldebaran/logo-header.png"
              alt="AltoPadrão Imobiliária"
            />
          </a>
          <nav>
            <a href="#espacos">Condomínios</a>
            <a href="#comparativo">Comparar Lotes</a>
            <a
              href="#captacao"
              onClick={(e) => {
                e.preventDefault();
                setCaptureModalOpen(true);
              }}
            >
              Anunciar meu Imóvel
            </a>
            <a
              href="/admin"
              style={{
                border: '1px solid rgba(233, 199, 155, 0.45)',
                color: '#e9c79b',
                padding: '8px 14px',
                borderRadius: '2px',
                fontSize: '0.84rem',
                fontWeight: 700,
              }}
            >
              Área Administrativa
            </a>
            <a className="btn" href="#espacos">
              Escolher Condomínio
            </a>
            <button
              type="button"
              className="mobile-menu-btn"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </div>

        <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#espacos" onClick={() => setMobileMenuOpen(false)}>
            <span>Condomínios</span>
            <ArrowRight size={15} />
          </a>
          <a href="#comparativo" onClick={() => setMobileMenuOpen(false)}>
            <span>Comparar Lotes</span>
            <ArrowRight size={15} />
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setCaptureModalOpen(true);
            }}
          >
            <span>Anunciar meu Imóvel</span>
            <ArrowRight size={15} />
          </button>
          <a href="/admin" onClick={() => setMobileMenuOpen(false)}>
            <span style={{ color: '#e9c79b' }}>Área Administrativa</span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <main id="topo">
        {/* Hero Principal Comercial */}
        <section className="hero">
          <img
            src="/images/aldebaran/hero-pool.jpg"
            alt="Condomínios AltoPadrão Imobiliária"
          />
          <div className="wrap">
            <p className="eyebrow">
              AltoPadrão Imobiliária · Curadoria de Condomínios Fechados
            </p>
            <h1
              className="offer"
              style={{
                fontSize: 'clamp(2.8rem, 6.8vw, 5.4rem)',
                maxWidth: '16ch',
                lineHeight: 0.98,
              }}
            >
              Viva o extraordinário <span>em</span> Teresina.
            </h1>
            <p className="sub" style={{ maxWidth: '54ch', marginBottom: '28px' }}>
              Selecione abaixo o condomínio de seu interesse para conhecer o
              projeto completo, simular parcelas sem juros e consultar a tabela
              de lotes disponíveis.
            </p>

            {/* Vitrine Comercial de Seleção Rápida de Condomínios */}
            <div className="hero-selector-panel">
              <div className="hero-selector-header">
                <span>Escolha o empreendimento para acessar a página exclusiva de reservas:</span>
              </div>

              <div className="hero-selector-grid">
                {spaces.map((sp) => (
                  <a
                    key={sp.slug}
                    href={getSpaceHref(sp.slug)}
                    className="hero-selector-card"
                  >
                    <div>
                      <span className="hero-card-region">{sp.region}</span>
                      <h3 className="hero-card-title">{sp.name}</h3>
                      <p className="hero-card-meta">
                        {sp.offerTitle} · Lotes a partir de {sp.minAreaM2} m²
                      </p>
                    </div>

                    <div className="hero-card-cta">
                      <span>{getReserveCtaLabel(sp.name)}</span>
                      <ArrowRight size={15} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Faixa de Destaques Comerciais */}
        <div className="facts">
          <div className="wrap">
            <div>
              <b>
                {spaces.length}{' '}
                {spaces.length === 1 ? 'Condomínio' : 'Condomínios'}
              </b>
              <span>nas regiões mais valorizadas de Teresina</span>
            </div>
            <div>
              <b>A partir de {minAreaActive} m²</b>
              <span>lotes amplos prontos ou em obras</span>
            </div>
            <div>
              <b>Entrada + {maxInstActive}x</b>
              <span>condições diretas sem burocracia bancária</span>
            </div>
            <div>
              <b>CRECI 0481-PJ</b>
              <span>segurança jurídica e atendimento exclusivo</span>
            </div>
          </div>
        </div>

        {/* Seção de Listagem de Todos os Condomínios */}
        <section id="espacos">
          <div className="wrap">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              <div>
                <p className="eyebrow" style={{ color: 'var(--cu)' }}>
                  Empreendimentos Selecionados
                </p>
                <h2>Conheça nossos condomínios e escolha o seu lote.</h2>
              </div>

              {/* Filtro Comercial */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <select
                  aria-label="Filtrar por Condomínio"
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  style={{ width: 'auto', minWidth: '210px' }}
                >
                  <option value="ALL">Todos os Condomínios</option>
                  {spaces.map((sp) => (
                    <option key={sp.slug} value={sp.slug}>
                      {sp.name}
                    </option>
                  ))}
                </select>

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por localização ou condomínio..."
                  style={{ width: '250px' }}
                />
              </div>
            </div>

            <div className="spaces-grid">
              {filteredSpaces.map((sp) => {
                const monthly =
                  (sp.defaultLotPrice - sp.defaultDownPayment) / sp.maxInstallments;
                return (
                  <article key={sp.id} className="space-card">
                    <div className="space-card-media">
                      <img src={sp.heroImage} alt={sp.name} />
                      <span className="space-card-subdomain">
                        <MapPin size={12} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} />
                        {sp.region}
                      </span>
                      <span className="space-card-offer">
                        {sp.offerTitle} · {sp.offerBadge}
                      </span>
                    </div>

                    <div className="space-card-body">
                      <div
                        style={{
                          fontSize: '0.78rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--cu)',
                          fontWeight: 700,
                        }}
                      >
                        {sp.developer}
                      </div>
                      <h3 style={{ fontSize: '2.15rem', marginTop: '4px' }}>
                        {sp.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.95rem',
                          color: 'var(--mut)',
                          marginTop: '10px',
                          flex: 1,
                        }}
                      >
                        {sp.heroSubtitle}
                      </p>

                      <div className="space-card-metrics">
                        <div>
                          <b>{sp.minAreaM2} m²</b>
                          <span>Lotes a partir de</span>
                        </div>
                        <div>
                          <b>{sp.greenAreaText}</b>
                          <span>Área verde e lazer</span>
                        </div>
                        <div>
                          <b>{sp.availableLots} lotes</b>
                          <span>Disponíveis na tabela</span>
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'var(--bg)',
                          padding: '12px 16px',
                          borderRadius: '2px',
                          marginBottom: '18px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        <div style={{ fontSize: '0.84rem' }}>
                          <span style={{ color: 'var(--mut)' }}>Lotes a partir de </span>
                          <b>
                            R$ {Number(sp.defaultLotPrice).toLocaleString('pt-BR')}
                          </b>
                        </div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#e9c79b',
                          }}
                        >
                          Entrada + {sp.maxInstallments}x de R${' '}
                          {monthly.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <a
                          href={getSpaceHref(sp.slug)}
                          className="btn"
                          style={{ flex: 1 }}
                        >
                          {getReserveCtaLabel(sp.name)}
                          <ArrowUpRight size={16} />
                        </a>
                        <button
                          type="button"
                          className="btn ghost"
                          style={{ color: 'var(--ink)' }}
                          onClick={() => {
                            setConfirmedRes(null);
                            setQuickReserveSpace(sp);
                          }}
                        >
                          Receber Tabela
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tabela Comparativa Comercial */}
        <section id="comparativo" className="alt">
          <div className="wrap">
            <p className="eyebrow" style={{ color: 'var(--cu)' }}>
              Comparativo de Condomínios
            </p>
            <h2>Compare metragens, áreas de lazer e condições de pagamento.</h2>

            <div className="admin-table-wrap" style={{ marginTop: '32px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Condomínio</th>
                    <th>Localização</th>
                    <th>Metragem dos Lotes</th>
                    <th>Área Verde & Lazer</th>
                    <th>Valor Inicial</th>
                    <th>Plano Direto</th>
                    <th>Disponibilidade</th>
                    <th>Página Exclusiva</th>
                  </tr>
                </thead>
                <tbody>
                  {spaces.map((sp) => (
                    <tr key={sp.id}>
                      <td data-label="Condomínio">
                        <b style={{ fontSize: '1.08rem' }}>{sp.name}</b>
                        <div style={{ fontSize: '0.78rem', color: 'var(--mut)' }}>
                          {sp.developer}
                        </div>
                      </td>
                      <td data-label="Localização">{sp.region}</td>
                      <td data-label="Metragem">
                        <b>A partir de {sp.minAreaM2} m²</b>
                      </td>
                      <td data-label="Área Verde & Lazer">{sp.greenAreaText}</td>
                      <td data-label="Valor Inicial">
                        R$ {Number(sp.defaultLotPrice).toLocaleString('pt-BR')}
                      </td>
                      <td data-label="Plano Direto">
                        <span className="badge confirmada">{sp.offerTitle}</span>
                      </td>
                      <td data-label="Disponibilidade">{sp.availableLots} unidades</td>
                      <td data-label="Página Exclusiva">
                        <a
                          href={getSpaceHref(sp.slug)}
                          style={{
                            color: '#e9c79b',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          Ver detalhes e reservar <ArrowUpRight size={14} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Seção de Captação Comercial & Atendimento Private */}
        <section id="captacao" className="spa">
          <div className="wrap split">
            <div>
              <p className="eyebrow">Venda ou Permute com a AltoPadrão</p>
              <h2>Possui um lote ou residência em condomínio fechado?</h2>
              <p className="lead">
                Se você é proprietário no {spaceNamesList}, nossa equipe conecta
                seu imóvel a compradores qualificados com total sigilo e
                agilidade.
              </p>
              <ul className="tick" style={{ marginBottom: '28px' }}>
                <li>Avaliação de mercado precisa baseada nas últimas vendas</li>
                <li>Produção de fotos e apresentação para clientes Private</li>
                <li>Assessoria jurídica completa até a assinatura da escritura</li>
              </ul>
              <button
                type="button"
                className="btn big"
                onClick={() => setCaptureModalOpen(true)}
              >
                Quero Anunciar ou Avaliar meu Imóvel
              </button>
            </div>

            <div
              style={{
                background: 'rgba(246, 241, 232, 0.04)',
                border: '1px solid rgba(233, 199, 155, 0.22)',
                padding: '34px',
                borderRadius: '2px',
                display: 'grid',
                gap: '22px',
              }}
            >
              <h3 style={{ color: '#e9c79b', fontSize: '1.85rem' }}>
                A experiência AltoPadrão Imobiliária
              </h3>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Award
                  size={24}
                  style={{ color: '#e9c79b', flexShrink: 0, marginTop: '3px' }}
                />
                <div>
                  <b>Especialistas em Condomínios Horizontais</b>
                  <p style={{ fontSize: '0.92rem', opacity: 0.82, margin: '4px 0 0' }}>
                    Seleção criteriosa dos melhores lotes nascentes, esquinas e
                    unidades próximas aos clubes de lazer.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Handshake
                  size={24}
                  style={{ color: '#e9c79b', flexShrink: 0, marginTop: '3px' }}
                />
                <div>
                  <b>Negociação Direta com a Incorporadora</b>
                  <p style={{ fontSize: '0.92rem', opacity: 0.82, margin: '4px 0 0' }}>
                    Planos em até 60x ou 72x sem burocracia bancária e condições
                    diferenciadas de pré-lançamento.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <KeyRound
                  size={24}
                  style={{ color: '#e9c79b', flexShrink: 0, marginTop: '3px' }}
                />
                <div>
                  <b>Visitas Guiadas Personalizadas</b>
                  <p style={{ fontSize: '0.92rem', opacity: 0.82, margin: '4px 0 0' }}>
                    Conheça in loco a infraestrutura do clube, quadras, spa e a
                    posição solar exata do seu futuro lote.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="wrap">
          <img
            className="flogo"
            src="/images/aldebaran/logo-footer.png"
            alt="AltoPadrão Imobiliária"
          />
          <p>
            <b>AltoPadrão Imobiliária</b> | CRECI 0481-PJ | Teresina - PI.
            Imagens ilustrativas de projeto, sujeitas a alterações. Condições de
            parcelamento direto sujeitas a análise de crédito, disponibilidade e
            regras de cada incorporadora.
          </p>
          <div style={{ marginTop: '16px' }}>
            <a
              href="/admin"
              className="btn ghost"
              style={{
                padding: '9px 18px',
                fontSize: '0.82rem',
                color: '#e9c79b',
                borderColor: 'rgba(233, 199, 155, 0.35)',
              }}
            >
              Acessar Área Administrativa (Corretor)
            </a>
          </div>
        </div>
      </footer>

      <a
        className="wa"
        href={`https://wa.me/${globalWhatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>

      {/* Barra Fixa Inferior Mobile (Thumb-Zone UX) */}
      <div className="mobile-bottom-dock">
        <a href="#espacos" className="btn" style={{ padding: '10px 12px' }}>
          Ver Condomínios
        </a>
        <a
          href={`https://wa.me/${globalWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#1f9d55',
            color: '#fff',
          }}
        >
          WhatsApp Plantão
        </a>
      </div>

      <PropertyCaptureModal
        isOpen={captureModalOpen}
        onClose={() => setCaptureModalOpen(false)}
        spaces={navSpaces}
      />

      {/* Modal de Reserva Rápida direto da Home */}
      {quickReserveSpace && (
        <div
          className="modal-backdrop"
          onClick={() => setQuickReserveSpace(null)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow" style={{ color: 'var(--cu)' }}>
              Atendimento Exclusivo · {quickReserveSpace.name}
            </p>
            <h3 style={{ fontSize: '2rem', marginBottom: '12px' }}>
              Solicitar Tabela e Reservar no {quickReserveSpace.name}
            </h3>

            {confirmedRes ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2
                  size={52}
                  style={{ color: '#1f9d55', margin: '0 auto 12px' }}
                />
                <h4 style={{ fontSize: '1.7rem' }}>
                  Solicitação Confirmada · {confirmedRes.protocol}
                </h4>
                <p style={{ color: 'var(--mut)', margin: '8px auto 18px' }}>
                  Um corretor especialista da AltoPadrão já recebeu seu pedido e
                  enviará o mapa atualizado de lotes disponíveis.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <a
                    className="btn"
                    href={`https://wa.me/${
                      quickReserveSpace.whatsappNumber || globalWhatsapp
                    }?text=${encodeURIComponent(
                      `Olá! Solicitei a tabela e reserva (${confirmedRes.protocol}) para o ${quickReserveSpace.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Falar com Corretor no WhatsApp
                  </a>
                  <button
                    type="button"
                    className="btn ghost"
                    style={{ color: 'var(--ink)' }}
                    onClick={() => setQuickReserveSpace(null)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleQuickReserveSubmit}
                style={{ display: 'grid', gap: '14px' }}
              >
                <label>
                  Nome completo
                  <input
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </label>
                <div className="form-grid-2">
                  <label>
                    WhatsApp
                    <input
                      required
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="(86) 99999-0000"
                    />
                  </label>
                  <label>
                    E-mail
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </label>
                </div>
                <label>
                  Preferência de Lote
                  <input
                    value={lotPreference}
                    onChange={(e) => setLotPreference(e.target.value)}
                  />
                </label>
                <div
                  style={{
                    background: 'var(--bg2)',
                    padding: '12px',
                    fontSize: '0.88rem',
                  }}
                >
                  <b>Condição Especial:</b> Lotes a partir de R${' '}
                  {Number(quickReserveSpace.defaultLotPrice).toLocaleString(
                    'pt-BR'
                  )}{' '}
                  (Entrada R${' '}
                  {Number(quickReserveSpace.defaultDownPayment).toLocaleString(
                    'pt-BR'
                  )}{' '}
                  + {quickReserveSpace.maxInstallments}x sem juros)
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn"
                    type="submit"
                    disabled={submitting}
                    style={{ flex: 1 }}
                  >
                    {submitting ? 'Enviando...' : 'Confirmar Interesse Agora'}
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    style={{ color: 'var(--ink)' }}
                    onClick={() => setQuickReserveSpace(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
