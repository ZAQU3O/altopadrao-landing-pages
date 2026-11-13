'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Home, Send } from 'lucide-react';
import { SpaceNavInfo } from './SubdomainBar';

interface PropertyCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaces: SpaceNavInfo[];
  defaultSpaceSlug?: string;
}

export default function PropertyCaptureModal({
  isOpen,
  onClose,
  spaces,
  defaultSpaceSlug,
}: PropertyCaptureModalProps) {
  const [spaceSlug, setSpaceSlug] = useState(
    defaultSpaceSlug || spaces[0]?.slug || 'aldebaran'
  );
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [propertyType, setPropertyType] = useState('Lote em Condomínio');
  const [blockAndLot, setBlockAndLot] = useState('');
  const [areaM2, setAreaM2] = useState('450');
  const [askingPrice, setAskingPrice] = useState('380000');
  const [acceptsDirectFin, setAcceptsDirectFin] = useState(true);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdCapture, setCreatedCapture] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/captures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceSlug,
          ownerName,
          ownerPhone,
          ownerEmail,
          propertyType,
          blockAndLot,
          areaM2: Number(areaM2),
          askingPrice: Number(askingPrice),
          acceptsDirectFin,
          description,
          sourceHost:
            typeof window !== 'undefined'
              ? window.location.host
              : 'altopadraoreservas.com',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedCapture(data.capture);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setCreatedCapture(null);
    setOwnerName('');
    setOwnerPhone('');
    setBlockAndLot('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={resetAndClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '18px',
          }}
        >
          <div>
            <p className="eyebrow" style={{ color: 'var(--cu)', marginBottom: '4px' }}>
              Venda ou Permuta · AltoPadrão Imobiliária
            </p>
            <h3 style={{ fontSize: '2rem' }}>
              Anuncie seu Lote ou Residência
            </h3>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            style={{
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              padding: '6px',
              color: 'var(--mut)',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {createdCapture ? (
          <div style={{ textAlign: 'center', padding: '18px 0' }}>
            <CheckCircle2
              size={54}
              style={{ color: '#1f9d55', margin: '0 auto 14px' }}
            />
            <h3 style={{ fontSize: '1.9rem', marginBottom: '8px' }}>
              Imóvel Recebido com Sucesso!
            </h3>
            <p style={{ margin: '0 auto 16px', color: 'var(--mut)' }}>
              Os dados do seu imóvel foram enviados para a diretoria da{' '}
              <b>AltoPadrão Imobiliária</b> (Atendimento{' '}
              <b style={{ color: 'var(--cu)' }}>{createdCapture.protocol}</b>) e
              entraremos em contato para agendar a avaliação.
            </p>
            <div
              style={{
                background: 'var(--bg2)',
                padding: '16px',
                borderRadius: '3px',
                textAlign: 'left',
                fontSize: '0.9rem',
                marginBottom: '20px',
              }}
            >
              <div>
                <b>Espaço/Condomínio:</b> {createdCapture.space?.name}
              </div>
              <div>
                <b>Tipo / Unidade:</b> {createdCapture.propertyType} ·{' '}
                {createdCapture.blockAndLot}
              </div>
              <div>
                <b>Área / Valor Pretendido:</b> {createdCapture.areaM2} m² ·{' '}
                {Number(createdCapture.askingPrice).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                className="btn"
                href={`https://wa.me/5586900000000?text=${encodeURIComponent(
                  `Olá! Cadastrei meu imóvel para captação na AltoPadrão (Protocolo ${createdCapture.protocol}) no ${createdCapture.space?.name} (${createdCapture.blockAndLot}). Gostaria de agendar a avaliação.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Enviar Fotos no WhatsApp da Captação
              </a>
              <button
                type="button"
                className="btn ghost"
                style={{ color: 'var(--ink)' }}
                onClick={resetAndClose}
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
            <p style={{ fontSize: '0.92rem', color: 'var(--mut)', marginBottom: '4px' }}>
              Possui um lote ou residência no Reserva Aldebaran, Terras Alphaville,
              Alphaville ou Fazenda Real? Cadastre para nossa carteira de clientes
              qualificados.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label>
                Condomínio / Espaço
                <select
                  value={spaceSlug}
                  onChange={(e) => setSpaceSlug(e.target.value)}
                >
                  {spaces.map((sp) => (
                    <option key={sp.slug} value={sp.slug}>
                      {sp.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Tipo de Imóvel
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option>Lote em Condomínio</option>
                  <option>Casa Construída Térrea</option>
                  <option>Mansão Duplex Alto Padrão</option>
                  <option>Repasse de Lote Financiado</option>
                </select>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label>
                Nome do Proprietário
                <input
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </label>

              <label>
                WhatsApp para Contato
                <input
                  required
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="(86) 99999-0000"
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '12px' }}>
              <label>
                Quadra e Lote / Localização
                <input
                  required
                  value={blockAndLot}
                  onChange={(e) => setBlockAndLot(e.target.value)}
                  placeholder="Ex.: Quadra C - Lote 14"
                />
              </label>

              <label>
                Área Total (m²)
                <input
                  required
                  type="number"
                  min="100"
                  value={areaM2}
                  onChange={(e) => setAreaM2(e.target.value)}
                />
              </label>

              <label>
                Valor Pretendido (R$)
                <input
                  required
                  type="number"
                  min="50000"
                  step="5000"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                />
              </label>
            </div>

            <label>
              Diferenciais do Lote ou Imóvel (Posição solar, esquina, benfeitorias)
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex.: Lote nascente, plano, próximo ao clube, quitado..."
              />
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={acceptsDirectFin}
                onChange={(e) => setAcceptsDirectFin(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              Aceito propostas de parcelamento direto ou permuta parcial
            </label>

            <button className="btn" type="submit" disabled={submitting}>
              <Home size={17} />
              {submitting
                ? 'Registrando no Banco Unificado...'
                : 'Cadastrar Imóvel na Carteira AltoPadrão'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

