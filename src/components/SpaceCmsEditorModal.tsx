'use client';

import React, { useState } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  Type,
  Globe,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface SpaceCmsEditorModalProps {
  space: any;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

function safeParseArray(jsonStr: string | undefined, fallback: any[] = []) {
  if (!jsonStr) return fallback;
  try {
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function SpaceCmsEditorModal({
  space,
  onClose,
  onSaved,
}: SpaceCmsEditorModalProps) {
  const [cmsTab, setCmsTab] = useState<
    'GERAL' | 'HERO' | 'SECOES' | 'IMAGENS'
  >('GERAL');

  // 1. Dados Gerais & Subdomínio
  const [name, setName] = useState(space.name || '');
  const [slug, setSlug] = useState(space.slug || '');
  const [region, setRegion] = useState(space.region || '');
  const [developer, setDeveloper] = useState(space.developer || '');
  const [whatsappNumber, setWhatsappNumber] = useState(
    space.whatsappNumber || '5586900000000'
  );
  const [metaPixelId, setMetaPixelId] = useState(space.metaPixelId || '');
  const [gtmId, setGtmId] = useState(space.gtmId || '');
  const [webhookUrl, setWebhookUrl] = useState(space.webhookUrl || '');
  const [autoOpenWhatsapp, setAutoOpenWhatsapp] = useState(
    space.autoOpenWhatsapp !== false
  );
  const [defaultLotPrice, setDefaultLotPrice] = useState(
    String(space.defaultLotPrice || 350000)
  );
  const [defaultDownPayment, setDefaultDownPayment] = useState(
    String(space.defaultDownPayment || 70000)
  );
  const [maxInstallments, setMaxInstallments] = useState(
    String(space.maxInstallments || 60)
  );
  const [totalLots, setTotalLots] = useState(String(space.totalLots || 238));
  const [availableLots, setAvailableLots] = useState(
    String(space.availableLots || 40)
  );
  const [minAreaM2, setMinAreaM2] = useState(String(space.minAreaM2 || 450));
  const [greenAreaText, setGreenAreaText] = useState(
    space.greenAreaText || '49 mil m²'
  );

  // 2. Hero & Condição Comercial
  const [eyebrow, setEyebrow] = useState(space.eyebrow || '');
  const [offerTitle, setOfferTitle] = useState(space.offerTitle || '');
  const [offerBadge, setOfferBadge] = useState(space.offerBadge || '');
  const [offerBarText, setOfferBarText] = useState(space.offerBarText || '');
  const [heroSubtitle, setHeroSubtitle] = useState(space.heroSubtitle || '');
  const [facts, setFacts] = useState<Array<{ value: string; label: string }>>(
    () => safeParseArray(space.factsJson)
  );
  const [offerBullets, setOfferBullets] = useState<string[]>(() =>
    safeParseArray(space.offerBulletsJson)
  );
  const [areaOptions, setAreaOptions] = useState<string[]>(() =>
    safeParseArray(space.areaOptionsJson)
  );

  // 3. Textos das Seções
  const [projectTitle, setProjectTitle] = useState(space.projectTitle || '');
  const [projectLead, setProjectLead] = useState(space.projectLead || '');
  const [projectBody, setProjectBody] = useState(space.projectBody || '');
  const [architect, setArchitect] = useState(space.architect || '');
  const [landscaper, setLandscaper] = useState(space.landscaper || '');
  const [spaTitle, setSpaTitle] = useState(space.spaTitle || '');
  const [spaLead, setSpaLead] = useState(space.spaLead || '');
  const [locationTitle, setLocationTitle] = useState(space.locationTitle || '');
  const [locationLead, setLocationLead] = useState(space.locationLead || '');
  const [locationBullets, setLocationBullets] = useState<
    Array<{ title: string; text: string }>
  >(() => safeParseArray(space.locationBulletsJson));
  const [tags, setTags] = useState<string[]>(() =>
    safeParseArray(space.tagsJson)
  );
  const [ctaTitle, setCtaTitle] = useState(space.ctaTitle || '');
  const [ctaLead, setCtaLead] = useState(space.ctaLead || '');
  const [footerDisclaimer, setFooterDisclaimer] = useState(
    space.footerDisclaimer || ''
  );

  // 4. Imagens & Galerias
  const [heroImage, setHeroImage] = useState(space.heroImage || '');
  const [projectImage, setProjectImage] = useState(space.projectImage || '');
  const [locationImage, setLocationImage] = useState(space.locationImage || '');
  const [ctaBgImage, setCtaBgImage] = useState(space.ctaBgImage || '');
  const [mosaic, setMosaic] = useState<
    Array<{ cls: string; img: string; title: string; subtitle: string }>
  >(() => safeParseArray(space.mosaicJson));
  const [spaItems, setSpaItems] = useState<Array<{ img: string; text: string }>>(
    () => safeParseArray(space.spaItemsJson)
  );
  const [familyItems, setFamilyItems] = useState<
    Array<{ img: string; title: string; text: string }>
  >(() => safeParseArray(space.familyItemsJson));

  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFileUpload = async (
    file: File,
    fieldKey: string,
    onUrlReady: (url: string) => void
  ) => {
    setUploadingField(fieldKey);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onUrlReady(data.url);
      } else {
        alert(data.error || 'Erro ao enviar imagem.');
      }
    } catch {
      alert('Falha no envio da imagem.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/spaces/${space.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          region,
          developer,
          whatsappNumber,
          metaPixelId,
          gtmId,
          webhookUrl,
          autoOpenWhatsapp,
          defaultLotPrice: Number(defaultLotPrice),
          defaultDownPayment: Number(defaultDownPayment),
          maxInstallments: Number(maxInstallments),
          totalLots: Number(totalLots),
          availableLots: Number(availableLots),
          minAreaM2: Number(minAreaM2),
          greenAreaText,
          eyebrow,
          offerTitle,
          offerBadge,
          offerBarText,
          heroSubtitle,
          factsJson: facts,
          offerBulletsJson: offerBullets.filter((b) => b.trim() !== ''),
          areaOptionsJson: areaOptions.filter((a) => a.trim() !== ''),
          projectTitle,
          projectLead,
          projectBody,
          architect,
          landscaper,
          spaTitle,
          spaLead,
          locationTitle,
          locationLead,
          locationBulletsJson: locationBullets,
          tagsJson: tags.filter((t) => t.trim() !== ''),
          ctaTitle,
          ctaLead,
          footerDisclaimer,
          heroImage,
          projectImage,
          locationImage,
          ctaBgImage,
          mosaicJson: mosaic,
          spaItemsJson: spaItems,
          familyItemsJson: familyItems,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        await onSaved();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const err = await res.json();
        alert(err.error || 'Não foi possível salvar as alterações.');
      }
    } finally {
      setSaving(false);
    }
  };

  const renderImageUploaderCard = (
    label: string,
    fieldKey: string,
    currentUrl: string,
    onChangeUrl: (val: string) => void
  ) => (
    <div
      style={{
        background: 'var(--bg2)',
        border: '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
        padding: '14px',
        borderRadius: '3px',
        display: 'grid',
        gap: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <b style={{ fontSize: '0.88rem' }}>{label}</b>
        <label
          className="btn"
          style={{
            padding: '6px 12px',
            fontSize: '0.76rem',
            cursor: 'pointer',
            margin: 0,
            color: '#fff',
          }}
        >
          <Upload size={13} />
          {uploadingField === fieldKey
            ? 'Enviando...'
            : 'Enviar Foto do Computador'}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f, fieldKey, onChangeUrl);
            }}
          />
        </label>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '80px',
            background: '#0c1514',
            borderRadius: '2px',
            overflow: 'hidden',
            border: '1px solid rgba(233,199,155,0.25)',
          }}
        >
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={label}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : null}
        </div>
        <label style={{ fontSize: '0.78rem', margin: 0 }}>
          Caminho ou URL da Imagem
          <input
            value={currentUrl}
            onChange={(e) => onChangeUrl(e.target.value)}
            placeholder="/images/aldebaran/hero-pool.jpg ou https://..."
            style={{ marginTop: '4px', fontSize: '0.82rem', padding: '8px 10px' }}
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box"
        style={{
          width: 'min(1040px, 100%)',
          maxHeight: '92vh',
          padding: '28px 32px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Editor */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            borderBottom:
              '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
            paddingBottom: '16px',
            marginBottom: '18px',
          }}
        >
          <div>
            <p className="eyebrow" style={{ color: 'var(--cu)', marginBottom: '4px' }}>
              Editor Completo de Landing Page (CMS)
            </p>
            <h3 style={{ fontSize: '2rem' }}>
              Gerenciar Textos e Imagens: {name}
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--mut)', marginTop: '2px' }}>
              Subdomínio: <code>{slug}.altopadraoreservas.com</code> · Rota:{' '}
              <code>/espaco/{slug}</code>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 0,
              color: 'var(--ink)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Abas Internas do Editor */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '22px',
          }}
        >
          {[
            {
              id: 'GERAL',
              label: '1. Subdomínio, Preços & Estoque',
              icon: <Globe size={15} />,
            },
            {
              id: 'HERO',
              label: '2. Topo (Hero), Oferta & Simulador',
              icon: <Sparkles size={15} />,
            },
            {
              id: 'SECOES',
              label: '3. Textos das Seções & Rodapé',
              icon: <Type size={15} />,
            },
            {
              id: 'IMAGENS',
              label: '4. Imagens & Galerias de Fotos',
              icon: <ImageIcon size={15} />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCmsTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 15px',
                borderRadius: '2px',
                border:
                  cmsTab === tab.id
                    ? '1.5px solid var(--cu)'
                    : '1px solid color-mix(in srgb, var(--ink) 20%, transparent)',
                background: cmsTab === tab.id ? 'var(--cu)' : 'var(--bg2)',
                color: cmsTab === tab.id ? '#fff' : 'var(--ink)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSaveAll} style={{ display: 'grid', gap: '18px' }}>
          {/* ABA 1: DADOS GERAIS, SUBDOMÍNIO & VALORES */}
          {cmsTab === 'GERAL' && (
            <div style={{ display: 'grid', gap: '14px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 0.8fr',
                  gap: '14px',
                }}
              >
                <label>
                  Nome Comercial do Empreendimento
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  Subdomínio (slug sem espaços)
                  <input
                    required
                    value={slug}
                    onChange={(e) =>
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9]/g, '')
                      )
                    }
                  />
                </label>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '14px',
                }}
              >
                <label>
                  Região / Localização Curta
                  <input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </label>
                <label>
                  Incorporadora / Construtora
                  <input
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                  />
                </label>
                <label>
                  WhatsApp de Atendimento (com DDI 55)
                  <input
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="5586999990000"
                  />
                </label>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '14px',
                }}
              >
                <label>
                  Valor Padrão do Lote no Simulador (R$)
                  <input
                    type="number"
                    value={defaultLotPrice}
                    onChange={(e) => setDefaultLotPrice(e.target.value)}
                  />
                </label>
                <label>
                  Entrada Padrão no Simulador (R$)
                  <input
                    type="number"
                    value={defaultDownPayment}
                    onChange={(e) => setDefaultDownPayment(e.target.value)}
                  />
                </label>
                <label>
                  Prazo Máximo Sem Juros (Parcelas)
                  <input
                    type="number"
                    value={maxInstallments}
                    onChange={(e) => setMaxInstallments(e.target.value)}
                  />
                </label>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '14px',
                }}
              >
                <label>
                  Total de Lotes do Condomínio
                  <input
                    type="number"
                    value={totalLots}
                    onChange={(e) => setTotalLots(e.target.value)}
                  />
                </label>
                <label>
                  Lotes Disponíveis na Tabela
                  <input
                    type="number"
                    value={availableLots}
                    onChange={(e) => setAvailableLots(e.target.value)}
                  />
                </label>
                <label>
                  Metragem Mínima (m²)
                  <input
                    type="number"
                    value={minAreaM2}
                    onChange={(e) => setMinAreaM2(e.target.value)}
                  />
                </label>
                <label>
                  Texto de Área Verde
                  <input
                    value={greenAreaText}
                    onChange={(e) => setGreenAreaText(e.target.value)}
                    placeholder="Ex: 49 mil m²"
                  />
                </label>
              </div>

              {/* Rastreamento de Tráfego Pago (Meta Pixel / GTM) & Automação WhatsApp */}
              <div
                style={{
                  background: 'var(--bg2)',
                  padding: '14px',
                  borderRadius: '3px',
                  border: '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
                  display: 'grid',
                  gap: '12px',
                  marginTop: '4px',
                }}
              >
                <b style={{ color: 'var(--cu)', fontSize: '0.88rem' }}>
                  Tráfego Pago (Meta Pixel / Google Tag Manager) & Automação desta Landing Page
                </b>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1.2fr',
                    gap: '12px',
                  }}
                >
                  <label>
                    Meta Pixel ID (Facebook / Instagram Ads)
                    <input
                      value={metaPixelId}
                      onChange={(e) => setMetaPixelId(e.target.value)}
                      placeholder="Ex: 123456789012345"
                    />
                  </label>
                  <label>
                    Google Tag Manager ID (GTM / Google Ads)
                    <input
                      value={gtmId}
                      onChange={(e) => setGtmId(e.target.value)}
                      placeholder="Ex: GTM-XXXXXXX"
                    />
                  </label>
                  <label>
                    Webhook de Notificação Externa (n8n / Zapier / CRM)
                    <input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://seu-webhook.com/leads"
                    />
                  </label>
                </div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={autoOpenWhatsapp}
                    onChange={(e) => setAutoOpenWhatsapp(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  Redirecionar o cliente automaticamente para o WhatsApp com o protocolo assim que enviar o formulário de reserva
                </label>
              </div>
            </div>
          )}

          {/* ABA 2: HERO, OFERTA & SIMULADOR */}
          {cmsTab === 'HERO' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                }}
              >
                <label>
                  Texto da Faixa Topo Laranja (Aviso de Oferta)
                  <input
                    value={offerBarText}
                    onChange={(e) => setOfferBarText(e.target.value)}
                  />
                </label>
                <label>
                  Eyebrow (Acima do Título Principal)
                  <input
                    value={eyebrow}
                    onChange={(e) => setEyebrow(e.target.value)}
                  />
                </label>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                }}
              >
                <label>
                  Título Principal do Hero (Ex: Entrada + 60x)
                  <input
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                  />
                </label>
                <label>
                  Selo em Moldura Dourada (Ex: SEM JUROS)
                  <input
                    value={offerBadge}
                    onChange={(e) => setOfferBadge(e.target.value)}
                  />
                </label>
              </div>

              <label>
                Subtítulo Descritivo do Hero
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                />
              </label>

              {/* Editor da Faixa de 4 Números (Facts) */}
              <div
                style={{
                  background: 'var(--bg2)',
                  padding: '14px',
                  borderRadius: '3px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <b style={{ fontSize: '0.88rem' }}>
                    Faixa de Destaques Numéricos (Abaixo do Hero)
                  </b>
                  <button
                    type="button"
                    onClick={() =>
                      setFacts([...facts, { value: 'Novo', label: 'destaque' }])
                    }
                    className="btn ghost"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      color: 'var(--ink)',
                    }}
                  >
                    <Plus size={13} /> Adicionar Número
                  </button>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                  }}
                >
                  {facts.map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <input
                        value={f.value}
                        onChange={(e) => {
                          const next = [...facts];
                          next[idx] = { ...next[idx], value: e.target.value };
                          setFacts(next);
                        }}
                        placeholder="Valor (ex: 450 m²)"
                        style={{ width: '40%', padding: '7px 10px' }}
                      />
                      <input
                        value={f.label}
                        onChange={(e) => {
                          const next = [...facts];
                          next[idx] = { ...next[idx], label: e.target.value };
                          setFacts(next);
                        }}
                        placeholder="Legenda"
                        style={{ flex: 1, padding: '7px 10px' }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFacts(facts.filter((_, i) => i !== idx))
                        }
                        style={{
                          background: 'transparent',
                          border: 0,
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullets da Oferta e Metragens */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                }}
              >
                <label>
                  Itens de Vantagem na Faixa do Simulador (1 por linha)
                  <textarea
                    rows={4}
                    value={offerBullets.join('\n')}
                    onChange={(e) =>
                      setOfferBullets(e.target.value.split('\n'))
                    }
                  />
                </label>
                <label>
                  Opções de Metragem no Formulário de Reserva (1 por linha)
                  <textarea
                    rows={4}
                    value={areaOptions.join('\n')}
                    onChange={(e) => setAreaOptions(e.target.value.split('\n'))}
                  />
                </label>
              </div>
            </div>
          )}

          {/* ABA 3: TEXTOS DAS SEÇÕES (PROJETO, SPA, LOCALIZAÇÃO, RODAPÉ) */}
          {cmsTab === 'SECOES' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div
                style={{
                  background: 'var(--bg2)',
                  padding: '16px',
                  borderRadius: '3px',
                  display: 'grid',
                  gap: '12px',
                }}
              >
                <b style={{ color: 'var(--cu)', fontSize: '0.88rem' }}>
                  Seção "O Projeto"
                </b>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <label>
                    Título da Seção Projeto
                    <input
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    Assinatura de Arquitetura
                    <input
                      value={architect}
                      onChange={(e) => setArchitect(e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Assinatura de Paisagismo
                  <input
                    value={landscaper}
                    onChange={(e) => setLandscaper(e.target.value)}
                  />
                </label>
                <label>
                  Parágrafo de Destaque (Lead)
                  <textarea
                    rows={2}
                    value={projectLead}
                    onChange={(e) => setProjectLead(e.target.value)}
                  />
                </label>
                <label>
                  Parágrafo Complementar do Projeto
                  <textarea
                    rows={2}
                    value={projectBody}
                    onChange={(e) => setProjectBody(e.target.value)}
                  />
                </label>
              </div>

              <div
                style={{
                  background: 'var(--bg2)',
                  padding: '16px',
                  borderRadius: '3px',
                  display: 'grid',
                  gap: '12px',
                }}
              >
                <b style={{ color: 'var(--cu)', fontSize: '0.88rem' }}>
                  Seção "Lazer & Spa"
                </b>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <label>
                    Título do Spa / Bem-Estar
                    <input
                      value={spaTitle}
                      onChange={(e) => setSpaTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    Subtítulo do Spa
                    <input
                      value={spaLead}
                      onChange={(e) => setSpaLead(e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Tags de Itens de Lazer (separadas por linha)
                  <textarea
                    rows={3}
                    value={tags.join('\n')}
                    onChange={(e) => setTags(e.target.value.split('\n'))}
                  />
                </label>
              </div>

              <div
                style={{
                  background: 'var(--bg2)',
                  padding: '16px',
                  borderRadius: '3px',
                  display: 'grid',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <b style={{ color: 'var(--cu)', fontSize: '0.88rem' }}>
                    Seção "Localização"
                  </b>
                  <button
                    type="button"
                    onClick={() =>
                      setLocationBullets([
                        ...locationBullets,
                        { title: 'Destaque', text: 'Descrição do acesso' },
                      ])
                    }
                    className="btn ghost"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      color: 'var(--ink)',
                    }}
                  >
                    <Plus size={13} /> Adicionar Ponto de Localização
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <label>
                    Título da Localização
                    <input
                      value={locationTitle}
                      onChange={(e) => setLocationTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    Descrição da Localização
                    <input
                      value={locationLead}
                      onChange={(e) => setLocationLead(e.target.value)}
                    />
                  </label>
                </div>

                {locationBullets.map((b, idx) => (
                  <div
                    key={idx}
                    style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <input
                      value={b.title}
                      onChange={(e) => {
                        const next = [...locationBullets];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setLocationBullets(next);
                      }}
                      placeholder="Título (ex: 5 min)"
                      style={{ width: '32%', padding: '7px 10px' }}
                    />
                    <input
                      value={b.text}
                      onChange={(e) => {
                        const next = [...locationBullets];
                        next[idx] = { ...next[idx], text: e.target.value };
                        setLocationBullets(next);
                      }}
                      placeholder="Descrição"
                      style={{ flex: 1, padding: '7px 10px' }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setLocationBullets(
                          locationBullets.filter((_, i) => i !== idx)
                        )
                      }
                      style={{
                        background: 'transparent',
                        border: 0,
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: 'var(--bg2)',
                  padding: '16px',
                  borderRadius: '3px',
                  display: 'grid',
                  gap: '12px',
                }}
              >
                <b style={{ color: 'var(--cu)', fontSize: '0.88rem' }}>
                  Chamada Final de Reserva (CTA) & Rodapé Legal
                </b>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <label>
                    Título da Chamada de Reserva
                    <input
                      value={ctaTitle}
                      onChange={(e) => setCtaTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    Texto de Apoio da Chamada de Reserva
                    <input
                      value={ctaLead}
                      onChange={(e) => setCtaLead(e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Texto Legal do Rodapé (CRECI / Incorporação)
                  <textarea
                    rows={2}
                    value={footerDisclaimer}
                    onChange={(e) => setFooterDisclaimer(e.target.value)}
                  />
                </label>
              </div>
            </div>
          )}

          {/* ABA 4: IMAGENS PRINCIPAIS & GALERIAS DE FOTOS */}
          {cmsTab === 'IMAGENS' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '1.35rem', marginBottom: '10px' }}>
                  Imagens Principais da Página
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  {renderImageUploaderCard(
                    '1. Imagem de Capa (Hero Principal)',
                    'heroImage',
                    heroImage,
                    setHeroImage
                  )}
                  {renderImageUploaderCard(
                    '2. Imagem da Seção "O Projeto"',
                    'projectImage',
                    projectImage,
                    setProjectImage
                  )}
                  {renderImageUploaderCard(
                    '3. Imagem da Seção "Localização"',
                    'locationImage',
                    locationImage,
                    setLocationImage
                  )}
                  {renderImageUploaderCard(
                    '4. Imagem de Fundo do Formulário Final',
                    'ctaBgImage',
                    ctaBgImage,
                    setCtaBgImage
                  )}
                </div>
              </div>

              {/* Galeria Mosaico de Lazer */}
              <div
                style={{
                  borderTop:
                    '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
                  paddingTop: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1.35rem' }}>
                      Galeria Mosaico de Lazer ({mosaic.length} fotos)
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--mut)' }}>
                      Gerencie as fotos e legendas da seção de Lazer
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setMosaic([
                        ...mosaic,
                        {
                          cls: 'c',
                          img: '/images/aldebaran/mosaic-1-pool-deck.jpg',
                          title: 'Novo Espaço de Lazer',
                          subtitle: 'Descrição do ambiente',
                        },
                      ])
                    }
                    className="btn ghost"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      color: 'var(--ink)',
                    }}
                  >
                    <Plus size={14} /> Adicionar Foto ao Mosaico
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {mosaic.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg2)',
                        padding: '12px',
                        borderRadius: '3px',
                        display: 'grid',
                        gridTemplateColumns: '110px 1fr auto',
                        gap: '12px',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        style={{
                          width: '110px',
                          height: '78px',
                          objectFit: 'cover',
                          borderRadius: '2px',
                        }}
                      />
                      <div style={{ display: 'grid', gap: '8px' }}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 120px',
                            gap: '8px',
                          }}
                        >
                          <input
                            value={item.title}
                            onChange={(e) => {
                              const next = [...mosaic];
                              next[idx] = { ...next[idx], title: e.target.value };
                              setMosaic(next);
                            }}
                            placeholder="Título da foto"
                            style={{ padding: '6px 9px', fontSize: '0.82rem' }}
                          />
                          <input
                            value={item.subtitle}
                            onChange={(e) => {
                              const next = [...mosaic];
                              next[idx] = {
                                ...next[idx],
                                subtitle: e.target.value,
                              };
                              setMosaic(next);
                            }}
                            placeholder="Subtítulo da foto"
                            style={{ padding: '6px 9px', fontSize: '0.82rem' }}
                          />
                          <select
                            value={item.cls || 'c'}
                            onChange={(e) => {
                              const next = [...mosaic];
                              next[idx] = { ...next[idx], cls: e.target.value };
                              setMosaic(next);
                            }}
                            style={{ padding: '6px 8px', fontSize: '0.8rem' }}
                          >
                            <option value="a">Destaque Maior (7 col)</option>
                            <option value="b">Destaque Médio (5 col)</option>
                            <option value="c">Card 1/3 (4 col)</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            value={item.img}
                            onChange={(e) => {
                              const next = [...mosaic];
                              next[idx] = { ...next[idx], img: e.target.value };
                              setMosaic(next);
                            }}
                            placeholder="URL da imagem"
                            style={{
                              flex: 1,
                              padding: '6px 9px',
                              fontSize: '0.8rem',
                            }}
                          />
                          <label
                            className="btn"
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              margin: 0,
                            }}
                          >
                            <Upload size={13} />
                            {uploadingField === `mosaic-${idx}`
                              ? 'Enviando...'
                              : 'Subir Foto'}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  handleFileUpload(f, `mosaic-${idx}`, (url) => {
                                    const next = [...mosaic];
                                    next[idx] = { ...next[idx], img: url };
                                    setMosaic(next);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setMosaic(mosaic.filter((_, i) => i !== idx))
                        }
                        style={{
                          background: 'transparent',
                          border: 0,
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '6px',
                        }}
                        title="Remover foto"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Galeria Spa & Família */}
              <div
                style={{
                  borderTop:
                    '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
                  paddingTop: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <h4 style={{ fontSize: '1.35rem' }}>
                    Fotos da Seção Spa ({spaItems.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setSpaItems([
                        ...spaItems,
                        {
                          img: '/images/aldebaran/spa-1-sauna.jpg',
                          text: 'Ambiente de relaxamento e bem-estar.',
                        },
                      ])
                    }
                    className="btn ghost"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      color: 'var(--ink)',
                    }}
                  >
                    <Plus size={14} /> Adicionar Foto Spa
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {spaItems.map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg2)',
                        padding: '10px 12px',
                        borderRadius: '3px',
                        display: 'grid',
                        gridTemplateColumns: '90px 1fr auto',
                        gap: '12px',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={s.img}
                        alt="Spa"
                        style={{
                          width: '90px',
                          height: '66px',
                          objectFit: 'cover',
                          borderRadius: '2px',
                        }}
                      />
                      <div style={{ display: 'grid', gap: '6px' }}>
                        <input
                          value={s.text}
                          onChange={(e) => {
                            const next = [...spaItems];
                            next[idx] = { ...next[idx], text: e.target.value };
                            setSpaItems(next);
                          }}
                          placeholder="Legenda do card de Spa"
                          style={{ padding: '6px 9px', fontSize: '0.82rem' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            value={s.img}
                            onChange={(e) => {
                              const next = [...spaItems];
                              next[idx] = { ...next[idx], img: e.target.value };
                              setSpaItems(next);
                            }}
                            style={{
                              flex: 1,
                              padding: '6px 9px',
                              fontSize: '0.8rem',
                            }}
                          />
                          <label
                            className="btn"
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              margin: 0,
                            }}
                          >
                            <Upload size={13} /> Subir Foto
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  handleFileUpload(f, `spa-${idx}`, (url) => {
                                    const next = [...spaItems];
                                    next[idx] = { ...next[idx], img: url };
                                    setSpaItems(next);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSpaItems(spaItems.filter((_, i) => i !== idx))
                        }
                        style={{
                          background: 'transparent',
                          border: 0,
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Galeria Família */}
              <div
                style={{
                  borderTop:
                    '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
                  paddingTop: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <h4 style={{ fontSize: '1.35rem' }}>
                    Cards da Seção Família ({familyItems.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setFamilyItems([
                        ...familyItems,
                        {
                          img: '/images/aldebaran/family-1-kids.jpg',
                          title: 'Para toda a família',
                          text: 'Descrição do espaço',
                        },
                      ])
                    }
                    className="btn ghost"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      color: 'var(--ink)',
                    }}
                  >
                    <Plus size={14} /> Adicionar Card Família
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  {familyItems.map((fam, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg2)',
                        padding: '10px 12px',
                        borderRadius: '3px',
                        display: 'grid',
                        gridTemplateColumns: '90px 1fr auto',
                        gap: '12px',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={fam.img}
                        alt={fam.title}
                        style={{
                          width: '90px',
                          height: '66px',
                          objectFit: 'cover',
                          borderRadius: '2px',
                        }}
                      />
                      <div style={{ display: 'grid', gap: '6px' }}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '0.4fr 0.6fr',
                            gap: '8px',
                          }}
                        >
                          <input
                            value={fam.title}
                            onChange={(e) => {
                              const next = [...familyItems];
                              next[idx] = {
                                ...next[idx],
                                title: e.target.value,
                              };
                              setFamilyItems(next);
                            }}
                            placeholder="Título"
                            style={{ padding: '6px 9px', fontSize: '0.82rem' }}
                          />
                          <input
                            value={fam.text}
                            onChange={(e) => {
                              const next = [...familyItems];
                              next[idx] = {
                                ...next[idx],
                                text: e.target.value,
                              };
                              setFamilyItems(next);
                            }}
                            placeholder="Descrição"
                            style={{ padding: '6px 9px', fontSize: '0.82rem' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            value={fam.img}
                            onChange={(e) => {
                              const next = [...familyItems];
                              next[idx] = { ...next[idx], img: e.target.value };
                              setFamilyItems(next);
                            }}
                            style={{
                              flex: 1,
                              padding: '6px 9px',
                              fontSize: '0.8rem',
                            }}
                          />
                          <label
                            className="btn"
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              margin: 0,
                            }}
                          >
                            <Upload size={13} /> Subir Foto
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  handleFileUpload(f, `fam-${idx}`, (url) => {
                                    const next = [...familyItems];
                                    next[idx] = { ...next[idx], img: url };
                                    setFamilyItems(next);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFamilyItems(
                            familyItems.filter((_, i) => i !== idx)
                          )
                        }
                        style={{
                          background: 'transparent',
                          border: 0,
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Barra Fixa de Salvar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop:
                '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
              paddingTop: '16px',
              marginTop: '6px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              {saveSuccess && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#22c55e',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                  }}
                >
                  <CheckCircle2 size={18} />
                  Alterações salvas e publicadas na Landing Page!
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn ghost"
                style={{ color: 'var(--ink)', padding: '11px 18px' }}
                onClick={onClose}
              >
                Fechar
              </button>
              <button
                type="submit"
                className="btn"
                disabled={saving}
                style={{ padding: '11px 24px' }}
              >
                <Save size={16} />
                {saving
                  ? 'Salvando Alterações...'
                  : 'Salvar Textos e Imagens da Página'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

