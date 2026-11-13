'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowUpRight } from 'lucide-react';

export interface SpaceNavInfo {
  id: string;
  slug: string;
  name: string;
  subdomain: string;
}

interface SubdomainBarProps {
  spaces: SpaceNavInfo[];
  currentSlug?: string;
  onOpenCaptureModal?: () => void;
}

export default function SubdomainBar({
  spaces,
  currentSlug,
  onOpenCaptureModal,
}: SubdomainBarProps) {
  const router = useRouter();

  const getSpaceHref = (slug: string) => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      if (host.includes('.localhost:')) {
        const port = host.split(':')[1] || '3000';
        return slug ? `http://${slug}.localhost:${port}` : `http://localhost:${port}`;
      }
      if (host.endsWith('.altopadraoreservas.com')) {
        return slug
          ? `https://${slug}.altopadraoreservas.com`
          : `https://altopadraoreservas.com`;
      }
    }
    return slug ? `/espaco/${slug}` : '/';
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'HOME') {
      window.location.href = getSpaceHref('');
    } else if (val === 'ADMIN') {
      router.push('/admin');
    } else {
      window.location.href = getSpaceHref(val);
    }
  };

  return (
    <div className="network-bar">
      <div className="wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#e9c79b',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: '0.72rem',
            }}
          >
            <MapPin size={13} />
            Empreendimentos AltoPadrão:
          </span>

          <select
            aria-label="Selecionar Condomínio"
            className="network-select"
            value={currentSlug || 'HOME'}
            onChange={handleSelectChange}
          >
            <option value="HOME">Ver todos os condomínios</option>
            {spaces.map((sp) => (
              <option key={sp.slug} value={sp.slug}>
                {sp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="network-switcher">
          <a
            href={getSpaceHref('')}
            className={`network-pill ${!currentSlug ? 'active' : ''}`}
          >
            Todos os Condomínios
          </a>
          {spaces.map((sp) => (
            <a
              key={sp.slug}
              href={getSpaceHref(sp.slug)}
              className={`network-pill ${currentSlug === sp.slug ? 'active' : ''}`}
            >
              {sp.name}
            </a>
          ))}
          {onOpenCaptureModal && (
            <button
              type="button"
              onClick={onOpenCaptureModal}
              className="network-pill"
              style={{
                background: 'rgba(233, 199, 155, 0.12)',
                color: '#e9c79b',
                border: '1px solid rgba(233, 199, 155, 0.28)',
                cursor: 'pointer',
              }}
            >
              Venda seu Imóvel
            </button>
          )}
          <a
            href="/admin"
            className={`network-pill ${currentSlug === 'ADMIN' ? 'active' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              opacity: 0.75,
            }}
          >
            Área do Corretor
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
