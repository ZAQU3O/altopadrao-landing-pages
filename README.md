# AltoPadrão Imobiliária — Plataforma Multi-Espaços & Central de Reservas

Plataforma web de alta conversão desenvolvida para a **AltoPadrão Imobiliária (CRECI 0481-PJ · Teresina - PI)** para centralizar a divulgação de condomínios fechados de alto padrão, simulação de parcelamento direto, reserva de lotes, captação de imóveis de terceiros e gestão comercial unificada.

- **Produção (Vercel):** [https://altopadrao-reservas.vercel.app](https://altopadrao-reservas.vercel.app)
- **Painel Administrativo (`/admin`):** [https://altopadrao-reservas.vercel.app/admin](https://altopadrao-reservas.vercel.app/admin)
- **Repositório GitHub:** [https://github.com/ZAQU3O/altopadrao-landing-pages](https://github.com/ZAQU3O/altopadrao-landing-pages)

---

## 1. Visão Geral & Arquitetura Multi-Subdomínio

O sistema opera com um **domínio principal** (vitrine geral da imobiliária) e **subdomínios dedicados** (ou rotas `/espaco/[slug]`) para cada empreendimento, mantendo 100% da consistência visual e editorial da marca:

| Camada | URL de Produção / Domínio Definitivo | Rota Interna Next.js | Descrição |
| :--- | :--- | :--- | :--- |
| **Portal Principal** | `altopadraoreservas.com` | `/` | Vitrine com seletor rápido de condomínios, filtros por *chips*, comparativo de lotes e captação de imóveis. |
| **Reserva Aldebaran** | `aldebaran.altopadraoreservas.com` | `/espaco/aldebaran` | Landing page exclusiva do Reserva Aldebaran com simulador de parcelas sem juros e reserva direta. |
| **Terras Alphaville 3** | `terrasalphaville.altopadraoreservas.com` | `/espaco/terrasalphaville` | Landing page oficial da nova etapa do Terras Alphaville Teresina 3 com galerias e localização. |
| **Novos Espaços** | `<slug>.altopadraoreservas.com` | `/espaco/<slug>` | Criados dinamicamente pelo painel administrativo (`/admin`) sem necessidade de novo código. |
| **Central Admin** | `admin.altopadraoreservas.com` | `/admin` | Painel protegido por login (e-mail e senha) para gestão de reservas, relatórios de VGV, alertas e CMS. |

O roteamento de subdomínios é gerenciado automaticamente pelo middleware em [`src/middleware.ts`](./src/middleware.ts).

---

## 2. Principais Funcionalidades

### Portal Público & Landing Pages de Condomínios
- **Identidade Visual Editorial & Mobile App-First:** Paleta verde profundo (`#0c1514` / `#121b1a`), cobre/dourado (`#d08a5c` / `#e9c79b`) e tipografia *Cormorant Garamond* + *Manrope*.
- **Experiência Mobile Moderna:**
  - *Header Glassmorphic* compacto (`60px`) com menu gaveta (*drawer*).
  - Barra fixa inferior na zona do polegar (*Thumb-Zone Bottom Dock*) com atalhos para **Simular e Reservar** e **WhatsApp Plantão**.
  - Carrosseis horizontais *Touch-Snap* (`scroll-snap-type: x mandatory`) nas galerias de Lazer, Spa e Família e no seletor do topo.
  - Grid *Bento* 2x2 para destaques numéricos e transformação automática de tabelas em cards mobile (`data-label`).
- **Simulador Interativo de Parcelamento:** Calcula automaticamente o valor das parcelas mensais sem juros a partir do valor do lote e da entrada digitada pelo cliente, vinculando a simulação ao formulário de reserva.
- **Redirecionamento Automático para WhatsApp com Protocolo:** Ao enviar uma reserva, o sistema gera um protocolo único (`RES-2026-XXXX`), grava no banco de dados e abre o WhatsApp da imobiliária com todos os dados preenchidos.
- **Captação de Novos Imóveis:** Modal dedicado para proprietários que desejam vender ou permutar lotes e casas em condomínios fechados (`CAP-2026-XXX`).
- **SEO & Preview Rico no WhatsApp (OpenGraph Dinâmico):** Cada landing page gera automaticamente suas próprias meta tags `og:title`, `og:description` e `og:image` em [`src/app/espaco/[slug]/page.tsx`](./src/app/espaco/[slug]/page.tsx).

### Painel Administrativo Centralizado (`/admin`)
- **Autenticação Segura:** Login por e-mail e senha com sessão via cookie `HTTP-Only` (`altopadrao_admin_session`) e proteção server-side em todas as rotas de escrita ([`src/lib/auth.ts`](./src/lib/auth.ts)).
- **Menu Lateral (Sidebar) & Filtro por Condomínio:** Navegação rápida entre as 6 áreas de gestão com filtro global por empreendimento conectado.
- **Gestão de Reservas & Transações:** Confirmação de reservas, controle de estágio financeiro (*Aguardando Entrada*, *Sinal Solicitado*, *Sinal Pago*, *Entrada Quitada*, *Contrato Assinado*), acionamento via WhatsApp, exclusão de registros e exportação para planilha **CSV**.
- **CMS Completo de Landing Pages (Criar, Editar e Apagar):**
  - Criação instantânea de novas landing pages (subdomínios).
  - Editor visual em 4 abas ([`src/components/SpaceCmsEditorModal.tsx`](./src/components/SpaceCmsEditorModal.tsx)) para alterar preços, metragens, textos de todas as seções e fazer **upload de fotos direto do computador** ou via URL.
  - Exclusão de landing pages com reajuste automático do layout da Home.
- **Relatórios Detalhados & VGV:** Indicadores consolidados de VGV confirmado, fluxo de entradas, carteira parcelada, taxa de conversão e ocupação de estoque por condomínio.
- **Notificações Automáticas em Tempo Real (SSE):** Canal *Server-Sent Events* (`/api/notifications/stream`) que exibe um alerta visual (*toast*) e toca um aviso sonoro no painel sempre que uma reserva é confirmada.
- **Tráfego Pago (Meta Pixel & Google Tag Manager) e Webhook:** Suporte a IDs de Meta Pixel, GTM (com disparo automático do evento `Lead` / `generate_lead`) e URL de Webhook externo (n8n, Zapier, Make, CRM) tanto globalmente quanto por página.

---

## 3. Como Funciona na Prática (Fluxo Operacional do Dia a Dia)

Abaixo está o funcionamento prático da plataforma em cada ponta da operação comercial da **AltoPadrão Imobiliária**:

### A. Jornada do Cliente Comprador (Simulação & Reserva de Lote)
1. **Entrada pela Vitrine ou Tráfego Direto:**
   - O cliente pode entrar pelo **Portal Principal** (`altopadraoreservas.com`), comparar os condomínios lado a lado (preço, entrada mínima, prazo sem juros e metragem) e clicar no empreendimento desejado; **ou**
   - Entrar diretamente na **Landing Page exclusiva** do condomínio vinda de um anúncio do Instagram/Google (ex.: `aldebaran.altopadraoreservas.com` ou `terrasalphaville.altopadraoreservas.com`).
2. **Exploração & Simulação Sem Juros:**
   - Na página do condomínio, o cliente navega pelas galerias (Complexo Aquático, Academia, Spa, Infantil e Localização).
   - No **Simulador de Parcelamento Direto**, ele digita o **Valor do Lote** e o **Valor da Entrada** (com botões rápidos de *Mínima 10%*, *20%* ou *30%*). O sistema calcula na hora o saldo financiado e o valor exato das parcelas mensais sem juros.
   - Ao clicar em **"Reservar com esta simulação"**, a página rola suavemente até o formulário de reserva já trazendo os valores simulados vinculados.
3. **Envio da Reserva & Atendimento Imediato no WhatsApp:**
   - O cliente preenche **Nome**, **WhatsApp** e a **Metragem de interesse** e clica no botão de envio.
   - Em menos de 1 segundo, o sistema realiza **5 ações simultâneas**:
     1. Grava a reserva no banco de dados **Neon PostgreSQL** com um protocolo único (ex.: `RES-2026-4819`).
     2. Dispara o evento de conversão `Lead` no **Meta Pixel** e `generate_lead` no **Google Tag Manager**.
     3. Dispara uma notificação em tempo real (com aviso sonoro) para a tela do **Painel Administrativo (`/admin`)**.
     4. Envia os dados via **Webhook** (se configurado) para o CRM ou automação da imobiliária.
     5. **Redireciona o cliente para o WhatsApp oficial da AltoPadrão** já com a mensagem pronta contendo protocolo, condomínio, metragem escolhida e plano de pagamento simulado.

---

### B. Jornada do Proprietário (Captação de Lotes e Casas)
1. Tanto no Portal Principal quanto dentro de qualquer Landing Page, há a seção **"Já possui um lote ou residência?"** e o botão **"Anunciar Lote / Imóvel"** no topo.
2. Ao clicar, abre-se o modal de **Captação de Imóveis**, onde o proprietário informa:
   - Nome, WhatsApp e E-mail;
   - Nome do Condomínio e Tipo do Imóvel (*Lote / Terreno*, *Casa Pronta*, *Casa em Construção*);
   - Quadra/Lote, Área em m², Valor Pretendido e Objetivo (*Venda*, *Permuta*, *Avaliação*).
3. O sistema gera o protocolo `CAP-2026-XXX`, salva na aba **"Captação de Imóveis"** do painel `/admin` e alerta a equipe de captação em tempo real.

---

### C. Rotina da Equipe Comercial e Gestores no Painel (`/admin`)
1. **Acesso Seguro:** O gestor ou coordenador acessa `/admin` e entra com seu e-mail e senha administrativos.
2. **Monitoramento ao Vivo (Plantão de Vendas):**
   - Com o painel aberto no computador ou celular, qualquer nova reserva feita em qualquer landing page faz saltar um **alerta visual no canto da tela acompanhado de um sinal sonoro**, sem precisar recarregar a página.
3. **Evolução do Funil e Controle de Estoque:**
   - Na aba **Reservas & Transações**, a equipe acompanha todas as solicitações, podendo filtrar por condomínio, buscar pelo nome/protocolo do cliente ou clicar no botão **"WhatsApp"** ao lado do lead para abrir a conversa diretamente com ele.
   - Ao clicar em **"Confirmar"**, o sistema confirma a reserva e **desconta automaticamente 1 unidade do estoque disponível** daquele condomínio nas páginas públicas.
   - O seletor de estágio financeiro permite atualizar o andamento de cada negócio (*Aguardando Entrada* → *Sinal Solicitado* → *Sinal Pago* → *Entrada Quitada* → *Contrato Assinado*).
4. **Relatórios de VGV & Exportação:**
   - Na aba **Relatórios Detalhados**, a diretoria acompanha em tempo real o **VGV Confirmado**, **Total de Entradas**, **Saldo Parcelado**, **Taxa de Conversão** e o comparativo de desempenho entre os condomínios.
   - O botão **"Exportar CSV"** baixa a planilha completa de reservas e clientes para uso no Excel ou Google Sheets.

---

### D. Como Criar ou Editar uma Landing Page pelo CMS (Sem Programador)
1. **Para editar textos, preços ou fotos de uma página existente:**
   - No painel `/admin`, abra a aba **Landing Pages (CMS)** e clique em **"Editar Textos, Preços e Fotos"** no card do condomínio.
   - O editor visual abre dividido em 4 abas:
     - **1. Dados & Preços:** Altere nome, estoque de lotes, preço inicial, prazo sem juros, % de entrada mínima, WhatsApp específico do plantão ou Meta Pixel da página.
     - **2. Topo, Destaques & Simulador:** Edite os títulos de impacto, textos do simulador e os 4 blocos numéricos (*Bento Grid*).
     - **3. Textos das Seções:** Altere os textos de *O Projeto*, *Clube & Lazer*, *Spa*, *Família*, *Localização* e *Chamada Final*.
     - **4. Imagens & Galeria:** Troque a foto de fundo do topo ou qualquer foto das galerias clicando em **"Enviar do PC"** (para subir um arquivo direto do computador) ou colando o link da imagem.
   - Ao clicar em **"Salvar Tudo e Publicar"**, a landing page e a vitrine da Home são atualizadas instantaneamente em produção.
2. **Para lançar um novo condomínio em minutos:**
   - Na aba **Landing Pages (CMS)**, preencha o formulário **"Criar Nova Landing Page"** informando Nome, Slug do subdomínio (ex.: `fazendareal`), Cidade, Quantidade de Lotes e Valor Inicial.
   - O sistema cria a nova landing page completa imediatamente em `/espaco/fazendareal` (e `fazendareal.altopadraoreservas.com`), adiciona o card na Home Principal e já permite personalizar todas as fotos e textos pelo editor CMS.
3. **Para remover um condomínio encerrado:**
   - Basta clicar no botão **"Apagar"** no card da landing page dentro do CMS. O sistema remove a página e reorganiza automaticamente o grid da Home Principal para não deixar espaços vazios.

---

## 4. Tecnologias Utilizadas

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Components & Middleware)
- **Interface:** [React 19](https://react.dev/), CSS Moderno (Custom Properties, CSS Grid `auto-fit`, Scroll Snap) & [Lucide Icons](https://lucide.dev/)
- **Linguagem:** [TypeScript 5](https://www.typescriptlang.org/)
- **ORM & Banco de Dados:** [Prisma ORM 6](https://www.prisma.io/) + **Neon PostgreSQL Serverless** (integrado via Vercel Storage)
- **Hospedagem & CI/CD:** [Vercel](https://vercel.com/) conectada ao GitHub

---

## 5. Estrutura do Projeto

```text
├── prisma/
│   └── schema.prisma                  # Modelos PostgreSQL (Space, Reservation, PropertyCapture, Notification, SystemConfig)
├── public/
│   └── images/
│       ├── aldebaran/                 # Ativos visuais e logos originais da AltoPadrão e Reserva Aldebaran
│       ├── terrasalphaville/          # Perspectivas oficiais em alta resolução do Terras Alphaville Teresina 3
│       └── uploads/                   # Diretório local para fotos enviadas pelo CMS
├── src/
│   ├── middleware.ts                  # Roteamento dinâmico de subdomínios (*.altopadraoreservas.com)
│   ├── app/
│   │   ├── globals.css                # Design system completo, variáveis de tema escuro/claro e responsividade mobile
│   │   ├── layout.tsx                 # Layout raiz e fontes Google (Cormorant Garamond & Manrope)
│   │   ├── page.tsx                   # Home do Portal Principal (altopadraoreservas.com)
│   │   ├── espaco/[slug]/page.tsx     # Página dinâmica de cada condomínio + SEO OpenGraph dinâmico
│   │   ├── admin/page.tsx             # Entrada da Central Administrativa Unificada
│   │   └── api/
│   │       ├── auth/route.ts          # Login, verificação de sessão e logout (Cookie HTTP-Only)
│   │       ├── spaces/route.ts        # Listagem (GET) e criação (POST) de landing pages
│   │       ├── spaces/[id]/route.ts   # Edição completa CMS (PATCH) e exclusão (DELETE) de landing page
│   │       ├── reservations/route.ts  # Listagem (GET) e criação (POST) de reservas + disparo de alertas/webhook
│   │       ├── reservations/[id]/route.ts # Atualização de status financeiro (PATCH) e exclusão (DELETE)
│   │       ├── captures/route.ts      # Listagem (GET) e cadastro (POST) de captação de imóveis
│   │       ├── captures/[id]/route.ts # Atualização de status (PATCH) e exclusão (DELETE) de captação
│   │       ├── notifications/route.ts # Histórico de notificações (GET) e marcação de leitura (PATCH)
│   │       ├── notifications/stream/route.ts # Stream SSE em tempo real para o painel administrativo
│   │       ├── settings/route.ts      # Configurações globais (WhatsApp, Meta Pixel, GTM, Webhook e Senha)
│   │       └── upload/route.ts        # Upload de imagens do computador (disco local ou Data URL na Vercel)
│   ├── components/
│   │   ├── PortalHomeView.tsx         # Interface comercial da Home Principal
│   │   ├── SpaceSubdomainView.tsx     # Interface das Landing Pages exclusivas de cada condomínio
│   │   ├── AdminDashboardView.tsx     # Painel Administrativo com Sidebar, KPIs, Tabelas, Relatórios e Configurações
│   │   ├── SpaceCmsEditorModal.tsx    # Editor CMS completo de textos, preços e galerias de imagens
│   │   ├── PropertyCaptureModal.tsx   # Modal de captação de imóveis de proprietários
│   │   ├── SubdomainBar.tsx           # Barra superior de navegação rápida (exclusiva da área administrativa)
│   │   └── TrackingPixels.tsx         # Injeção automática de Meta Pixel e Google Tag Manager + eventos de Lead
│   └── lib/
│       ├── prisma.ts                  # Instância singleton do PrismaClient e seed inicial de condomínios
│       ├── auth.ts                    # Validação server-side da sessão administrativa
│       ├── events.ts                  # Barramento de eventos em memória para Server-Sent Events (SSE)
│       └── seed-data.ts               # Dados e imagens iniciais dos condomínios
├── next.config.mjs                    # Configurações do Next.js 15
├── package.json                       # Scripts e dependências do projeto
└── tsconfig.json                      # Configuração do TypeScript
```

---

## 6. Como Rodar o Projeto Localmente

### Pré-requisitos
- **Node.js** 18.18+ ou 20+
- Banco PostgreSQL (ou a variável `DATABASE_URL` gerada pela integração do **Neon** na Vercel no arquivo `.env`)

### Passo a Passo

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto com a string de conexão do banco PostgreSQL (Neon):
   ```env
   DATABASE_URL="postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require"
   ```
   *(Caso já esteja autenticado na Vercel CLI, basta rodar `vercel env pull .env` para baixar automaticamente).*

3. **Sincronize o schema do Prisma com o banco:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**
   - **Portal Principal (Home):** `http://localhost:3000`
   - **Landing Page Reserva Aldebaran:** `http://localhost:3000/espaco/aldebaran` (ou `http://aldebaran.localhost:3000`)
   - **Landing Page Terras Alphaville 3:** `http://localhost:3000/espaco/terrasalphaville` (ou `http://terrasalphaville.localhost:3000`)
   - **Painel Administrativo:** `http://localhost:3000/admin`

---

## 7. Como Apontar o Domínio Definitivo e Subdomínios na Vercel

Quando o domínio oficial (ex.: `altopadraoreservas.com`) estiver registrado:

1. No painel da **Vercel**, abra o projeto **`altopadrao-reservas`** e vá em **Settings → Domains**.
2. Adicione o domínio principal:
   - `altopadraoreservas.com`
   - `www.altopadraoreservas.com`
3. Adicione o domínio curinga (*Wildcard*) para habilitar todos os subdomínios automaticamente:
   - `*.altopadraoreservas.com`
4. No provedor de DNS do domínio, aponte os registros `A` / `CNAME` (ou Nameservers da Vercel) conforme exibido na tela da Vercel.
5. A partir desse momento, qualquer nova landing page criada no painel `/admin` (ex.: slug `fazendareal`) responderá automaticamente em `https://fazendareal.altopadraoreservas.com`.

---

## 8. Contato & Identidade Institucional

**AltoPadrão Imobiliária**
- **CRECI:** 0481-PJ
- **Endereço:** Avenida Lindolfo Monteiro, 1210 - Bairro Fátima, Teresina - PI
- **Telefones:** (86) 3303-2451 | (86) 99414-1738
