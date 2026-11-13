import { PrismaClient } from '@prisma/client';
import { INITIAL_SPACES } from './seed-data';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  seedPromise?: Promise<void>;
};

function getDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  if (process.env.VERCEL) {
    const tmpDb = '/tmp/dev.db';
    try {
      if (!fs.existsSync(tmpDb)) {
        const bundledDb = path.join(process.cwd(), 'prisma', 'dev.db');
        if (fs.existsSync(bundledDb)) {
          fs.copyFileSync(bundledDb, tmpDb);
        }
      }
      return `file:${tmpDb}`;
    } catch {
      // fallback to default
    }
  }
  return undefined;
}

const resolvedDbUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
    ...(resolvedDbUrl ? { datasources: { db: { url: resolvedDbUrl } } } : {}),
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function ensureSeeded() {
  if (globalForPrisma.seedPromise) {
    return globalForPrisma.seedPromise;
  }

  globalForPrisma.seedPromise = (async () => {
    try {
      const count = await prisma.space.count();
      if (count > 0) return;

      const createdSpaces: Record<string, any> = {};
      for (const spaceData of INITIAL_SPACES) {
        const sp = await prisma.space.create({
          data: spaceData,
        });
        createdSpaces[sp.slug] = sp;
      }

      const aldebaran = createdSpaces['aldebaran'];
      const terras = createdSpaces['terrasalphaville'];
      const alphaville = createdSpaces['alphaville'];
      const fazenda = createdSpaces['fazendareal'];

      const sampleReservations = [
        {
          protocol: 'RES-2026-8412',
          spaceId: aldebaran.id,
          clientName: 'Dr. Henrique Cavalcanti',
          clientPhone: '(86) 99981-4420',
          clientEmail: 'henrique.cavalcanti@medpi.com.br',
          clientCpf: '412.890.333-15',
          lotPreference: 'Quadra A · Lote 04 (Frente Clube)',
          areaInterest: '500 a 600 m²',
          lotValue: 410000,
          downPayment: 82000,
          installments: 60,
          installmentValue: 5466.67,
          status: 'CONFIRMADA',
          paymentStatus: 'CONTRATO_ASSINADO',
          sourceHost: 'aldebaran.altopadraoreservas.com',
          brokerName: 'Camila Tajra',
          notes: 'Entrada paga via TED. Contrato assinado digitalmente.',
          confirmedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
        },
        {
          protocol: 'RES-2026-8419',
          spaceId: aldebaran.id,
          clientName: 'Fernanda Eulálio Mendes',
          clientPhone: '(86) 99412-8810',
          clientEmail: 'fernanda.eulalio@arquitetura.com',
          clientCpf: '089.312.743-09',
          lotPreference: 'Quadra C · Lote 18 (Nascente)',
          areaInterest: '450 a 500 m²',
          lotValue: 350000,
          downPayment: 70000,
          installments: 60,
          installmentValue: 4666.67,
          status: 'CONFIRMADA',
          paymentStatus: 'SINAL_PAGO',
          sourceHost: 'aldebaran.altopadraoreservas.com',
          brokerName: 'Rodrigo Burlamaqui',
          notes: 'Reserva confirmada com sinal de R$ 20.000 + saldo de entrada em 15 dias.',
          confirmedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        },
        {
          protocol: 'RES-2026-8425',
          spaceId: terras.id,
          clientName: 'Marcelo Castelo Branco',
          clientPhone: '(86) 99802-1190',
          clientEmail: 'marcelo@cbengenharia.com.br',
          clientCpf: '621.440.193-44',
          lotPreference: 'Quadra F · Lote 09 (Esquina)',
          areaInterest: '380 a 450 m²',
          lotValue: 325000,
          downPayment: 65000,
          installments: 72,
          installmentValue: 3611.11,
          status: 'CONFIRMADA',
          paymentStatus: 'ENTRADA_QUITADA',
          sourceHost: 'terrasalphaville.altopadraoreservas.com',
          brokerName: 'Camila Tajra',
          notes: 'Cliente aproveitou tabela direta de 72x.',
          confirmedAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
        },
        {
          protocol: 'RES-2026-8431',
          spaceId: alphaville.id,
          clientName: 'Patrícia & Gustavo Nogueira',
          clientPhone: '(86) 99911-3040',
          clientEmail: 'gustavo.nogueira@agroinvest.com.br',
          clientCpf: '310.992.813-00',
          lotPreference: 'Quadra Ilha · Lote 02 (Reserva Ecológica)',
          areaInterest: '550 a 750 m²',
          lotValue: 680000,
          downPayment: 170000,
          installments: 60,
          installmentValue: 8500.0,
          status: 'CONFIRMADA',
          paymentStatus: 'CONTRATO_ASSINADO',
          sourceHost: 'alphaville.altopadraoreservas.com',
          brokerName: 'Diretoria Private',
          notes: 'Aquisição de lote ilha pronto para construir.',
          confirmedAt: new Date(Date.now() - 1000 * 60 * 60 * 42),
        },
        {
          protocol: 'RES-2026-8440',
          spaceId: fazenda.id,
          clientName: 'Roberto Silveira Filho',
          clientPhone: '(86) 99955-7122',
          clientEmail: 'roberto.silveira@grupors.com.br',
          clientCpf: '519.220.413-82',
          lotPreference: 'Alameda do Lago · Lote 07',
          areaInterest: '1.200 a 1.800 m²',
          lotValue: 490000,
          downPayment: 98000,
          installments: 60,
          installmentValue: 6533.33,
          status: 'EM_ANALISE',
          paymentStatus: 'AGUARDANDO_ENTRADA',
          sourceHost: 'fazendareal.altopadraoreservas.com',
          brokerName: 'Rodrigo Burlamaqui',
          notes: 'Documentação enviada para análise de crédito da incorporadora.',
        },
        {
          protocol: 'RES-2026-8448',
          spaceId: aldebaran.id,
          clientName: 'Dra. Juliana Paranaguá',
          clientPhone: '(86) 98821-6090',
          clientEmail: 'juliana.paranagua@clinica.med.br',
          clientCpf: '741.203.993-20',
          lotPreference: 'Quadra B · Lote 11 (Próximo ao Spa)',
          areaInterest: '450 a 500 m²',
          lotValue: 360000,
          downPayment: 90000,
          installments: 60,
          installmentValue: 4500.0,
          status: 'PENDENTE',
          paymentStatus: 'AGUARDANDO_ENTRADA',
          sourceHost: 'aldebaran.altopadraoreservas.com',
          brokerName: 'Plantão AltoPadrão',
          notes: 'Simulou pelo site com entrada de R$ 90 mil. Aguardando confirmação.',
        },
      ];

      for (const r of sampleReservations) {
        await prisma.reservation.create({ data: r });
      }

      const sampleCaptures = [
        {
          protocol: 'CAP-2026-301',
          spaceId: alphaville.id,
          ownerName: 'Carlos Eduardo Gayoso',
          ownerPhone: '(86) 99974-2010',
          ownerEmail: 'cadu.gayoso@gmail.com',
          propertyType: 'Mansão Pronta para Morar',
          blockAndLot: 'Alphaville 1 · Quadra E Lote 14',
          areaM2: 560,
          askingPrice: 3450000,
          acceptsDirectFin: true,
          description: 'Mansão duplex recém-construída, 4 suítes, piscina em pedra hijau, energia solar e automação completa.',
          status: 'APROVADO_ESTOQUE',
          sourceHost: 'alphaville.altopadraoreservas.com',
        },
        {
          protocol: 'CAP-2026-305',
          spaceId: aldebaran.id,
          ownerName: 'Antônio Pádua Almendra',
          ownerPhone: '(86) 99401-5532',
          ownerEmail: 'padua.almendra@hotmail.com',
          propertyType: 'Lote em Condomínio',
          blockAndLot: 'Quadra D · Lote 02 (Esquina Nascente)',
          areaM2: 525,
          askingPrice: 395000,
          acceptsDirectFin: true,
          description: 'Repasse/captação de lote de esquina privilegiado em frente ao cinturão verde.',
          status: 'VISTORIA_AGENDADA',
          sourceHost: 'aldebaran.altopadraoreservas.com',
        },
        {
          protocol: 'CAP-2026-309',
          spaceId: terras.id,
          ownerName: 'Luciana Bona',
          ownerPhone: '(86) 99928-9001',
          ownerEmail: 'lucianabona@uol.com.br',
          propertyType: 'Casa Construída',
          blockAndLot: 'Quadra H · Lote 21',
          areaM2: 360,
          askingPrice: 1580000,
          acceptsDirectFin: false,
          description: 'Casa térrea contemporânea pé-direito duplo, 3 suítes + escritório, gourmet integrado.',
          status: 'EM_AVALIACAO',
          sourceHost: 'altopadraoreservas.com',
        },
      ];

      for (const c of sampleCaptures) {
        await prisma.propertyCapture.create({ data: c });
      }

      const sampleNotifications = [
        {
          type: 'RESERVA_CONFIRMADA',
          title: 'Reserva Confirmada · Reserva Aldebaran',
          message: 'Protocolo RES-2026-8419 de Fernanda Eulálio Mendes confirmado (R$ 350.000,00 · Entrada R$ 70.000 + 60x de R$ 4.666,67). Alertas enviados ao corretor e cliente.',
          protocol: 'RES-2026-8419',
          spaceId: aldebaran.id,
          amount: 350000,
          clientName: 'Fernanda Eulálio Mendes',
          clientPhone: '(86) 99412-8810',
          channelsSent: 'PAINEL_REALTIME,WHATSAPP_AUTO,EMAIL_CORRETOR',
          read: false,
        },
        {
          type: 'NOVA_RESERVA',
          title: 'Nova Simulação & Reserva · Reserva Aldebaran',
          message: 'Dra. Juliana Paranaguá solicitou reserva do Lote 11 Quadra B (R$ 360.000,00 · Entrada R$ 90.000). Aguardando confirmação.',
          protocol: 'RES-2026-8448',
          spaceId: aldebaran.id,
          amount: 360000,
          clientName: 'Dra. Juliana Paranaguá',
          clientPhone: '(86) 98821-6090',
          channelsSent: 'PAINEL_REALTIME,WHATSAPP_AUTO',
          read: false,
        },
        {
          type: 'NOVA_CAPTACAO',
          title: 'Novo Imóvel para Captação · Terras Alphaville',
          message: 'Luciana Bona cadastrou Casa Construída (Quadra H · Lote 21) avaliada em R$ 1.580.000,00.',
          protocol: 'CAP-2026-309',
          spaceId: terras.id,
          amount: 1580000,
          clientName: 'Luciana Bona',
          clientPhone: '(86) 99928-9001',
          channelsSent: 'PAINEL_REALTIME,EMAIL_DIRETORIA',
          read: true,
        },
      ];

      for (const n of sampleNotifications) {
        await prisma.notification.create({ data: n });
      }
    } catch (err) {
      console.error('Seed error:', err);
    }
  })();

  return globalForPrisma.seedPromise;
}

