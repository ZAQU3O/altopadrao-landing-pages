'use client';

import React, { useState, useEffect, useRef } from 'react';
import SubdomainBar, { SpaceNavInfo } from './SubdomainBar';
import SpaceCmsEditorModal from './SpaceCmsEditorModal';
import {
  Bell,
  BellRing,
  CheckCircle2,
  TrendingUp,
  Building2,
  FileSpreadsheet,
  Plus,
  Volume2,
  VolumeX,
  Search,
  RefreshCw,
  ArrowUpRight,
  DollarSign,
  Home,
  Globe,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Printer,
  Lock,
  LogOut,
  Edit3,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminDashboardViewProps {
  initialSpaces: any[];
  initialReservations: any[];
  initialCaptures: any[];
  initialNotifications: any[];
}

export default function AdminDashboardView({
  initialSpaces,
  initialReservations,
  initialCaptures,
  initialNotifications,
}: AdminDashboardViewProps) {
  const [spaces, setSpaces] = useState<any[]>(initialSpaces);
  const [reservations, setReservations] = useState<any[]>(initialReservations);
  const [captures, setCaptures] = useState<any[]>(initialCaptures);
  const [notifications, setNotifications] = useState<any[]>(initialNotifications);

  const [activeTab, setActiveTab] = useState<
    | 'RESERVAS'
    | 'RELATORIOS'
    | 'CAPTACOES'
    | 'ESPACOS'
    | 'NOTIFICACOES'
    | 'CONFIGURACOES'
  >('RESERVAS');
  const [spaceFilter, setSpaceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Global System Settings State
  const [cfgWhatsapp, setCfgWhatsapp] = useState('5586900000000');
  const [cfgApplyAllSpaces, setCfgApplyAllSpaces] = useState(true);
  const [cfgMetaPixel, setCfgMetaPixel] = useState('');
  const [cfgGtmId, setCfgGtmId] = useState('');
  const [cfgWebhookUrl, setCfgWebhookUrl] = useState('');
  const [cfgAdminEmail, setCfgAdminEmail] = useState('admin@altopadraoreservas.com');
  const [cfgAdminPassword, setCfgAdminPassword] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [liveToast, setLiveToast] = useState<any | null>(null);
  const [sseConnected, setSseConnected] = useState<boolean>(false);

  // Authentication State (Email & Password protection for Admin / Corretor Area)
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  // CMS Editor & Delete Space State
  const [editingSpace, setEditingSpace] = useState<any | null>(null);
  const [deletingSpace, setDeletingSpace] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Modal: Create New Space / Subdomain
  const [newSpaceModal, setNewSpaceModal] = useState<boolean>(false);
  const [nsName, setNsName] = useState('');
  const [nsSlug, setNsSlug] = useState('');
  const [nsRegion, setNsRegion] = useState('Zona Leste · Teresina - PI');
  const [nsDeveloper, setNsDeveloper] = useState('Mãe Rainha Urbanismo');
  const [nsPrice, setNsPrice] = useState('390000');
  const [nsEntry, setNsEntry] = useState('78000');
  const [nsInstallments, setNsInstallments] = useState('60');
  const [nsMinArea, setNsMinArea] = useState('450');
  const [nsTotalLots, setNsTotalLots] = useState('220');
  const [creatingSpace, setCreatingSpace] = useState(false);

  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  const playNotificationSound = () => {
    if (!soundRef.current || typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Two-note luxury chime (E5 -> B5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.setValueAtTime(987.77, now + 0.14);

      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.65);
    } catch {
      // ignore if browser blocks autoplay before user interaction
    }
  };

  const refreshAllData = async () => {
    try {
      const [spRes, rvRes, cpRes, nfRes] = await Promise.all([
        fetch('/api/spaces'),
        fetch('/api/reservations'),
        fetch('/api/captures'),
        fetch('/api/notifications'),
      ]);
      if (spRes.ok) {
        const d = await spRes.json();
        setSpaces(d.spaces || []);
      }
      if (rvRes.ok) {
        const d = await rvRes.json();
        setReservations(d.reservations || []);
      }
      if (cpRes.ok) {
        const d = await cpRes.json();
        setCaptures(d.captures || []);
      }
      if (nfRes.ok) {
        const d = await nfRes.json();
        setNotifications(d.notifications || []);
      }
    } catch (e) {
      console.error('Error refreshing admin data:', e);
    }
  };

  useEffect(() => {
    fetch('/api/auth')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setAuthUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));

    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.config) {
          setCfgWhatsapp(data.config.globalWhatsapp || '5586900000000');
          setCfgMetaPixel(data.config.globalMetaPixelId || '');
          setCfgGtmId(data.config.globalGtmId || '');
          setCfgWebhookUrl(data.config.globalWebhookUrl || '');
          setCfgAdminEmail(data.config.adminEmail || 'admin@altopadraoreservas.com');
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSavedMsg('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          globalWhatsapp: cfgWhatsapp,
          applyWhatsappToAllSpaces: cfgApplyAllSpaces,
          globalMetaPixelId: cfgMetaPixel,
          globalGtmId: cfgGtmId,
          globalWebhookUrl: cfgWebhookUrl,
          adminEmail: cfgAdminEmail,
          adminPassword: cfgAdminPassword,
        }),
      });
      if (res.ok) {
        setCfgAdminPassword('');
        setSettingsSavedMsg('Configurações salvas e aplicadas com sucesso!');
        await refreshAllData();
        setTimeout(() => setSettingsSavedMsg(''), 3500);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteReservation = async (resId: string, protocol: string) => {
    if (!confirm(`Deseja excluir a reserva ${protocol} permanentemente?`)) return;
    const res = await fetch(`/api/reservations/${resId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await refreshAllData();
    }
  };

  const handleDeleteCapture = async (capId: string, protocol: string) => {
    if (!confirm(`Deseja excluir a captação ${protocol} permanentemente?`)) return;
    const res = await fetch(`/api/captures/${capId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await refreshAllData();
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setAuthUser(data.user);
      } else {
        setLoginError(
          data.error || 'E-mail ou senha incorretos. Tente novamente.'
        );
      }
    } catch {
      setLoginError('Falha ao autenticar. Tente novamente.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthUser(null);
    setLoginPassword('');
  };

  const handleDeleteSpaceConfirm = async () => {
    if (!deletingSpace) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/spaces/${deletingSpace.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeletingSpace(null);
        await refreshAllData();
      } else {
        const err = await res.json();
        alert(err.error || 'Não foi possível apagar a landing page.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!authUser) return;
    const es = new EventSource('/api/notifications/stream');
    es.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        if (payload.event === 'CONNECTED') {
          setSseConnected(true);
          return;
        }
        if (payload.notification) {
          playNotificationSound();
          setLiveToast(payload.notification);
          setNotifications((prev) => [
            payload.notification,
            ...prev.filter((n) => n.id !== payload.notification.id),
          ]);
          refreshAllData();
        }
      } catch {
        // ignore parse errors
      }
    };
    es.onerror = () => {
      setSseConnected(false);
    };
    return () => {
      es.close();
    };
  }, [authUser]);

  const handleConfirmReservation = async (resId: string) => {
    const res = await fetch(`/api/reservations/${resId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'CONFIRMADA',
        paymentStatus: 'SINAL_PAGO',
        triggerNotification: true,
      }),
    });
    if (res.ok) {
      await refreshAllData();
    }
  };

  const handleUpdateReservationStatus = async (
    resId: string,
    status: string,
    paymentStatus?: string
  ) => {
    const res = await fetch(`/api/reservations/${resId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
      }),
    });
    if (res.ok) {
      await refreshAllData();
    }
  };

  const handleUpdateCaptureStatus = async (capId: string, status: string) => {
    const res = await fetch(`/api/captures/${capId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await refreshAllData();
    }
  };

  const handleSimulateRealtimeReservation = async () => {
    const targetSpace =
      spaceFilter !== 'ALL'
        ? spaces.find((s) => s.id === spaceFilter) || spaces[0]
        : spaces[Math.floor(Math.random() * spaces.length)];

    const sampleNames = [
      'Dr. Leonardo Eulálio',
      'Beatriz Tajra Napoleão',
      'Eduardo Freitas Neto',
      'Dra. Clarissa Castelo Branco',
      'Alexandre Arcoverde',
    ];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomQuadra = ['Quadra A', 'Quadra B', 'Quadra C', 'Quadra Ilha'][
      Math.floor(Math.random() * 4)
    ];
    const randomLot = Math.floor(1 + Math.random() * 24);

    await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spaceId: targetSpace.id,
        clientName: randomName,
        clientPhone: `(86) 999${Math.floor(10 + Math.random() * 89)}-${Math.floor(
          1000 + Math.random() * 8999
        )}`,
        clientEmail: 'cliente.vip@altopadrao.com.br',
        lotPreference: `${randomQuadra} · Lote ${randomLot} (Nascente)`,
        areaInterest: `${targetSpace.minAreaM2} a ${targetSpace.minAreaM2 + 100} m²`,
        lotValue: targetSpace.defaultLotPrice,
        downPayment: targetSpace.defaultDownPayment,
        installments: targetSpace.maxInstallments,
        status: 'CONFIRMADA',
        paymentStatus: 'SINAL_PAGO',
        sourceHost: targetSpace.subdomain,
      }),
    });
  };

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingSpace(true);
    try {
      const res = await fetch('/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nsName,
          slug: nsSlug || nsName,
          region: nsRegion,
          developer: nsDeveloper,
          defaultLotPrice: Number(nsPrice),
          defaultDownPayment: Number(nsEntry),
          maxInstallments: Number(nsInstallments),
          minAreaM2: Number(nsMinArea),
          totalLots: Number(nsTotalLots),
          availableLots: Math.round(Number(nsTotalLots) * 0.25),
        }),
      });
      if (res.ok) {
        setNewSpaceModal(false);
        setNsName('');
        setNsSlug('');
        await refreshAllData();
      }
    } finally {
      setCreatingSpace(false);
    }
  };

  const markAllNotificationsRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const exportCsvReport = () => {
    const headers = [
      'Protocolo',
      'Espaco',
      'Subdominio',
      'Cliente',
      'WhatsApp',
      'Unidade',
      'Metragem',
      'Valor_Total_BRL',
      'Entrada_BRL',
      'Parcelas',
      'Valor_Parcela_BRL',
      'Status_Reserva',
      'Status_Pagamento',
      'Data',
    ];
    const rows = filteredReservations.map((r) => [
      r.protocol,
      `"${r.space?.name || ''}"`,
      r.sourceHost,
      `"${r.clientName}"`,
      `"${r.clientPhone}"`,
      `"${r.lotPreference || ''}"`,
      `"${r.areaInterest}"`,
      r.lotValue,
      r.downPayment,
      r.installments,
      r.installmentValue,
      r.status,
      r.paymentStatus,
      new Date(r.createdAt).toLocaleDateString('pt-BR'),
    ]);
    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-altopadrao-reservas-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
  };

  // Filtered Reservations
  const filteredReservations = reservations.filter((r) => {
    if (spaceFilter !== 'ALL' && r.spaceId !== spaceFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        r.clientName.toLowerCase().includes(q) ||
        r.protocol.toLowerCase().includes(q) ||
        r.clientPhone.toLowerCase().includes(q) ||
        (r.lotPreference || '').toLowerCase().includes(q) ||
        (r.space?.name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Financial & Analytical Calculations
  const confirmedList = filteredReservations.filter(
    (r) => r.status === 'CONFIRMADA'
  );
  const totalVgvConfirmed = confirmedList.reduce(
    (acc, r) => acc + Number(r.lotValue || 0),
    0
  );
  const totalDownPaymentConfirmed = confirmedList.reduce(
    (acc, r) => acc + Number(r.downPayment || 0),
    0
  );
  const totalInstallmentsPortfolio =
    totalVgvConfirmed - totalDownPaymentConfirmed;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navSpaces: SpaceNavInfo[] = spaces.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    subdomain: s.subdomain,
  }));

  const fmtBRL = (val: number) =>
    Number(val || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });

  if (!authChecked) {
    return (
      <div
        style={{
          minHeight: '100svh',
          background: '#0c1514',
          color: '#f6f1e8',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src="/images/aldebaran/logo-header.png"
            alt="AltoPadrão Imobiliária"
            style={{ height: '64px', margin: '0 auto 14px' }}
          />
          <p style={{ fontSize: '0.88rem', opacity: 0.75 }}>
            Verificando credenciais de segurança...
          </p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div
        style={{
          minHeight: '100svh',
          background:
            'radial-gradient(circle at 50% 0%, #1a2e2c 0%, #0c1514 70%)',
          color: '#f6f1e8',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: 'min(460px, 100%)',
            background: '#121b1a',
            border: '1px solid rgba(233, 199, 155, 0.28)',
            borderRadius: '4px',
            padding: '38px 34px',
            boxShadow: '0 28px 80px rgba(0, 0, 0, 0.65)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <a href="/" style={{ display: 'inline-block', marginBottom: '14px' }}>
              <img
                src="/images/aldebaran/logo-header.png"
                alt="AltoPadrão Imobiliária"
                style={{ height: '64px', margin: '0 auto' }}
              />
            </a>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: '#e9c79b',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              <Lock size={13} />
              Acesso Restrito · Área do Corretor & Administração
            </div>
            <h1 style={{ fontSize: '2.1rem', color: '#fff' }}>
              Painel Administrativo
            </h1>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'rgba(246, 241, 232, 0.72)',
                margin: '6px auto 0',
              }}
            >
              Informe seu e-mail corporativo e senha para gerenciar reservas,
              landing pages, imagens e textos.
            </p>
          </div>

          <form
            onSubmit={handleLoginSubmit}
            style={{ display: 'grid', gap: '16px' }}
          >
            <label style={{ color: '#f6f1e8' }}>
              E-mail Corporativo
              <input
                type="email"
                required
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@altopadraoreservas.com"
                style={{
                  background: '#0c1514',
                  color: '#f6f1e8',
                  borderColor: 'rgba(233, 199, 155, 0.3)',
                }}
              />
            </label>

            <label style={{ color: '#f6f1e8' }}>
              Senha de Acesso
              <input
                type="password"
                required
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  background: '#0c1514',
                  color: '#f6f1e8',
                  borderColor: 'rgba(233, 199, 155, 0.3)',
                }}
              />
            </label>

            {loginError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.16)',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  color: '#fca5a5',
                  padding: '10px 12px',
                  fontSize: '0.82rem',
                  borderRadius: '2px',
                }}
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="btn"
              disabled={loggingIn}
              style={{ width: '100%', marginTop: '4px' }}
            >
              <Lock size={16} />
              {loggingIn ? 'Autenticando...' : 'Entrar na Área Administrativa'}
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(233, 199, 155, 0.16)',
            }}
          >
            <a
              href="/"
              style={{
                fontSize: '0.8rem',
                color: 'rgba(246, 241, 232, 0.65)',
                textDecoration: 'underline',
              }}
            >
              ← Voltar para a página pública de condomínios
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <SubdomainBar spaces={navSpaces} currentSlug="ADMIN" />

      <div className="admin-topbar">
        <div
          className="wrap-wide"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/" aria-label="Voltar ao Portal">
              <img
                src="/images/aldebaran/logo-header.png"
                alt="AltoPadrão"
                style={{ height: '50px', width: 'auto' }}
              />
            </a>
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: '#e9c79b',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Central Administrativa Unificada</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: sseConnected
                      ? 'rgba(34, 197, 94, 0.2)'
                      : 'rgba(234, 179, 8, 0.2)',
                    color: sseConnected ? '#4ade80' : '#facc15',
                    padding: '2px 8px',
                    borderRadius: '99px',
                    fontSize: '0.68rem',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: sseConnected ? '#22c55e' : '#eab308',
                    }}
                  />
                  {sseConnected ? 'Notificações Live Ativas' : 'Conectando...'}
                </span>
              </div>
              <h1 style={{ fontSize: '1.85rem', color: '#fff' }}>
                Gestão Multi-Espaços, Transações & Relatórios
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={refreshAllData}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#f6f1e8',
                padding: '9px 14px',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
              title="Atualizar dados do painel"
            >
              <RefreshCw size={15} />
              Atualizar Dados
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#f6f1e8',
                padding: '9px 12px',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
              }}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {soundEnabled ? 'Som Ativo' : 'Mudo'}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('NOTIFICACOES')}
              style={{
                position: 'relative',
                background:
                  unreadCount > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(233, 199, 155, 0.35)',
                color: '#f6f1e8',
                padding: '9px 14px',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <BellRing size={16} style={{ color: '#e9c79b' }} />
              Alertas ({unreadCount})
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: 'rgba(239, 68, 68, 0.16)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                padding: '9px 13px',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
              title={`Conectado como ${authUser.email}`}
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Layout com Menu Lateral (Sidebar) + Área Principal */}
      <div className="wrap-wide admin-layout">
        <aside className="admin-sidebar">
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: 'var(--cu)',
                fontWeight: 700,
                padding: '0 6px 8px',
              }}
            >
              Navegação do Painel
            </div>

            <nav className="admin-nav-list">
              {[
                {
                  id: 'RESERVAS',
                  label: 'Reservas & Transações',
                  count: reservations.length,
                  icon: <DollarSign size={16} />,
                },
                {
                  id: 'ESPACOS',
                  label: 'Landing Pages & CMS',
                  count: spaces.length,
                  icon: <Globe size={16} />,
                },
                {
                  id: 'RELATORIOS',
                  label: 'Relatórios & VGV',
                  count: null,
                  icon: <TrendingUp size={16} />,
                },
                {
                  id: 'CAPTACOES',
                  label: 'Captação de Imóveis',
                  count: captures.length,
                  icon: <Building2 size={16} />,
                },
                {
                  id: 'NOTIFICACOES',
                  label: 'Notificações',
                  count: notifications.length,
                  icon: <Bell size={16} />,
                },
                {
                  id: 'CONFIGURACOES',
                  label: 'WhatsApp, Pixels & Senha',
                  count: null,
                  icon: <ShieldCheck size={16} />,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`admin-nav-btn ${activeTab === t.id ? 'active' : ''}`}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </span>
                  {t.count !== null && (
                    <span className="admin-nav-count">{t.count}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div
            style={{
              borderTop: '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
              paddingTop: '14px',
              display: 'grid',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--mut)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Filtrar por Condomínio:
            </span>
            <select
              value={spaceFilter}
              onChange={(e) => setSpaceFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 11px',
                fontSize: '0.83rem',
                fontWeight: 700,
              }}
            >
              <option value="ALL">Todos os Espaços ({spaces.length})</option>
              {spaces.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <div className="admin-main">
          {/* KPIs Consolidados no Topo */}
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="kpi-label">VGV de Reservas Confirmadas</div>
            <div className="kpi-value">{fmtBRL(totalVgvConfirmed)}</div>
            <div style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 600 }}>
              ✓ {confirmedList.length} reservas confirmadas no filtro atual
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-label">Entradas (Fluxo de Caixa Imediato)</div>
            <div className="kpi-value" style={{ color: 'var(--cu)' }}>
              {fmtBRL(totalDownPaymentConfirmed)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--mut)' }}>
              Média de{' '}
              {totalVgvConfirmed > 0
                ? Math.round((totalDownPaymentConfirmed / totalVgvConfirmed) * 100)
                : 20}
              % de entrada direta
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-label">Carteira Parcelada (60x / 72x)</div>
            <div className="kpi-value">{fmtBRL(totalInstallmentsPortfolio)}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--mut)' }}>
              Recebíveis diretos sem juros
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="kpi-label">Estoque & Captações Conectadas</div>
            <div className="kpi-value">
              {spaces.reduce((acc, s) => acc + Number(s.availableLots || 0), 0)} lotes
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--mut)' }}>
              + {captures.length} imóveis de terceiros em captação
            </div>
          </div>
        </div>

        {/* ABA 1: RESERVAS & TRANSAÇÕES UNIFICADAS */}
        {activeTab === 'RESERVAS' && (
          <div className="admin-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.75rem' }}>
                  Banco Unificado de Reservas & Transações
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--mut)', margin: 0 }}>
                  Gerencie todas as reservas vindas dos subdomínios, confirme
                  transações e dispare notificações automáticas.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar cliente, protocolo, lote..."
                  style={{ width: '240px', padding: '9px 12px', fontSize: '0.85rem' }}
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: 'auto', padding: '9px 12px', fontSize: '0.85rem' }}
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="CONFIRMADA">Confirmadas</option>
                  <option value="PENDENTE">Pendentes</option>
                  <option value="EM_ANALISE">Em Análise</option>
                  <option value="CANCELADA">Canceladas</option>
                </select>

                <button
                  type="button"
                  onClick={exportCsvReport}
                  className="btn ghost"
                  style={{
                    color: 'var(--ink)',
                    padding: '9px 14px',
                    fontSize: '0.82rem',
                  }}
                >
                  <FileSpreadsheet size={15} />
                  Exportar CSV
                </button>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Protocolo & Condomínio</th>
                    <th>Cliente & Contato</th>
                    <th>Unidade & Metragem</th>
                    <th>Transação</th>
                    <th>Status & Estágio Financeiro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: 'center',
                          padding: '38px 20px',
                          color: 'var(--mut)',
                        }}
                      >
                        Nenhuma reserva encontrada para o filtro atual. As novas
                        reservas enviadas pelos clientes nas landing pages
                        aparecerão aqui automaticamente em tempo real.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((r) => (
                    <tr key={r.id}>
                      <td data-label="Protocolo & Condomínio">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <b style={{ color: '#e9c79b', fontFamily: 'monospace' }}>
                            {r.protocol}
                          </b>
                          <span style={{ fontSize: '0.73rem', color: 'var(--mut)' }}>
                            {new Date(r.createdAt).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, marginTop: '2px' }}>
                          {r.space?.name}
                        </div>
                      </td>

                      <td data-label="Cliente & Contato">
                        <b>{r.clientName}</b>
                        <div style={{ fontSize: '0.78rem', color: 'var(--mut)' }}>
                          {r.clientPhone}
                        </div>
                      </td>

                      <td data-label="Unidade & Metragem">
                        <b>{r.lotPreference}</b>
                        <div style={{ fontSize: '0.76rem', color: 'var(--mut)' }}>
                          {r.areaInterest}
                        </div>
                      </td>

                      <td data-label="Transação">
                        <b style={{ fontSize: '0.95rem' }}>{fmtBRL(r.lotValue)}</b>
                        <div style={{ fontSize: '0.76rem', color: 'var(--mut)' }}>
                          Entrada {fmtBRL(r.downPayment)} + {r.installments}x de{' '}
                          {Number(r.installmentValue).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </div>
                      </td>

                      <td data-label="Status & Estágio Financeiro">
                        <div style={{ display: 'grid', gap: '6px', justifyItems: 'start' }}>
                          <span
                            className={`badge ${String(r.status).toLowerCase()}`}
                          >
                            {r.status}
                          </span>
                          <select
                            value={r.paymentStatus}
                            onChange={(e) =>
                              handleUpdateReservationStatus(
                                r.id,
                                r.status,
                                e.target.value
                              )
                            }
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              width: 'auto',
                            }}
                          >
                            <option value="AGUARDANDO_ENTRADA">
                              Aguardando Entrada
                            </option>
                            <option value="SINAL_RESERVA_SOLICITADO">
                              Sinal Solicitado
                            </option>
                            <option value="SINAL_PAGO">Sinal Pago</option>
                            <option value="ENTRADA_QUITADA">Entrada Quitada</option>
                            <option value="CONTRATO_ASSINADO">
                              Contrato Assinado
                            </option>
                          </select>
                        </div>
                      </td>

                      <td data-label="Ações">
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {r.status !== 'CONFIRMADA' ? (
                            <button
                              type="button"
                              onClick={() => handleConfirmReservation(r.id)}
                              className="btn"
                              style={{
                                padding: '5px 9px',
                                fontSize: '0.74rem',
                                background: '#1f9d55',
                              }}
                            >
                              <Check size={13} /> Confirmar
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleConfirmReservation(r.id)}
                              style={{
                                padding: '5px 8px',
                                fontSize: '0.73rem',
                                background: 'var(--bg2)',
                                color: 'var(--ink)',
                                border: '1px solid color-mix(in srgb, var(--ink) 25%, transparent)',
                                cursor: 'pointer',
                                borderRadius: '2px',
                                fontWeight: 600,
                              }}
                              title="Reenviar Alerta Automático de Reserva Confirmada"
                            >
                              🔔 Notificar
                            </button>
                          )}

                          <a
                            href={`https://wa.me/${r.clientPhone.replace(
                              /\D/g,
                              ''
                            )}?text=${encodeURIComponent(
                              `Olá ${r.clientName}! Aqui é da Central AltoPadrão Imobiliária. Sua reserva protocolo ${r.protocol} no ${r.space?.name} (${r.lotPreference}) está ${r.status}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '5px 9px',
                              fontSize: '0.73rem',
                              background: '#1f9d55',
                              color: '#fff',
                              textDecoration: 'none',
                              borderRadius: '2px',
                              fontWeight: 700,
                            }}
                          >
                            WhatsApp
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteReservation(r.id, r.protocol)
                            }
                            style={{
                              padding: '5px 8px',
                              fontSize: '0.73rem',
                              background: 'rgba(239, 68, 68, 0.14)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              cursor: 'pointer',
                              borderRadius: '2px',
                              display: 'inline-flex',
                              alignItems: 'center',
                            }}
                            title="Excluir esta reserva"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 2: RELATÓRIOS DETALHADOS PARA TODOS OS ESPAÇOS CONECTADOS */}
        {activeTab === 'RELATORIOS' && (
          <div>
            <div className="admin-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                  marginBottom: '22px',
                }}
              >
                <div>
                  <p className="eyebrow" style={{ color: 'var(--cu)' }}>
                    Business Intelligence Imobiliário
                  </p>
                  <h3 style={{ fontSize: '1.9rem' }}>
                    Relatório Consolidado por Subdomínio & Espaço
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={exportCsvReport}
                    className="btn"
                    style={{ padding: '10px 16px', fontSize: '0.84rem' }}
                  >
                    <FileSpreadsheet size={16} />
                    Baixar Planilha Completa (CSV)
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn ghost"
                    style={{
                      color: 'var(--ink)',
                      padding: '10px 16px',
                      fontSize: '0.84rem',
                    }}
                  >
                    <Printer size={16} />
                    Imprimir Relatório
                  </button>
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Espaço / Empreendimento</th>
                      <th>Reservas & Conversão</th>
                      <th>VGV Confirmado</th>
                      <th>Total Entradas</th>
                      <th>Carteira Parcelada</th>
                      <th>Imóveis Captados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spaces.map((sp) => {
                      const spRes = reservations.filter(
                        (r) => r.spaceId === sp.id
                      );
                      const spConf = spRes.filter(
                        (r) => r.status === 'CONFIRMADA'
                      );
                      const spVgv = spConf.reduce(
                        (sum, r) => sum + Number(r.lotValue || 0),
                        0
                      );
                      const spEntry = spConf.reduce(
                        (sum, r) => sum + Number(r.downPayment || 0),
                        0
                      );
                      const spParcelado = spVgv - spEntry;
                      const spCaps = captures.filter((c) => c.spaceId === sp.id);
                      const convRate =
                        spRes.length > 0
                          ? Math.round((spConf.length / spRes.length) * 100)
                          : 0;

                      return (
                        <tr key={sp.id}>
                          <td data-label="Espaço / Empreendimento">
                            <b>{sp.name}</b>
                            <div style={{ fontSize: '0.75rem', color: 'var(--mut)' }}>
                              {sp.developer}
                            </div>
                          </td>
                          <td data-label="Reservas & Conversão">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span className="badge confirmada">
                                {spConf.length}/{spRes.length} confirmadas
                              </span>
                              <b>({convRate}%)</b>
                            </div>
                          </td>
                          <td data-label="VGV Confirmado">
                            <b style={{ color: '#e9c79b' }}>{fmtBRL(spVgv)}</b>
                          </td>
                          <td data-label="Total Entradas">{fmtBRL(spEntry)}</td>
                          <td data-label="Carteira Parcelada">{fmtBRL(spParcelado)}</td>
                          <td data-label="Imóveis Captados">
                            <b>{spCaps.length}</b> (
                            {fmtBRL(
                              spCaps.reduce(
                                (s, c) => s + Number(c.askingPrice || 0),
                                0
                              )
                            )}
                            )
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Performance Breakdown per Space */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.6rem', marginBottom: '18px' }}>
                Participação de VGV e Ocupação de Estoque por Espaço
              </h3>
              <div style={{ display: 'grid', gap: '18px' }}>
                {spaces.map((sp) => {
                  const spConf = reservations.filter(
                    (r) => r.spaceId === sp.id && r.status === 'CONFIRMADA'
                  );
                  const spVgv = spConf.reduce(
                    (sum, r) => sum + Number(r.lotValue || 0),
                    0
                  );
                  const allConfirmedVgv = Math.max(
                    1,
                    reservations
                      .filter((r) => r.status === 'CONFIRMADA')
                      .reduce((s, r) => s + Number(r.lotValue || 0), 0)
                  );
                  const sharePct = Math.round((spVgv / allConfirmedVgv) * 100);
                  const soldLots = sp.totalLots - sp.availableLots;
                  const soldPct = Math.round((soldLots / sp.totalLots) * 100);

                  return (
                    <div
                      key={sp.id}
                      style={{
                        padding: '16px',
                        background: 'var(--bg)',
                        borderRadius: '3px',
                        border: '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div>
                          <b style={{ fontSize: '1.08rem' }}>{sp.name}</b>{' '}
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.78rem',
                              color: 'var(--mut)',
                            }}
                          >
                            ({sp.subdomain})
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, color: '#e9c79b' }}>
                          VGV Confirmado: {fmtBRL(spVgv)} ({sharePct}% do total) ·{' '}
                          {soldLots}/{sp.totalLots} lotes comercializados ({soldPct}%)
                        </div>
                      </div>
                      <div
                        style={{
                          height: '12px',
                          background: 'var(--deep)',
                          borderRadius: '99px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.max(6, sharePct)}%`,
                            height: '100%',
                            background: 'var(--cu)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: CAPTAÇÃO DE IMÓVEIS DE PROPRIETÁRIOS */}
        {activeTab === 'CAPTACOES' && (
          <div className="admin-card">
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.75rem' }}>
                Central de Captação de Novos Imóveis & Lotes
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--mut)', margin: 0 }}>
                Imóveis e lotes cadastrados por proprietários nas landing pages
                para revenda ou permuta pela AltoPadrão Imobiliária.
              </p>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Protocolo & Condomínio</th>
                    <th>Proprietário & Contato</th>
                    <th>Tipo & Localização</th>
                    <th>Área / Valor Pretendido</th>
                    <th>Condição</th>
                    <th>Status & Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {captures.filter(
                    (c) => spaceFilter === 'ALL' || c.spaceId === spaceFilter
                  ).length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: 'center',
                          padding: '38px 20px',
                          color: 'var(--mut)',
                        }}
                      >
                        Nenhum imóvel cadastrado para captação até o momento.
                      </td>
                    </tr>
                  ) : (
                    captures
                      .filter(
                        (c) => spaceFilter === 'ALL' || c.spaceId === spaceFilter
                      )
                      .map((c) => (
                      <tr key={c.id}>
                        <td data-label="Protocolo & Condomínio">
                          <b style={{ fontFamily: 'monospace', color: '#e9c79b' }}>
                            {c.protocol}
                          </b>
                          <div style={{ fontWeight: 700, marginTop: '2px' }}>
                            {c.space?.name}
                          </div>
                        </td>
                        <td data-label="Proprietário & Contato">
                          <b>{c.ownerName}</b>
                          <div style={{ fontSize: '0.8rem', color: 'var(--mut)' }}>
                            {c.ownerPhone}
                          </div>
                        </td>
                        <td data-label="Tipo & Localização">
                          <b>{c.propertyType}</b>
                          <div style={{ fontSize: '0.8rem', color: 'var(--cu)' }}>
                            {c.blockAndLot}
                          </div>
                          {c.description && (
                            <div
                              style={{
                                fontSize: '0.76rem',
                                color: 'var(--mut)',
                                maxWidth: '320px',
                              }}
                            >
                              {c.description}
                            </div>
                          )}
                        </td>
                        <td data-label="Área / Valor Pretendido">
                          <b>{fmtBRL(c.askingPrice)}</b>
                          <div style={{ fontSize: '0.78rem', color: 'var(--mut)' }}>
                            {c.areaM2} m² (
                            {fmtBRL(Math.round(c.askingPrice / c.areaM2))}/m²)
                          </div>
                        </td>
                        <td data-label="Condição">
                          {c.acceptsDirectFin
                            ? 'Aceita Parcelamento / Permuta'
                            : 'Somente à vista / Fin. Bancário'}
                        </td>
                        <td data-label="Status & Ações">
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <select
                              value={c.status}
                              onChange={(e) =>
                                handleUpdateCaptureStatus(c.id, e.target.value)
                              }
                              style={{
                                padding: '6px 10px',
                                fontSize: '0.78rem',
                                width: 'auto',
                                fontWeight: 700,
                              }}
                            >
                              <option value="EM_AVALIACAO">Em Avaliação</option>
                              <option value="VISTORIA_AGENDADA">
                                Vistoria Agendada
                              </option>
                              <option value="APROVADO_ESTOQUE">
                                Aprovado no Estoque
                              </option>
                              <option value="ARQUIVADO">Arquivado</option>
                            </select>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteCapture(c.id, c.protocol)
                              }
                              style={{
                                padding: '6px 9px',
                                background: 'rgba(239, 68, 68, 0.14)',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                cursor: 'pointer',
                                borderRadius: '2px',
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}
                              title="Excluir esta captação"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 4: GESTÃO DE ESPAÇOS & SUBDOMÍNIOS */}
        {activeTab === 'ESPACOS' && (
          <div className="admin-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '22px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.75rem' }}>
                  Subdomínios e Landing Pages de Espaços
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--mut)', margin: 0 }}>
                  Cada espaço listado possui sua própria Landing Page de alta
                  conversão com subdomínio exclusivo mantendo a consistência da
                  marca AltoPadrão.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNewSpaceModal(true)}
                className="btn"
                style={{ padding: '12px 20px', fontSize: '0.88rem' }}
              >
                <Plus size={17} />
                Criar Novo Espaço + Subdomínio
              </button>
            </div>

            <div className="spaces-grid" style={{ marginTop: '16px' }}>
              {spaces.map((sp) => (
                <div
                  key={sp.id}
                  style={{
                    border: '1px solid color-mix(in srgb, var(--ink) 18%, transparent)',
                    borderRadius: '3px',
                    padding: '22px',
                    background: 'var(--bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        height: '130px',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        marginBottom: '12px',
                        position: 'relative',
                        border: '1px solid rgba(233, 199, 155, 0.2)',
                      }}
                    >
                      <img
                        src={sp.heroImage}
                        alt={sp.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          background: 'rgba(12, 21, 20, 0.9)',
                          color: '#e9c79b',
                          padding: '4px 9px',
                          borderRadius: '2px',
                        }}
                      >
                        https://{sp.subdomain}
                      </span>
                      <span
                        className="badge confirmada"
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                        }}
                      >
                        Ativa
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.75rem' }}>{sp.name}</h4>
                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: 'var(--mut)',
                        margin: '6px 0 0',
                      }}
                    >
                      {sp.region} · Incorporadora: <b>{sp.developer}</b>
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '10px',
                      background: 'var(--bg2)',
                      padding: '12px',
                      borderRadius: '2px',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--mut)', display: 'block' }}>
                        Lote Padrão
                      </span>
                      <b>{fmtBRL(sp.defaultLotPrice)}</b>
                    </div>
                    <div>
                      <span style={{ color: 'var(--mut)', display: 'block' }}>
                        Condição
                      </span>
                      <b>{sp.offerTitle}</b>
                    </div>
                    <div>
                      <span style={{ color: 'var(--mut)', display: 'block' }}>
                        Disponíveis
                      </span>
                      <b>
                        {sp.availableLots}/{sp.totalLots}
                      </b>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setEditingSpace(sp)}
                      className="btn"
                      style={{
                        padding: '11px 16px',
                        fontSize: '0.84rem',
                        width: '100%',
                      }}
                    >
                      <Edit3 size={15} />
                      Editar Textos e Imagens da Página
                    </button>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <a
                        href={`/espaco/${sp.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn ghost"
                        style={{
                          color: 'var(--ink)',
                          padding: '9px 14px',
                          fontSize: '0.8rem',
                          flex: 1,
                        }}
                      >
                        Ver Página Pública
                        <ArrowUpRight size={14} />
                      </a>

                      <button
                        type="button"
                        onClick={() => setDeletingSpace(sp)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#ef4444',
                          padding: '9px 13px',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                        title="Apagar esta Landing Page e Subdomínio"
                      >
                        <Trash2 size={14} />
                        Apagar Página
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA 5: CENTRAL DE NOTIFICAÇÕES AUTOMÁTICAS */}
        {activeTab === 'NOTIFICACOES' && (
          <div className="admin-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.75rem' }}>
                  Log de Disparo de Notificações Automáticas
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--mut)', margin: 0 }}>
                  Histórico auditável de todos os alertas disparados a cada nova
                  reserva confirmada ou imóvel captado.
                </p>
              </div>
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="btn ghost"
                style={{
                  color: 'var(--ink)',
                  padding: '9px 16px',
                  fontSize: '0.82rem',
                }}
              >
                Marcar Todas como Lidas
              </button>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: '32px 20px',
                    textAlign: 'center',
                    background: 'var(--bg)',
                    borderRadius: '3px',
                    color: 'var(--mut)',
                  }}
                >
                  Nenhuma notificação registrada até o momento.
                </div>
              ) : (
                notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '16px 20px',
                    background: 'var(--bg)',
                    border: '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
                    borderLeft: `4px solid ${
                      n.type === 'RESERVA_CONFIRMADA' ? '#1f9d55' : 'var(--cu)'
                    }`,
                    borderRadius: '3px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '4px',
                      }}
                    >
                      <span className="badge confirmada">{n.type}</span>
                      {n.protocol && (
                        <code
                          style={{
                            fontWeight: 700,
                            color: '#e9c79b',
                            fontSize: '0.82rem',
                          }}
                        >
                          {n.protocol}
                        </code>
                      )}
                      <span style={{ fontSize: '0.78rem', color: 'var(--mut)' }}>
                        {new Date(n.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <b style={{ fontSize: '1.05rem', display: 'block' }}>
                      {n.title}
                    </b>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--mut)',
                        margin: '4px 0 6px',
                        maxWidth: '85ch',
                      }}
                    >
                      {n.message}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--cu)', fontWeight: 700 }}>
                      Canais Disparados: {n.channelsSent}
                    </div>
                  </div>

                  {n.clientPhone && (
                    <a
                      href={`https://wa.me/${n.clientPhone.replace(
                        /\D/g,
                        ''
                      )}?text=${encodeURIComponent(
                        `Olá ${n.clientName}! Confirmamos o registro do seu protocolo ${n.protocol} na AltoPadrão Imobiliária.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{
                        padding: '9px 14px',
                        fontSize: '0.78rem',
                        background: '#1f9d55',
                      }}
                    >
                      Acionar Cliente no WhatsApp
                    </a>
                  )}
                </div>
              ))
              )}
            </div>
          </div>
        )}

        {/* ABA 6: CONFIGURAÇÕES GERAIS, WHATSAPP DA IMOBILIÁRIA, PIXELS & SENHA */}
        {activeTab === 'CONFIGURACOES' && (
          <div className="admin-card">
            <div style={{ marginBottom: '22px' }}>
              <p className="eyebrow" style={{ color: 'var(--cu)' }}>
                Configurações Globais do Sistema
              </p>
              <h3 style={{ fontSize: '1.85rem' }}>
                WhatsApp da Imobiliária, Pixels de Tráfego Pago, Webhook & Acesso
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--mut)', margin: 0 }}>
                Insira aqui o número oficial de WhatsApp da AltoPadrão Imobiliária
                quando tiver em mãos, além dos IDs globais de Meta Pixel / Google
                Tag Manager e credenciais de acesso administrativo.
              </p>
            </div>

            <form
              onSubmit={handleSaveGlobalSettings}
              style={{ display: 'grid', gap: '20px', maxWidth: '860px' }}
            >
              <div
                style={{
                  background: 'var(--bg)',
                  padding: '20px',
                  borderRadius: '3px',
                  border: '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
                  display: 'grid',
                  gap: '14px',
                }}
              >
                <b style={{ color: '#e9c79b', fontSize: '1rem' }}>
                  1. WhatsApp Oficial de Plantão da Imobiliária
                </b>
                <label>
                  Número do WhatsApp (com DDI 55 + DDD, apenas números)
                  <input
                    value={cfgWhatsapp}
                    onChange={(e) => setCfgWhatsapp(e.target.value)}
                    placeholder="Ex: 5586999990000"
                  />
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={cfgApplyAllSpaces}
                    onChange={(e) => setCfgApplyAllSpaces(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  Atualizar também o WhatsApp de todas as Landing Pages existentes com este número ao salvar
                </label>
              </div>

              <div
                style={{
                  background: 'var(--bg)',
                  padding: '20px',
                  borderRadius: '3px',
                  border: '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
                  display: 'grid',
                  gap: '14px',
                }}
              >
                <b style={{ color: '#e9c79b', fontSize: '1rem' }}>
                  2. Rastreamento Global (Meta Pixel / Google Tag Manager) & Webhook de Leads
                </b>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px',
                  }}
                >
                  <label>
                    Meta Pixel ID Global (Facebook / Instagram Ads)
                    <input
                      value={cfgMetaPixel}
                      onChange={(e) => setCfgMetaPixel(e.target.value)}
                      placeholder="Ex: 123456789012345"
                    />
                  </label>
                  <label>
                    Google Tag Manager ID Global (GTM / Google Ads)
                    <input
                      value={cfgGtmId}
                      onChange={(e) => setCfgGtmId(e.target.value)}
                      placeholder="Ex: GTM-XXXXXXX"
                    />
                  </label>
                </div>
                <label>
                  URL de Webhook Global (Recebe POST JSON a cada nova Reserva ou Captação)
                  <input
                    value={cfgWebhookUrl}
                    onChange={(e) => setCfgWebhookUrl(e.target.value)}
                    placeholder="https://seu-n8n-ou-crm.com/webhook/altopadrao"
                  />
                </label>
              </div>

              <div
                style={{
                  background: 'var(--bg)',
                  padding: '20px',
                  borderRadius: '3px',
                  border: '1px solid color-mix(in srgb, var(--ink) 16%, transparent)',
                  display: 'grid',
                  gap: '14px',
                }}
              >
                <b style={{ color: '#e9c79b', fontSize: '1rem' }}>
                  3. Credenciais de Acesso à Área Administrativa (/admin)
                </b>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '14px',
                  }}
                >
                  <label>
                    E-mail do Administrador
                    <input
                      type="email"
                      value={cfgAdminEmail}
                      onChange={(e) => setCfgAdminEmail(e.target.value)}
                    />
                  </label>
                  <label>
                    Nova Senha (deixe em branco para manter a senha atual)
                    <input
                      type="password"
                      value={cfgAdminPassword}
                      onChange={(e) => setCfgAdminPassword(e.target.value)}
                      placeholder="Digite apenas se desejar alterar a senha"
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  type="submit"
                  className="btn"
                  disabled={savingSettings}
                >
                  {savingSettings
                    ? 'Salvando Configurações...'
                    : 'Salvar Configurações Globais'}
                </button>
                {settingsSavedMsg && (
                  <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.88rem' }}>
                    ✓ {settingsSavedMsg}
                  </span>
                )}
              </div>
            </form>
          </div>
        )}
        </div>
      </div>

      {/* Modal: Criar Novo Espaço + Subdomínio */}
      {newSpaceModal && (
        <div
          className="modal-backdrop"
          onClick={() => setNewSpaceModal(false)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
              }}
            >
              <div>
                <p className="eyebrow" style={{ color: 'var(--cu)' }}>
                  Expansão Multi-Subdomínio
                </p>
                <h3 style={{ fontSize: '1.9rem' }}>
                  Lançar Nova Landing Page de Espaço
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNewSpaceModal(false)}
                style={{ background: 'transparent', border: 0, cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleCreateSpace}
              style={{ display: 'grid', gap: '12px' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <label>
                  Nome do Espaço / Condomínio
                  <input
                    required
                    value={nsName}
                    onChange={(e) => {
                      setNsName(e.target.value);
                      setNsSlug(
                        e.target.value
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9]/g, '')
                      );
                    }}
                    placeholder="Ex.: Reserva Imperial"
                  />
                </label>

                <label>
                  Subdomínio (.altopadraoreservas.com)
                  <input
                    required
                    value={nsSlug}
                    onChange={(e) => setNsSlug(e.target.value)}
                    placeholder="Ex.: reservaimperial"
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label>
                  Região / Endereço
                  <input
                    required
                    value={nsRegion}
                    onChange={(e) => setNsRegion(e.target.value)}
                  />
                </label>
                <label>
                  Incorporadora / Construtora
                  <input
                    required
                    value={nsDeveloper}
                    onChange={(e) => setNsDeveloper(e.target.value)}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <label>
                  Valor Lote Ref. (R$)
                  <input
                    type="number"
                    required
                    value={nsPrice}
                    onChange={(e) => setNsPrice(e.target.value)}
                  />
                </label>
                <label>
                  Entrada Padrão (R$)
                  <input
                    type="number"
                    required
                    value={nsEntry}
                    onChange={(e) => setNsEntry(e.target.value)}
                  />
                </label>
                <label>
                  Prazo Sem Juros (x)
                  <input
                    type="number"
                    required
                    value={nsInstallments}
                    onChange={(e) => setNsInstallments(e.target.value)}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label>
                  Metragem Mínima (m²)
                  <input
                    type="number"
                    required
                    value={nsMinArea}
                    onChange={(e) => setNsMinArea(e.target.value)}
                  />
                </label>
                <label>
                  Total de Lotes do Condomínio
                  <input
                    type="number"
                    required
                    value={nsTotalLots}
                    onChange={(e) => setNsTotalLots(e.target.value)}
                  />
                </label>
              </div>

              <div
                style={{
                  background: 'var(--bg2)',
                  padding: '10px 14px',
                  fontSize: '0.82rem',
                  borderRadius: '2px',
                }}
              >
                Subdomínio que será provisionado imediatamente:{' '}
                <b>{nsSlug || 'novoespaco'}.altopadraoreservas.com</b>
              </div>

              <button className="btn" type="submit" disabled={creatingSpace}>
                {creatingSpace
                  ? 'Provisionando Subdomínio...'
                  : 'Publicar Espaço e Subdomínio'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal CMS: Editar Textos e Imagens da Landing Page */}
      {editingSpace && (
        <SpaceCmsEditorModal
          space={editingSpace}
          onClose={() => setEditingSpace(null)}
          onSaved={async () => {
            await refreshAllData();
          }}
        />
      )}

      {/* Modal de Confirmação para Apagar Landing Page (Subdomínio) */}
      {deletingSpace && (
        <div
          className="modal-backdrop"
          onClick={() => setDeletingSpace(null)}
        >
          <div
            className="modal-box"
            style={{ width: 'min(500px, 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="eyebrow" style={{ color: '#ef4444' }}>
              Exclusão de Landing Page & Subdomínio
            </p>
            <h3 style={{ fontSize: '1.9rem', marginBottom: '10px' }}>
              Apagar {deletingSpace.name}?
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--mut)' }}>
              Tem certeza que deseja excluir a landing page{' '}
              <b>{deletingSpace.name}</b> (
              <code>{deletingSpace.subdomain}</code>) e todas as reservas
              vinculadas a este espaço? Esta ação não pode ser desfeita.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                marginTop: '20px',
              }}
            >
              <button
                type="button"
                className="btn ghost"
                style={{ color: 'var(--ink)', padding: '10px 18px' }}
                onClick={() => setDeletingSpace(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn"
                disabled={isDeleting}
                onClick={handleDeleteSpaceConfirm}
                style={{
                  background: '#dc2626',
                  padding: '10px 20px',
                }}
              >
                <Trash2 size={15} />
                {isDeleting ? 'Apagando...' : 'Sim, Apagar Landing Page'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast em Tempo Real (SSE) quando uma reserva é confirmada */}
      {liveToast && (
        <div className="realtime-toast">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#4ade80',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <BellRing size={16} />
              Notificação Automática em Tempo Real
            </div>
            <button
              type="button"
              onClick={() => setLiveToast(null)}
              style={{
                background: 'transparent',
                border: 0,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '6px' }}>
            {liveToast.title}
          </div>
          <p style={{ fontSize: '0.84rem', opacity: 0.9, margin: '6px 0 0' }}>
            {liveToast.message}
          </p>
        </div>
      )}
    </div>
  );
}

