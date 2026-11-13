'use client';

import React, { useState, useEffect } from 'react';
import SubdomainBar, { SpaceNavInfo } from './SubdomainBar';
import PropertyCaptureModal from './PropertyCaptureModal';
import { CheckCircle2, Sparkles, ShieldCheck, Building } from 'lucide-react';

interface SpaceSubdomainViewProps {
  space: any;
  allSpaces: SpaceNavInfo[];
}

export default function SpaceSubdomainView({
  space,
  allSpaces,
}: SpaceSubdomainViewProps) {
  const facts = JSON.parse(space.factsJson || '[]');
  const offerBullets = JSON.parse(space.offerBulletsJson || '[]');
  const mosaic = JSON.parse(space.mosaicJson || '[]');
  const tags = JSON.parse(space.tagsJson || '[]');
  const spaItems = JSON.parse(space.spaItemsJson || '[]');
  const familyItems = JSON.parse(space.familyItemsJson || '[]');
  const locationBullets = JSON.parse(space.locationBulletsJson || '[]');
  const areaOptions = JSON.parse(space.areaOptionsJson || '["450 a 500 m²"]');

  const [scrolled, setScrolled] = useState(false);
  const [lotValue, setLotValue] = useState<string>(String(space.defaultLotPrice || 350000));
  const [downPayment, setDownPayment] = useState<string>(
    String(space.defaultDownPayment || 70000)
  );

  // Reservation Form States
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [areaInterest, setAreaInterest] = useState(areaOptions[0] || '450 a 500 m²');
  const [lotPreference, setLotPreference] = useState('Melhor unidade disponível (Nascente)');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<any | null>(null);
  const [captureModalOpen, setCaptureModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const numLot = Number(lotValue) || 0;
  const numEntry = Number(downPayment) || 0;
  const maxInst = Number(space.maxInstallments) || 60;
  const validCalc = numLot > 0 && numEntry >= 0 && numEntry < numLot;
  const monthlyValue = validCalc ? (numLot - numEntry) / maxInst : 0;

  const formattedMonthly = validCalc
    ? `${maxInst}x de R$ ${monthlyValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : `${maxInst}x de R$ ---`;

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId: space.id,
          spaceSlug: space.slug,
          clientName,
          clientPhone,
          clientEmail,
          areaInterest,
          lotPreference,
          lotValue: numLot > 0 ? numLot : space.defaultLotPrice,
          downPayment: numEntry >= 0 ? numEntry : space.defaultDownPayment,
          installments: maxInst,
          status: 'CONFIRMADA',
          sourceHost:
            typeof window !== 'undefined' ? window.location.host : space.subdomain,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmedReservation(data.reservation);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsAppWithProtocol = (resObj: any) => {
    const msg = `Olá! Sou ${resObj.clientName} (${resObj.clientPhone}). Acabei de registrar a Reserva Protocolo ${resObj.protocol} no ${space.name} (${space.subdomain}), metragem: ${resObj.areaInterest}, unidade: ${resObj.lotPreference}. Simulação: Valor R$ ${Number(resObj.lotValue).toLocaleString('pt-BR')} | Entrada R$ ${Number(resObj.downPayment).toLocaleString('pt-BR')} + ${resObj.installments}x de R$ ${Number(resObj.installmentValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Pode me enviar o mapa de lotes e contrato?`;
    window.open(
      `https://wa.me/${space.whatsappNumber || '5586900000000'}?text=${encodeURIComponent(
        msg
      )}`,
      '_blank'
    );
  };

  // Split offerTitle like "Entrada + 60x" to style the "+"
  const offerParts = String(space.offerTitle || 'Entrada + 60x').split('+');

  return (
    <div>
      <header className={`lp-header ${scrolled ? 's' : ''}`}>
        <div className="bar">
          {space.offerBarText}{' '}
          <a href="#simular">Simule agora</a>
          <span style={{ margin: '0 10px', opacity: 0.5 }}>|</span>
          <span style={{ fontWeight: 500, textTransform: 'none' }}>
            {space.availableLots} unidades disponíveis
          </span>
        </div>
        <div className="wrap">
          <a className="logo" href="#topo" aria-label="AltoPadrão Imobiliária">
            <img
              src="/images/aldebaran/logo-header.png"
              alt="AltoPadrão Imobiliária"
            />
          </a>
          <nav>
            <a href="#projeto">O projeto</a>
            <a href="#lazer">Lazer</a>
            <a href="#bem-estar">Spa</a>
            <a href="#local">Localização</a>
            <a
              href="#captacao"
              onClick={(e) => {
                e.preventDefault();
                setCaptureModalOpen(true);
              }}
            >
              Anunciar Lote
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
            <a className="btn" href="#contato">
              Reservar unidade
            </a>
          </nav>
        </div>
      </header>

      <main id="topo">
        <section className="hero">
          <img src={space.heroImage} alt={space.name} />
          <div className="wrap">
            <p className="eyebrow">{space.eyebrow}</p>
            <h1 className="offer">
              {offerParts.length > 1 ? (
                <>
                  {offerParts[0].trim()} <span>+</span> {offerParts[1].trim()}
                </>
              ) : (
                space.offerTitle
              )}
            </h1>
            <div className="nj">{space.offerBadge}</div>
            <p className="sub">{space.heroSubtitle}</p>
            <div className="row">
              <a className="btn big" href="#simular">
                Simular minha parcela
              </a>
              <a className="btn ghost" href="#contato">
                Reservar unidade agora
              </a>
            </div>
          </div>
        </section>

        <div className="facts">
          <div className="wrap">
            {facts.map((f: any, i: number) => (
              <div key={i}>
                <b>{f.value}</b>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <section className="offerband" id="simular">
          <div className="wrap">
            <div>
              <p className="eyebrow" style={{ color: '#f6e2c4' }}>
                Condição especial
              </p>
              <h2>
                Entrada + {space.maxInstallments} parcelas, sem juros.
              </h2>
              <ul className="tick">
                {offerBullets.map((b: string, i: number) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="sim">
              <label>
                Valor do lote (R$)
                <input
                  id="v"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="5000"
                  value={lotValue}
                  onChange={(e) => setLotValue(e.target.value)}
                  placeholder={`Ex.: ${space.defaultLotPrice}`}
                />
              </label>
              <label>
                Sua entrada (R$)
                <input
                  id="e"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="5000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder={`Ex.: ${space.defaultDownPayment}`}
                />
              </label>
              <div className="res" id="r">
                {formattedMonthly}
                <small>
                  Simulação vinculada ao formulário de reserva abaixo. Valores
                  sujeitos à tabela vigente.
                </small>
              </div>
              <a className="btn" id="sw" href="#contato">
                Quero reservar com essa condição
              </a>
            </div>
          </div>
        </section>

        <section id="projeto">
          <div className="wrap split">
            <div>
              <h2>{space.projectTitle}</h2>
              <p className="lead">{space.projectLead}</p>
              <p>{space.projectBody}</p>
              <div className="sig">
                Arquitetura e interiores: {space.architect}
                <br />
                Paisagismo: {space.landscaper}
              </div>
            </div>
            <img src={space.projectImage} alt={`Projeto ${space.name}`} />
          </div>
        </section>

        {mosaic.length > 0 && (
          <section id="lazer" className="alt">
            <div className="wrap">
              <h2>Lazer completo para todas as idades.</h2>
              <div className="mos">
                {mosaic.map((item: any, idx: number) => (
                  <figure key={idx} className={item.cls || 'c'}>
                    <img src={item.img} alt={item.alt || item.title} loading="lazy" />
                    <figcaption>
                      {item.title}
                      <small>{item.subtitle}</small>
                    </figcaption>
                  </figure>
                ))}
              </div>
              {tags.length > 0 && (
                <ul className="tags">
                  {tags.map((t: string, idx: number) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {spaItems.length > 0 && (
          <section id="bem-estar" className="spa">
            <div className="wrap">
              <h2>{space.spaTitle}</h2>
              <p className="lead" style={{ marginTop: '22px' }}>
                {space.spaLead}
              </p>
              <div className="trio">
                {spaItems.map((s: any, idx: number) => (
                  <div key={idx}>
                    <img src={s.img} alt={s.alt || 'Spa'} loading="lazy" />
                    <p>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {familyItems.length > 0 && (
          <section>
            <div className="wrap">
              <h2>Cada pessoa da casa tem o seu lugar.</h2>
              <div className="fam">
                {familyItems.map((f: any, idx: number) => (
                  <div key={idx}>
                    <img src={f.img} alt={f.alt || f.title} loading="lazy" />
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="alt">
          <div className="wrap split rev">
            <img
              src={space.locationImage}
              alt={`Localização ${space.name}`}
              loading="lazy"
            />
            <div className="loc">
              <h2 id="local">{space.locationTitle}</h2>
              <p className="lead">{space.locationLead}</p>
              <ul>
                {locationBullets.map((b: any, idx: number) => (
                  <li key={idx}>
                    <b>{b.title}</b>
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Banner de Captação de Imóveis integrado na LP */}
        <section
          id="captacao"
          style={{
            background: 'var(--deep)',
            color: '#f6f1e8',
            padding: '54px 0',
            borderBottom: '1px solid rgba(233, 199, 155, 0.15)',
          }}
        >
          <div
            className="wrap"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '28px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p className="eyebrow" style={{ marginBottom: '6px' }}>
                Venda ou Permuta · {space.name}
              </p>
              <h3 style={{ fontSize: '2.1rem', color: '#fff' }}>
                Já possui um lote ou residência no {space.name}?
              </h3>
              <p style={{ margin: '8px 0 0', opacity: 0.85 }}>
                Anuncie seu imóvel com a AltoPadrão e apresente para clientes
                qualificados interessados em morar neste condomínio.
              </p>
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => setCaptureModalOpen(true)}
            >
              <Building size={18} />
              Quero Vender ou Avaliar meu Imóvel
            </button>
          </div>
        </section>

        <section
          id="contato"
          className="cta"
          style={{ '--bgimg': `url(${space.ctaBgImage})` } as React.CSSProperties}
        >
          <div className="wrap split">
            <div>
              <h2>{space.ctaTitle}</h2>
              <p className="lead" style={{ color: '#f6f1e8b8' }}>
                {space.ctaLead}
              </p>
            </div>

            {confirmedReservation ? (
              <div className="lp-form" style={{ textAlign: 'center', padding: '36px' }}>
                <CheckCircle2
                  size={56}
                  style={{ color: '#1f9d55', margin: '0 auto 12px' }}
                />
                <p className="eyebrow" style={{ color: 'var(--cu)' }}>
                  Atendimento Prioritário · {confirmedReservation.protocol}
                </p>
                <h3 style={{ fontSize: '2.1rem', marginBottom: '10px' }}>
                  Solicitação de Reserva Recebida!
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--mut)', margin: '0 auto 16px' }}>
                  Um especialista da <b>AltoPadrão Imobiliária</b> para o{' '}
                  <b>{space.name}</b> já foi acionado para apresentar o mapa de
                  lotes e formalizar sua condição.
                </p>
                <div
                  style={{
                    background: 'var(--bg2)',
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    borderRadius: '2px',
                    display: 'grid',
                    gap: '6px',
                    marginBottom: '18px',
                  }}
                >
                  <div>
                    <b>Cliente:</b> {confirmedReservation.clientName} (
                    {confirmedReservation.clientPhone})
                  </div>
                  <div>
                    <b>Empreendimento:</b> {space.name}
                  </div>
                  <div>
                    <b>Unidade / Metragem:</b> {confirmedReservation.lotPreference}{' '}
                    · {confirmedReservation.areaInterest}
                  </div>
                  <div>
                    <b>Condição Simulada:</b> Valor R${' '}
                    {Number(confirmedReservation.lotValue).toLocaleString('pt-BR')}{' '}
                    | Entrada de R${' '}
                    {Number(confirmedReservation.downPayment).toLocaleString('pt-BR')}{' '}
                    + {confirmedReservation.installments}x de R${' '}
                    {Number(confirmedReservation.installmentValue).toLocaleString(
                      'pt-BR',
                      { minimumFractionDigits: 2 }
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn"
                  style={{ width: '100%', marginBottom: '10px' }}
                  onClick={() => openWhatsAppWithProtocol(confirmedReservation)}
                >
                  Falar Agora com o Corretor no WhatsApp
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  style={{ width: '100%', color: 'var(--ink)' }}
                  onClick={() => setConfirmedReservation(null)}
                >
                  Nova Simulação
                </button>
              </div>
            ) : (
              <form id="f" className="lp-form" onSubmit={handleSubmitReservation}>
                <div>
                  <img
                    className="fl-l"
                    src="/images/aldebaran/logo-form-light.png"
                    alt="AltoPadrão Imobiliária"
                  />
                  <img
                    className="fl-d"
                    src="/images/aldebaran/logo-form-dark.png"
                    alt="AltoPadrão Imobiliária"
                  />
                </div>

                <label>
                  Nome
                  <input
                    name="n"
                    required
                    autoComplete="name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </label>

                <label>
                  WhatsApp
                  <input
                    name="t"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(86) 9 0000-0000"
                  />
                </label>

                <label>
                  Metragem de interesse
                  <select
                    name="m"
                    value={areaInterest}
                    onChange={(e) => setAreaInterest(e.target.value)}
                  >
                    {areaOptions.map((opt: string, idx: number) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>

                <button className="btn" type="submit" disabled={submitting}>
                  {submitting
                    ? 'Enviando...'
                    : `Quero ${space.offerTitle.toLowerCase()} sem juros`}
                </button>
                <small>
                  Ao enviar, você recebe a tabela atualizada e o contato imediato de
                  um especialista da AltoPadrão Imobiliária.
                </small>
              </form>
            )}
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
          <p>{space.footerDisclaimer}</p>
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
        href={`https://wa.me/${space.whatsappNumber || '5586900000000'}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp Plantão
      </a>

      <PropertyCaptureModal
        isOpen={captureModalOpen}
        onClose={() => setCaptureModalOpen(false)}
        spaces={allSpaces}
        defaultSpaceSlug={space.slug}
      />
    </div>
  );
}

