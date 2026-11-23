'use client';

import React, { useEffect } from 'react';

interface TrackingPixelsProps {
  metaPixelId?: string;
  gtmId?: string;
}

export function trackLeadConversion(payload: {
  type: 'RESERVA' | 'CAPTACAO';
  spaceName?: string;
  value?: number;
  protocol?: string;
}) {
  if (typeof window === 'undefined') return;
  try {
    const w = window as any;
    if (typeof w.fbq === 'function') {
      w.fbq('track', 'Lead', {
        content_name: payload.spaceName || 'AltoPadrão Imobiliária',
        content_category: payload.type,
        value: payload.value || 0,
        currency: 'BRL',
      });
    }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({
        event: 'generate_lead',
        lead_type: payload.type,
        space_name: payload.spaceName || 'AltoPadrão Imobiliária',
        value: payload.value || 0,
        currency: 'BRL',
        protocol: payload.protocol || '',
      });
    }
  } catch {
    // ignore tracking errors
  }
}

export default function TrackingPixels({
  metaPixelId,
  gtmId,
}: TrackingPixelsProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;

    // Meta Pixel initialization
    if (metaPixelId && metaPixelId.trim() !== '') {
      const pixelId = metaPixelId.trim();
      if (!w.fbq) {
        (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod
              ? n.callMethod.apply(n, arguments)
              : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = true;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = true;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(
          window,
          document,
          'script',
          'https://connect.facebook.net/en_US/fbevents.js'
        );
      }
      w.fbq('init', pixelId);
      w.fbq('track', 'PageView');
    }

    // Google Tag Manager initialization
    if (gtmId && gtmId.trim() !== '') {
      const cleanGtm = gtmId.trim();
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const existingScript = document.querySelector(
        `script[src*="googletagmanager.com/gtm.js?id=${cleanGtm}"]`
      );
      if (!existingScript) {
        const j = document.createElement('script');
        j.async = true;
        j.src = `https://www.googletagmanager.com/gtm.js?id=${cleanGtm}`;
        document.head.appendChild(j);
      }
    }
  }, [metaPixelId, gtmId]);

  return null;
}
