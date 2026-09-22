# Guia de Integração Mobile (React Native) — paridade com o chat-web

> **Para quem é:** agente/desenvolvedor que vai construir um app móvel com as mesmas funcionalidades do `chat-web`, consumindo diretamente `ai-api` e `admin-api` — sem passar pelo BFF do Next.js.
> **Base:** validado contra o código em 2026-08-21.
> **§4.2 e §10 atualizadas em 2026-09-20 (plano `docs/TODO/Proyectos por Organización/`, PR-03: `chat-web`, branch `feat/proyectos-por-organizacao`, não mergeada) — CONTRATO DE CAPABILITY.** `capabilities.workspacesEnabled` do `/auth/me` vira a **fonte única** da superfície de Proyectos, por organização, lida com `=== true` (ausência = desligado). A variável de build `NEXT_PUBLIC_WORKSPACES_ENABLED` foi removida do `chat-web`. Fora de projeto, a lista de conversas filtra toda thread com `workspace_id`, com a flag ligada ou desligada. **Código local, ainda não publicado; nenhuma organização ligada em produção até agora.**
> **§4.2, §5.5, §6 e §8 escritas em 2026-09-20 (plano `docs/TODO/Chat Identidade Verificada/`, PR-01: `chat-web`, branch `feat/chat-identidade-verificada`, não mergeada) — MUDANÇA DE CONTRATO.** Quem o `ai-api` acha que você é passa a sair do **token** em `run`, `cancel`, `/py/api/chat`, notas de projeto e áudio; `user_id`/`organization_id` declarados continuam aceitos e não autorizam mais nada. `401` antes do streaming nessas rotas → renovar a sessão (§4.3) e repetir **uma** vez. O lado servidor chega na PR-02 do mesmo plano em modo `shadow`: **nada é recusado** até a virada manual para `enforce`. **Código local, ainda não publicado.**
> **§12 RELIDA INTEIRA contra o código em 2026-09-16 (aiKuaa Events Fase 9, PR-01 a PR-06 juntas, branch `feat/f9-mapa-do-stand` nos cinco repositórios, nenhuma mergeada).** §12.1 e §12.2 conferidas linha a linha e continuam verdadeiras (nada das PR-05/PR-06 mudou `hasStandMap`, a rota `stand-map` do visitante, o `has_stand_map` do bloco ou as regras de tela do chat); §12.3 acrescentada com o widget e o que o app faria se um dia exibir anexos. Duas correções de descrição entraram nesta releitura: a ORDEM de entrega no WhatsApp (duas mensagens, texto primeiro — U-13) e a pré-geração do recorte (U-14).
> **§12 e §12.1 escritas contra o código em 2026-09-15 (aiKuaa Events Fase 9, PR-02: `admin-api`, branch `feat/f9-mapa-do-stand`, não mergeada).** Só as seções novas; nenhuma seção anterior mudou.
> **Conferido contra o código em 2026-09-15 (aiKuaa Events Fase 8, PR-01 a PR-04: `admin-api` `f76bd87` e `chat-web` `3eac011`, branch `feat/f8-autoinscricao-visitante`, não mergeadas).** Escopo desta conferência: §2 (login config), §3.1 (nota sobre o resolvedor de tenant), §4.4, §8, §9.2 e a §11 inteira; as demais seções mantêm a conferência de 2026-09-11.
> **Conferido contra o código em 2026-09-11 (Fase 6 + PR-08 + PR-09).** Achado crítico desta rodada: o login por senha do `chat-web` **não usa mais** a resposta JSON com `access_token` no corpo por padrão — migrou para o fluxo `responseMode: "bridge"` (cookies apenas). Ver §4.1 reescrita e a lacuna §9.1 atualizada.
> Onde o backend hoje não suporta um cenário mobile, a lacuna está registrada explicitamente na [seção 9](#9-lacunas-e-decisões-de-backend-necessárias).
> **👉 Começando agora? Leia primeiro o
> [`PACOTE_INICIO_MOBILE.md`](./PACOTE_INICIO_MOBILE.md)** — escopo, o que já
> existe, o caminho recomendado para o MVP, a única lacuna real (canal nos
> logs) e a lista de acessos a providenciar. Este guia é a referência de
> contrato; aquele é o ponto de entrada.
>
> **Especificações OpenAPI geradas do código:** [`openapi/admin-api.mobile.json`](./openapi/admin-api.mobile.json)
> e [`openapi/ai-api.mobile.json`](./openapi/ai-api.mobile.json) — leia o §0.2 antes de usá-las.
>
> **Complementos obrigatórios de leitura:** [`chat-web.md`](./chat-web.md) (§13 = guia de paridade), [`../ai-api/ai-api.md`](../ai-api/ai-api.md), [`../ai-api/AG-UX.md`](../ai-api/AG-UX.md), [`../admin-api/admin-api.md`](../admin-api/admin-api.md).

---

> **§3.1, §4.1, §4.2, §4.3, §4.7, §4.8, §5.1, §9.0, §9.2 e §11 atualizadas em
> 2026-09-20 — o bloco de autenticação e o contrato de inferência foram
> completados.** A revisão nasceu de uma pergunta simples: *um agente que
> recebesse só este documento conseguiria criar conta, logar, mandar um prompt e
> receber a resposta?* A resposta era não, por quatro motivos, todos corrigidos
> aqui:
>
> 1. **O corpo do `POST /py/api/agent/run` não estava no documento** — §5
>    descrevia só o transporte SSE e delegava o contrato a `docs/ai-api/ai-api.md`.
>    Agora está inline, com a `metadata`, o catálogo de eventos AG-UI e o aviso
>    de que `extra="forbid"` transforma campo a mais em `422` (§5.1).
> 2. **O catálogo de modelos não tinha shape** — sem ele não há `model_name`,
>    `model_url` nem `llm_id` para montar o `run` (§4.8, seção nova).
> 3. **Recuperação de senha e convite não existiam no texto** — `forgot-password`,
>    `reset-password`, `change-password` e `activate` não apareciam uma vez
>    (§4.7, seção nova).
> 4. **O bloqueador de resolução de tenant estava registrado como ressalva** —
>    é o que impede a primeira requisição do app nativo, e derruba o **login**,
>    não só o branding (§3.1, §9.0).
>
> **Segunda parte da mesma rodada (2026-09-20):** entraram a **§0** (introdução
> para a equipe, com as especificações OpenAPI geradas do código e os três
> caminhos pelos quais uma conta nasce) e a **§3.4** (QR code e o que fazer
> quando não há QR). As especificações ficam em
> [`openapi/`](./openapi/) — leia o §0.2 antes de gerar cliente a partir
> delas: no `admin-api` só 16% das operações declaram schema de resposta, e
> nenhuma rota de cadastro declara.
>
> Na mesma rodada entrou o **§5.6** (conversas: listar, abrir, renomear,
> favoritar, mover, apagar, título automático e feedback), que o §8 cobrava no
> checklist sem nenhuma rota no texto — sem histórico não há produto.
>
> **Terceira parte (2026-09-20):** corrigida em todo o documento a premissa de
> que `GET /auth/tenant-branding` responde `404` para organização inexistente.
> Ele responde **`200` com campos vazios** quando o tenant não resolve, e `404`
> só para organização **inativa** — então **hoje não existe sonda de existência
> confiável para cliente nativo**. Alcançou §2, §3.1, §3.2, §3.4 e o checklist
> do §8, além de `analise-mobile-proposta.md`. O achado é o **P-04** do
> [SDD do login mobile](../TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md),
> que também já traz a correção desenhada (**D-15**) e a do bloqueador §9.0
> (**P-03**, decisões D-06 a D-16) — **5 PRs planejadas, nada implementado**.
>
> Também foram corrigidos: a afirmação falsa de que `/auth/me` traz capacidades
> de reasoning (§4.2), o corpo incompleto de `/auth/refresh` (§4.3) e a
> contradição sobre a validade do access token entre §4.1 e §5.5 (§4.1).

---

## 0. Introdução para a equipe de desenvolvimento (escrita em 2026-09-20)

Se você está chegando agora neste documento, leia esta seção inteira antes de
qualquer outra. Ela existe porque o guia tem quase 3000 linhas e a ordem em que
você lê muda quanto tempo você perde.

### 0.1 O que você está construindo

Um app React Native que conversa **direto** com dois backends, sem passar pelo
Next.js do `chat-web`:

| Backend | Para quê | Base URL de exemplo |
|---|---|---|
| `admin-api` (NestJS) | Autenticação, cadastro, perfil, capacidades, catálogo de modelos, uploads | `https://api.aikuaa.ai` |
| `ai-api` (FastAPI) | Chat por SSE, conversas, áudio, arquivos, feedback | **`https://api.aikuaa.ai`**, rotas sob `/py/api/…` |

> **(2026-09-20 — correção de base URL.)** Versões anteriores deste guia diziam
> `https://chat.aikuaa.ai` para o `ai-api`. **Está errado e não funciona em
> produção.** Conferido em `edge-proxy/Caddyfile`: só `api.aikuaa.ai` tem o
> `handle_path /py/*` que remove o prefixo e encaminha ao `ai-api`;
> `chat.aikuaa.ai` cai no `handle` genérico e vai para o **`chat-web`**. O
> rewrite `/py/:path*` do `chat-web` existe **apenas em desenvolvimento**
> (`next.config.ts`: `if (process.env.NODE_ENV !== "development") return []`),
> então `https://chat.aikuaa.ai/py/api/…` responde **`404`** em produção.
>
> **O app fala com um host público só: `api.aikuaa.ai`.** A raiz é o
> `admin-api`; `/py/*` é o `ai-api`. O erro já estava registrado como **P-23**
> no [SDD do login mobile](../TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md)
> desde 2026-08-21 e nunca tinha chegado aqui.

O `chat-web` é a **implementação de referência** do mesmo contrato. Quando este
documento e o `chat-web` divergirem, o `chat-web` está certo e o documento tem
um bug — reporte.

### 0.2 Especificações OpenAPI (geradas do código)

Em [`openapi/`](./openapi/) há dois arquivos, gerados do código em 2026-09-20:

| Arquivo | Conteúdo |
|---|---|
| [`admin-api.mobile.json`](./openapi/admin-api.mobile.json) | 67 rotas, 36 schemas — `/auth/*`, `/file-upload/*`, `/db/llm-organization*`, `/db/user/me`, `/workspace/*` |
| [`ai-api.mobile.json`](./openapi/ai-api.mobile.json) | 26 rotas, 30 schemas — `/api/agent/*`, `/api/threads/*`, `/api/feedback/*`, `/api/files/*`, `/api/chat/*` |

São **subconjuntos** do que o app consome; a superfície administrativa foi
retirada de propósito. Gere o cliente com a ferramenta que preferir, por exemplo:

```bash
npx openapi-typescript docs/chat-web/openapi/ai-api.mobile.json -o src/api/ai-api.d.ts
```

**Três avisos que economizam um dia de depuração:**

1. **Os caminhos do `ai-api` começam em `/api/…`, mas o app chama `/py/api/…`.**
   O prefixo `/py` é adicionado pelo edge-proxy, não pela aplicação. Configure o
   `baseUrl` do cliente gerado como `https://api.aikuaa.ai/py` — ou reescreva
   os caminhos no seu wrapper. Este documento sempre escreve a URL que o app
   deve chamar de verdade (`/py/api/…`).

2. **No `admin-api`, confie no corpo da REQUISIÇÃO, não no da RESPOSTA.** Os
   corpos de requisição são 100% tipados (313/313 operações), porque saem dos
   DTOs `class-validator`. As respostas **não**: só 128 de 784 operações
   declaram schema `2xx` — e em `/auth/*` são 9 de 42. Nenhuma rota
   `/auth/signup/*`, nem `bridge/exchange`, nem `refresh`, nem `activate`
   declara o que devolve. **Os corpos de resposta do `admin-api` estão escritos
   à mão neste documento**, nas seções §4 e §11 — é a fonte de verdade para
   eles. *(Fechar essa lacuna no backend é barato: `@ApiOkResponse` em ~15
   rotas de auth. Vale pedir ao time.)*

3. **No `ai-api` a história é outra:** 74 de 74 operações têm resposta tipada
   (Pydantic dá de graça). O cliente gerado dali é confiável de ponta a ponta.
   A única exceção é o **stream SSE** do `POST /py/api/agent/run`: OpenAPI não
   descreve stream de eventos, então o catálogo de eventos está no §5.1, à mão.

**Para regenerar** quando o backend mudar: `ai-api` expõe `/openapi.json`
(FastAPI); `admin-api` expõe `/docs` e `/api-json` (Swagger, `main.ts`). Os
arquivos deste diretório foram gerados a partir do código, não de um servidor
rodando.

### 0.3 A ordem de leitura que funciona

1. **§9.0 — leia primeiro.** Há um bloqueador aberto: sem um sinal de topologia
   na requisição, o `admin-api` não identifica a organização e responde
   `400 TENANT_NOT_FOUND` no login, no `login-config` e no cadastro. **Nenhuma
   estimativa é confiável antes de isso ser respondido pelo time do
   `admin-api`.** Diagnóstico completo no fim do §3.1.
2. **§0.4 e §3** — como o app descobre em qual organização o usuário entra.
3. **§4** — autenticação: login, sessão, renovação, senha, convite, catálogo de
   modelos.
4. **§5** — inferência: corpo do `run`, eventos SSE, conversas.
5. **§11** — cadastro do visitante, **apenas** em organização de evento.
6. O resto (§6 a §12) conforme a funcionalidade entrar no escopo.

### 0.4 Como uma conta nasce: os três caminhos

Esta é a pergunta que mais gera confusão, então vai explícita. **Não existe um
"cadastre-se" universal da plataforma.** Há três caminhos, e qual deles se
aplica depende da organização:

| Caminho | Quando se aplica | O app participa? | Onde está |
|---|---|---|---|
| **A. Autoinscrição do visitante** | **Só em organização de evento** que tenha edição corrente, termo vigente e departamento "Visitante" | **Sim, por inteiro** | §11 |
| **B. Convite do administrador** | Organização comum: alguém do `admin-web` cria o usuário e dispara o convite | Parcialmente — o link do e-mail abre o **navegador** hoje | §4.7 |
| **C. Pedido de acesso via Google** | Identidade Google nova numa organização sem cadastro aberto | **Não** — é só web (§9.2) | §11.4 |

`POST /auth/register` — a rota antiga de registro livre — **foi aposentada** e
responde `410 AUTH_LEGACY_ROUTE_RETIRED`. Não existe quarto caminho.

**Como o app decide qual mostrar.** Uma chamada, antes de qualquer tela:

```
GET {ADMIN_API}/auth/login-config?client=chat
```

A resposta traz `methods` (como entrar) e `signup` (se dá para criar conta):

```jsonc
{
  "context": "organization",
  "organization": { "publicId": "…", "slug": "expo", "name": "…", "logoUrl": "…" },
  "methods": { "email": true, "microsoft": false, "google": true },
  "signup":  { "enabled": true, "methods": { "email": true, "google": true } }
}
```

Regra de tela, sem exceção: mostre **"Crear cuenta"** somente com
`signup.enabled === true` **e** `signup.methods.email === true`. O app não
cadastra com Google (§9.2), então `signup.methods.google` é ignorado. Com
`signup.enabled === false`, o app oferece **só login** — quem não tem conta
precisa ser convidado por um administrador.

O resumo do caminho A, do começo ao fim, está no §11.3 ("Sequência completa no
app"): `start` → `verify` → termo → `complete` → `bridge/exchange` → `refresh`
→ `/auth/me`. São sete chamadas, e a conta **só nasce na sexta** — antes do
aceite do termo nada existe em banco.

---

## 1. Princípios

1. **O app fala direto com os dois backends, sem passar pelo BFF do chat-web**
   (`/api/auth/*` são rotas internas do Next.js). **(2026-09-20 — nuance:** isto
   é o destino, não uma impossibilidade. O BFF é utilizável por um app nativo e
   contorna o bloqueador do §9.0 sem backend novo; prós e contras no §1.1.**)**
   Os dois backends:
   - `admin-api` (`NEXT_PUBLIC_API_URL` equivalente, ex.: `https://api.aikuaa.ai`) — auth, perfil, capacidades, workspaces, modelos.
   - `ai-api` (**`https://api.aikuaa.ai`**, rotas sob `/py/api/...` — ver a correção no §0.1) — chat SSE, arquivos, áudio, feedback.
2. **Cookie não prova sessão** — a fonte de verdade é `GET /auth/me`.
3. **Contratos são estáveis**: eventos AG-UX, clarificação por forma, reasoning top-level. Não invente campos.
4. **Textos já vêm localizados** (`displayMessage`, avisos de clarificação) — o app não traduz nem compõe.

### 1.1 Duas arquiteturas possíveis — e por que o widget não é precedente (escrito em 2026-09-20)

> Seção nova, escrita a partir de uma pergunta do time: *"achei que já estava
> tudo pronto e o mobile ia usar a infra do chat-web, como o widget fez."*
> A pergunta é boa e a resposta tem duas partes.

#### O widget não autentica ninguém

O widget **não é** um caso de "cliente que reusou a infra existente". Ele tem
**BFF próprio**, construído para ele: 17 rotas sob
`chat-web/src/app/api/widget/v1/` — `sessions`, `sessions/refresh`,
`sessions/current`, `visitors/current/identification`, `conversations/[id]/
{messages,turns,handoff,restart}`, `assets/{logo,stand-map}` — mais uma borda
dedicada no `edge-proxy` (as regex `@widget_stream` e `@widget_surface` do
`Caddyfile`). Alguém construiu tudo isso.

E, principalmente: **o widget não faz login.** Não há senha, não há cadastro,
não há `/auth/me`. `POST /api/widget/v1/sessions` cria uma sessão de **visitante
anônimo**, com vínculo ao navegador e nonce. O app móvel precisa de outra coisa
— autenticar uma pessoa e, quando a organização permitir, criar a conta dela.

Então o precedente do widget diz o contrário do que parece: **cada superfície
nova ganhou o caminho de que precisava**. O widget ganhou o dele; o app ainda
não tem o seu.

#### O que já existe e funciona

Quase tudo. O backend de chat está pronto e em produção: inferência, RAG,
conversas, arquivos, áudio, eventos, cadastro de visitante. **Nada disso
precisa ser construído.** Este guia documenta um produto funcionando, não um
projeto.

O que falta é estreito e sempre a mesma coisa: **toda superfície até hoje foi
um navegador.** Navegador manda `Origin` e `Host` sozinho, guarda cookie
`HttpOnly` sozinho, respeita CORS, e abre universal link. Um app nativo não faz
nada disso de graça — e três mecanismos do `admin-api` dependem justamente
disso: a resolução de tenant (§3.1), a sessão por cookie (§4.1) e o retorno do
OAuth (§9.2).

#### Caminho A — pelo BFF do `chat-web` (como o widget, e mais barato)

O §1 acima diz que o app nunca fala com o BFF. **Isso é a recomendação de
destino, não uma impossibilidade** — e vale rever para o MVP.

O `chat-web` já expõe um BFF de autenticação completo em
`src/app/api/auth/`: `login`, `logout`, `refresh`, `session`, `terms/*` e as
seis rotas de `signup/*`. Ele existe para o navegador, mas **um app nativo
consegue usá-lo**:

```
App chama:  POST https://expo.aikuaa.ai/api/auth/login
Headers:    Origin: https://expo.aikuaa.ai
            Content-Type: application/json
Corpo:      { "email": "…", "password": "…", "remember": true }
```

Por que funciona (conferido em `src/lib/serverAuth.ts` e
`src/lib/authRequestSecurity.ts`):

1. O `Host` da requisição é `expo.aikuaa.ai`, então o BFF deriva o slug e
   injeta `Origin`, `X-Forwarded-Host`, `X-Tenant-Slug` e `X-Tenant-Host` na
   chamada ao `admin-api` (`buildBackendAuthHeaders`). **O bloqueador do §9.0
   desaparece** — é o BFF que resolve o tenant, exatamente como faz para o
   navegador.
2. O guardião do BFF (`validateAuthRequest`) exige só que `Origin` bata com o
   `Host` e que `sec-fetch-site` não seja `cross-site`. Um app nativo controla
   o primeiro e não manda o segundo.
3. O BFF faz o `login` → `bridge/exchange` internamente e devolve os
   `Set-Cookie`. O app guarda com `@react-native-cookies/cookies` — **os três
   passos do §4.1 viram um**.

**O que este caminho NÃO resolve:**

| Limite | Detalhe |
|---|---|
| Nunca devolve token | `POST /api/auth/refresh` responde `{ message }` + `Set-Cookie`, **sem `access_token` no corpo**. O app vive de cookie, e cookie no `Keychain` é mais frágil que um Bearer |
| Cobre só auth e eventos | Não há BFF para o catálogo de modelos (§4.8), `/file-upload/*`, `/workspace/*`. Essas chamadas vão direto ao `admin-api` — e aí o `Origin` forjado volta a ser necessário |
| ~~O `ai-api` fica noutro host~~ | **Deixou de ser limite.** `AUTH_COOKIE_DOMAIN = .aikuaa.ai` em produção (confirmado 2026-09-20, §4.1): o cookie emitido em `<slug>.aikuaa.ai` **é enviado para `api.aikuaa.ai/py/*`**. O chat funciona pelo cookie sem nenhuma mudança |
| OAuth continua quebrado | O retorno do provedor vai para a web (§9.2), com ou sem BFF |
| Acopla o app ao `chat-web` | Toda mudança no BFF passa a ter um segundo consumidor que ninguém vê nos testes |

#### Caminho B — modo nativo no `admin-api` (o SDD de login mobile)

É o destino desenhado em
[`docs/TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md`](../TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md):
cliente `mobile`, tenant por `X-Tenant-Slug` em host neutro, `login` e `refresh`
com **tokens no corpo** e sem cookie, OAuth por universal link. **5 PRs
planejadas, nada implementado** — e a conferência de 2026-09-20
([`CONFERENCIA_SDD_vs_CODIGO`](../TODO/login-app-mobile/CONFERENCIA_SDD_vs_CODIGO_2026-09-20.md))
mostrou que a PR-02 encolheu muito, porque a entrega Sessões com Estado já fez a
parte de sessão.

#### Como escolher

| | Caminho A (BFF) | Caminho B (nativo) |
|---|---|---|
| Trabalho de backend para o MVP | **nenhum** | 2 PRs (cliente `mobile` + modo nativo) |
| Resolve o §9.0 | sim, de lado | sim, de frente |
| Sessão no app | cookies | Bearer + refresh no corpo |
| Catálogo de modelos, upload, workspace | ainda direto no `admin-api` | direto, com contrato próprio |
| OAuth no app | não | sim (PR-04 do SDD) |
| Dívida criada | acoplamento ao BFF | nenhuma |

**Recomendação:** comece pelo **A** para validar o produto no aparelho sem
esperar backend, e trate o **B** como destino — isolando login, sessão e
renovação atrás de uma interface no app, para que a troca seja local. É o que o
§4.1 já recomenda por outro motivo.

**Uma das duas perguntas que este guia deixava em aberto já foi respondida**
(2026-09-20): `AUTH_COOKIE_DOMAIN` é `.aikuaa.ai` em produção, então o caminho A
é tecnicamente viável de ponta a ponta — o cookie do login atravessa do
`<slug>.aikuaa.ai` até o `api.aikuaa.ai/py/*` do chat.

**Resta uma, e é de gente, não de código:** o BFF do `chat-web` pode ter um
segundo consumidor? Hoje ele é privado do próprio `chat-web`; com o app, toda
mudança nele passa a ter um consumidor que não aparece nos testes do repositório.

---

## 2. Base URLs e resolução de tenant (conferido 2026-09-11, sem mudança)

### Headers obrigatórios em TODA chamada (os dois backends)

| Header | Valor |
|---|---|
| `X-Tenant-Host` | hostname da organização (ex.: `cliente.aikuaa.ai`). Em app, use o host configurado no login/onboarding. |
| `X-Tenant-Slug` | slug derivado (ex.: `cliente`). Regras de derivação: `chat.cliente.aikuaa.ai → cliente`; `api.*` → sem slug; `<org>.localhost` → slug (dev). |
| `X-Client-App` | **ver seção 4** — para autenticação só valem `chat` ou `admin`. |

### Branding público (pré-login)

```
GET {ADMIN_API}/auth/tenant-branding
Headers: X-Tenant-Host, X-Tenant-Slug
```

Resposta: `{ assistantName, assistantLogoUrl, assistantSlogan, logoScale, assistantLogoScale }`.

> **(2026-09-20 — correção.)** A redação anterior dizia "tenant inexistente →
> **404**". **Não é o que o código faz.** Lendo
> `auth.controller.ts:getTenantBranding`: o `404` (`NotFoundException "Tenant no
> encontrado"`) acontece **só** quando o tenant **resolve** para uma organização
> **inativa**. Quando o tenant **não resolve** — que é exatamente o caso do app
> nativo sem sinal de topologia (§3.1, §9.0) — a rota responde **`200` com todos
> os campos vazios**.
>
> **Isto não é novidade: o SDD do login mobile já tinha registrado.** É o achado
> **P-04** de
> [`docs/TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md`](../TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md)
> (2026-08-21), com a mesma leitura do código — e a correção já está desenhada
> ali como **D-15**: `X-Client-App: mobile` + `X-Tenant-Slug` → `200` com
> branding quando a organização está ativa, `404 TENANT_NOT_FOUND` caso
> contrário, com limite `tenant-probe` de 30/60 s por IP (§6.2 do SDD). Sem o
> cabeçalho `mobile`, o comportamento atual continua — retrocompatível com o
> `chat-web`. **Nada disso foi implementado.**
>
> Consequência para o app: **`200` aqui não prova que a organização existe.**
> Branding vazio é indistinguível de "existe, mas não configurou logo". Enquanto
> o §9.0 não for resolvido, **não existe sonda de existência confiável para
> cliente nativo** — não construa a tela de confirmação ("Você está entrando na
> Acme") sobre este `200`. A proposta de rota dedicada está em
> [`docs/TODO/Codigo Curto da Organizacao/PROPOSTA_CODIGO_CURTO.md`](../TODO/Codigo%20Curto%20da%20Organizacao/PROPOSTA_CODIGO_CURTO.md).

### Login config (quais métodos estão habilitados)

```
GET {ADMIN_API}/auth/login-config?client=chat
```

Retorna contexto (`global_admin` ou `organization` com `{ publicId, slug, name, logoUrl }`) e `methods: { email, microsoft, google }` — monte a tela de login condicionalmente por esses flags.
Desde a Fase 8 do aiKuaa Events (PR-01) a resposta traz também o campo aditivo `signup: { enabled, methods: { email, google } }`. **Regra de tela (conferida 2026-09-15, PR-04):** o `chat-web` só mostra "Crear cuenta" com `signup.enabled === true` **e** pelo menos um método `true` — `enabled: true` com os dois métodos `false` é resposta válida e não deve abrir uma tela sem opção. Como o app ainda não cadastra com Google (§9.2), no app a condição prática é `signup.enabled === true && signup.methods.email === true`. Detalhes em [§11.1](#111-disponibilidade-do-cadastro-e-texto-público-do-termo-pr-01) e [§11.5](#115-regras-de-tela-que-o-app-repete-pr-04).

---

## 3. Descoberta do tenant no app (onboarding) (conferido 2026-09-11, sem mudança)

Na web, o tenant vem do hostname. No app não existe hostname por organização: um binário atende a todos os tenants. A solução é fazer o usuário **declarar** o tenant uma única vez, validá-lo por **sonda individual** e persistir. **Não existe endpoint de listagem de tenants e não se deve criar um** — a descoberta é sempre 1:1, igual ao fluxo de workspace do Slack.

### 3.1 Fluxo completo (funciona hoje, sem mudança de backend)

**Tela 1 — "Qual o endereço da sua organização?"**

Usuário digita `cliente.aikuaa.ai` (ou só `cliente`). O app normaliza com as mesmas regras de `tenantHeaders.ts`:

- Aceita domínio completo ou apenas o slug.
- Rejeita prefixos reservados (`api.*`) e entradas sem slug.
- Em builds de desenvolvimento, aceita `<org>.localhost`.

Deriva `{ slug: "cliente", host: "cliente.aikuaa.ai" }`.

**Tela 2 — Sonda de existência**

```http
GET {ADMIN_API}/auth/tenant-branding
X-Tenant-Host: cliente.aikuaa.ai
X-Tenant-Slug: cliente
```

- `200` **com `assistantName` preenchido** → tenant existe: mostra
  `{ assistantName, assistantLogoUrl }` como confirmação visual ("Você está
  entrando na **Acme**") e segue para o login.
- `200` **com todos os campos vazios** → **(2026-09-20)** o tenant **não
  resolveu**. Não é "organização sem logo": é o app nativo sem sinal de
  topologia (ver a escalada no fim desta seção). Tratar como falha de
  configuração do cliente, não como resposta do usuário.
- `404` → a organização resolveu mas está **inativa**. Só isso — ver a correção
  no §2.
- Erro de rede → permitir tentar novamente; nunca cachear resultado negativo por muito tempo.

> **Enquanto o §9.0 não for resolvido, esta sonda não distingue "organização
> inexistente" de "tenant não resolvido"** — os dois chegam como `200` vazio.
> A tela 2 não tem como ser construída de forma confiável hoje.

> **Nota de conferência (2026-09-15, Fase 8, PR-04) — divergência com o código, não resolvida aqui.**
> O texto acima diz que `X-Tenant-Host` + `X-Tenant-Slug` bastam. No código,
> `tenant-branding`, `login-config` e as rotas `/auth/signup/*` passam pelo
> mesmo resolvedor (`TenantResolverService.resolvePublicLoginFromRequest`,
> `admin-api/src/database/auth/services/tenant-resolver.service.ts`), e nele
> os dois cabeçalhos são só **declarativos**: valem apenas quando um sinal de
> topologia da mesma organização os confirma (`Host`, `X-Forwarded-Host`,
> `Origin` ou `Referer` com o host `<slug>.aikuaa.ai`). Uma chamada nativa a
> `https://api.aikuaa.ai` sem esse sinal resolve como contexto não
> identificado. O web não sente isso porque o navegador e o BFF mandam
> `Origin`/`X-Forwarded-Host`. **Antes de implementar o onboarding no app,
> confirmar com o time do `admin-api` qual sinal o app deve enviar** (por
> exemplo `Origin: https://<host>`); o mesmo vale para o §11.
>
> **Escalada (2026-09-20) — isto é um bloqueador, não uma ressalva.**
> Reconferido contra `tenant-resolver.service.ts`
> (`resolvePublicLoginFromRequest`, linhas 154 a 250): a nota acima
> subestimava o alcance. O mesmo resolvedor atende **`POST /auth/login`**
> (`auth.controller.ts:948`), e `enforceTenantLogin` (`:496`) converte o
> resultado `unresolved` em **`400 TENANT_NOT_FOUND`**. Ou seja: sem sinal de
> topologia o app nativo não passa de `tenant-branding` — **não faz login, não
> lê `login-config` e não cadastra** (`/auth/signup/*`, `bridge/exchange` e o
> TUS de upload usam o mesmo caminho).
>
> Como o resolvedor decide, em uma frase: ele coleta sinais **confiáveis** de
> `x-forwarded-host`, `host`, `origin` e `referer`; `X-Tenant-Host` e
> `X-Tenant-Slug` são **declarativos** e só valem quando um sinal confiável
> apontar para a **mesma** organização. Um app nativo batendo em
> `https://api.aikuaa.ai` manda `Host: api.aikuaa.ai` (neutro) e nenhum
> `Origin` — nada confirma a declaração, e ela vira `unresolved`.
>
> **Correção de enquadramento (2026-09-20, mesma revisão):** este bloqueador
> **já estava registrado e já tem solução desenhada** — o que falta é execução,
> não decisão. É o achado **P-03** de
> [`docs/TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md`](../TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md)
> (2026-08-21), com a mesma leitura do `tenant-resolver.service.ts` e a
> observação de que o BFF do `chat-web` só funciona porque injeta `Origin` e
> `X-Forwarded-Host` (`chat-web/src/lib/serverAuth.ts`).
>
> O SDD resolve a família inteira, sob uma flag e sem tocar o caminho web:
>
> | Decisão do SDD | O que entrega |
> |---|---|
> | **D-15** | `tenant-branding` com `X-Client-App: mobile` → `200`/`404` de verdade + limite `tenant-probe` 30/60 s por IP (§6.2) |
> | **D-16** | `login-config?client=mobile` responde como `chat` (§6.3) |
> | **D-06/D-08** | `POST /auth/login` com `responseMode: "native"` → `access_token` + `refresh_token` no corpo, **sem cookie** (§6.4) — aposenta o workaround de três passos do §4.1 |
> | **D-07/D-14** | `refresh` com refresh token **no corpo** + limite próprio (§6.5) — aposenta a captura de cookie do §4.3 |
> | **D-10/D-11/D-12** | OAuth móvel por universal link em host dedicado (`app.aikuaa.ai`) — fecha o §9.2 |
>
> **Estado: 5 PRs planejadas, nada implementado** (conferido em 2026-09-20:
> `login.dto.ts` ainda aceita só `'legacy' | 'bridge'`).
>
> **Então a pergunta para o time não é "qual sinal o app deve mandar?" — é
> "quando as PRs do SDD de login mobile entram?"**. Duas saídas:
>
> - **(a) Executar o SDD.** É o caminho limpo: o app nativo deixa de depender de
>   cookies, de `Origin` forjado e da sonda ambígua, tudo de uma vez.
> - **(b) Contornar por enquanto** mandando `Origin: https://<slug>.aikuaa.ai`
>   em toda chamada. **Verificado em 2026-09-20: o CORS aceita.** Em produção
>   `FRONTEND_URL_WILDCARD_SUFFIXES = .aikuaa.ai`, e `isAllowedBrowserOrigin`
>   (`common/security/browser-origin.ts`) aprova qualquer `https://*.aikuaa.ai`.
>   O contorno funciona de ponta a ponta — mas continua sem resolver a sonda de
>   existência (§2) nem o OAuth (§9.2), e deixa o app forjando um cabeçalho de
>   navegador que ele não é.
>
> Enquanto uma das duas não for escolhida, **nenhuma estimativa do app de
> autenticação é confiável**: §2, §3, §4 e §11 dependem todas dela.

**Tela 3 — Login dentro do contexto resolvido**

Com o slug confirmado:

1. `GET /auth/login-config?client=chat` (com headers de tenant) → monta métodos habilitados + dados da org.
2. `POST /auth/login` com `organizationSlug` + headers de tenant (ver seção 4).
3. Se o usuário pertencer a outra organização, o backend devolve `400 ACCOUNT_ORGANIZATION_CONFLICT` — exiba a mensagem sem revelar detalhes.

**Persistência e troca**

Guarde `{ slug, host, branding }` no storage seguro. Hoje cada usuário pertence a **uma** organização (`User.organizationId` único), portanto não há account switcher; a troca de organização acontece apenas no logout, retornando à Tela 1. Deixe o modelo de dados do app preparado para múltiplas contas no futuro.

### 3.2 Por que isso não expõe tenants

> **(2026-09-20 — ressalva que muda a leitura desta tabela.)** A tabela abaixo
> descreve o risco da **sonda do navegador**, que é onde ela sempre valeu: o
> `chat-web` chega em `<slug>.aikuaa.ai` e o `Host`/`Origin` confirmam o tenant,
> então a resposta de fato discrimina uma organização da outra. **Do cliente
> nativo a análise é diferente e mais estranha:** sem sinal de topologia (§2,
> §3.1) o `tenant-branding` responde `200` com campos vazios para **qualquer**
> slug, existente ou não. Isso reduz o vazamento a zero — e junto com ele a
> utilidade: é por isso que hoje não há sonda de existência para o app.
>
> Quando o §9.0 for resolvido e o app passar a mandar o sinal de topologia, as
> linhas abaixo **voltam a valer integralmente para ele também** — e aí o limite
> por IP mencionado na segunda linha deixa de ser recomendação e vira requisito.

| Risco | Mitigação |
|---|---|
| Enumeração de slugs | A sonda responde apenas sobre o slug perguntado; não há listagem. Descobrir um tenant exige adivinhar o slug exato |
| Scraping em massa | `/auth/tenant-branding` é público por design (o SSR do web depende dele), mas deve ficar atrás do mesmo rate limiter das rotas de auth — restrinja origens desconhecidas |
| Vazamento de dados sensíveis | A resposta só contém branding público (nome, logo, slogan) — a mesma informação que qualquer visitante do subdomínio veria no navegador |
| Confirmação de existência para atacante | Custo de sondar é alto comparado ao valor (só nomes/logos públicos); monitore volume por IP. **Hoje a rota não confirma existência nem para o atacante nem para o app legítimo** — ver a ressalva acima |

**Anti-padrões — não faça:**

- ❌ Endpoint `GET /tenants` (listagem) — vaza o diretório inteiro.
- ❌ Descoberta por domínio de email antes do login — confirma existência da org pelo domínio corporativo e exige mapeamento email→org que hoje não existe.
- ❌ Slug fixado no build do app — impede múltiplos clientes com o mesmo binário.

### 3.3 Refinamentos futuros (requerem backend)

> **(2026-09-20)** O §3.4 abaixo retoma estes três itens com o custo real de
> cada um, e responde a pergunta que o time levantou: *o QR entrega o caminho
> da organização — e quando não houver QR?*

1. **Link de convite com tenant embutido**: o email de convite já identifica a organização; se o `returnTo` passar a aceitar universal links (lacuna 9.2), o usuário clica e o app abre com o slug pré-preenchido — elimina a digitação.
2. **Código curto da organização**: a org define um código amigável (ex.: `ACME`) exibido no painel admin; mesma mecânica de sonda, melhor UX.
3. **QR code no painel**: super-admin exibe QR com o endereço da org; o app escaneia e pula a digitação.

### 3.4 QR code e as alternativas quando não há QR (escrito em 2026-09-20)

> Seção nova, escrita a partir de uma pergunta em aberto do próprio time: *"o
> QR dá o caminho da organização; e quando não houver QR, como o usuário informa
> qual é?"*. A resposta honesta tem duas partes — **o que existe hoje no
> código** e **o que precisa ser decidido**. Nada aqui é especulação sobre o
> backend: o que não existe está marcado como não existente.

#### O que o app precisa obter, no fim das contas

Uma coisa só: **o slug da organização**. Tudo o mais deriva dele — `X-Tenant-Slug`,
`X-Tenant-Host`, o `organizationSlug` do login e do `bridge/exchange`, e o sinal
de topologia do §3.1. Um slug é uma string curta como `expo` ou `cliente`.

Ou seja: QR, código curto, link de convite e digitação manual **não são
mecanismos diferentes** — são quatro formas de entregar a mesma string. A
validação depois é sempre a mesma sonda do §3.1 — com a ressalva de que
**essa sonda não funciona para cliente nativo hoje**: `GET /auth/tenant-branding`
responde `200` com campos vazios quando o tenant não resolve, e só devolve `404`
para organização **inativa** (correção no §2). Enquanto o §9.0 não for
resolvido, as quatro entradas entregam o slug corretamente e **nenhuma delas
consegue confirmar que ele existe** antes da tela de login.

#### QR code: não existe no backend, e não precisa existir

**Estado atual:** não há nada de QR no `admin-api` (busca por `qrcode`/`QRCode`
só encontra a integração de WhatsApp, que é outra coisa). O §3.3 lista QR como
refinamento futuro.

**A boa notícia:** para o caso do evento, **QR não precisa de backend nenhum**.
O QR carrega a URL da organização, o app lê o slug dela e cai na sonda de
sempre:

```
QR contém:  https://expo.aikuaa.ai
App extrai: slug = "expo", host = "expo.aikuaa.ai"
App sonda:  GET /auth/tenant-branding  (com os cabeçalhos de tenant)

  ── depois do §9.0 resolvido ──
  200 com assistantName → "Você está entrando na Expo Paraguay Brasil" → login
  404                   → organização inativa
  200 vazio             → não deveria acontecer; tratar como erro de cliente

  ── hoje, sem o §9.0 ──
  200 vazio para QUALQUER slug. A sonda não confirma nada.
```

A normalização é a mesma do §3.1 (aceita domínio completo ou só o slug, rejeita
`api.*`). **O único trabalho é de produto** — gerar o QR, imprimir, colocar na
entrada do evento —, e de front: câmera e parser. Zero rota nova.

**O que fazer enquanto o §9.0 não sai.** Duas opções, as duas honestas:

- **Pular a tela de confirmação** e ir direto ao login, mostrando o slug lido
  ("Entrando em **expo**") em vez do nome e do logo. Se o slug estiver errado, o
  erro aparece no login — mais tarde e mais feio, mas sem mentir para o usuário.
- **Construir a tela de confirmação desligada atrás de uma flag**, pronta para
  ligar no dia em que o sinal de topologia entrar. É o caminho que eu
  recomendaria: a tela é a mesma, muda só a fonte dos dados.

**Não faça** a terceira opção, que é a tentadora: tratar `200` como "existe" e
mostrar uma confirmação com nome vazio. Isso dá ao usuário a impressão de que o
app validou algo que ele não validou.

Uma recomendação de formato, para não travar o futuro: coloque no QR a **URL
completa** (`https://expo.aikuaa.ai`), não só o slug. Assim o mesmo QR funciona
escaneado pela câmera nativa do celular (abre o chat na web) e pelo app.

> **Ressalva que vale mais que o resto desta seção:** o QR entrega o slug, mas
> o slug sozinho **não resolve o tenant hoje** — é exatamente o bloqueador do
> §3.1/§9.0. Ler o QR não adianta nada enquanto o `admin-api` devolver
> `400 TENANT_NOT_FOUND` para o login do app. **Resolva o §9.0 antes de
> investir no QR.**

#### Quando não há QR: as opções, com o custo de cada uma

**Opção 1 — digitar o endereço (funciona hoje, zero backend).**
É o fluxo já documentado no §3.1: o usuário digita `cliente.aikuaa.ai` ou só
`cliente`. É o mesmo modelo do Slack ("qual o endereço do seu workspace?") e do
Zendesk.
*Serve bem para:* organização corporativa, onde o usuário já conhece o nome.
*Serve mal para:* visitante de feira, que não sabe nem que existe um slug.

**Opção 2 — código curto do evento (não existe; precisa de backend).**
> **Proposta técnica escrita em 2026-09-20:**
> [`docs/TODO/Codigo Curto da Organizacao/PROPOSTA_CODIGO_CURTO.md`](../TODO/Codigo%20Curto%20da%20Organizacao/PROPOSTA_CODIGO_CURTO.md)
> — contrato da rota, formato do código, coluna e migration (pelo `migrate diff`,
> nunca `migrate dev`), limite de tentativa, campo no `admin-web` e cinco
> decisões em aberto. O parágrafo abaixo é o resumo.

Um código amigável impresso no crachá e nos banners (`EXPO26`), que o app troca
pelo slug. É o §3.3 item 2. Precisa de uma rota pública nova, algo como
`GET /auth/tenant-by-code?code=EXPO26` → `{ slug, name, logoUrl }`, com limite
de tentativa por IP (senão vira enumeração barata — é por isso que o slug hoje
é a chave: adivinhar exige acertar exatamente).
*É a melhor rede de segurança para o QR*: mesmo material impresso, funciona
quando a câmera falha ou o QR está riscado.

**Opção 3 — link de convite com o tenant embutido (parcial; depende do §9.2).**
Já existe algo próximo, e é a única resolução token→organização do sistema:

```
GET {ADMIN_API}/auth/sso-invitations/resolve?token=<token opaco>
→ 200 { "provider": "google", "organization": { "slug": "cliente", "name": "…", "logoUrl": "…" } }
```

Rota **pública**, sem sessão (`sso-invitation.controller.ts`,
`PublicSsoInvitationController`). Mas leia os limites antes de se animar: o
token é de um **convite SSO nominal** criado por um administrador para um
usuário específico, vale para **um provedor** (Google/Microsoft — não para
senha), e **expira**. Não é um mecanismo de descoberta de organização; é a
resolução de um convite. Erro de token, convite não-`PENDING` ou vencido
respondem a mesma recusa genérica.
*Por que registrar isto aqui:* é o padrão que um "QR de convite" deveria imitar
— token opaco de uso restrito, resposta com o mínimo (`slug`, `name`, `logoUrl`),
recusa indistinguível. Se o time for construir a Opção 2, copie esta forma.
*O que falta para o app usar:* o universal link do §9.2, para o token chegar ao
app em vez do navegador.

**Opção 4 — descobrir pelo domínio do e-mail. Não faça.**
Está listado como anti-padrão no §3.2, por dois motivos: confirma a existência
de uma organização a partir do domínio corporativo de quem pergunta, e exige um
mapeamento e-mail→organização que **não existe** no modelo de dados.

**Opção 5 — slug fixo no build. Não faça.**
Anti-padrão do §3.2: impede um binário único de atender vários clientes. Se o
app for exclusivo de um evento e isso for uma decisão consciente de produto, aí
é outra conversa — mas registre como decisão, não como atalho.

**Opção 6 — listar as organizações. Nunca.**
Anti-padrão do §3.2. Vaza o diretório inteiro de clientes.

#### O desenho que eu recomendaria

Para o app que atende feiras **e** organizações corporativas, em camadas, da
mais fácil para a mais trabalhosa:

1. **QR** na entrada do evento → caminho de 2 segundos para o visitante. Sem
   backend.
2. **Código curto** impresso ao lado do QR → rede de segurança para câmera
   quebrada, QR danificado, celular sem permissão de câmera. Precisa da rota da
   Opção 2.
3. **Digitar o endereço** → caminho do usuário corporativo, e último recurso de
   todos. Já funciona.
4. **Persistir** `{ slug, host, branding }` em armazenamento seguro depois da
   primeira vez, para não repetir nada disso (§3.1).

As três primeiras convergem na mesma sonda e na mesma tela de confirmação
("Você está entrando na **Expo Paraguay Brasil**", com o logo) — construa **uma**
tela de confirmação e três entradas para ela, não três fluxos.

#### Decisões que o time precisa tomar (não são do app)

1. **O §9.0**, antes de tudo: qual sinal de topologia o app envia.
2. **A rota de código curto existe?** Se sim, quem define o código e onde ele
   aparece no `admin-web`. Se não, a Opção 1 é a única rede de segurança do QR —
   e ela é ruim para visitante de feira.
3. **Troca de organização.** Hoje um usuário pertence a **uma** organização
   (`User.organizationId` é único), então não há seletor de contas: trocar =
   deslogar e voltar à tela 1 (§3.1). Há uma iniciativa de multi-organização em
   aberto; até ela existir, o app deve **deixar o modelo de dados preparado**
   para várias contas, mas expor uma só.

---

## 4. Autenticação em mobile

> **Aviso de trabalho em paralelo (2026-09-20).** Este capítulo está sendo
> escrito por **duas frentes ao mesmo tempo**, e `docs/` **não está sob controle
> de versão em repositório nenhum** (nem a raiz do monorepo, nem os sub-repos) —
> não há merge, não há histórico, e o último a gravar o arquivo vence.
>
> | Seções | Frente | Estado |
> |---|---|---|
> | Bloco ao fim do §4.3, §4.5, §4.6 | Sessões com Estado (entrega 3 do Órbita), PR-01 | `admin-api` commit `80fd31a4`, **em review, sem merge** |
> | §4.1, §4.2, §4.3 (corpo), §4.7, §4.8 | Revisão do guia mobile de 2026-09-20 | Só documentação |
>
> **Se você vai editar este capítulo:** edite por âncora (substituição de trecho
> exato), nunca reescrevendo o arquivo inteiro, ou vai apagar o trabalho da
> outra frente sem perceber. A PR-03 de Sessões com Estado volta a tocar este
> documento — se ela precisar de um número de seção já ocupado, renumere as
> seções **desta revisão** (§4.7, §4.8), não as dela.

### 4.1 Login com email/senha (caminho principal — REESCRITO 2026-09-11, mudança de contrato)

**O `chat-web` não usa mais a resposta JSON legada** (`access_token` direto no
corpo de `POST /auth/login`). Ele migrou para o modo `responseMode: "bridge"`
(`src/lib/authContracts.ts`, `buildPasswordBridgeLoginBody`), que devolve só um
`bridge_code` e exige uma segunda chamada — `POST /auth/bridge/exchange` —
que seta **cookies HttpOnly** e **não devolve `access_token` no corpo**. O
caminho antigo (resposta direta com `access_token`) continua existindo no
código do `admin-api`, mas está **atrás de um kill-switch desligado por
padrão**: `POST /auth/login` sem `responseMode: "bridge"` chama
`assertLegacyBridgeEnabled()` e, se a env `AUTH_LEGACY_BRIDGE_ENABLED` não
estiver `"true"`, responde **`410 Gone { code: "AUTH_LEGACY_ROUTE_RETIRED" }`**
(`admin-api/src/database/auth/controllers/auth.controller.ts`,
`admin-api/src/database/auth/legacy-auth-flags.ts`). Não há como confirmar por
este documento se essa env está ligada em produção hoje — **confirme com o
time antes de desenhar o app em cima do caminho legado**; ele pode desaparecer
a qualquer momento (é um "cutover", não um recurso permanente).

> **✅ Respondido em 2026-09-20:** `AUTH_LEGACY_BRIDGE_ENABLED = false` no
> serviço `admin-api` em produção (Railway). O caminho legado **está desligado**
> e responde `410`. O fluxo `bridge` abaixo é o único que existe.

**Passo 1 — pedir o bridge code:**

```
POST {ADMIN_API}/auth/login
Content-Type: application/json
X-Tenant-Host / X-Tenant-Slug

{
  "email": "...",
  "password": "...",
  "remember": true,
  "responseMode": "bridge",
  "client": "chat",
  "organizationSlug": "<slug>"
}
```

Resposta 200: `{ "message": "Código de inicio de sesión creado.", "bridge_code": "<43 chars [A-Za-z0-9_-]>", "expires_in": <segundos> }`.

**Passo 2 — trocar o código por sessão:**

```
POST {ADMIN_API}/auth/bridge/exchange
Content-Type: application/json

{ "code": "<bridge_code>", "client": "chat", "organizationSlug": "<slug>" }
```

Resposta 200: `{ "message": "Sesión iniciada correctamente.", "returnTo": "..." }`
— **sem `access_token` no corpo**. A sessão inteira vem em `Set-Cookie`
(`chat_api_access_token` + `chat_api_refresh_token`, ambos HttpOnly). `400 {
code: "BRIDGE_CODE_INVALID" }` se o código já foi usado, expirou ou não bate
com o tenant/cliente da chamada.

**Passo 3 — obter um Bearer utilizável (recomendado para mobile):** como o
passo 2 só entrega cookies, capture-os com `@react-native-cookies/cookies`
(o HttpOnly bloqueia só o acesso via `document.cookie` do navegador — a
gerência de cookies nativa do RN ainda os lê) e, em seguida, chame
imediatamente `POST /auth/refresh` (§4.3) reenviando esses cookies: essa rota
**sempre** devolve `access_token` no corpo, legado ou não. É o caminho que
converte a sessão em cookie recém-criada num Bearer guardável no Keychain/
Keystore, sem depender do kill-switch do passo alternativo.

Conflito de contexto → `400 { code: "ACCOUNT_ORGANIZATION_CONFLICT" }` (pode
vir tanto no passo 1 quanto no passo 2).

#### Catálogo de recusas do `POST /auth/login` (escrito em 2026-09-20)

Conferido contra `admin-api/src/database/auth/controllers/auth.controller.ts`
(`login`, `enforceTenantLogin`), `services/auth.service.ts` (`validateUser`) e
`organization-auth-provider/auth-rate-limiter.service.ts`. Até aqui o §4.1
listava só o conflito de organização e o `410`; a lista real é esta:

| Status | `code` / mensagem | Quando | O que o app faz |
|---|---|---|---|
| `400` | `TENANT_NOT_FOUND` | A organização não foi identificada na requisição — **é isto que o app nativo recebe quando falta o sinal de topologia (§3.1, §9.1)** — ou está inativa | Não é erro de credencial: não marque os campos em vermelho. Voltar à tela de endereço da organização |
| `400` | `TENANT_CONTEXT_CONFLICT` | Os sinais de organização da requisição não coincidem entre si (ex.: `X-Tenant-Slug` de uma org e `Origin` de outra) | Defeito de montagem do cliente. Corrigir os cabeçalhos; não expor ao usuário |
| `400` | `ACCOUNT_ORGANIZATION_CONFLICT` | A conta pertence a outra organização | Mensagem genérica, sem revelar qual |
| `401` | `Invalid credentials` (texto, **sem `code`**) | E-mail inexistente **ou** senha errada — a resposta é idêntica de propósito | "Correo o contraseña incorrectos" |
| `401` | `User is disabled` (texto, **sem `code`**) | Conta inativa, banida ou excluída | Encaminhar à organização; não oferecer "esqueci a senha" como saída |
| `401` | `LOCAL_LOGIN_NOT_AVAILABLE` | A organização não tem provedor de e-mail/senha ativo | Esconder o formulário de senha e oferecer só os métodos de `/auth/login-config` |
| `403` | `GLOBAL_ADMIN_ROOT_REQUIRED` | Contexto administrativo global com usuário que não é `root` | Não acontece com `client: "chat"`; tratar como erro genérico |
| `410` | `AUTH_LEGACY_ROUTE_RETIRED` | `POST /auth/login` **sem** `responseMode: "bridge"` com o kill-switch desligado | Nunca deve acontecer: o app sempre manda `bridge` |
| `429` | `AUTH_RATE_LIMITED` + `retryAfter` no corpo e cabeçalho `Retry-After` | **10 tentativas por minuto** por IP + organização + e-mail | Travar o botão pela contagem regressiva; **não** é senha errada |

Duas observações que mudam código:

- Os dois `401` de credencial chegam como texto de mensagem, **sem campo
  `code`** — diferente de todo o resto do fluxo de auth. Um cliente que só
  lê `body.code` vai tratá-los como erro desconhecido.
- O `429` do login **degrada em vez de recusar** quando o contador do servidor
  está fora do ar (`assertPasswordFallbackAllowed`): não existe
  `503 AUTH_RATE_LIMIT_UNAVAILABLE` neste fluxo, ao contrário do cadastro
  (§11.2).

#### Vida dos tokens e o que `remember` realmente faz (escrito em 2026-09-20)

Conferido contra `auth.service.ts` (`getAccessTokenTtlSeconds`,
`getRefreshTokenTtlSeconds`). O exemplo do passo 1 manda `remember: true` sem
dizer o preço:

**Hoje, em `main` (o que roda em produção):**

| `remember` | Access token | Refresh token |
|---|---|---|
| `false` | `JWT_EXPIRES_IN`, **default 1 h** | `JWT_REFRESH_EXPIRES_IN`, default **7 dias** |
| `true` | **30 dias** (fixo no código, não é variável de ambiente) | `JWT_REFRESH_REMEMBER_EXPIRES_IN`, default **30 dias** |

> **⚠️ Esta tabela descreve `main`, e `main` está para mudar.** A entrega
> **Sessões com Estado** altera a regra: o token de acesso passa a durar **no
> máximo 1 h sempre** e `remember` vale **só para o token de renovação**, além
> de trazer rotação com derrubada de família, prazos de sessão e
> `POST /auth/sessions/revoke-others`. **O contrato novo está descrito no bloco
> ao fim do §4.3, no §4.5 e no §4.6** — escreva a camada de sessão do app para
> ele, não para a tabela acima.
>
> **O que aquele bloco não diz, e importa para planejar:** em 2026-09-20 isso
> ainda **não está em `main`**. Vive na branch `feat/sessoes-com-estado` do
> `admin-api` (commit `80fd31a4`), um commit à frente, **sem merge e sem
> deploy**. Ou seja: **hoje, em produção, a tabela acima é a verdade** — um
> `remember: true` ainda devolve Bearer de 30 dias. Durante a janela entre o
> merge e o deploy os dois comportamentos convivem, e o app precisa aguentar os
> dois: renove pelo `expires_in` que a resposta devolve (§4.3), nunca por um
> prazo fixo assumido.

- **Em `main`, `remember: true` entrega um Bearer de 30 dias** — e é o que
  obriga Keychain/Keystore: um token desses, copiado, vale um mês. Depois de
  Sessões com Estado isso acaba, mas o armazenamento seguro continua obrigatório
  pelo token de renovação.
- A frase do §5.5 "o access token vive ~1h" vale **só com `remember: false`** em
  `main` — e passa a valer sempre depois da entrega. Em nenhum dos dois casos
  escreva a renovação em cima de um prazo fixo: use o `expires_in` que o
  `/auth/refresh` devolve (§4.3).
- O `remember` do cadastro (§11.3, caixa "Mantener sesión iniciada") tem a
  mesma semântica e o mesmo efeito, nos dois mundos.

#### Atributos dos cookies de sessão (escrito em 2026-09-20)

`auth.service.ts`, `getCookieBaseOptions`. São o que a camada de cookies do RN
precisa saber para capturar e reenviar:

| Atributo | Valor |
|---|---|
| Nomes (cliente `chat`) | `chat_api_access_token`, `chat_api_refresh_token` |
| Nomes (cliente `admin`) | `admin_api_access_token`, `admin_api_refresh_token` |
| `HttpOnly` | sempre `true` |
| `Path` | `/` |
| `SameSite` | `COOKIE_SAMESITE`; sem override, `none` em produção e `lax` fora |
| `Secure` | `COOKIE_SECURE`; sem override, `true` em produção |
| `Domain` | `AUTH_COOKIE_DOMAIN` ou `COOKIE_DOMAIN`. **Sem nenhuma das duas, o cookie sai sem `Domain` e fica preso ao host que respondeu** (`api.aikuaa.ai`) |
| `Max-Age` | o TTL do token correspondente, da tabela acima |

O `Domain` é o detalhe que decide se o cookie capturado volta nas chamadas
seguintes.

> **✅ Confirmado em produção (Railway, 2026-09-20).** Lido do serviço
> `admin-api`, ambiente `production`, projeto `aiKuaa`:
>
> | Variável | Valor em produção |
> |---|---|
> | `AUTH_COOKIE_DOMAIN` | **`.aikuaa.ai`** |
> | `COOKIE_SAMESITE` | `none` |
> | `COOKIE_SECURE` | `true` |
> | `NODE_ENV` | `production` |
> | `FRONTEND_URL_WILDCARD_SUFFIXES` | `.aikuaa.ai` |
> | `TENANT_HOST_SUFFIXES` | `aikuaa.ai` |
> | `AUTH_LEGACY_BRIDGE_ENABLED` | **`false`** |
>
> `COOKIE_DOMAIN` não está definida — quem vale é `AUTH_COOKIE_DOMAIN`, que tem
> precedência no código.

> **O que isso significa para o app:**
>
> - O cookie de sessão vale para **todo** `*.aikuaa.ai` — inclusive
>   `api.aikuaa.ai`, onde vivem o `admin-api` e o `ai-api` (§0.1). Um cookie
>   obtido em qualquer superfície serve para as duas APIs; é o que torna o
>   **caminho A do §1.1** viável sem backend novo.
> - `SameSite=none` + `Secure` significa que a gerência de cookies do RN precisa
>   tratá-los como cookies de terceiros sobre HTTPS — não há caminho `http` em
>   produção.
> - **`AUTH_LEGACY_BRIDGE_ENABLED = false`** responde em definitivo a pergunta
>   aberta no início do §4.1: o login legado (`access_token` direto no corpo de
>   `POST /auth/login`) **está desligado em produção** e responde `410`. Não
>   desenhe nada em cima dele — o fluxo `bridge` dos passos 1 a 3 é o único que
>   existe hoje.

Este mesmo fluxo está registrado como **caminho interino** no SDD do login
mobile (`docs/TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md` §6.12):
quando a PR-03 daquele SDD sair, o passo 1 vira `responseMode: "native"` e os
passos 2 e 3 deixam de existir para senha. Isole o login atrás de uma
interface no app para que a troca seja local.

### 4.2 Chamadas autenticadas: Bearer funciona (conferido, sem mudança)

A estratégia JWT do admin-api extrai token de **cookie OU header Bearer**:

```
Authorization: Bearer <access_token>
```

Use Bearer em todas as chamadas autenticadas ao admin-api (`/auth/me`, `/db/user/me`, `/workspace/*`, `/file-upload/*` — atenção ao `DELETE /file-upload/:id`, que desde 2026-09-19 recusa a foto de perfil, ver §7.4 —, `/db/llm-organization/*`, `/db/llm-organization-config/*` — corrigido 2026-09-11, não existe rota `/api/models/*`). Para o ai-api, mantenha `credentials` via cookie quando possível (ver 3.4) — o runtime de chat valida sessão pelo mesmo JWT.

`GET /auth/me` é a fonte de verdade da sessão e das features visíveis no app.

**(2026-09-20 — correção)** A redação anterior dizia que este payload traz
"capacidades de reasoning". **Não traz.** Conferido em `auth.service.ts`
(`buildUserPayload`, `buildIdentity`, `buildTenantContext`,
`buildCapabilities`): não existe nenhum campo de reasoning em `/auth/me`. As
capacidades de reasoning são **por modelo** e vêm do catálogo de LLMs —
`GET {ADMIN_API}/db/llm-organization/organization/:organizationId`, campos
`llm.supportsReasoning`, `llm.supportsReasoningEffort` e
`llm.reasoningMaxTokens` (é de lá que o `chat-web` os lê, em
`src/context/AuthContext.tsx`). Um app que esperar reasoning no `/auth/me` vai
achar que nenhum modelo pensa.

**Corpo completo** (`auth.controller.ts:getMe` = `buildUserPayload()` +
`eventTerms`). Atenção: as chaves de `identity` e `tenant` estão **em
espanhol** — `nombre`, `correo`, `rol`, `idioma`, `departamento`, `dominios`,
`subdominios`:

```jsonc
{
  "identity": {
    "id": "018f5c7d9e4a123456789abcdef0",
    "nombre": "Ana Benítez",
    "correo": "ana@example.com",
    "rol": "user",                       // nome do papel: root | owner | admin | user
    "idioma": "auto",                    // auto | es | pt | en
    "avatar": "",                        // URL, ou string vazia
    "bio": "",
    "customChatInstructions": null,      // vai como user_custom_instructions na metadata do run
    "whatsapp": "",
    "provider": "local",
    "credentialAuthority": "email",      // email | google | microsoft (minúsculas)
    "avatarSource": "local",
    "linkedProviders": ["email"]
  },
  "tenant": {                            // null quando o usuário não tem organização
    "id": "org_123456",
    "publicId": "0f4221bc-20af-4f10-9a9f-409c128ee880",
    "nombre": "Mi Empresa",
    "slug": "cliente",
    "isEventOrganization": false,        // === true habilita §10, §11 e §12
    "modelSelectionEnabled": true,       // ler com !== false (default LIGADO)
    "defaultInferenceLlmId": null,
    "logoUrl": "",
    "assistantName": "",
    "assistantLogoUrl": "",
    "assistantSlogan": "",
    "logoScale": 1,
    "assistantLogoScale": 1,
    "departamento": { "id": "dept_001", "nombre": "Visitante", "slug": "visitante" },
    "dominios": [
      { "id": "domain_1", "nombre": "Soporte",
        "subdominios": [{ "id": "sub_1", "nombre": "Hardware" }] }
    ]
  },
  "capabilities": {
    "canChangePassword": true,           // ver §4.7: esconde a tela de troca de senha quando false
    "canUploadAvatar": true,             // false quando a credencial é gerida pelo Google
    "canMigrateToGoogle": false,
    "microsoft365Available": false,
    "workspacesEnabled": false,          // ler com === true (default DESLIGADO)
    "allowedDomains": [
      {
        "id": "domain_1",
        "code": "SUPPORT",
        "name": "Soporte",
        "description": null,             // texto do seletor @ quando presente
        "graphNode": "support_node",
        "agentCode": "support_agent",
        "agentId": "agent_123",
        "isEnabled": true
      }
    ]
  },
  "eventTerms": { }                      // só em organização de evento — shape no §10.3
}
```

Notas de contrato que o app precisa respeitar:

- `tenant` é **`null`** quando o usuário não pertence a organização (ex.: `root`).
  Nesse caso `capabilities.allowedDomains` cai no item único `GENERIC` (sem
  `id` e sem `agentId`) e `workspacesEnabled` vem `false`. Um token sem
  organização também **não consegue inferir**: o `ai-api` responde `403` no
  `run` (§5.5).
- `allowedDomains` nunca vem vazio: sem domínio habilitado na organização, o
  servidor injeta o `GENERIC`. É este array que alimenta o seletor `@` **e** o
  campo `allowed_domains` da `metadata` do run — sem ele o turno não alcança o
  acervo (§5.1).
- `canChangePassword` é `false` para conta cuja credencial é do Google ou do
  Microsoft: a tela de troca de senha do app não deve existir nesse caso (§4.7).
- Os quatro campos `canChangePassword`, `canUploadAvatar`, `canMigrateToGoogle`
  e `microsoft365Available` **sempre** vêm, com e sem organização.

**(2026-09-20, Proyectos por Organización — contrato de capability)** `capabilities.workspacesEnabled: boolean` é a **fonte única** da superfície de Proyectos e vale por organização (coluna `organization.workspaces_enabled`, default `false`, alternada por `root`/`owner` na tela de organização do `admin-web`). O `admin-api` emite o campo **sempre**, nos dois caminhos de `buildCapabilities` (com e sem organização) — usuário sem organização recebe `false`. O app deve ler `capabilities?.workspacesEnabled === true`, e **não** `!== false`: aqui o default é o inverso do de `tenant.modelSelectionEnabled`, então ausência do campo (backend anterior à migration) significa **desligado**. Com a flag desligada, não chame nenhuma rota `/workspace/*` nem `/py/api/workspace-notes`: o `admin-api` responde `403` inclusive para listar e abrir projeto existente, e a `metadata` do run não deve levar `workspace_id`. Alternar o toggle no `admin-web` passa a valer no próximo `/auth/me` — não há cache de tenant nem de capabilities, e não é preciso relogar. O `chat-web` não tem mais nenhum interruptor por deployment: a variável de build `NEXT_PUBLIC_WORKSPACES_ENABLED` foi removida (D-04); se o app copiou esse padrão, remova também.

**(2026-09-20, Proyectos por Organización — lista de conversas)** Fora de projeto, a lista global **nunca** pode exibir thread com `workspace_id` preenchido, com a flag ligada ou desligada (D-05). O `GET /py/api/threads/` sem `workspace_id` devolve tudo; o filtro é do cliente. Sem ele, desligar uma organização que já tinha projetos faz as threads de dentro dos projetos reaparecerem soltas na lista.

**(2026-09-20, identidade verificada — mudança de contrato)** O `ai-api` identifica quem pede **pelo token**: cookie `chat_api_access_token` **ou** `Authorization: Bearer <access_token>` (os dois valem). Os campos `user_id` e `organization_id` que o app declara — na `metadata` do `run`, no corpo de `POST /py/api/workspace-notes` e no formulário de `POST /py/api/chat/audio/transcribe` — **continuam aceitos no contrato** (não remova: alimentam a fase `shadow` e a métrica de divergência), mas **não autorizam nada**: o servidor sobrescreve os dois pelos valores do token. Declarar o `user_id` de outra pessoa não dá acesso a nada dela. Regra completa, com o tratamento de `401` e a posse da conversa: **§5.5**.

**(2026-09-12, política de seleção de modelo)** O payload também traz `tenant.modelSelectionEnabled: boolean` e `tenant.defaultInferenceLlmId: string | null`. Quando `modelSelectionEnabled === false` (organização travada em um único modelo), o app deve: mostrar apenas o modelo padrão (sem seletor visível), esconder qualquer UI de troca de modelo, e enviar sempre `llm_id` igual ao padrão nas chamadas de inferência — nunca deixar o usuário escolher outro (D-07/D-08, invariante I-02).

### 4.3 Renovação de sessão (atenção! — **mudança de contrato 2026-09-20**, sessões com estado; também é o caminho para obter o primeiro Bearer, ver §4.1 passo 3)

```
POST {ADMIN_API}/auth/refresh
X-Client-App: chat
Cookie: chat_api_refresh_token=<token>
```

- O refresh token **só é lido do cookie** `chat_api_refresh_token` — não há campo no body.
- O header `X-Client-App` **só aceita `chat` ou `admin`** (qualquer outro valor cai no default `admin` e procura o cookie errado).
- A rota é `@Public()`: **não** precisa de Bearer válido. É por isso que ela
  funciona como conversor de cookie em Bearer no §4.1 passo 3.

**Corpo da resposta `200` (escrito em 2026-09-20, `auth.controller.ts:refresh`).**
A redação anterior dizia apenas "devolve novo `access_token`". São cinco campos:

```json
{
  "message": "Session refreshed",
  "access_token": "<JWT>",
  "expires_in": 3600,
  "refresh_expires_in": 604800,
  "remember": false
}
```

- `expires_in` é o TTL do access token em segundos — **use este número** para
  agendar a renovação silenciosa, nunca uma hora fixa (§4.1, tabela de TTL).
- `remember` ecoa a escolha feita no login e explica os dois números.

**A renovação ROTACIONA os cookies.** Cada `200` traz `Set-Cookie` novo para
`chat_api_access_token` **e** `chat_api_refresh_token`, com o `Max-Age`
recalculado. O app precisa recapturar e regravar os dois **a cada refresh**, não
só no login: guardar os cookies da sessão inicial e reusá-los indefinidamente
funciona até o primeiro refresh e depois falha em silêncio.

**Falha responde `400`, não `401`, e limpa a sessão.** Três casos, todos
`BadRequestException` com mensagem de texto (sem `code`):

| Corpo da mensagem | Quando | Efeito colateral |
|---|---|---|
| `Unable to resolve client app for refresh` | Sem `X-Client-App` reconhecível **e** sem cookie de refresh de `admin` nem de `chat` | Limpa os cookies dos **dois** clientes |
| `Refresh token missing` | Cliente resolvido, mas o cookie de refresh dele não veio | Limpa os cookies desse cliente |
| `Invalid refresh token` | Cookie presente, mas vencido/adulterado/de outra chave | Limpa os cookies desse cliente |

Consequência para o app: **`400` nesta rota é fim de sessão**, e o servidor já
apagou os cookies — repetir a chamada só repete o `400`. Leve ao login e limpe
o Keychain/Keystore. O tratamento de `401` descrito no §5.5 ("renovar e repetir
uma vez") se refere ao `401` das rotas do `ai-api`, **não** a esta; aqui um
`400` encerra a tentativa.

**Recomendação prática para RN:** use `@react-native-cookies/cookies` para persistir os cookies `Set-Cookie` da resposta do login e reenviá-los no `/auth/refresh`. Alternativa mais limpa exige mudança de backend (ver §9.1).

> **(2026-09-20, sessões com estado — mudança de contrato, leia antes de tocar no app)**
>
> 1. **O token de acesso dura no máximo 1 hora, sempre.** `remember: true` não
>    estica mais o token de acesso; ele estica só o de renovação (7 dias sem
>    "lembrar", 30 dias com). Um app que guardava o Bearer por 30 dias e só
>    renovava quando tomava `401` passa a renovar de hora em hora. O fluxo é o
>    mesmo — interceptar a recusa, chamar `/auth/refresh`, repetir uma vez.
> 2. **O token de renovação ROTACIONA: guarde sempre o novo.** Cada
>    `/auth/refresh` bem-sucedido invalida o token apresentado e devolve outro
>    (`Set-Cookie: chat_api_refresh_token=...`). Reapresentar um token já
>    rotacionado é tratado como vazamento e **encerra a sessão inteira** — o
>    usuário cai no login. Há uma janela de tolerância de ~30 segundos para a
>    corrida real (retentativa de rede, duas telas renovando juntas), e ela não
>    cobre um app que persiste o token antigo.
> 3. **Serialize a renovação.** Uma única chamada de `/auth/refresh` por vez,
>    com as demais aguardando o resultado. Duas renovações em paralelo separadas
>    por mais que a janela de tolerância derrubam a sessão.
> 4. **A sessão tem prazos próprios**, além do token: 30 dias de prazo absoluto
>    e 7 dias de inatividade (padrões configuráveis no servidor). Voltar ao app
>    depois de mais de uma semana parado pede login de novo, mesmo com
>    "lembrar".
> 5. **O token de acesso passa a levar `sid`** (identificador da sessão) e
>    `ver` (versão). O app não precisa ler nem enviar nada disso; é o servidor
>    que usa. O token de renovação leva `sid` e `jti`, e **nunca** leva `ver`.
>    Token emitido antes desta entrega não tem `sid` e continua valendo por uma
>    janela de transição — detalhada no item 6.
> 6. **Janela legada: 7 dias, e ela nasce ABERTA.** Token sem `sid` (emitido
>    antes desta entrega) continua sendo aceito pelo `ai-api` durante a janela.
>    A contagem **não** começa sozinha: ela só existe depois que o operador
>    escreve a data de ativação na configuração do servidor; enquanto essa data
>    estiver vazia, nenhum token legado é recusado. Passada a janela, token sem
>    `sid` recebe `401` (§5.5). **Nada disso exige ação do app:** a primeira
>    renovação bem-sucedida (§4.3) converte o token antigo em sessão registrada,
>    e a partir daí ele tem `sid` como qualquer outro. Um app que renova
>    normalmente atravessa a transição sem perceber.

**Árvore de decisão do app ao tomar uma recusa (escrita em 2026-09-20).** As
três recusas abaixo se parecem no código e exigem reações diferentes. Errar a
distinção é o que transforma um token vencido em laço de renovação:

| O que você recebeu | O que significa | O que fazer |
|---|---|---|
| `401` do `ai-api` em rota de chat, **primeira** vez naquela chamada | Provavelmente token de acesso vencido (vale ~1 h) | Renovar pelo §4.3 e repetir a chamada **uma única vez** |
| `401` do `ai-api` com `detail` `"Tu sesión ya no es válida. Iniciá sesión de nuevo."` **e** `/auth/refresh` respondendo `400` | Sessão encerrada de verdade (logout, "cerrar las demás", reuso do token de renovação detectado) | **Entrar de novo.** Não renove de novo: o token de renovação daquela sessão também morreu, e insistir só repete o `400` |
| `503` do `ai-api` com `detail` `"No pudimos verificar tu sesión..."` | O servidor não conseguiu verificar o estado da sessão | **Nem deslogar, nem renovar.** Esperar e repetir mais tarde |

Regra que fecha o laço, e vale para qualquer uma das três: **no máximo uma
renovação por recusa, e uma só renovação em voo no app inteiro.** Quando
`/auth/refresh` responde `400`, marque a sessão como encerrada e faça as
chamadas seguintes falharem **sem tocar a rede** até o próximo login — é
exatamente o que o `chat-web` e o `admin-web` passaram a fazer (guard único de
renovação em cada um). Insistir não recupera nada e ainda gasta a janela de
tolerância do servidor, que é o último anteparo contra a detecção de reuso.

**O que o servidor NÃO faz (para você não construir em cima disso):** não
existe rota para listar as sessões do usuário, nem tela de sessões — só o botão
do §4.6. E a revogação não é instantânea em toda parte: o `ai-api` recusa em
segundos, mas o `admin-api` autoriza pela assinatura do token, então depois do
logout o token de acesso ainda abre o `admin-api` até vencer (no máximo 1 h).


### 4.4 OAuth Google/Microsoft (conferido 2026-09-11, sem mudança — rotas `tenant-aware-auth.controller.ts` não passam pelo kill-switch legado)

Fluxo server-side (o app abre um browser in-app):

1. `GET {ADMIN_API}/auth/oauth/{provider}/start?client=chat&organizationSlug=<slug>&returnTo=<path>`
   - `provider`: `microsoft` | `google`
   - O backend redireciona (302) para o provedor.
2. Callback do provedor volta ao admin-api, que emite sessão e redireciona ao `returnTo`.

**Limitação atual (registrada):** o `returnTo` é sanitizado para aceitar **apenas caminhos relativos** (allowlist `AUTH_RETURN_TO_PREFIXES`, default `/,/admin,/chat,/model-check,/aikuaaGPT`). Um deep link `myapp://auth/callback` **não passa** no sanitizador — a origem é descartada. Enquanto isso não mudar (ver §9.2), o padrão viável é:

- Abrir o OAuth num browser/as-webview apontando para um **domínio web seu** de retorno (ex.: `https://app.seudominio.com/mobile-bridge`), que troca o código via `POST /auth/bridge/exchange` ou captura os cookies e repassa ao app via universal link/redirect intermediário; **ou**
- Oferecer no app somente login email/senha na primeira versão.

3. Bridge (login iniciado em outra superfície): `POST {ADMIN_API}/auth/bridge/exchange` com o código de 43 chars `[A-Za-z0-9_-]{43}`.

> **Autoinscrição (Fase 8, conferido 2026-09-15).** No Google da plataforma,
> a volta do Google para uma **identidade nova** numa organização com cadastro
> ligado (`signup.methods.google === true`, §11.1) não cria mais pedido
> pendente: redireciona para a tela web do termo,
> `<origem>/signup/terms?ticket=<signupTicket>` (§11.4). Identidade conhecida
> continua logando como descrito acima. O app não usa esse caminho (§9.2 e
> §11.4): lá o cadastro é só por e-mail.

### 4.5 Logout (**mudança de contrato 2026-09-20**: agora revoga de verdade)

```
POST {ADMIN_API}/auth/logout    (com Bearer + cookies)
```

Limpe tokens locais + cookies + caches (`aikuaa_models_cache_v5` equivalente — chave atualizada em 2026-09-12, política de seleção de modelo).

**(2026-09-20, sessões com estado)** O logout deixou de ser só limpeza de
cookie: ele **encerra a sessão no servidor**. Mande a chamada com o que você
tiver — `Authorization: Bearer <access_token>` basta, e é o caso do app, que
não usa cookie. Sem nenhum token identificável, o servidor não tem como saber
qual sessão encerrar e a chamada vira só limpeza de cookie, como antes.

O logout **nunca falha** por causa da revogação: a resposta continua sendo
`200 { "message": "Logged out" }`. Sessões irmãs do mesmo usuário (outro
aparelho, o navegador) **não** são afetadas — só a que saiu.

### 4.6 Cerrar las demás sesiones (novo em 2026-09-20)

```
POST {ADMIN_API}/auth/sessions/revoke-others
Authorization: Bearer <access_token>
```

Encerra todas as sessões ativas do usuário **menos a atual**, identificada pelo
`sid` do token apresentado. Resposta `200`:

```json
{ "message": "Se cerraron las demás sesiones.", "closedSessions": 2 }
```

Não há tela de lista de sessões nesta entrega. Token anterior a 2026-09-20 não
tem `sid`: nesse caso não há sessão atual a preservar e a chamada encerra todas
as sessões registradas do usuário.

**Como os clientes web expõem isso (2026-09-20), para o app copiar a forma.**
É um botão só, com confirmação, dentro do perfil (`chat-web`) e do menu do
usuário (`admin-web`); não existe listagem porque o servidor não sabe listar.
Depois do `200`, **a sessão atual continua** — não limpe tokens nem navegue
para o login. O retorno `closedSessions` é o que vira a mensagem de sucesso
(`No había otras sesiones abiertas.` quando vem `0`).

Um `401` NESTA rota é a própria sessão de quem pediu que acabou: trate como o
segundo caso da árvore de decisão do §4.3 (entrar de novo), **não** como erro
da operação — e não insista renovando.

### 4.7 Senha e convite: recuperar, trocar, ativar (escrito em 2026-09-20)

> Seção nova. Estas quatro rotas existem no `admin-api` desde antes deste guia
> e **nunca tinham sido documentadas aqui** — `forgot-password`,
> `reset-password`, `change-password` e `activate` não apareciam uma vez no
> texto. Um app que autentica por senha precisa das quatro. Conferido contra
> `admin-api/src/database/auth/controllers/auth.controller.ts` (linhas 1267 a
> 1392), `services/auth.service.ts` (`forgotPassword`, `resetPassword`,
> `changePassword`, `activateAccount`), `mail/mail.service.ts`
> (`sendPasswordResetEmail`) e `common/security/browser-origin.ts`.

#### Visão geral: os três caminhos que criam ou recuperam acesso

| Caminho | Rota de entrada | Quem inicia | Disponível no app? |
|---|---|---|---|
| Autoinscrição do visitante | `POST /auth/signup/email/start` (§11) | O próprio usuário | **Só em organização de evento** — ver o aviso de abertura do §11 |
| Convite do administrador | e-mail com link → `POST /auth/activate` | Um `admin`/`owner` pelo `admin-web` | Sim, se o app tratar o link (hoje ele abre a web — §9.2) |
| Recuperação de senha | `POST /auth/forgot-password` → link → `POST /auth/reset-password` | O próprio usuário | Parcial: o link do e-mail vai para a **web** |

`POST /auth/register` está aposentado (`410 AUTH_LEGACY_ROUTE_RETIRED`, §11.1) —
não existe terceiro caminho de auto-cadastro.

#### `POST /auth/forgot-password` — pedir o link de redefinição

```
POST {ADMIN_API}/auth/forgot-password
Content-Type: application/json
Headers: X-Tenant-Host, X-Tenant-Slug (ver a ressalva de topologia abaixo)

{ "email": "ana@example.com", "origin": "https://cliente.aikuaa.ai" }
```

- **Pública**, sem `Authorization`.
- Responde **sempre** `200` com o mesmo corpo, exista ou não a conta:
  `{ "message": "Si la cuenta existe, se ha enviado un enlace para restablecer la contraseña." }`.
  O app **não pode** inferir existência de conta daqui — é enumeração.
- Silenciosamente não envia nada quando: a conta não é local (sem senha, ou
  `credentialAuthority` diferente de `EMAIL`), a organização não tem o provedor
  de e-mail ativo, ou o usuário está excluído/banido. Em todos, a resposta é
  aquele mesmo `200`.
- Qualquer token de redefinição anterior ainda válido é invalidado; o novo vale
  **15 minutos**.
- **A falha de envio não aparece na resposta** (fica só no log do servidor, pelo
  mesmo motivo de não vazar existência). Não existe confirmação de entrega: a
  tela do app deve dizer "se existir uma conta, o e-mail foi enviado" e parar
  por aí.

**O campo `origin` e a lacuna do deep link.** `origin` decide o prefixo do link
do e-mail — o e-mail monta `<origin>/reset-password?token=<token>`. O valor passa
por `isAllowedBrowserOrigin`: precisa ser `http:`/`https:` e estar em
`FRONTEND_URL`, ou casar com `FRONTEND_URL_WILDCARD_SUFFIXES` (só em `https:`).
Fora disso o campo é **descartado em silêncio** e o link cai no padrão do
servidor (`FRONTEND_ADMIN_URL` em produção). Ou seja: **`origin` não aceita
custom scheme nem universal link** — é exatamente a lacuna §9.2, na outra rota.

O que o app pode fazer hoje:

1. Mandar `origin` com a **origem web do chat da organização**
   (`https://<slug>.aikuaa.ai`). **Confirmado em 2026-09-20** que esse valor
   passa no `isAllowedBrowserOrigin`: em produção
   `FRONTEND_URL_WILDCARD_SUFFIXES = .aikuaa.ai`, então qualquer
   `https://<slug>.aikuaa.ai` é aceito e o link do e-mail cai na página certa;
2. Abrir o navegador do sistema quando o usuário voltar ao app, ou simplesmente
   instruir "abra o link que enviamos no seu e-mail";
3. Ao terminar, voltar ao login normal do app. **Não existe hoje caminho que
   entregue a sessão de volta ao app depois do reset** — o usuário faz login
   com a senha nova.

**Ressalva de topologia.** Esta rota **não** passa pelo `TenantResolverService`
(é a única do bloco de senha que não passa): a conta é achada pelo e-mail
global. Na prática ela funciona sem o sinal do §3.1 — mas o e-mail sai com o
link do `origin` que você mandou, e é aí que o tenant importa.

#### `POST /auth/reset-password` — aplicar a senha nova

```
POST {ADMIN_API}/auth/reset-password
Content-Type: application/json

{ "token": "<token cru do link do e-mail>", "newPassword": "********" }
```

- **Pública**. O token é o valor cru de `?token=` do link; o servidor guarda só
  o SHA-256 dele.
- `200 { "message": "Password reset successfully" }`.
- `400 "Invalid or expired token"`: inexistente, já usado ou vencido (15 min).
- `400 "Invalid account type"`: o token aponta para conta que não é local.
- **Não abre sessão.** Depois do `200` o app volta ao login.
- O app **poderia** consumir esta rota direto se tivesse o token — mas hoje o
  token só chega pelo navegador (ver acima). Deixe a chamada isolada atrás da
  mesma interface do login, para ligar quando o universal link existir.

#### `PATCH /auth/change-password` — trocar a senha estando logado

```
PATCH {ADMIN_API}/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{ "currentPassword": "********", "newPassword": "********" }
```

- Autenticada (`JwtAuthGuard`); a identidade é a do token, não do corpo.
- `200 { "message": "Password changed successfully" }`.
- `401` quando a senha atual está errada.
- **Só ofereça esta tela com `capabilities.canChangePassword === true`** no
  `/auth/me` (§4.2): conta cuja credencial é do Google ou do Microsoft não tem
  senha local para trocar.
- A troca **não invalida** a sessão corrente nem os tokens já emitidos — o app
  não precisa relogar depois dela.

#### `POST /auth/activate` — aceitar convite do administrador

```
POST {ADMIN_API}/auth/activate
Content-Type: application/json

{ "token": "<token do link do convite>", "password": "********" }
```

- É o caminho pelo qual um usuário **convidado** (criado pelo `admin-web`, ainda
  sem senha) ganha acesso. `password`: mínimo 8 caracteres.
- Em uma transação: cria a conta local (`providerId: "email"`), marca o usuário
  como `isActive` e `isVerified`, e consome o convite.
- `200 { "message": "Cuenta activada exitosamente" }`. **Não abre sessão** — o
  app segue para o login.
- Erros, todos com mensagem de texto (sem `code`):
  `400 "Token invalido"`, `400 "Token ya fue usado"`, `400 "Token expirado"`,
  `403 "User disabled"`, `409 "La cuenta local ya existe"`. Há ainda a recusa de
  reativação quando existe exclusão definitiva em andamento para aquele usuário.
- Mesma lacuna do reset: o link do convite chega por e-mail e aponta para a
  **web**. Enquanto o universal link do §9.2 não existir, o app não intercepta.

#### `POST /auth/invite/:userId` — fora do escopo do app

Rota administrativa (dispara/reenvia o convite). Vive no `admin-web`, não no app
do usuário final. Registrada aqui só para fechar o mapa das rotas de conta.

### 4.8 Catálogo de modelos: o que o app precisa antes de inferir (escrito em 2026-09-20)

> Seção nova. O §4.2 e o §8 citavam as duas rotas pelo nome, sem o shape da
> resposta — e sem o shape não dá para montar o corpo do `run` (§5.1).
> Conferido contra `chat-web/src/context/AuthContext.tsx` (`eligibleModels`) e
> `admin-api/src/database/llm-organization/`.

Duas chamadas, as duas com Bearer. O `:organizationId` da URL é **`tenant.id`**
do `/auth/me` — o id interno, o mesmo valor que vai em `metadata.org` e
`metadata.organization_id` do `run`. **Não** é o `tenant.publicId`
(`AuthContext.tsx:464`).

```
GET {ADMIN_API}/db/llm-organization/organization/:organizationId
GET {ADMIN_API}/db/llm-organization-config/organization/:organizationId
```

A primeira devolve a lista de vínculos `{ llm: {...} }`. Os campos do `llm` que
o app usa:

| Campo | Vira, no corpo do `run` | Observação |
|---|---|---|
| `id` | `metadata.llm_id` | UUID do modelo no admin |
| `name` | `model_name` | — |
| `apiVersion` | `model_version` | ausente → mandar `"1.0"` |
| `apiUrl` | `model_url` | — |
| `apiId` | `model_id` | ausente → omitir |
| `provider` | `model_provider` | `openai`, `anthropic`, `google`, … |
| `toolCallingStrategy` | `tool_calling_strategy` | ausente → `"auto"` |
| `supportsNativeTools` | `supports_native_tools` | ausente → `null` |
| `harmonyFormat` | `harmony_format` | ausente → `false` |
| `supportsReasoning` | *(não vai no corpo)* | `false` → **esconder o toggle "Thinking"** |
| `supportsReasoningEffort` | *(não vai no corpo)* | `false` → toggle sim, seletor Bajo/Medio/Alto não |
| `reasoningMaxTokens` | teto de `reasoning_max_tokens` | `null` = sem teto declarado |
| `isActive`, `inferenceModel`, `mainLLM` | *(filtros)* | ver abaixo |

**Elegibilidade — a mesma regra do `chat-web`, nesta ordem:**

1. manter só `llm.isActive === true` **e** `llm.inferenceModel === true`;
2. descartar os que a segunda rota marcar como desabilitados (o mapa por
   `llmId` da resposta de `llm-organization-config`; valor `false` = fora);
3. aplicar a política de seleção do §4.2: com
   `tenant.modelSelectionEnabled === false`, sobra **só**
   `tenant.defaultInferenceLlmId` (e nada, se ele não for elegível);
4. modelo inicial = o primeiro com `mainLLM === true`, senão o primeiro da lista.

**`model_api_key` — não mande.** O campo existe em `RunAgentRequest` (§5.1) e o
`chat-web` **não** o envia: a chave da organização é resolvida no servidor. Um
cliente que passar chave no corpo está expondo credencial de organização sem
necessidade.

**Cache.** Guarde a lista por usuário/organização (equivalente do
`aikuaa_models_cache_v5`), e **não** leia nem grave esse cache quando
`modelSelectionEnabled === false` — limpe o existente e refaça o fetch quando a
organização destravar (§4.2).

---

## 5. Inferência: contrato do `run` e transporte SSE (§5.1 ampliada em 2026-09-20 com o corpo da requisição e o catálogo de eventos; demais subseções conferidas em 2026-09-11 — `ai-api/src/api/routes/ag_ui.py`, `src/services/ag_ui_emitter.py`, `src/core/settings.py`)

### 5.1 O contrato do `run`: corpo da requisição e wire format

> **(2026-09-20 — seção ampliada.)** Até aqui o §5 descrevia só o transporte e
> deixava o **corpo da requisição** para `docs/ai-api/ai-api.md`. Quem lê este
> guia sem o repositório em mãos não conseguia montar uma chamada. O contrato
> passa a estar aqui. Conferido contra `ai-api/src/api/routes/ag_ui.py`
> (`RunAgentRequest`, `run_agent`), `src/services/ag_ui_emitter.py`
> (`EventType`, `emit`) e `chat-web/src/services/aguiClient.ts` (payload real).

#### Corpo da requisição

```
POST {AI_API}/py/api/agent/run
Content-Type: application/json
Authorization: Bearer <access_token>          ← identidade (§5.5); cookie também vale
X-Rag-Sql-Run-Grant: <grant>                  ← só com a capability ragSqlResultSetsV1
```

```jsonc
{
  "threadId": "01JAFBQXYZ1234567890ABCDEF",   // ULID do cliente; "" = servidor cria (ver §5.5)
  "userMessageId": "01JAFBR0000000000000000000", // ULID do cliente, para remapear o feedback
  "message": "¿Dónde queda el stand de Acme?",
  "domain": "GENERIC",                         // code de allowedDomains, ou "GENERIC"

  // --- modelo: tudo vem do catálogo do §4.8 ---
  "model_name": "gpt-4o-mini",
  "model_version": "1.0",
  "model_url": "https://api.openai.com/v1",
  "model_id": "gpt-4o-mini",                   // omitir quando llm.apiId é nulo
  "model_provider": "openai",
  "tool_calling_strategy": "auto",             // auto | native | harmony | prompt_based | none
  "supports_native_tools": null,
  "harmony_format": false,

  // --- reasoning: TOP-LEVEL, nunca dentro de metadata ---
  "reasoning_enabled": false,
  "reasoning_effort": null,                    // "low" | "medium" | "high" | null
  "reasoning_max_tokens": null,

  "metadata": { }                              // ver a tabela abaixo
}
```

**`extra="forbid"`: campo a mais é `422`.** `RunAgentRequest` recusa qualquer
propriedade não declarada, de propósito — é o que transforma um erro de
digitação camelCase (`reasoningEffort` em vez de `reasoning_effort`) em falha
visível em vez de directiva silenciosamente ignorada. Campos aceitos além dos
acima: `model_api_key` (**não mande**, §4.8), `mcp_function_tools_enabled`,
`mcp_function_tools_rollout` e `timeout_seconds` (10 a 600). Nada mais.

**`threadId` é obrigatório como chave.** Omitir a chave → `422`. Mandar `""` é
diferente: o servidor cria a conversa e devolve o id real **só no
`RUN_FINISHED`** (detalhe completo no §5.5). Gere sempre o ULID no cliente.

#### `metadata` — o contexto do turno

O `chat-web` monta este objeto em `useChatController.ts` (`buildRunMetadata`).
Os campos:

| Campo | Origem | Obrigatório? |
|---|---|---|
| `user_id` | `identity.id` do `/auth/me` | Sim no contrato; **não autoriza** (§5.5) |
| *(cabeçalhos)* `X-Client-App: mobile` + `X-Client-Platform: ios\|android` | fixos do app | **Sim** — é o que carimba o canal da conversa e do log (§5.6). Sem eles o app é contado como chat web |
| `organization_id` | `tenant.id` | idem |
| `org` | `tenant.id` (mesmo valor) | Sim |
| `dept` | `tenant.departamento.id` | Quando houver |
| `user_name` | `identity.nombre` | Recomendado |
| `llm_id` | `llm.id` do catálogo (§4.8) | **Sim** |
| `modelId` | `llm.apiId`, ou `null` | Sim |
| `allowed_domains` | `capabilities.allowedDomains` inteiro, do `/auth/me` | **Sim — sem ele o turno não alcança o acervo RAG** |
| `forced_domain` | `code` do domínio escolhido no seletor `@`, ou `null` | Sim |
| `user_custom_instructions` | `identity.customChatInstructions`, ou `null` | Sim |
| `client_channel` | `"APP_IOS"` ou `"APP_ANDROID"` no app | **Sim em organização de evento** — fail-closed (§10.6) |
| idioma | derivado de `identity.idioma` (§10.5) | Sim |
| `workspace_id` | id do projeto ativo | **Só** em modo Proyectos (§4.2) |
| `capabilities` | ex.: `["ragSqlResultSetsV1"]` | Só quando o app implementa a capability |

`allowed_domains` é o erro mais caro de omitir: a chamada responde normalmente,
o modelo responde de cabeça, e **nada no stream indica que o acervo ficou fora**.

#### Wire format da resposta

`POST {AI_API}/py/api/agent/run` responde `text/event-stream`:

```
data: {"type":"RUN_STARTED", ...}\n\n
data: {"type":"TEXT_MESSAGE_CONTENT", ...}\n\n
: keepalive\n\n            ← ping quando ocioso (AGENT_SSE_KEEPALIVE_SECONDS, default 30s)
data: {"type":"RUN_FINISHED", ...}\n\n
```

Cada evento é uma linha `data: <JSON>` seguida de linha vazia. Keepalive é um comentário SSE (`: keepalive`). Timeout global do run: `AGENT_TIMEOUT_SECONDS` (default 300s).

#### Envelope comum a todo evento

```jsonc
{
  "type": "TEXT_MESSAGE_CONTENT",  // ver o catálogo abaixo
  "timestamp": 1758300000.123,     // epoch em segundos, float
  "sequence": 42,                  // monotônico por run — descartar <= último aplicado
  // campos opcionais do contrato AG-UX, presentes só quando o servidor os envia:
  "phase": "synthesis",
  "emphasis": "transient",         // "silent" = NÃO exibir
  "displayMessageKey": "…",
  "displayIndicator": "spinner",   // valor desconhecido → tratar como "spinner"
  // … + os campos próprios do tipo
}
```

#### Catálogo de tipos (`EventType`, `ag_ui_emitter.py`)

| `type` | Campos próprios | O que o app faz |
|---|---|---|
| `RUN_STARTED` | `threadId`, `runId` | Guardar o `runId` — é o que o `cancel` exige |
| `TEXT_MESSAGE_START` | `messageId`, `role: "assistant"` | Abrir a bolha |
| `TEXT_MESSAGE_CONTENT` | `messageId`, **`delta`** | Concatenar `delta`. É o texto incremental |
| `TEXT_MESSAGE_END` | `messageId` | Fechar a bolha |
| `RUN_FINISHED` | `threadId`, `runId`, `response`, `result` | Fim do turno — ver o `result` abaixo |
| `RUN_ERROR` | `message`, `code` | Exibir `message`; o turno acabou |
| `STEP_STARTED` / `STEP_PROGRESS` / `STEP_FINISHED` | `stepName`, `displayMessage` | Indicador de progresso; respeitar `emphasis`/`displayIndicator` |
| `TOOL_CALL_START` / `_ARGS` / `_END` / `_RESULT` | conforme a tool | Progresso; nunca exibir argumento cru |
| `STATE_SNAPSHOT` / `STATE_DELTA` / `MESSAGES_SNAPSHOT` | estado do grafo | Ignoráveis numa primeira versão |
| `CUSTOM` | `name` + carga própria | Superfícies especiais: bloco de expositores (§10.1), mapa do stand (§12), menu de clarificação |
| `RAW` | passthrough | Ignorar |

**`RUN_FINISHED.result`:**

```jsonc
{
  "response": "<texto final completo>",
  "status": "completed",
  "error": null,
  "token_usage": null,
  "assistant_message_id": "<ULID>",   // remapear a mensagem local: é a chave do feedback
  "effective_model": { },             // modelo realmente usado (pode diferir, ver model_fallback)
  "rag_sources": []
}
```

O `threadId` do próprio evento `RUN_FINISHED` é o id real da conversa — é onde
ele aparece quando o app mandou `threadId: ""` (§5.5). Não existe objeto
`thread` nesse evento.

**Nunca renderizar raciocínio.** Mesmo com `reasoning_enabled: true`, a cadeia
de raciocínio não deve chegar ao chat. Mantenha um filtro defensivo local
equivalente ao `stripReasoningLeaks` do `chat-web` (§8).

### 5.2 Opções de implementação (em ordem de preferência)

1. **`fetch` + `ReadableStream`** (RN ≥0.74 / New Architecture com polyfill de streams): POST manual, parse do stream por delimitador `\n\n`. É a rota que dá controle do `AbortController` para cancelamento.
2. **`react-native-sse`**: suporta apenas GET nativamente — não serve para o `POST /agent/run` sem adaptação no backend. Evite.
3. **WebSocket**: não existe endpoint WS hoje. Não haveria fallback sem mudança de backend (ver §9.3).

### 5.3 Guardas obrigatórias (idênticas ao chat-web)

- Descartar evento com `sequence` ≤ último aplicado.
- `emphasis: "silent"` não é exibido.
- `displayIndicator` desconhecido → `spinner`.
- Cancelamento: `POST /py/api/agent/cancel` com `{ threadId, runId }` + abortar o fetch local.
- `userMessageId`: gerar ULID no cliente e reutilizar; o `assistant_message_id` pré-gerado chega em `RUN_FINISHED.result.assistant_message_id` — remapeie a mensagem local para habilitar feedback.

### 5.4 Demais SSEs do app

Mesma técnica para: progresso de upload (`GET /py/api/files/:id/status`), análise visual (`.../visual-analyses/:id/events`), eventos de título (`/py/api/threads/:id/events`). Todos são GET — aqui `react-native-sse` ou EventSource polyfill funcionam.

### 5.5 Identidade, 401 e posse da conversa (mudança de contrato, 2026-09-20)

> Escrita contra o `chat-web` da branch `feat/chat-identidade-verificada` (PR-01 do plano `docs/TODO/Chat Identidade Verificada/`). O lado servidor chega na PR-02 do mesmo plano **em modo `shadow`** — nada é recusado enquanto o usuário não virar `AI_API_AUTH_MODE_AGENT` para `enforce`. **Exceção: a transcrição de áudio não segue esse calendário — ver §6.** **Código local, ainda não publicado.**

**Identidade sai do token, não do que o app declara** — ver §4.2. Vale para `POST /py/api/agent/run`, `POST /py/api/agent/cancel`, `POST /py/api/chat`, `POST`/`DELETE /py/api/workspace-notes` e `POST /py/api/chat/audio/transcribe` (esta última já roda no guard **global**, em `enforce` desde 2026-09-17 — não espera a virada de `AI_API_AUTH_MODE_AGENT`; detalhe em §6).

**`401` em `run`, `cancel` e `workspace-notes`: renovar e repetir UMA vez.**

- O access token vive ~1h. Um `401` na **resposta inicial** dessas chamadas significa token vencido, não sessão encerrada.
- Regra: renovar pelo §4.3 (`POST {ADMIN_API}/auth/refresh`) e **repetir a chamada uma única vez**. Nunca mais de uma.
- Renovação recusada, ou segundo `401`: o `chat-web` **hoje** não leva ao login automaticamente — não é esse o comportamento real do código desta PR. Em `run`, o erro chega como `Error(SESSION_EXPIRED_MESSAGE)` **sem `statusCode`**
  (`aguiClient.ts:267`/`:277`), então o `isUnauthorizedError` que dispara toast + `signOut` (`handleExpiredSession`, só ligado em `useThreads.ts`) **não é acionado**: o usuário vê a mensagem `"Tu sesión expiró. Iniciá sesión de nuevo."` na bolha de erro e **permanece na tela**. Em `cancel`, essa mensagem **nem chega** ao usuário: o `catch` de `useChatController.ts:2252-2256` a substitui por `"No fue posible cancelar la ejecución"`. Ligar `handleExpiredSession` a partir do `run`/`cancel` é mudança de UI fora do escopo desta PR (registrada como follow-up). O app deve decidir seu próprio comportamento nesse ponto — não presuma redirecionamento automático a partir do que o `chat-web` faz hoje.
- **Só antes do streaming.** Depois que o corpo do SSE começou a ser lido **não há repetição**: erro no meio do stream segue o caminho de erro normal (§5.3). Repetir ali reexecutaria o turno.
- Cancelamento local durante a renovação (usuário apertou "parar") **aborta tudo**: não dispara a repetição.
- Com a capacidade `ragSqlResultSetsV1` (result-sets paginados): a autorização `X-Rag-Sql-Run-Grant` é **single-use** e o servidor a destrói já na tentativa de consumo. A repetição precisa de **uma autorização nova** para a mesma conversa — reaproveitar a anterior devolve `401` de novo.

**`threadId`: recomendação forte, nunca uma recusa** (revisado em 2026-09-20 contra o servidor entregue pela PR-02). Gere sempre um id no cliente (ULID) e mande em `threadId`, inclusive na primeira mensagem de uma conversa nova — é o que garante que a conversa criada seja exatamente a que o app já está exibindo. Se a chave `threadId` vier omitida do payload, o servidor devolve `422` — o campo é obrigatório no contrato da requisição. O comportamento a seguir (id gerado no servidor, sem recusa) é o de mandar `threadId: ""` (string vazia), não o de omitir a chave. Com `threadId` vazio, o `ai-api` **cria a conversa e gera o id no servidor** (`ag_ui.py:_resolve_run_thread`), nos dois modos e com ou sem token verificado: a ausência **não** é recusada nem antes nem depois da virada para `enforce`. Com token verificado a conversa nova nasce carimbada com a identidade do token. Atenção ao efeito colateral de não mandar o id: o `RUN_STARTED` ecoa o `threadId` que o app enviou (ou seja, vazio) e o id real só aparece no `RUN_FINISHED`, no campo `threadId` do próprio evento (`ag_ui.py`, `emitter.emit(EventType.RUN_FINISHED, threadId=thread_id, …)`) — não existe objeto `thread` nesse evento.

**O que muda quando o servidor entrar em `enforce`** (não antes):

| Situação | Resposta |
|---|---|
| Sem token válido em `run`, `cancel` ou `POST /py/api/chat` | `401` — aplicar a regra de renovar + repetir uma vez |
| `run` com `threadId` de conversa de outro dono (outro usuário **ou** outra organização) | evento `RUN_ERROR` com `"No se pudo verificar la identidad de esta ejecución."`; nada é lido nem gravado na conversa |
| `cancel` de conversa de outro dono | `404` (nunca confirma que a conversa existe); conversa inexistente continua devolvendo a resposta idempotente de hoje |
| Token de usuário **sem organização** (ex.: `root`) em `run` ou `/py/api/chat` | `403`, com a mensagem atual de `organization_id` obrigatório — não adianta declarar a organização no corpo |
| Usuário movido para outra organização | perde acesso às conversas da organização anterior: a conversa pertence à organização em que foi criada. Não é falha do app — tratar como conversa inacessível, sem repetir a chamada |
| `GET /py/api/agent/health` | segue público, sem token |

**Sessão encerrada: o `ai-api` também recusa agora** (2026-09-20, sessões com
estado — PR-02, código local, ainda não publicado). Depois do logout (§4.5) ou
do "cerrar las demás sesiones" (§4.6), o token daquela sessão para de abrir as
rotas do chat em **segundos**, e isso **não depende** do modo `enforce`: vale
inclusive enquanto `AI_API_AUTH_MODE_AGENT` estiver em `shadow`.

| Situação | Resposta do `ai-api` | O que o app faz |
|---|---|---|
| Token de uma sessão encerrada (logout, "cerrar las demás", reuso do token de renovação detectado) | `401` com `detail` `"Tu sesión ya no es válida. Iniciá sesión de nuevo."` | **Não adianta renovar**: o token de renovação daquela sessão também morreu. Peça login |
| Token cuja versão de sessão ficou para trás | mesmo `401` | renovar (§4.3) resolve: a renovação devolve a versão corrente |
| Token **anterior** a esta entrega (sem `sid`) depois da janela de 7 dias | mesmo `401` | renovar (§4.3) uma vez — a renovação converte o token antigo em sessão registrada. Só depois disso peça login |
| O servidor não conseguiu verificar o estado da sessão | `503` com `detail` `"No pudimos verificar tu sesión. Intentá de nuevo en unos minutos."` | **Não deslogue e não renove**: é indisponibilidade temporária. Repita mais tarde |

O `503` é deliberadamente diferente do `401`: renovar em massa durante uma
indisponibilidade é o que mais machuca, porque a renovação rotaciona o token
(§4.3) e renovações concorrentes chegam a ser tratadas como reuso. A regra do
app é simples — `401` age, `503` espera.

---

### 5.6 Conversas: listar, abrir, renomear, favoritar, apagar (escrito em 2026-09-20)

> Seção nova. O §8 cobrava "listar/renomear/apagar/mover/favoritos/busca/
> agrupamento" como item de checklist, sem nenhuma rota ou shape no texto.
> Sem histórico o app não tem produto. Conferido contra
> `ai-api/src/api/controllers/thread_controller.py` e
> `src/api/controllers/feedback_controller.py` +
> `src/schemas/feedback_schema.py`.

Todas com `Authorization: Bearer <access_token>` (ou cookie). **A identidade
sai do token** (§5.5): o `user_id` de query segue aceito por compatibilidade e
não autoriza nada. Conversa de outro dono responde **`404` com o mesmo texto de
inexistente** (`"Thread não encontrada"`) — de propósito, para não confirmar
existência.

| Rota | Para quê |
|---|---|
| `GET /py/api/threads/?user_id=&limit=&workspace_id=` | Lista (mais recentes primeiro) |
| `GET /py/api/threads/{thread_id}` | Metadados de uma |
| `GET /py/api/threads/{thread_id}/messages?count=` | Histórico de mensagens |
| `PATCH /py/api/threads/{thread_id}` | Renomear, trocar domínio, favoritar, mover de projeto |
| `DELETE /py/api/threads/{thread_id}` | Apagar conversa e mensagens |
| `GET /py/api/threads/{thread_id}/title-status` | Polling do título automático |
| `GET /py/api/threads/{thread_id}/events` | SSE do título (alternativa ao polling) |
| `POST /py/api/threads/classify-batch?user_id=&limit=` | Enfileirar títulos pendentes (chamar no login) |
| `POST /py/api/feedback/submit` | Like/dislike de uma resposta |

#### `GET /py/api/threads/` — a lista

`limit`: 1 a 500, default **200**. `workspace_id`: só em modo Proyectos.

```jsonc
{
  "threads": [
    {
      "thread_id": "01JAFBQXYZ1234567890ABCDEF",
      "user_id": "018f5c7d9e4a123456789abcdef0",
      "title": "Stand de Acme",         // null enquanto o título não saiu
      "title_status": "completed",      // pending | completed | failed
      "classification_status": "completed",
      "domain": "GENERIC",
      "created_at": 1758300000,         // epoch em SEGUNDOS, inteiro
      "updated_at": 1758300500,
      "message_count": 4,
      "last_message_preview": "El stand de Acme queda en …",
      "is_favorite": false,
      "workspace_id": null,             // null = fora de projeto
      "channel": "app-ios"              // null = conversa anterior a 2026-09-20
    }
  ],
  "total": 1
}
```

**(2026-09-20, canal de origem — campo aditivo.)** `channel` diz de onde a
conversa nasceu: `denes-chat` (chat web), `app-ios`, `app-android`, `widget` ou
`whatsapp`. É **resolvido pelo servidor** a partir de `X-Client-App` +
`X-Client-Platform` na primeira mensagem — o cliente não escolhe, e
`metadata.channel` no corpo do `run` não decide nada (segue aceito no
contrato).

Duas regras para o app:

- **`null` é "não registrado", não um canal.** Conversa criada antes desta
  entrega vem sem. Não preencha com um padrão nem esconda a conversa: se você
  mostrar a origem na lista, trate `null` como "sem informação".
- **O app só recebe `app-ios` ou `app-android` se mandar os cabeçalhos.** Sem
  `X-Client-App: mobile` + `X-Client-Platform`, a conversa nasce como
  `denes-chat` — indistinguível do chat web. Mande os dois desde a primeira
  versão (§5.1).

**Busca e agrupamento são do cliente.** Não existe parâmetro de busca nem de
ordenação: a lista vem completa (até `limit`) e ordenada por mais recente. O
filtro por texto, os grupos por data e a separação de favoritos são todos
locais, sobre este array.

**Filtro obrigatório de projeto (§4.2, D-05):** fora de projeto, o app
**precisa** descartar da lista global toda thread com `workspace_id`
preenchido — a rota sem `workspace_id` devolve tudo, inclusive as de dentro dos
projetos. Vale com a flag ligada **e** desligada.

#### `GET /py/api/threads/{thread_id}/messages` — o histórico

`count`: 1 a 200, default **50**. **Não há paginação** — só o corte pelas
`count` mais recentes. Para conversa longa, peça 200.

```jsonc
{
  "thread_id": "01JAF…",
  "messages": [
    {
      "id": "01JAFBR…",              // ULID — é a chave do feedback
      "role": "user",                // user | assistant
      "content": "¿Dónde queda el stand de Acme?",
      "ts": 1758300000,
      "metadata": null,
      "liked": null,
      "disliked": null,
      "feedback_reason": null,
      "feedback_comment": null
    }
  ]
}
```

O `id` da mensagem do assistente é o mesmo `assistant_message_id` que chega em
`RUN_FINISHED.result` (§5.1) — é assim que o feedback continua funcionando
depois de recarregar a conversa.

#### `PATCH /py/api/threads/{thread_id}` — renomear, favoritar, mover

```jsonc
{
  "title": "Nombre nuevo",     // opcional
  "domain": "SUPPORT",         // opcional
  "is_favorite": true,         // opcional
  "workspace_id": "…",         // SENTINELA — ver abaixo
  "user_id": "…"               // obrigatório SÓ quando workspace_id vem no body
}
```

Responde o `ThreadMetadataResponse` já atualizado (mesmo shape do item da
lista) — não é preciso reler a conversa.

**`workspace_id` é sentinela de três estados**, e a diferença entre "ausente" e
"presente com `null`" é real no servidor (`model_fields_set`):

| No corpo | Efeito |
|---|---|
| chave **ausente** | não mexe no vínculo de projeto |
| chave presente = `null` | tira a conversa do projeto |
| chave presente = `"<id>"` | move para aquele projeto (valida dono e destino) |

Um cliente que serialize "campo não preenchido" como `null` **tira a conversa
do projeto sem querer** a cada renomeação. Monte o corpo só com as chaves que
você realmente quer mudar. Quando `workspace_id` vai no corpo, `user_id`
também é obrigatório, e destino inválido ou de terceiro responde `403`.

#### `DELETE /py/api/threads/{thread_id}`

`{ "success": true, "message": "Thread deletada com sucesso" }`. Apaga a
conversa, as mensagens e os derivados privados (result-sets, analítica CSV), e
avisa o `admin-api` para purgar o backup. `404` quando não existe **ou** não é
sua.

#### Título automático: polling ou SSE

A conversa nasce com título provisório e o servidor gera o definitivo em
background. Dois caminhos, escolha um:

- **Polling:** `GET /py/api/threads/{thread_id}/title-status` →
  `{ thread_id, title, title_status, classification_status, updated_at }`.
  Parar quando `title_status` sair de `pending`.
- **SSE:** `GET /py/api/threads/{thread_id}/events` — é `GET`, então aqui
  `react-native-sse` ou um polyfill de `EventSource` servem (§5.4). O stream
  manda um **snapshot imediato** ao abrir e depois os eventos; o tipo é
  `thread.title.updated` (o evento usa `event:` nomeado, não só `data:`),
  com keepalive a cada 15 s. Detalhe que evita bug: numa conversa recém-criada
  o metadado ainda pode não existir e **o stream abre mesmo assim** em vez de
  responder `404` — é intencional, para o `EventSource` não morrer sem
  reconexão.

No login, `POST /py/api/threads/classify-batch?user_id=<id>&limit=200`
enfileira os títulos pendentes de uma vez (`{ queued, message }`).

#### `POST /py/api/feedback/submit` — like/dislike

```jsonc
{
  "thread_id": "01JAF…",
  "message_id": "01JAFBR…",     // ULID da mensagem do ASSISTENTE
  "liked": false,
  "disliked": true,
  "feedback_reason": "incorrecta",   // incorrecta | inapropiada | desactualizada | otro
  "feedback_comment": "",            // opcional, até 1000 caracteres
  "org_id": "…"                      // opcional
}
```

Recusas em `400`: `liked` e `disliked` ao mesmo tempo; os dois `false`; e
`disliked: true` **sem** `feedback_reason` — o motivo é obrigatório no dislike.
`404` quando a conversa não existe ou não é sua.

---

## 6. Áudio (STT) (conferido 2026-09-11, sem mudança — `ai-api/src/api/routes/chat_audio.py`)

```
POST {AI_API}/py/api/chat/audio/transcribe
Content-Type: multipart/form-data (deixe o cliente gerar o boundary)
X-User-Id: <user publicId>     ← OBRIGATÓRIO (chave do rate limit)
Campos: file, user_id, organization_id
```

- Limites do cliente: **120 s** e **25 MB** (servidor aceita até `AUDIO_MAX_REQUEST_MB`=30MB antes de buferizar).
- Rate limit por `X-User-Id` com fallback IP; idempotência Redis por hash+org.
- **(2026-09-20, identidade verificada)** `user_id` e `organization_id` do formulário continuam obrigatórios no contrato, mas **não autorizam**: o servidor usa o usuário e a organização do token (§4.2, §5.5). `X-User-Id` segue sendo a chave do rate limit. Atenção ao calendário: esta rota está no guard **global**, que já roda em `enforce` — aqui a regra vale **desde o deploy**, não depois da virada do §5.5. Consequência prática: token de usuário **sem organização** (ex.: `root`) recebe `401 UNAUTHENTICATED` nesta rota, e declarar a organização no formulário não resolve.
- **MIME**: envie o content-type real do arquivo gravado. O servidor assume `audio/webm` como fallback se o campo vier vazio — não confie nisso no mobile.
- Formatos de gravação por plataforma: iOS → AAC contido em `.m4a`/MP4 (`AVAudioRecorder`, `audio/mp4`); Android → AAC (`audio/aac`) ou Opus em WebM (`audio/webm;codecs=opus` com `MediaRecorder` onde disponível).
- Sem `language_hint` — detecção é do servidor. Resposta: `{ text, language, duration_seconds, provider }`.
- Erros tipados: `UNAUTHENTICATED`, `RATE_LIMIT_EXCEEDED`, `PAYLOAD_TOO_LARGE`, `AUDIO_MODEL_NOT_CONFIGURED`, `TRANSCRIPTION_TIMEOUT`, `ALL_PROVIDERS_FAILED`, `INTERNAL_ERROR`, `MIC_PERMISSION_DENIED`, `RECORDING_UNSUPPORTED`.
- Texto transcrito entra no compositor editável antes do envio.

---

## 7. Uploads de arquivos (conferido 2026-09-11, sem mudança — `ai-api/src/api/controllers/file_controller.py`, `admin-api/src/file-upload/`)

### 7.1 Documentos do chat (thread)

```
POST {AI_API}/py/api/files          (multipart; gera thread antes se não houver ativo)
GET  {AI_API}/py/api/files/:id/status   (SSE: status/summary/complete/error)
```

Pipeline server-side: extracting → summarizing → chunking → embedding → persisting. Dedupe por SHA256 no último upload do thread. Previews locais antes do envio; lightbox próprio no app.

### 7.2 Arquivos de workspace (Proyectos)

Via TUS no admin-api: `POST/PATCH/HEAD {ADMIN_API}/file-upload/tus` com metadata `purpose=DOCUMENT`, `organizationId`, `workspaceId` (modo Proyectos), headers de tenant e cookie/Bearer. Biblioteca RN: `tus-js-client` tem limitações em RN — avaliar implementação mínima do protocolo (create/offset/patch) ou `react-native-tus`. Detalhes do contrato: [`../admin-api/admin-api.md`](../admin-api/admin-api.md) § FileUploads e [`../../docs/admin-web/upload.md`](../admin-web/upload.md).

### 7.3 Analítica CSV e análise visual

Artefatos: `GET /py/api/files/:id/artifacts` e `/py/api/files/thread/:id/tabular` (reidratação ao trocar de thread). Tipos em `chat-web/src/types/csvAnalytics.ts` (`ChartSpec` renderizável com `react-native-svg`/`victory-native`, `TablePreviewPayload`, `QualityTablePayload`, `JsonReportPayload`). Análise visual: `POST /py/api/files/visual-analyses` + SSE de eventos.

### 7.4 `DELETE /file-upload/:id` recusa a foto de perfil (mudança de contrato, 2026-09-19)

```
DELETE {ADMIN_API}/file-upload/:id
→ 400  quando o upload tem purpose = USER_AVATAR
   "La foto de perfil no se elimina por acá: subí una nueva imagen desde tu perfil para reemplazarla."
```

- Vale para qualquer chamador autorizado (inclusive o próprio dono e root) e em qualquer estado do upload (`AVAILABLE`, `UPLOADING`, `SYNCING_R2`, `ERROR`). Nada é apagado no R2 nem no banco.
- Avatar de outra pessoa continua respondendo **403** (a autorização roda antes da recusa).
- As demais finalidades **não mudam**: `DOCUMENT`, `ORGANIZATION_LOGO` e `ASSISTANT_LOGO` seguem sendo apagados normalmente, com o recurso à lixeira quando o R2 recusa o DELETE.
- Upload de avatar **incompleto** continua podendo ser cancelado por `POST /file-upload/:id/cancel`.
- **O que o app deve fazer:** para trocar a foto de perfil, subir uma nova imagem pelo fluxo de avatar — a anterior é apagada pelo servidor na troca. Não oferecer "excluir foto" via este DELETE; se ainda houver essa ação na tela, tratar o 400 exibindo a mensagem devolvida pela API.
- Origem: admin-api `src/file-upload/file-upload.service.ts` (U-21 parte 2, PR-10 do plano `docs/TODO/Exclusao Definitiva de Usuario/`). Motivo: esse DELETE era a única porta capaz de criar cópias órfãs do avatar em `trash/` no R2, que a exclusão definitiva de usuário não consegue atribuir a ninguém. **Código local, ainda não publicado.**

---

## 8. Checklist de paridade funcional (conferido 2026-09-11, um item corrigido — ver abaixo; item de autoinscrição acrescentado em 2026-09-15; item do mapa do stand acrescentado em 2026-09-16)

- [ ] **(2026-09-20)** Caminho de descoberta da organização escolhido entre QR / código curto / digitação, sabendo que os três convergem na mesma sonda e que **o QR não dispensa o bloqueador abaixo** (§3.4)
- [ ] **(2026-09-20, bloqueador)** Sinal de topologia definido com o time do `admin-api` **antes de escrever a camada de rede** — sem ele `login`, `login-config`, `bridge/exchange` e `/auth/signup/*` respondem `400 TENANT_NOT_FOUND` (§3.1, §9.0)
- [ ] Tenant resolvido antes de tudo; branding via `/auth/tenant-branding`. **(2026-09-20 — corrigido)** O `404` significa organização **inativa**, não inexistente; tenant não resolvido devolve **`200` com campos vazios**. Enquanto o §9.0 não sair, **não construa a tela de confirmação sobre esse `200`** (§2, §3.1, §3.4)
- [ ] Login email/senha com `client: "chat"` + `organizationSlug`; métodos condicionais via `/auth/login-config`
- [ ] Sessão: login por `responseMode: "bridge"` (§4.1) + cookies de sessão persistidos (`@react-native-cookies/cookies`) + `POST /auth/refresh` para obter o primeiro Bearer; `/auth/me` como fonte de verdade
- [ ] **(2026-09-20)** Catálogo de recusas do login tratado por inteiro, incluindo os dois `401` **sem campo `code`** e o `429 AUTH_RATE_LIMITED` de 10/min (§4.1)
- [ ] **(2026-09-20)** `remember` escolhido de propósito: `true` emite Bearer de **30 dias** (Keychain/Keystore obrigatório); renovação agendada pelo `expires_in` do `/auth/refresh`, nunca por 1 h fixa (§4.1, §4.3)
- [ ] **(2026-09-20)** Cookies recapturados **a cada** `/auth/refresh` (a rota rotaciona os dois); `400` nessa rota = fim de sessão, sem repetir (§4.3)
- [ ] **(2026-09-20)** Senha e convite: "Esqueci minha senha" (`forgot-password` com `origin` da web da org), troca de senha só com `capabilities.canChangePassword === true`, e ciência de que reset e convite terminam **no navegador** hoje (§4.7, §9.2)
- [ ] **(2026-09-20)** Catálogo de modelos lido e filtrado pela regra de elegibilidade antes de qualquer inferência; **`model_api_key` nunca enviado** pelo cliente (§4.8)
- [ ] **(2026-09-20)** Corpo do `run` montado só com campos declarados (`extra="forbid"` → `422`), reasoning **top-level**, e `metadata.allowed_domains` sempre presente — sem ele o turno não alcança o acervo e **nada no stream avisa** (§5.1)
- [ ] Threads: listar/renomear/apagar/mover/favoritos/busca/agrupamento (`classify-batch`), título provisório + polling `title-status` — **contrato completo no §5.6 (escrito em 2026-09-20)**
- [ ] **(2026-09-20)** `PATCH` de thread montado só com as chaves que mudam: `workspace_id` é **sentinela de três estados** e um `null` acidental tira a conversa do projeto (§5.6)
- [ ] **(2026-09-20)** Busca, agrupamento por data e favoritos são **do cliente** — a rota de lista não tem parâmetro de busca nem ordenação (§5.6)
- [ ] Run AG-UI completo com as 3 guardas + cancelamento + remapeamento de `assistant_message_id`
- [ ] Seletor `@` de domínio (`allowedDomains` com `description`); `forced_domain` no metadata
- [ ] Reasoning toggle + esforço (`low|medium|high`) respeitando suporte do modelo
- [ ] Menu de clarificação renderizado **por forma** (`groups/options/allow_free_text`); resposta via `resume_mode`; nunca `option_id` + `free_text` juntos
- [ ] Nunca renderizar raciocínio (filtro defensivo local equivalente ao `stripReasoningLeaks`)
- [ ] Áudio conforme §5
- [ ] Uploads + analítica CSV + análise visual (superfícies diferíveis)
- [ ] Proyectos atrás de flag (`capabilities.workspacesEnabled`); notas via `/py/api/workspace-notes`. **(2026-09-20, Proyectos por Organización)** Ler a capability com `=== true` (ausência = desligado, D-07), nunca de variável de build; com a flag desligada não tocar em `/workspace/*` nem em `/py/api/workspace-notes` (o backend responde `403` até para listar); fora de projeto, filtrar da lista global toda thread com `workspace_id` preenchido, nos dois estados da flag (D-05) — ver §4.2
- [ ] Modelos: cache local por usuário/org (equivalente a `aikuaa_models_cache_v5` — atualizado 2026-09-12, política de seleção de modelo); leitura via `GET {ADMIN_API}/db/llm-organization/organization/:organizationId` + `GET {ADMIN_API}/db/llm-organization-config/organization/:organizationId` (corrigido 2026-09-11 — não existe rota `/api/models/check`); toast em `model_fallback`; **(2026-09-12, política de seleção de modelo)** não ler nem gravar o cache quando `modelSelectionEnabled === false` (limpar o existente); ao destravar, refazer o fetch (E-06)
- [ ] Feedback like/dislike com motivo no dislike, usando o ULID/ID remapeado correto
- [ ] Bloqueio de interações quando créditos insuficientes (mensagem já vem do backend)
- [ ] **(2026-09-20, identidade verificada)** Identidade só pelo token em `run`, `cancel`, `/py/api/chat`, notas e áudio (declarados continuam no corpo e não autorizam); `threadId` sempre gerado no cliente; `401` antes do streaming em `run`/`cancel`/`workspace-notes` → `POST /auth/refresh` + **uma** repetição, nunca durante o stream nem duas vezes; `X-Rag-Sql-Run-Grant` novo a cada tentativa; conversa de outro dono → `RUN_ERROR`/`404`, sem repetir (§4.2, §5.5)
- [ ] **(2026-09-16, aiKuaa Events Fase 9)** Mapa do stand: ler `has_stand_map` do bloco (§12.2) e `hasStandMap` da ficha (§12.1), buscar a rota `stand-map` ao exibir e ao reabrir a conversa, refazer a chamada quando `expiresAt` passou, desenhar área/entorno/marcador com zoom inicial no stand, nunca guardar URL assinada (só a imagem, por caminho sem query), e tratar `404`/rede fora como "sem mapa" — nunca como erro de tela (§12.1, §12.2). Widget e anexos de mensagem: §12.3, fora do app hoje
- [ ] **(2026-09-16, limites do cadastro)** Cadastro: tratar
  `429 SIGNUP_CAPACITY_REACHED` (novo código, em `email/start`, `email/resend`
  e `complete`) como indisponibilidade temporária do evento, respeitando
  `Retry-After`; parar de tratar `429` em `email/verify` e `cancel` e `503` do
  limitador em `terms`, que não acontecem mais (§11.1, §11.2, §11.3)
- [ ] **(2026-09-15, aiKuaa Events Fase 8)** Autoinscrição do visitante por e-mail: "Crear cuenta" só com `signup.enabled` e `signup.methods.email`; seletor de idioma; senha confirmada no app; código com autopreenchimento `one-time-code`; termo com "Mantener sesión iniciada"; `complete` → `bridge/exchange` → `refresh`; recusa chama `cancel`; bilhete só em memória (§11.2, §11.3, §11.5). Cadastro com Google fora do app até o universal link (§9.2)

---

## 9. Lacunas e decisões de backend necessárias

Estes pontos **não resolvíveis só no app** — registre com o time antes de começar:

### 9.0 Tenant não resolve sem sinal de topologia (registrado 2026-09-20) — **bloqueador**

`X-Tenant-Host` e `X-Tenant-Slug` sozinhos não identificam a organização:
`TenantResolverService` exige que `host`, `x-forwarded-host`, `origin` ou
`referer` confirmem `<slug>.aikuaa.ai`. Um app nativo em `api.aikuaa.ai` recebe
`400 TENANT_NOT_FOUND` em `login`, `login-config`, `bridge/exchange` e
`/auth/signup/*`. **É a primeira coisa a resolver com o time do `admin-api`** —
**a solução já está desenhada** no SDD do login mobile
([`docs/TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md`](../TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md),
achados P-03 e P-04, decisões D-06 a D-16), **com 5 PRs planejadas e nada
implementado**. A pergunta é de calendário, não de desenho. Diagnóstico
completo e as duas saídas no fim do §3.1.

### 9.1 Login e refresh são cookie-first (ampliado 2026-09-11)
`POST /auth/refresh` lê exclusivamente o cookie `chat_api_refresh_token`. E,
desde a migração do `chat-web` para `responseMode: "bridge"` (§4.1), **o
próprio login também é cookie-first**: `POST /auth/bridge/exchange` só seta
cookies, sem `access_token` no corpo. Para mobile limpo, seria preciso um dos
dois: (a) aceitar refresh token no body / endpoint dedicado a clientes
nativos, ou (b) uma variante de `bridge/exchange` que devolva `access_token`
no corpo para o `client: "mobile"` (que já existe como valor de
`X-Client-App`, mas não tem cookies próprios — `AuthClientApp` não inclui
`mobile`, ver `admin-api/src/database/auth/support/client-app.ts`). **Workaround
atual:** gerenciar cookies no app (`@react-native-cookies/cookies`) e, após o
`bridge/exchange`, chamar `POST /auth/refresh` (que sempre devolve
`access_token` no corpo) para materializar o Bearer — ver §4.1 passo 3. O
caminho legado de login direto (`access_token` no corpo de `POST /auth/login`
sem `responseMode`) ainda existe no código, mas está atrás do kill-switch
`AUTH_LEGACY_BRIDGE_ENABLED` (desligado por padrão, `410 Gone` quando
desligado) — **não desenhe o app assumindo que ele vai continuar disponível**;
confirme com o time se vale negociar reabri-lo para o cliente `mobile` em vez
de implementar o workaround de dois passos.

### 9.2 OAuth sem deep link
O sanitizador de `returnTo` aceita apenas caminhos relativos (`AUTH_RETURN_TO_PREFIXES`), descartando a origem — deep links/custom schemes não funcionam no callback. Decisões possíveis: (a) permitir prefixos absolutos (custom scheme/universal links) no allowlist; (b) página-ponte web que entrega a sessão ao app. Enquanto isso, o app fica limitado a email/senha (ou bridge via web).

**Autoinscrição com Google (Fase 8, PR-03, registrado em 2026-09-15):** o
cadastro do visitante com Google também depende desta lacuna. A volta do
Google leva a identidade nova para a tela web do termo
(`https://<slug>.aikuaa.ai/signup/terms?ticket=…`, §11.4), e não há como
entregá-la ao app. **Até o universal link do SDD de login mobile existir, o
app oferece só o cadastro por e-mail** (§11.2), mesmo quando
`signup.methods.google` vier `true`.

**Atualização (Fase 8, PR-04, 2026-09-15):** o lado web está implementado no
`chat-web` (`/signup/terms` lê o `?ticket=`, tira da URL e conclui pelo BFF),
então a lacuna agora é só do app: falta o universal link para o bilhete
chegar a ele. Nenhuma rota nova é necessária quando isso existir — o bilhete
e o `complete` são os mesmos do §11.3.

**Recuperação de senha e convite (registrado 2026-09-20):** a mesma lacuna
alcança as duas rotas do §4.7. O `origin` de `POST /auth/forgot-password` passa
por `isAllowedBrowserOrigin` — só `http:`/`https:` de `FRONTEND_URL` ou dos
sufixos coringa —, então custom scheme e universal link são descartados em
silêncio. O link do convite (`POST /auth/activate`) é montado pelo mesmo
`MailService`. Consequência: hoje **redefinir senha e aceitar convite acontecem
no navegador**, e o usuário volta ao app pelo login normal. A decisão (a) do
parágrafo acima — permitir prefixos absolutos no allowlist — resolve os três
casos de uma vez.

### 9.3 Sem fallback de transporte para o run (conferido 2026-09-11, sem mudança)
O único canal do `POST /agent/run` é SSE. Em redes que quebram streaming (proxies corporativos), não há WebSocket/gRPC alternativo. Mitigação no app: retry com `resume` do turno não existe — trate falha de stream como erro do run e ofereça reenviar.

### 9.4 Push notifications (conferido 2026-09-11, sem mudança)
Não existem endpoints/infra de push (nenhuma superfície no chat-web). Fora de escopo da paridade; exigiria projeto novo no ai-api/admin-api.

### 9.5 `X-Client-App` restrito (conferido 2026-09-11, sem mudança)
Apesar do guia de paridade sugerir um valor próprio (ex.: `mobile`), o backend de auth normaliza apenas `admin`/`chat`. Use `chat` no header de auth; telemetria própria do app pode usar identificador interno à parte.

> **Nota (aiKuaa Events, Fase 6, PR-07, 2026-09-10):** desde o SDD de login
> mobile, `mobile` **já é** um valor reconhecido de `X-Client-App`
> (`ClientApp`, `admin-api/src/database/auth/support/client-app.ts`) — a
> restrição acima vale só para o fluxo de **sessão** (`AuthClientApp`, que não
> inclui `mobile` porque não há par de cookies próprio para ele). Nas rotas de
> **eventos** (§10 abaixo), `X-Client-App: mobile` + `X-Client-Platform` é o
> contrato correto e funcional.

---

## 10. aiKuaa Events, Fase 6 — Destaque Premium (bloco de expositores, ficha, termo, exposição)

> Escopo novo desta fase (SDD `docs/TODO/aiKuaa Events/fase 6 - Destaque
> Premium/README.md`). Válido só para organização com `tenant.isEventOrganization
> === true`. Confirmado por leitura dos handoffs da PR-01 a PR-06 e do código
> real em 2026-09-10; **reconfirmado 2026-09-11 contra `origin/main` de
> `admin-api` (`edition-terms.contract.ts`, `edition-terms-reader.service.ts`,
> `auth.controller.ts`, `visitor-catalog.controller.ts`,
> `ingest-user-exposures.dto.ts`, `exposure-channel.ts`) e `ai-api`
> (`exhibitor_results.py`, `exhibitor_exposure.py`)** — nenhuma divergência de
> shape ou de rota encontrada; §10.3 ganhou o detalhamento do seletor de
> idioma (PR-09, `EventTermsGate.tsx`) que faltava.

### 10.1 Bloco de expositores (consumo do `CUSTOM exhibitor_results`)

> **Atualizado na Fase 7.1 (busca semântica).** Conferido contra o código em
> 2026-09-13 (Fase 7.1): `chat-web/src/types/exhibitorResults.ts`
> (`ExhibitorSourceTool`, `parseSourceTool`, `parseQuery`) e o handoff da PR-02
> do `ai-api` (`build_semantic_block`). O contrato só **cresceu** — nenhuma
> chave existente mudou de nome, tipo ou significado; um app que ignore o valor
> novo continua funcionando, apenas sem rastrear de qual busca veio o bloco.

O app recebe o mesmo evento AG-UI `CUSTOM name="exhibitor_results"` que o
`chat-web` — ver o shape campo a campo e as regras de ausência de lista em
[`chat-web.md` §5](./chat-web.md#eventos-custom-consumidos-pelo-chat). Pontos
específicos para quem implementa fora do `chat-web`:

- Chega **antes** do primeiro `TEXT_MESSAGE_CONTENT` do run; um run pode
  emitir vários blocos.
- `kind == "single"` (ficha direta, ou busca com 1 resultado) é o gatilho da
  expansão inline no `chat-web`; o app decide o equivalente na própria UI.
  - **(2026-09-16, só interface — nenhum contrato mudou)** Nesse caso o
    `chat-web` passou a desenhar a **ficha inteira** dentro do balão, e não
    mais um meio-perfil: descrição íntegra (recolhida só acima de 420
    caracteres, com "Leer más"), contatos (site, redes, e-mail e telefone
    públicos), mapa do stand inline, "Fotos y video" (galeria com o vídeo como
    último quadro), produtos e catálogo. **Sumiram os botões "Ver perfil
    completo" e "Cómo llegar al stand"** — o conteúdo que eles abriam já está
    na tela. A mesma ficha é o que a folha lateral mostra ao tocar num premium
    da lista; a lista em si (card premium, linha básica, "Ver todos") não
    mudou. O app pode espelhar a decisão ou manter a própria UI: nada aqui
    altera rota, evento, campo ou regra de exposição.
- **`source_tool` tem três valores** (Fase 7.1): `"search_exhibitors"`,
  `"get_exhibitor_details"` e `"search_exhibitors_semantic"`. O app deve
  **aceitar** o terceiro — a lista é uma allowlist por igualdade estrita, e um
  valor fora dela deve virar "desconhecido" **sem descartar o bloco** (perde-se
  rastreabilidade, nunca o card). O bloco semântico é idêntico aos outros dois
  item por item: mesmos campos, mesmas regras de ausência, mesma renderização —
  **nenhuma tela nova, nenhum estado novo**.
- **`query` muda de forma conforme o `source_tool`** — leia chave a chave, com
  `null` para o que não vier, nunca como um objeto de shape fixo. No bloco
  semântico chegam `semantic_query` (`string | null` — o texto que o agente
  passou à busca, o papel que `search` tem na busca por filtro), `top_k`
  (inteiro de 1 a 5 (teto reduzido na Fase 7.2)), `country` (ISO-2, como hoje) e `category_public_id`
  (**UUID**, `null` quando não houve filtro). **Não vêm** `search`, `category`
  (slug) nem `resolved_participation_public_id`. `category_public_id` não
  substitui `category`: exibir o UUID como rótulo de filtro mostraria um
  identificador ao visitante.
- **`resolution` é sempre `null` no bloco semântico** (decisão D-05 da Fase
  7.1) — a busca semântica é sempre exposição indireta. Qualquer ramo de
  interface condicionado a `resolution == "resolved"` ("consulta direta") não
  se aplica a esse `source_tool`.
- **O bloco chega na ordem do ranking semântico**; o balão do `chat-web`
  agrupa os Premium antes dos Básicos (regra de apresentação da Fase 6,
  `ExhibitorResultsSection.tsx:85-88` — até 5 Premium + até 10 Básicos), então
  a ordem exibida na bolha pode divergir do ranking quando os planos se
  intercalam. O painel completo ("Ver todos") **mantém** a ordem do bloco tal
  como recebida — só a bolha reagrupa. Apps devem replicar esse agrupamento
  (Premium antes de Básico) no resumo, e não presumir que a ordem crua do
  ranking é o que o usuário vê no resumo do `chat-web`. `total` nunca é maior
  que `items.length` e `has_more` é sempre `false` (não há paginação no
  ranking). (Correção registrada na etapa E da PR-03 — Fase 7.1, achado 1 do
  review.)
- Se o bloco não vier, não há estado de erro novo a implementar: falha na
  resolução do lado do servidor simplesmente **não emite bloco**, e o run segue
  com a prosa do agente — o mesmo caminho de sempre.
- **Rehidratação**: `GET {AI_API}/py/api/threads/{threadId}/messages` devolve
  `message.metadata.exhibitorResults` como lista de blocos — os mesmos
  objetos `value` do evento, na ordem de emissão. **Vale igual para o bloco
  semântico**: ele é persistido na mesma chave, com o mesmo shape, e volta pelo
  mesmo endpoint — nenhuma chave nova de metadata, nenhum endpoint novo. Ao
  reidratar, **nunca**
  disparar exposição (nem `DETAIL_VIEW` por expansão automática); o servidor
  já fez a deduplicação por run, mas o cliente ainda deve colapsar por
  `participation_public_id` ao receber (dois eventos podem chegar antes do
  estado final). **O mesmo colapso vale ao reidratar**: a lista da metadata
  pode repetir o mesmo bloco, e o `chat-web` deduplica pelo identificador
  derivado do conteúdo (natureza + `source_tool` + participações, em ordem)
  antes de renderizar — apps devem fazer o mesmo, senão a conversa reaberta
  mostra dois cards onde o visitante viu um (Fase 7.3).
- **Campo novo na Fase 9 (PR-04): `has_stand_map`** em cada item — booleano,
  sempre presente, nos dois planos. É a única mudança do envelope nessa fase;
  o que fazer com ele está na §12.2.
- Fora de organização-evento, o evento simplesmente não deve ser tratado
  (mesmo comportamento do `chat-web`): a interface permanece idêntica à atual.

### 10.2 Ficha do expositor

`GET {ADMIN_API}/events/me/current-edition/published-catalog/:participationPublicId?locale=es&resolveMedia=true`

- Rota **de usuário**, `JwtAuthGuard` — Bearer do app, sem BFF. A organização
  vem do token; a edição corrente é resolvida no servidor (regra "em curso >
  próxima > última" do `admin-api`). Sem edição corrente (nenhuma ou mais de
  uma edição viva), **404**.
- Com `resolveMedia=true`, cada item de `media[]` ganha `signedUrl` e
  `expiresAt`. **`signedUrl` é CAMINHO relativo ao `admin-api`, não URL
  absoluta** (`PublishedResolvedAsset.signedUrl`, ex.:
  `/portal/media/files/<assetPublicId>?token=…`) — o app deve prefixar com a
  base do `admin-api` que já usa para as demais chamadas.
- `expiresAt` é ISO 8601 com fuso e vale **120 segundos** a partir da
  assinatura (`ASSET_LINK_TTL_SECONDS`). Vencido, **refazer a chamada da
  ficha inteira** (não existe endpoint de refresh isolado do link) — imagens
  já carregadas seguem no cache do app/navegador.
- BASIC responde 200 com o mesmo shape (simetria de contrato), mas nenhum
  gatilho de interface deve abrir ficha de plano BASIC (regra de produto,
  não do servidor).

### 10.3 Termo de uso do evento

`GET /auth/me` devolve, para organização de evento, o campo `eventTerms`:

```jsonc
{
  "editionPublicId": "…",     // null se não há edição corrente (fail-open)
  "required": true,           // o app bloqueia enquanto for true
  "currentVersion": "2026-11-v1", // null se não há termo publicado
  "currentLocales": ["pt-BR", "es-PY"], // idiomas em que a versão corrente está publicada
  "acceptedVersion": null,    // versão que ESTE visitante aceitou, se coincidir com a corrente
  "acceptedAt": null          // ISO 8601 com fuso
}
```

- **Fail-open**: sem edição corrente, sem termo publicado, ou erro
  inesperado do domínio de eventos, `required` vem `false` — o app nunca
  fica bloqueado por instabilidade do backend.
- Bloqueio: enquanto `required === true`, o app impede o uso do chat até
  chamar:

  `POST {ADMIN_API}/auth/terms/accept`
  ```jsonc
  { "edition_public_id": "…", "terms_version": "2026-11-v1", "locale": "es" }
  ```

  Identidade e canal vêm do token/sessão — nenhum campo de identidade ou de
  canal é aceito no corpo (o pipe global recusa com 400 se vier). O aceite
  valida `(edição, versão, isCurrent)`; o `locale` enviado é gravado como
  registro do gesto e **não** precisa bater com `EventEdition.locales`
  (`pt-BR`/`es-PY`) — pode ser `"es"` livremente.
- **Texto do termo (PR-08, complemento pós-deploy)**: ao entrar, se
  `eventTerms.required` vier `true`, o app chama

  `GET {ADMIN_API}/auth/terms/current?locale=<es-PY|pt-BR>` (Bearer)

  e recebe `200 { editionPublicId, version, locale, title, body,
  availableLocales }`. O app mostra `title` + `body` em área rolável, junto
  com a versão recebida. O `locale` devolvido **pode diferir** do pedido —
  quando a versão vigente não tem o idioma solicitado, a rota faz fallback
  para o primeiro idioma disponível e informa em `locale` qual veio; o app
  deve exibir o texto recebido sem insistir no idioma original.
  - **"Aceptar"**: chama `POST /auth/terms/accept` com `terms_version` igual
    ao `version` recebido nesta rota (não um valor fixo do app).
  - **"No acepto y salir"**: não chama `/auth/terms/accept`. Encerra a sessão
    (logout local do app e revogação de sessão no backend, se o fluxo mobile
    tiver esse mecanismo) e volta à tela de login sem gravar aceite nem
    recusa (ausência de aceite já é a prova).
  - **Sem texto** (a rota responde `404` — sem termo vigente ou sem edição
    corrente da organização — ou qualquer erro): o app bloqueia o aceite
    (o botão de aceitar fica desabilitado) e explica a falha; nunca deixa o
    visitante aceitar sem ter lido o texto.
- **Seletor de idioma do texto (PR-09, adicionado nesta revisão — cliente de
  referência `chat-web/src/components/auth/EventTermsGate.tsx`)**: o app
  deve replicar este comportamento, não só a rota:
  - O seletor de idioma **só aparece quando `availableLocales` tem mais de
    um item** — um idioma só não é escolha; com um item só, não há UI de
    troca.
  - **Trocar o idioma desmarca o consentimento** e relê o texto no idioma
    escolhido (`GET /auth/terms/current?locale=<novo>`), cancelando qualquer
    requisição pendente do idioma anterior. O consentimento marcado se refere
    ao texto que estava na tela — trocar de idioma invalida essa marca.
  - **Sem texto carregado, o aceite fica bloqueado**: o botão de aceitar só
    habilita com `termsDocument !== null` — nunca por causa só do checkbox
    marcado.
  - **"No acepto y salir" nunca chama `/auth/terms/accept`**: é
    literalmente um logout (o mesmo do menu da conta) sem enviar nada à rota
    de aceite; a ausência de aceite é a prova da recusa.
  - **`400` no aceite com motivo `terms_version_not_current`** (a versão em
    tela saiu do ar entre a leitura e o clique — pode acontecer se o termo for
    republicado enquanto o visitante lê): o cliente de referência mostra "los
    términos cambiaron, recargá la página" e, ao confirmar, **relê o texto
    (`GET /auth/terms/current`) e a sessão (`/auth/me`)** e reseta o
    consentimento — o app deve seguir a mesma reação, nunca repetir o mesmo
    corpo de aceite (repetir só reproduziria o mesmo 400).
  - **O tema (claro/escuro) segue o app** — no `chat-web` o gate tem um
    controle de tema próprio porque é a única tela cheia que aparece antes do
    resto da interface autenticada; num app nativo, a tranca do termo deve
    simplesmente herdar o tema já ativo do app, sem replicar esse controle.

### 10.4 Exposição do cliente (cliques do visitante)

`POST {ADMIN_API}/events/me/exposures`

`edition_public_id` vem do próprio bloco `exhibitor_results` que originou o
gesto (`block.editionPublicId`, §10.1) — nunca resolvido pelo app à parte.
**Pode vir `null`** (o `ai-api` não conseguiu resolver a edição, §5 acima). O
`chat-web` trata isso desligando a gravação: se `edition_public_id` (ou
`message_id`) estiver ausente, a chamada **não é enviada**
(`eventsApi.ts:126-129`, log `exposicion omitida: falta edition_public_id`) —
o app deve seguir a mesma regra, nunca mandar a rota com `edition_public_id:
null` no corpo.

```jsonc
{
  "edition_public_id": "…",
  "thread_id": "…",
  "message_id": "…",        // OBRIGATÓRIO — âncora da chave de idempotência
  "items": [
    { "participation_public_id": "…", "kind": "DETAIL_VIEW" | "MEDIA_VIEW" | "LINK_CLICK", "target": "video" | "gallery" | "website" | "linkedin" | "instagram" | "catalog_pdf" | null }
  ]
}
```

Pares `(kind, target)` reais, tal como o `chat-web` (PR-05) os emite — o app
deve seguir a mesma lista, sem inventar `target` novo (o vocabulário é
fechado porque entra na chave de idempotência):

| `kind` | `target` | Gesto |
|---|---|---|
| `DETAIL_VIEW` | (sem alvo) | abriu a ficha, ou interagiu com o card expandido |
| `MEDIA_VIEW` | `gallery` | ampliou uma imagem da galeria |
| `MEDIA_VIEW` | `video` | abriu o vídeo |
| `MEDIA_VIEW` | `catalog_pdf` | abriu o catálogo em PDF |
| `LINK_CLICK` | `website` | clicou no site — e também em rede social sem alvo próprio (Facebook/YouTube/TikTok/WhatsApp caem aqui) |
| `LINK_CLICK` | `linkedin` / `instagram` | clicou nessas duas redes |

- **Quando disparar**: só em gesto real do visitante (abrir ficha, ampliar
  mídia, clicar link). **Nunca na rehidratação** da thread — reabrir uma
  conversa não deve gerar nenhuma chamada a esta rota.
- Identidade vem do token; canal vem dos headers da sessão (§10.5), nunca do
  corpo. Resposta `202` com `{ accepted, rejected: [{index, reason}] }`.
- E-mail e telefone públicos **não** geram evento (fora do vocabulário de
  `target`); não prometer "clique de contato" na interface.

### 10.5 Headers de canal

Quem deriva o canal (`ExposureChannel`) é sempre o **servidor**, a partir dos
headers da sessão — nunca do corpo:

| `X-Client-App` | `X-Client-Platform` | Canal resolvido |
|---|---|---|
| `chat` | (ignorado) | `CHAT_WEB` |
| `mobile` | `ios` | `APP_IOS` |
| `mobile` | `android` | `APP_ANDROID` |
| `mobile` | ausente ou outro valor | **rejeitado — 400** |
| `admin` | — | `null` (painel não é superfície de visitante) |

`X-Client-Platform` é o header **novo** desta fase — emenda ao SDD do login
mobile (ver
[`SDD_LOGIN_APP_MOBILE_v1.0.md` §6.1](../TODO/login-app-mobile/SDD_LOGIN_APP_MOBILE_v1.0.md#61-headers-comuns-a-toda-chamada-do-app)).
O `chat-web` manda só `X-Client-App: chat` (sem plataforma), e é isso que
deriva `CHAT_WEB` no servidor — o app deve **sempre** mandar os dois headers
juntos (`mobile` + `ios`/`android`).

### 10.6 `metadata.client_channel` no run do `ai-api`

Além dos headers do `admin-api` (§10.5, para as rotas de exposição e termo),
o `POST {AI_API}/py/api/agent/run` precisa incluir `client_channel` dentro de
`metadata` (ao lado de `user_id`/`organization_id`):

```jsonc
{ "metadata": { "user_id": "…", "organization_id": "…", "client_channel": "APP_IOS" } }
```

Valores esperados: `"APP_IOS"` ou `"APP_ANDROID"` (o app `"chat_web"`/`"CHAT_WEB"`
também é aceito, normalizado em maiúsculas no servidor). **Sem esse campo, ou
fora do enum, o lote de exposição `SEARCH_*` daquele run simplesmente não é
enviado** — sem erro visível ao usuário, só log
`exposure_skipped reason=channel_missing|channel_invalid` no `ai-api`. Isso é
independente dos headers do `admin-api`: os dois precisam estar corretos para
a audiência de busca ser contabilizada.

---

## 11. aiKuaa Events, Fase 8 — Autoinscrição do visitante

> Escopo novo desta fase (SDD [`docs/TODO/aiKuaa Events/fase 8 - Autoinscricao
> do Visitante/README.md`](../TODO/aiKuaa%20Events/fase%208%20-%20Autoinscricao%20do%20Visitante/README.md)).
> Fluxo em uma frase: o visitante prova a posse do e-mail (código por e-mail
> ou Google), lê e aceita o termo vigente e só então a conta é criada, com a
> sessão entregue pelo mesmo bridge do login. Esta seção é escrita junto com
> cada PR que muda contrato: §11.1 (PR-01) e §11.2/§11.3 (PR-02), conferidas
> contra o código em 2026-09-14, e §11.4 (PR-03), conferida em 2026-09-15, no
> `admin-api`, branch `feat/f8-autoinscricao-visitante`; §11.5 (PR-04, telas
> do `chat-web`, mesma branch). **Em 2026-09-15 (PR-04) a §11 inteira foi
> relida contra o código final dos dois repositórios** (`admin-api`
> `f76bd87`, `chat-web` `3eac011`); os ajustes de redação estão marcados.
> Nada disto está em produção antes do merge e deploy das PR-01 a PR-04
> (ordem: `admin-api` antes do `chat-web`).

> **(2026-09-20) Leia isto antes de planejar a tela de cadastro.** A
> autoinscrição deste §11 **não é o cadastro genérico da plataforma**. Ela só
> existe quando, ao mesmo tempo: a organização é de evento e está ativa, tem
> edição corrente, a edição tem termo vigente em pelo menos um idioma, e a
> organização tem exatamente um departamento ativo chamado "Visitante" (§11.1).
> Fora disso `signup.enabled` vem `false` e **não há caminho de auto-cadastro**:
> a conta nasce por convite do administrador (`POST /auth/activate`, §4.7) ou,
> só na web e com Google, por pedido de acesso (§11.4). `POST /auth/register`
> está aposentado. Se a organização-alvo do app não é de evento, o §11 inteiro
> não se aplica — vá para o §4.7.

### 11.1 Disponibilidade do cadastro e texto público do termo (PR-01)

Código de referência: `admin-api/src/database/auth/services/signup-eligibility.service.ts`,
`controllers/tenant-aware-auth.controller.ts` (`login-config`) e
`controllers/signup.controller.ts`.

**Quem pode se cadastrar** é decidido só no servidor. O cadastro fica
disponível quando, ao mesmo tempo:

- a organização é de evento e está ativa;
- existe edição corrente (mesma regra de `GET /auth/terms/current`);
- a edição corrente tem termo vigente em pelo menos um idioma;
- a organização tem exatamente um departamento ativo chamado "Visitante"
  (sem diferenciar maiúsculas nem espaços nas pontas).

Faltando qualquer peça, o cadastro está indisponível. Não há fail-open aqui,
ao contrário do `eventTerms` do §10.3: sem termo, não existe conta.

#### `signup` no `GET /auth/login-config`

```
GET {ADMIN_API}/auth/login-config?client=chat
Headers: os mesmos do §2
```

```jsonc
{
  "context": "organization",
  "organization": { "publicId": "…", "slug": "expo", "name": "…", "logoUrl": "…" },
  "methods": { "email": true, "microsoft": false, "google": true },
  "signup": { "enabled": true, "methods": { "email": true, "google": true } }
}
```

- O campo é **aditivo**: `context`, `organization` e `methods` não mudaram.
- `signup.enabled` é `false` quando a organização não atende às condições
  acima, e **sempre** `false` nos contextos `global_admin` e `platform`.
  Com `enabled: false`, `signup.methods` vem `{ "email": false, "google": false }`.
- `signup.methods.email` segue o mesmo critério do login por senha (provedor
  de e-mail ativo na organização).
- `signup.methods.google` só é `true` para o **Google da plataforma**. Uma
  organização com o Google no modo legado por organização pode ter
  `methods.google: true` para login e `signup.methods.google: false`. No app,
  o cadastro com Google depende ainda do universal link (§9.2, PR-03).
- Se a avaliação do cadastro falhar no servidor, o `login-config` responde
  normalmente com `signup.enabled: false`: o login nunca cai por causa do
  cadastro.
- **Regra de tela:** o app só mostra "Crear cuenta" com `signup.enabled === true`
  **e pelo menos um método `true`** (ajuste de 2026-09-15: `enabled: true`
  com `email` e `google` em `false` é resposta válida da API e levaria a uma
  tela sem opção; no app, que não cadastra com Google, a condição é
  `signup.methods.email === true`), e oferece por dentro apenas os métodos
  com `true`. A resposta não traz motivo, edição nem versão do termo; o app
  não deve tentar deduzir por que o cadastro está desligado.

#### `GET /auth/signup/terms`

```
GET {ADMIN_API}/auth/signup/terms?locale=<es-PY|pt-BR>
Headers: X-Tenant-Host, X-Tenant-Slug (sem Authorization)
```

- **Pública**, sem sessão. A organização é resolvida pelo mesmo resolvedor do
  `login-config` (`resolvePublicLoginFromRequest`), a partir de host e
  cabeçalhos de tenant. Organização, edição ou slug em query ou corpo são
  ignorados. Atenção: nesse resolvedor, `X-Tenant-Host` e `X-Tenant-Slug`
  só valem quando confirmados por um sinal de topologia da mesma
  organização (`Host`, `X-Forwarded-Host`, `Origin` ou `Referer`); cabeçalho
  declarativo sozinho resolve como contexto não identificado. Vale igual
  para o `login-config`.
- `locale` é **preferência**, igual a `GET /auth/terms/current`: ausente ou
  fora do ar, a resposta cai no primeiro idioma disponível (espanhol
  paraguaio primeiro) e o campo `locale` do corpo diz qual veio.
- `200` com o **mesmo corpo** de `GET /auth/terms/current` (§10.3):

  ```jsonc
  {
    "editionPublicId": "…",
    "version": "2026-11-v1",
    "locale": "es-PY",
    "title": "…",
    "body": "…",
    "availableLocales": ["es-PY", "pt-BR"]
  }
  ```

- `404 { "code": "SIGNUP_NOT_AVAILABLE", "message": "El registro no está disponible para esta organización." }`
  quando o cadastro não está disponível, por qualquer motivo (inclusive
  organização não identificada ou termo retirado entre a checagem e a
  leitura). O corpo é o mesmo em todos os casos.
- Limite **(mudou em 2026-09-16)**: **15 000 leituras por hora por
  organização** — não mais por IP. Acima disso,
  `429 { "code": "AUTH_RATE_LIMITED", "retryAfter": 3600 }` com cabeçalho
  `Retry-After`. Esta rota **falha aberta**: se o controle de tentativas do
  servidor estiver fora do ar, o termo continua sendo lido normalmente (`200`).
  O app **não** precisa mais tratar `503 AUTH_RATE_LIMIT_UNAVAILABLE` aqui.
- `version` e `editionPublicId` recebidos aqui são os que a conclusão do
  cadastro vai conferir (§11.3, PR-02). O app não fixa versão nem edição.

#### `POST /auth/register` retirado

A rota antiga de registro local responde
`410 { "code": "AUTH_LEGACY_ROUTE_RETIRED" }`, salvo com a variável de
ambiente `AUTH_LEGACY_REGISTER_ENABLED=true` no servidor (desligada por
padrão). O app **não** usa essa rota: ela criava conta sem provar o e-mail e
sem termo. O cadastro de visitante é só pelas rotas `/auth/signup/*`.

### 11.2 Cadastro por e-mail e senha: `start`, `resend`, `verify` (PR-02)

Código de referência: `admin-api/src/database/auth/controllers/signup.controller.ts`
(rotas e limites), `dto/signup.dto.ts` (corpos),
`services/signup-email-verification.service.ts` (regras),
`services/signup-store.service.ts` (prazos) e `support/signup-errors.ts`
(códigos de erro).

**Regras comuns às três rotas:**

- Públicas, JSON puro, sem `Authorization`.
- Organização pelo tenant, com os mesmos cabeçalhos e a mesma exigência de
  sinal de topologia descritos no §11.1. Organização, canal ou identidade no
  corpo não existem: propriedade fora do corpo documentado é `400`.
- Toda chamada reavalia se o cadastro está disponível **e** se o método
  e-mail está ligado (`signup.methods.email`). Fora disso:
  `404 { "code": "SIGNUP_NOT_AVAILABLE" }`, mesmo corpo do §11.1.
- **Confirmação de senha é do app** (D-20): a tela pede a senha duas vezes,
  confere e bloqueia o envio se forem diferentes. A API recebe uma senha só
  e recusa com `400` um campo de confirmação no corpo.
- O idioma é escolha do visitante no seletor da tela: `es-PY` ou `pt-BR`. Não
  há padrão no servidor.
- `503 { "code": "AUTH_RATE_LIMIT_UNAVAILABLE" }` quando o controle de
  tentativas ou o estado temporário (Redis) não está disponível: erro
  temporário, permitir tentar de novo.

#### `POST /auth/signup/email/start`

```
POST {ADMIN_API}/auth/signup/email/start
Content-Type: application/json
Headers: tenant (§11.1)

{ "name": "Ana Benítez", "email": "ana@example.com", "password": "********", "locale": "pt-BR" }
```

- `name`: texto de 2 a 120 caracteres (espaços nas pontas são removidos).
- `email`: e-mail válido, até 254 caracteres; o servidor normaliza para
  minúsculas e sem espaços.
- `password`: 8 a 128 caracteres (mesmo mínimo do login local).
- `locale`: **obrigatório**, `es-PY` ou `pt-BR`. Ausente ou outro valor
  (`es`, `pt`, `en-US`, vazio) → `400`. Define o idioma do e-mail com o
  código.
- Resposta **sempre** `202`, com o mesmo formato, exista ou não conta com o
  e-mail, na mesma organização ou em outra:

  ```json
  { "signupId": "<43 caracteres [A-Za-z0-9_-]>", "expiresIn": 900, "resendAfter": 60 }
  ```

  `expiresIn` é a validade do pedido em segundos; `resendAfter` é o intervalo
  mínimo, em segundos, até o próximo `resend`. O app não deve inferir nada
  sobre a existência da conta a partir desta resposta: ela só aparece no
  `verify`.
- O e-mail chega com um código de 6 dígitos, válido por 15 minutos, sem link.
  Assunto e texto em espanhol para `es-PY` e em português para `pt-BR`.
- Erros: `400` (corpo inválido), `404 SIGNUP_NOT_AVAILABLE`,
  `429 AUTH_RATE_LIMITED` (mesmo correio, ver limites),
  `429 { "code": "SIGNUP_CAPACITY_REACHED", "retryAfter": 3600 }`
  (**novo em 2026-09-16**: a edição atingiu o teto de cadastros da hora ou do
  dia; cabeçalho `Retry-After`; nada a ver com o correio informado — o app
  mostra "intentá más tarde" e mantém o formulário),
  `503 AUTH_RATE_LIMIT_UNAVAILABLE`,
  `503 { "code": "SIGNUP_EMAIL_DELIVERY_FAILED" }` (o envio falhou; o pedido é
  descartado e o visitante pode tentar de novo).

#### `POST /auth/signup/email/resend`

```
POST {ADMIN_API}/auth/signup/email/resend
Content-Type: application/json
Headers: tenant (§11.1)

{ "signupId": "<signupId>", "locale": "es-PY" }
```

- `locale` é **opcional**: presente, o pedido passa a esse idioma e o e-mail
  novo sai nele (o visitante trocou o idioma na tela do código); ausente,
  mantém o idioma do pedido.
- Envia um código novo; o anterior deixa de valer. A validade do pedido volta
  a 15 minutos.
- `202` com o mesmo formato do `start` (mesmo `signupId`).
- Erros:
  - `400` (corpo inválido): `signupId` fora do formato de 43 caracteres ou
    `locale` fora de `es-PY`/`pt-BR`.
  - `429 { "code": "SIGNUP_RESEND_TOO_SOON", "retryAfter": <segundos> }` com
    cabeçalho `Retry-After`: menos de 60 s desde o último envio. Use o valor
    para a contagem regressiva do botão.
  - `429 { "code": "SIGNUP_RESEND_LIMIT_REACHED" }`: já houve 3 reenvios; o
    visitante recomeça o cadastro (esperar não resolve).
  - `410 { "code": "SIGNUP_EXPIRED" }`: pedido vencido, já usado, esgotado ou
    de outra organização. Voltar ao início do cadastro. "Esgotado" = as 5
    tentativas de código já foram gastas: o reenvio não manda código novo,
    descarta o pedido e responde `410` mesmo antes dos 60 s.
  - `429 SIGNUP_CAPACITY_REACHED` (**novo em 2026-09-16**): o reenvio também
    conta no teto de códigos da edição. O código anterior continua valendo —
    não descartar o pedido por causa deste erro.
  - `404 SIGNUP_NOT_AVAILABLE`, `503 AUTH_RATE_LIMIT_UNAVAILABLE`,
    `503 SIGNUP_EMAIL_DELIVERY_FAILED`.

#### `POST /auth/signup/email/verify`

```
POST {ADMIN_API}/auth/signup/email/verify
Content-Type: application/json
Headers: tenant (§11.1), X-Client-App: mobile

{ "signupId": "<signupId>", "code": "042917" }
```

- `code`: exatamente 6 dígitos (texto). Outro formato → `400` de validação,
  sem gastar tentativa.
- **No máximo 5 tentativas por pedido**, somando todos os códigos enviados
  (o reenvio não devolve tentativas). A sexta chamada responde `410
  SIGNUP_EXPIRED`, mesmo com o código certo, e o pedido é apagado.
- Código errado dentro do limite:
  `400 { "code": "SIGNUP_CODE_INVALID", "message": "El código no es correcto.", "attemptsRemaining": <0-4> }`.
- Código certo: o e-mail está provado e **só agora** o servidor diz se ele já
  tem dono. O pedido é consumido nos três casos:
  - sem conta → `200`:

    ```json
    { "signupTicket": "<43 caracteres [A-Za-z0-9_-]>", "expiresIn": 900, "profile": { "name": "Ana Benítez", "email": "ana@example.com" } }
    ```

  - conta na **mesma** organização, em qualquer estado (ativa, inativa,
    bloqueada, excluída ou com convite pendente) →
    `409 { "code": "ACCOUNT_ALREADY_EXISTS", "message": "Ya existe una cuenta con este correo. Iniciá sesión o recuperá tu contraseña. Si no podés entrar, contactá a la organización." }`;
  - conta em **outra** organização →
    `409 { "code": "ACCOUNT_ORGANIZATION_CONFLICT", "message": "Este correo ya está asociado a otra organización. No es posible crear una cuenta aquí." }`.
- `X-Client-App: mobile` fica registrado no bilhete como origem do pedido; não
  muda a resposta.
- O `signupTicket` é **segredo de uso único** (15 minutos): guardar só em
  memória até a tela do termo, nunca em log, URL ou armazenamento
  persistente.
- Outros erros: `410 SIGNUP_EXPIRED` (pedido vencido, consumido, esgotado ou
  de outra organização), `404 SIGNUP_NOT_AVAILABLE`,
  `503 AUTH_RATE_LIMIT_UNAVAILABLE`. **Desde 2026-09-16 esta rota não devolve
  mais `429`**: o único freio é o de 5 tentativas por pedido.

#### Limites de tentativa (constantes no código — revisados em 2026-09-16)

| Rota | Chave | Limite | Resposta |
|---|---|---|---|
| `terms` | organização | 15 000 por hora | `429 AUTH_RATE_LIMITED`, `retryAfter: 3600` (falha **aberta**: sem contador, responde `200`) |
| `email/start` | IP + organização + e-mail | 5 por 10 min | `429 AUTH_RATE_LIMITED`, `retryAfter: 600` + `Retry-After` |
| `email/start`, `email/resend` | edição (códigos enviados) | 1500 por hora e 6000 por dia | `429 SIGNUP_CAPACITY_REACHED`, `retryAfter: 3600` (máximo anunciado) + `Retry-After` |
| `email/resend` | pedido | 60 s entre envios, até 3 reenvios | `429 SIGNUP_RESEND_TOO_SOON` / `SIGNUP_RESEND_LIMIT_REACHED` |
| `email/verify` | pedido | 5 tentativas no total | `400 SIGNUP_CODE_INVALID`, depois `410 SIGNUP_EXPIRED` |
| `complete` | edição (contas criadas) | 1500 por hora e 6000 por dia | `429 SIGNUP_CAPACITY_REACHED`, `retryAfter: 3600` (máximo anunciado) + `Retry-After` |
| `cancel` | — | sem limite | — |

**O `retryAfter` nunca passa de 3600** (**desde 2026-09-16**). O teto diário
continua contando por um dia no servidor, mas a resposta não anuncia mais
`86400`: um "volte em 24 horas" faz o app fechar a tela e nunca mais tentar. O
número é uma orientação de quando vale a pena voltar — se o teto ainda estiver
de pé, a nova tentativa recebe o mesmo `429`.

**O que mudou e por quê.** Os limites puros por IP (`start` 20/10 min,
`verify` 30/10 min, `complete` e `cancel` 10/min, `terms` 60/min) foram
**removidos**. O `chat-web` chama o `admin-api` pelo servidor dele e não
repassa o endereço do visitante, então a feira inteira chegava ao servidor de
um endereço só: aqueles contadores eram um balde único do evento — não
continham abuso e bastavam ~20 requisições para fechar o cadastro para todo
mundo. Continuam de pé o limite por **IP + organização + e-mail** (que o
e-mail torna por pessoa) e os limites **por pedido**; entrou o teto **por
edição**, dimensionado para 12 mil visitantes em 3 dias com pico de mil por
hora.

**O que o app precisa fazer.** Tratar `SIGNUP_CAPACITY_REACHED` como erro
temporário do evento (não do usuário): mensagem neutra, botão para tentar de
novo, respeitando o `Retry-After`/`retryAfter`. Nunca sugerir que o correio, a
senha ou a conta têm algum problema. Em `terms`, não tratar mais `503` do
limitador.

### 11.3 Conclusão com aceite: `complete` e `cancel` (PR-02)

Código de referência: `admin-api/src/database/auth/services/signup-completion.service.ts`
e as rotas em `controllers/signup.controller.ts`.

A tela do termo mostra o texto de `GET /auth/signup/terms` (§11.1) no idioma
escolhido, com a caixa "Leí y acepto los términos de uso del evento.", a caixa
"Mantener sesión iniciada" (desmarcada) e os botões "Aceptar y crear mi
cuenta" e "No acepto" (textos finais do `chat-web`, conferidos em 2026-09-15;
em português: "Li e aceito os termos de uso do evento.", "Manter sessão
iniciada", "Aceitar e criar minha conta", "Não aceito"). **A conta só é criada em
`complete`.** Até lá nada existe em banco, e recusar não deixa rastro.

#### `POST /auth/signup/complete`

```
POST {ADMIN_API}/auth/signup/complete
Content-Type: application/json
Headers: tenant (§11.1), X-Client-App: mobile, X-Client-Platform: ios | android

{
  "signupTicket": "<signupTicket>",
  "editionPublicId": "<editionPublicId recebido em GET /auth/signup/terms>",
  "termsVersion": "<version recebido em GET /auth/signup/terms>",
  "locale": "pt-BR",
  "remember": false,
  "returnTo": "/"
}
```

- **Canal obrigatório pelos cabeçalhos** (mesma tabela do §10.5): app manda
  `X-Client-App: mobile` + `X-Client-Platform: ios|android` (grava `APP_IOS`
  ou `APP_ANDROID`); o `chat-web` manda `X-Client-App: chat` (`CHAT_WEB`).
  Sem canal resolvível →
  `400 { "code": "SIGNUP_CHANNEL_UNRESOLVED" }`, **antes** de consumir o
  bilhete: corrigir os cabeçalhos e repetir com o mesmo bilhete.
- `editionPublicId` e `termsVersion`: os valores que vieram com o texto
  mostrado. O app não fixa nem inventa esses valores.
- `locale`: **obrigatório**, `es-PY` ou `pt-BR` — o idioma do texto do termo
  que estava na tela no clique. Vai para o aceite e para o idioma do perfil
  (`es` ou `pt`), e prevalece sobre o idioma escolhido no início.
- `remember`: **obrigatório**, booleano, valor da caixa "Mantener sesión
  iniciada". Ausente → `400` (antes de consumir o bilhete). Mesma semântica do
  `remember` do login por senha.
- `returnTo`: opcional, mesmas regras do login.
- Sucesso `200`:

  ```json
  { "code": "<43 caracteres [A-Za-z0-9_-]>", "expiresIn": 60 }
  ```

  É o mesmo bridge do login por senha (válido por 60 s, uso único). Os
  nomes dos campos são `code`/`expiresIn`, e não `bridge_code`/`expires_in`
  como na resposta de `POST /auth/login`.
- O que o servidor grava: o aceite do termo (edição, versão, idioma, canal)
  e depois a conta — papel `user`, organização do evento, departamento
  "Visitante", e-mail verificado, idioma do termo aceito, conta de senha.
  Nenhum outro vínculo. Se a criação da conta falhar depois do aceite, o
  aceite é desfeito.
- Erros (em todos, nenhuma conta é criada):
  - `410 { "code": "SIGNUP_TICKET_INVALID" }`: bilhete inexistente, vencido,
    já usado (inclusive por uma chamada simultânea) ou de outra organização.
    Recomeçar o cadastro.
  - `409 { "code": "TERMS_VERSION_CHANGED" }`: a edição ou a versão do termo
    mudou desde a leitura. O bilhete já foi consumido: reler o termo não
    basta, o visitante recomeça o cadastro.
  - `409 ACCOUNT_ALREADY_EXISTS` / `409 ACCOUNT_ORGANIZATION_CONFLICT`: alguém
    criou a conta entre o `verify` e o `complete` (mesmas mensagens do §11.2).
  - `404 SIGNUP_NOT_AVAILABLE`: o cadastro deixou de estar disponível (por
    exemplo, o departamento "Visitante" foi desativado).
  - `429 { "code": "SIGNUP_CAPACITY_REACHED", "retryAfter": 3600 }`
    (**novo em 2026-09-16**): a edição atingiu o teto de contas da hora ou do
    dia. O bilhete já foi consumido: o visitante recomeça o cadastro mais
    tarde.
  - `400` (corpo ou canal), `503 AUTH_RATE_LIMIT_UNAVAILABLE`.

#### `POST /auth/signup/cancel`

```
POST {ADMIN_API}/auth/signup/cancel
Content-Type: application/json
Headers: tenant (§11.1)

{ "signupTicket": "<signupTicket>" }
```

- É o "No acepto": descarta o bilhete e **não grava nada**. Depois dele, o
  mesmo bilhete em `complete` responde `410 SIGNUP_TICKET_INVALID`.
- `204` sem corpo, exista ou não o bilhete (inclusive já cancelado ou
  vencido). O app volta à tela de login.
- Erros: `400` (bilhete fora do formato de 43 caracteres), `404
  SIGNUP_NOT_AVAILABLE`, `503 AUTH_RATE_LIMIT_UNAVAILABLE`. **Desde 2026-09-16
  esta rota não devolve mais `429`.**

#### Sequência completa no app, do cadastro à sessão

1. `GET /auth/login-config?client=chat` → oferecer "Crear cuenta" só com
   `signup.enabled === true` e `signup.methods.email === true` (§11.1).
   Regras de tela das etapas 2 a 6: §11.5.
2. Tela de cadastro com seletor de idioma: nome, e-mail, senha e confirmação
   conferida no app → `POST /auth/signup/email/start` com `locale` →
   guardar `signupId` em memória.
3. Tela do código: `POST /auth/signup/email/verify`; botão de reenviar
   habilitado após `resendAfter` → `POST /auth/signup/email/resend` (com o
   `locale` novo, se o visitante trocou). Tratar `SIGNUP_CODE_INVALID`
   (mostrar `attemptsRemaining`), `SIGNUP_EXPIRED` (recomeçar) e os `409`
   (mensagem + ir ao login).
4. Com o `signupTicket`: `GET /auth/signup/terms?locale=<idioma da tela>` →
   mostrar título e corpo em área rolável, a caixa "Mantener sesión
   iniciada" e os dois botões.
5. "No acepto" → `POST /auth/signup/cancel` → voltar ao login.
6. "Aceptar y crear mi cuenta" → `POST /auth/signup/complete` com os
   cabeçalhos de canal, `editionPublicId`, `termsVersion`, `locale` do texto
   exibido e `remember` → `{ code, expiresIn }`.
7. Trocar o código exatamente como no login (§4.1, passo 2):
   `POST /auth/bridge/exchange` com
   `{ "code": "<code>", "client": "chat", "organizationSlug": "<slug>" }` —
   aqui `client` é `chat`, como no login por senha do app.
8. Obter o Bearer como no §4.1, passo 3: `POST /auth/refresh` com
   `X-Client-App: chat` e os cookies recebidos no passo 7 → `access_token`.
9. `GET /auth/me` com o Bearer: a conta nova já vem com
   `eventTerms.required === false`, sem pedir o termo de novo.

### 11.4 Cadastro com Google (PR-03)

Código de referência: `admin-api/src/database/platform-auth/platform-google-oauth.service.ts`
(`completeCallbackRedirect`), `platform-google-identity.service.ts` (`resolve`),
`auth/services/signup-google.service.ts` e `auth/services/signup-completion.service.ts`.

> **Fluxo web (`chat-web`).** O app ainda não usa este caminho: ver a nota no
> fim desta seção e o §9.2.

O cadastro com Google é o mesmo fluxo do §11.3 com outra prova de identidade:
em vez de código por e-mail, o Google. **A conta continua nascendo só em
`complete`, depois do aceite.**

**Entrada:** o botão Google que já existe, sem nenhuma mudança:
`GET {ADMIN_API}/auth/oauth/google/start?client=chat&organizationSlug=<slug>&returnTo=<path>`,
numa organização com o Google da plataforma (§4.4).

**Volta do Google.** O `admin-api` decide o destino no servidor:

| Situação na volta do Google | Redirecionamento (302) |
|---|---|
| Conta Google ou e-mail já existentes na organização (login) | `<origem>/auth/bridge?code=<43 caracteres>&next=<returnTo>` — como antes |
| E-mail ou identidade Google de outra organização; usuário inativo, banido ou excluído; convite que não pode ser aceito | `<origem>/signin?error=ACCOUNT_ORGANIZATION_CONFLICT&returnTo=<returnTo>` — como antes |
| **Identidade nova**, `client=chat`, organização pedida, `signup.enabled` e `signup.methods.google` (§11.1) | **`<origem>/signup/terms?ticket=<signupTicket>`** — novo |
| Identidade nova fora disso (organização sem cadastro, contexto sem organização, `client=admin`, e-mail já existente com outra grafia de maiúsculas) | `<origem>/auth/access-status?code=<43 caracteres>` (pedido pendente de acesso) — como antes |
| Falha | `<origem>/signin?error=<CODE>&returnTo=<returnTo>` |

- `<origem>` é a origem web do chat da organização, gravada pelo servidor no
  `start` (`https://<slug>.aikuaa.ai` em produção). Não vem de nenhum
  parâmetro da volta do Google.
- `ticket` é o mesmo `signupTicket` do §11.2/§11.3: 43 caracteres
  `[A-Za-z0-9_-]`, **uso único, 15 minutos**, só vale na organização do
  login. É o **único** parâmetro da URL: o `returnTo` do `start` não é levado
  adiante (o `complete` aceita `returnTo` no corpo, §11.3). A tela tira o
  bilhete da URL no primeiro render.
- O servidor guarda no bilhete o e-mail verificado, o nome e a foto do
  Google. **Nenhum idioma:** o idioma é o `locale` do `complete`.
- Nenhum pedido pendente de acesso é criado para a identidade que vai para o
  cadastro. Um pedido pendente antigo da mesma identidade não impede o
  cadastro e não é alterado.
- Códigos de `error` no `/signin` por este caminho: os de antes
  (`ACCOUNT_ORGANIZATION_CONFLICT`, `OAUTH_IDENTITY_INVALID`,
  `AUTH_METHOD_DISABLED`, `PROVIDER_TOKEN_EXCHANGE_FAILED`,
  `OAUTH_TRANSACTION_INVALID`) e `AUTH_RATE_LIMIT_UNAVAILABLE` quando o
  bilhete não pôde ser gravado (Redis fora). Transação OAuth vencida ou já
  usada responde `400` (`OAUTH_TRANSACTION_EXPIRED` / `OAUTH_TRANSACTION_INVALID`)
  sem redirecionar, como antes.

**Tela do termo e conclusão:** exatamente o §11.3 com o `ticket` recebido —
`GET /auth/signup/terms?locale=`, "No acepto" → `POST /auth/signup/cancel`,
"Aceptar y crear mi cuenta" → `POST /auth/signup/complete` com os mesmos
campos, cabeçalhos de canal, respostas e erros. Com um bilhete do Google:

- a conta criada é `google` (sem senha): o visitante entra sempre com
  "Continuar con Google", que passa a ser login de identidade conhecida;
- credencial e foto do perfil ficam geridas pelo Google, como em qualquer
  conta Google da plataforma; papel `user`, organização do evento,
  departamento "Visitante" e idioma do `locale`, como no e-mail;
- `409 ACCOUNT_ALREADY_EXISTS` / `409 ACCOUNT_ORGANIZATION_CONFLICT` também
  quando a identidade Google foi vinculada a outra conta entre a volta do
  Google e o `complete`;
- `404 SIGNUP_NOT_AVAILABLE` também quando o Google da plataforma deixou de
  ser método de cadastro da organização nesse intervalo.

**App móvel:** este caminho não se aplica ainda. O `start` do Google da
plataforma só aceita `client=chat|admin` e a volta sempre cai na origem web do
chat; sem o universal link do SDD de login mobile, o bilhete chegaria ao
navegador e não ao app (§9.2). O app oferece só o cadastro por e-mail
(§11.2) e ignora `signup.methods.google`.

### 11.5 Regras de tela que o app repete (PR-04)

Referência: as telas do `chat-web` (branch `feat/f8-autoinscricao-visitante`,
commit `3eac011`), conferidas no navegador contra backend simulado em
2026-09-15. Código: `chat-web/src/components/auth/signup/` (`SignupForm.tsx`,
`SignupVerifyForm.tsx`, `SignupTermsForm.tsx`, `signupTexts.ts`) e
`src/lib/signupLocale.ts`. O `chat-web` fala com o `admin-api` por um BFF
(`/api/auth/signup/*`); **o app não usa o BFF** e chama as rotas do §11.2 e
do §11.3 direto (§1). O que se repete são as regras abaixo, não as rotas
internas do Next.

**1. Entrada no cadastro.** "Crear cuenta" só aparece com
`signup.enabled === true` e pelo menos um método ligado (§11.1). No app, que
só cadastra por e-mail: `signup.methods.email === true`. Sem isso, nenhuma
tela de cadastro.

**2. Seletor de idioma nas três telas** (Español / Português), sempre com os
dois botões, cada um com o nome no próprio idioma.

- Valor inicial: a escolha anterior guardada; sem ela, português quando o
  primeiro idioma do aparelho começa com `pt`; espanhol nos demais casos.
- A escolha vale para os textos das telas e para o `locale` enviado:
  `es` → `es-PY`, `pt` → `pt-BR`.
- `locale` vai no `start`; no `resend` **só quando o idioma mudou** desde o
  último e-mail enviado (ausente, o servidor mantém o do pedido); e no
  `complete`, com o idioma do **texto do termo exibido** — que é o `locale`
  devolvido por `GET /auth/signup/terms`, e não necessariamente o pedido
  (se a versão só existir no outro idioma, a tela avisa "Texto disponible
  en …" e o aceite registra o idioma que foi lido).
- O único dado do cadastro que o app pode persistir é esse idioma (o web usa
  `sessionStorage`, chave `aikuaa.signup.locale`, valores `es`/`pt`). Nome,
  e-mail, senha, `signupId` e bilhete nunca vão para armazenamento.

**3. Tela de cadastro.** Nome (2 a 120), e-mail (até 254), senha e
**confirmação de senha**, as duas com o botão de mostrar senha.

- Senha com menos de 8 caracteres: mensagem "La contraseña debe tener al
  menos 8 caracteres." / "A senha precisa ter pelo menos 8 caracteres." e
  nenhuma chamada.
- Senha e confirmação diferentes: os dois campos marcados em vermelho, "Las
  contraseñas no coinciden." / "As senhas não coincidem." abaixo da
  confirmação e **nenhuma chamada ao `start`**. Iguais: o `start` recebe uma
  senha só (a confirmação não existe na API, D-20).
- Botão "Continuar con Google" só no web (§9.2).
- **Botão "Cancelar"** (mesmo texto em es e pt), secundário, logo abaixo de
  "Continuar": volta ao login sem chamar nenhuma rota (acrescentado em
  2026-09-15 a pedido do usuário). A tela é mais alta que muitas janelas:
  ela precisa rolar (no web o layout de autenticação tem rolagem própria,
  porque o `body` global bloqueia a roda do mouse).

**4. Tela do código.** Seis casas em dois grupos de três, só dígitos.
Tem também "Cancelar" (volta ao login; o pedido pendente vence sozinho em
15 min) além de "Usar otro correo" (volta ao cadastro).

- No web é o `InputOTP` do shadcn (`inputMode="numeric"`,
  `autoComplete="one-time-code"`). No app, o equivalente nativo com
  autopreenchimento do código recebido por e-mail/SMS — em React Native,
  `textContentType="oneTimeCode"` no iOS e `autoComplete="sms-otp"` no
  Android (conferir na versão do RN usada) — com teclado numérico.
- Colar o código inteiro preenche as seis casas; espaços e hífens colados
  são descartados, letras são recusadas.
- **Envio automático** ao completar o sexto dígito (e botão "Verificar" para
  quem preferir).
- `SIGNUP_CODE_INVALID`: casas em vermelho e "Código incorrecto. Te quedan N
  intentos." / "Código incorreto. Restam N tentativas." (singular com 1).
  Com `attemptsRemaining: 0`, a tela trava o código e manda recomeçar — a
  próxima chamada seria `410`.
- Reenvio: contagem regressiva a partir de `resendAfter` (e de `retryAfter`
  no `429 SIGNUP_RESEND_TOO_SOON`); `SIGNUP_RESEND_LIMIT_REACHED` esconde o
  reenvio.
- `SIGNUP_EXPIRED`, `ACCOUNT_ALREADY_EXISTS`, `ACCOUNT_ORGANIZATION_CONFLICT`
  e `SIGNUP_NOT_AVAILABLE` encerram o pedido: mensagem e caminho para
  recomeçar ("Usar otro correo") ou para o login.
- O `signupTicket` do `verify` fica **só em memória** até o `complete` ou o
  `cancel`.

**5. Tela do termo.**

- Título, versão e corpo em área rolável, no idioma escolhido. Trocar o
  idioma relê o termo e **desmarca o consentimento**: ele se referia ao texto
  anterior.
- Caixa "Leí y acepto los términos de uso del evento." — o botão "Aceptar y
  crear mi cuenta" só habilita com ela marcada e com o texto carregado.
- Caixa **"Mantener sesión iniciada"**, desmarcada por padrão, enviada como
  `remember` (D-18).
- No caminho por e-mail a tela mostra "Vas a crear la cuenta de <e-mail>"
  com o `profile` do `verify`. Com bilhete do Google (só web) não há perfil e
  a linha não aparece.
- **"No acepto" chama `POST /auth/signup/cancel`** com o bilhete e volta ao
  login, sem sessão. Falha no `cancel` não prende o visitante (o bilhete
  vence sozinho).
- Recusas do `complete` que gastam o bilhete (`SIGNUP_TICKET_INVALID`,
  `TERMS_VERSION_CHANGED`, `SIGNUP_NOT_AVAILABLE`,
  `ACCOUNT_ORGANIZATION_CONFLICT`): mensagem e botões "Empezar de nuevo" e
  "Iniciar sesión", sem aceitar de novo. `ACCOUNT_ALREADY_EXISTS`: só
  "Iniciar sesión". Recusas temporárias (`AUTH_RATE_LIMITED`,
  `AUTH_RATE_LIMIT_UNAVAILABLE`, `SIGNUP_CHANNEL_UNRESOLVED`, rede) mantêm o
  bilhete e deixam tentar de novo.
- Sucesso: bridge → `bridge/exchange` → `refresh` → `/auth/me` (§11.3,
  passos 7 a 9). Se a conta foi criada mas a sessão não abriu (exchange
  recusado), a mensagem manda entrar pelo login — nunca refazer o cadastro.

**6. Bilhete fora da URL.** No web, a volta do Google chega em
`/signup/terms?ticket=…`: a tela lê o valor e **tira da URL no primeiro
render do cliente** (`history.replaceState`, hidratação) e guarda só em
memória; as rotas `/signup*` respondem com `Referrer-Policy: no-referrer`. O
HTML vindo do servidor ainda traz `?ticket=` na barra até a hidratação — em
rede lenta isso pode levar segundos — e o valor não fica em
`sessionStorage`/`localStorage`/cookie/log em nenhum momento. No app, quando
o universal link existir (§9.2), a regra é a mesma: ler o bilhete do link,
não registrar o link em log/analytics e não persistir o valor.

**7. Mensagens.** Toda recusa tem texto em espanhol e português, escolhido
pelo idioma da tela a partir do `code` — a `message` do servidor (sempre em
espanhol) não é mostrada. O catálogo completo, com a mesma lista de códigos
do §11.2/§11.3, está em `chat-web/src/components/auth/signup/signupTexts.ts`
(`SIGNUP_ERROR_MESSAGES`); a mensagem de conta existente é a literal do
D-17.

---

## 12. aiKuaa Events, Fase 9 — Mapa do stand

> Escopo novo desta fase (SDD [`docs/TODO/aiKuaa Events/fase 9 - Localizacao
> do Stand/README.md`](../TODO/aiKuaa%20Events/fase%209%20-%20Localizacao%20do%20Stand/README.md)).
> Fluxo em uma frase: a organização publica a planta de cada local, o staff
> marca no portal a área de cada stand, e o visitante vê o mapa com o stand
> destacado **só para expositor PREMIUM**, com a decisão sempre no servidor.
> Válido só para organização com `tenant.isEventOrganization === true`. Esta
> seção cresce com cada PR que muda contrato consumido pelo app: §12.1
> (PR-02, `admin-api`, conferida contra o código em 2026-09-15 e RELIDA em
> 2026-09-16, branch `feat/f9-mapa-do-stand`), §12.2 (PR-04, bloco de
> expositores e regras de tela, conferida em 2026-09-15 e RELIDA em
> 2026-09-16, mesma branch), §12.3 (PR-06, widget e anexos, escrita em
> 2026-09-16) e §12.4 (Fase 9.1, PR-01 do `admin-api`, branch
> `feat/logo-na-lista`, escrita em 2026-09-16: o logo do expositor no cartão
> da lista — campo novo no resumo e rota de assinatura em lote).
> **A PR-05 não abriu subseção**: ela entrega o mapa em WhatsApp
> e widget (recorte gerado no servidor, anexo da mensagem do widget e
> marcador `[Mapa del stand <rótulo>]` no inbox) e nenhuma dessas superfícies
> é consumida pelo app — a rota do recorte é interna (credencial
> `events-runtime`) e o anexo do widget é lido pelo cliente do widget na web.
> **No WhatsApp são DUAS mensagens entregues** (U-13): o texto sai primeiro,
> sozinho, e a imagem depois, em mensagem separada com legenda curta; o inbox
> continua com UMA mensagem gravada, de texto, sem `mediaUrl`. **Nada disto
> está em produção antes do merge e deploy** (runbook da fase, §3: são cinco
> branches inteiras, uma por repositório, e o `admin-api` sobe e estabiliza
> ANTES do `ai-api`, porque o `ai-api` novo manda `attachment` no turno do
> widget e um `admin-api` anterior recusa o corpo inteiro).
>
> Regras que valem para a fase inteira:
>
> - o app **nunca decide o plano** nem se o mapa existe: ele lê
>   `hasStandMap` e, quando `true`, busca a rota do mapa;
> - a URL assinada da imagem **nunca é guardada** em mensagem, metadado de
>   conversa ou histórico — o app busca o mapa ao exibir, também ao reabrir a
>   conversa;
> - falha do mapa (404, rede, link vencido que não renova) **não aparece
>   como erro**: a resposta em texto continua como hoje, sem imagem.

### 12.1 Presença do mapa e rota do mapa do stand (PR-02)

Código de referência (`admin-api`): `src/database/events/publication/published-catalog.contract.ts`
(`hasStandMap`, `PublishedStandMap`), `published-catalog.controller.ts`,
`published-stand-map.service.ts`, `services/stand-map.reader.ts` (as quatro
condições), `visitor/visitor-catalog.controller.ts` e
`floor-plan/floor-plan-image-link.service.ts` / `floor-plan-image-file.controller.ts`.

**1. `hasStandMap` na ficha e no catálogo publicado.** Campo `boolean`
acrescentado — nenhum campo existente mudou — em:

- `GET {ADMIN_API}/events/me/current-edition/published-catalog/:participationPublicId`
  (a ficha do visitante da §10.2, Bearer do app);
- `GET {ADMIN_API}/portal/editions/:editionPublicId/published-catalog` (cada
  item de `items[]`) e `.../published-catalog/:participationPublicId` —
  superfície do staff/revisor do portal e da credencial de máquina
  `events-runtime` (é por ela que o `mcp-server` lê); **não é rota do app**.

`hasStandMap` é `true` só quando as quatro condições valem, conferidas no
banco a cada leitura (SDD §5.5):

1. participação publicada (ficha no ar);
2. plano `PREMIUM`;
3. stand vinculado, ativo, com a área marcada inteira;
4. planta publicada, com imagem, no local desse stand.

Consequências para o app:

- ficha `BASIC` vem sempre com `hasStandMap: false` — mesmo que o stand tenha
  área marcada;
- o valor não é cacheado pelo servidor junto do documento da ficha: marcar a
  área, trocar o plano ou publicar a planta vale na leitura seguinte. O app
  **não deve** guardar o booleano por mais tempo que a própria ficha.

**2. Rota do mapa — a que o app usa.**

```
GET {ADMIN_API}/events/me/current-edition/published-catalog/:participationPublicId/stand-map
Authorization: Bearer <access_token>
```

- Autenticação: a **mesma da ficha** (§10.2): `JwtAuthGuard` do core, Bearer
  do app, sem BFF. A organização vem do token (relida no servidor) e a edição
  é a corrente da organização — o app não informa edição em lugar nenhum.
- Sem parâmetros de query. Qualquer parâmetro (inclusive `editionPublicId`) é
  **400**.
- Só chamar quando a ficha (ou o bloco de expositores, §12.2) disser
  `hasStandMap: true`.

Resposta **200**:

```jsonc
{
  "imageUrl": "/portal/media/floor-plans/7b0e…?token=eyJ…", // CAMINHO relativo ao admin-api
  "expiresAt": "2026-11-11T13:02:00.000Z",                 // ISO 8601; 120 s após a assinatura
  "imageWidth": 3508,                                       // pixels da imagem
  "imageHeight": 2481,
  "area": { "x": 0.402, "y": 0.301, "width": 0.03, "height": 0.025 },
  "standLabel": "75"                                        // número do stand como cadastrado
}
```

- `area` é **proporção da imagem, de 0 a 1**: canto superior esquerdo (`x`,
  `y`) e tamanho (`width`, `height`). Em pixels da imagem:
  `left = x × imageWidth`, `top = y × imageHeight`,
  `w = width × imageWidth`, `h = height × imageHeight`. Nunca vem pixel.
- `standLabel` é o texto do marcador (ex.: `75`, `58–61`); o setor não entra.
- A resposta não carrega chave de armazenamento, nome de bucket nem URL do
  R2 — só o caminho assinado do próprio `admin-api`.

Erros:

| Status | Quando | Corpo |
|---|---|---|
| `401` | sem Bearer ou sessão inválida | o 401 padrão do `JwtAuthGuard` (§4.2) |
| `400` | `:participationPublicId` não é UUID, ou query com qualquer parâmetro | erro do `ValidationPipe` |
| `404` | **toda** recusa do mapa: participação de outra edição ou de outra organização, ficha fora do ar, plano `BASIC`, sem stand, sem área, local sem planta publicada, organização sem edição corrente | `{ "statusCode": 404, "code": "STAND_MAP_NOT_AVAILABLE", "message": "…" }` — sempre os mesmos três campos, sem identificador |

O 404 não distingue os casos de propósito: o app trata todos igual (sem
mapa, sem mensagem de erro) e não tenta descobrir o motivo.

**3. A imagem e a validade do link.**

```
GET {ADMIN_API}{imageUrl}
```

- `imageUrl` é **caminho**, não URL absoluta: prefixar com a mesma base do
  `admin-api` que o app já usa (mesma regra de `signedUrl` da §10.2).
- Não precisa de Bearer: quem autoriza é o `token` da query (como a mídia da
  ficha). Resposta `200` com `Content-Type: image/webp`,
  `X-Content-Type-Options: nosniff` e `Cache-Control: private, max-age=120`.
- Validade: **120 segundos** a partir da assinatura (`expiresAt`). Vencido,
  **refazer a chamada da rota `stand-map`** — não existe renovação isolada do
  link. Link vencido, adulterado ou de outra planta responde `404`
  `EVENTS_FLOOR_PLAN_IMAGE_LINK_INVALID`.
- Guardar a imagem no aparelho (SDD §5.6) é permitido e recomendado: a
  **chave do cache é o caminho sem a query** (`/portal/media/floor-plans/<id>`),
  e não a URL inteira — o `token` muda a cada chamada, o `<id>` só muda quando
  a organização publica uma planta nova. Assim a imagem (≈ 150 KB na planta
  da Expo) é baixada uma vez por versão, e a área continua vindo sempre da
  rota `stand-map`, nunca do cache.
- A mesma imagem serve todos os stands do local; o destaque (área, entorno
  esmaecido, rótulo) é desenhado pelo app sobre ela. Regras de desenho, zoom e
  gestos entram na §12.2.

**4. Rota equivalente do portal (não é do app).**

```
GET {ADMIN_API}/portal/editions/:editionPublicId/published-catalog/:participationPublicId/stand-map
```

Mesma resposta, mesmo `404 STAND_MAP_NOT_AVAILABLE`, mesmos guards da ficha
publicada do portal: sessão do portal (`EVENT_STAFF` ou `AIKUAA_REVIEWER` da
edição, `ADMIN`) ou a credencial de máquina `events-runtime` (`X-API-Key`),
sempre só `GET` e com a edição no caminho. Existe para o staff e para os
serviços internos (`mcp-server`, `ai-api` no WhatsApp e no widget, PR-05). O
app nunca recebe chave de máquina.

### 12.2 `has_stand_map` no bloco de expositores e regras de tela (PR-04)

Código de referência: `mcp-server/src/tools/event_exhibitors_tool.py`
(`_project_location`), `ai-api/src/services/exhibitor_results.py`
(`_identity_and_place`) e, no `chat-web`, `src/types/standMap.ts`,
`src/components/chat/exhibitors/useStandMap.ts`, `StandMapView.tsx`,
`StandMapCard.tsx` e `standMapGeometry.ts`.

**1. O campo novo no bloco: `has_stand_map`.**

O evento `CUSTOM name="exhibitor_results"` (§10.1) ganha **um único campo**,
em cada item de `items[]`:

```jsonc
{
  "participation_public_id": "…",
  "plan": "PREMIUM",
  "sector": "Calle B", "stand_number": "75",
  "stand_location": "Sector B, stand 75",
  "has_stand": true,
  "has_stand_map": true   // ← Fase 9; sempre booleano, nos dois planos
}
```

- **Sempre booleano**, nunca ausente e nunca `null` — ao contrário das seis
  chaves só-PREMIUM, `has_stand_map` sai também no item `BASIC` (lá é sempre
  `false`). Um app antigo que ignore o campo continua funcionando, sem mapa.
- **Não é opinião do cliente**: o valor vem do `admin-api`, resolvido a cada
  leitura pelas quatro condições do §12.1. O app **nunca** decide por plano,
  por `has_stand` ou por qualquer outra pista.
- `has_stand_map: true` com `has_stand: false` não acontece hoje (uma das
  condições é ter stand vinculado), mas se acontecer, vale o `has_stand_map`:
  ele é o que diz se a rota do mapa vai responder.
- O bloco **continua sem nenhuma URL**: nem a imagem, nem o link assinado, nem
  a área. Nada disso entra em `message_meta` (D-08).
- Nenhum outro campo do envelope mudou, nem a ordem dos eventos do run.

**2. Quando buscar a rota do mapa.**

Rota, autenticação e corpo: §12.1 (`GET {ADMIN_API}/events/me/current-edition/
published-catalog/:participation/stand-map`, Bearer do app, sem query).
Quando chamar:

- **ao exibir** o card/ficha daquele expositor com `has_stand_map: true`
  (ou, se a tela abre o mapa sob demanda, no gesto que o abre);
- **de novo ao reabrir a conversa**: a rehidratação de
  `message.metadata.exhibitorResults` traz o booleano, nunca o link — o app
  refaz a chamada, como o `chat-web` faz;
- **de novo antes de usar a imagem quando `expiresAt` já passou** (o link vale
  120 s). Não existe renovação isolada do link: refaz-se a rota inteira. O
  `chat-web` faz isso em dois pontos — antes de abrir a tela cheia e quando o
  carregamento da imagem falha (uma única retentativa por endereço, nunca em
  laço).

Nunca chamar: com `has_stand_map: false`, por expositor sem stand, "por
garantia" em lista (a rota é por participação, uma chamada por card aberto) ou
para pré-carregar todos os resultados de uma busca.

**3. Regras de tela (o que o `chat-web` faz, e o app deve espelhar).**

- Card expandido de um expositor com mapa: o mapa aparece **dentro do card**,
  abaixo da descrição, com cabeçalho (nome + linha do stand) e um rodapé de
  ajuda. Sem mapa, o card é exatamente o da Fase 6.
- **"Cómo llegar al stand"**: com mapa, abre o mapa (no `chat-web`, em tela
  cheia); sem mapa, mantém o texto de hoje — a linha do stand mais
  *"Todavía no hay plano del predio: buscá la señalización del sector y el
  número del stand en la feria."*
- Desenho do destaque: a imagem é a planta inteira do local; o stand é o
  retângulo `area` (proporção 0–1 × `imageWidth`/`imageHeight`), com **borda
  marcada, entorno esmaecido e um marcador** com o texto
  `"<empresa> · <standLabel>"` (`standLabel` da resposta do mapa, não o
  `stand_number` do bloco — os dois podem divergir até a próxima publicação).
  Sem `standLabel`, o marcador fica só com o nome da empresa.
- **Zoom inicial enquadrando o stand, com o entorno visível** — não é ajuste
  da planta inteira nem zoom máximo: o `chat-web` calcula a escala em que o
  retângulo ocupa ~12 % da menor dimensão do visor, limitada entre "imagem
  inteira" e 2,4×. Gestos: arrastar para mover, pinça (no app) ou +/− para
  aproximar, um botão "volver al stand" que refaz o enquadramento inicial, e
  tela cheia.
- A **borda e o marcador são desenhados em pixels de tela**, não escalados com
  a imagem: com zoom afastado uma borda escalada some.
- **Falha do mapa nunca vira erro**: `404`, rede fora ou corpo inesperado
  deixam a tela igual à de um expositor sem mapa. Nada de alerta, nada de
  "reintentar" — a resposta em texto do agente já está na tela.
- O agente **não descreve o mapa** quando `has_stand_map` é verdadeiro (a
  descrição da tool orienta o modelo a dizer só sector e stand): a tela é que
  mostra o lugar. Não montar texto adicional do tipo "abre o mapa abaixo".

**4. Cache da imagem no aparelho.**

Repete o §12.1 porque é aqui que ele se aplica: guardar a imagem por
**caminho sem a query** (`/portal/media/floor-plans/<floorPlanPublicId>`), que
só muda quando a organização publica uma planta nova; o `token` muda a cada
chamada e não pode entrar na chave. A **área e o rótulo vêm sempre da rota**,
nunca do cache — o staff pode ter movido o retângulo desde a última visita. A
planta da Expo tem ~150 KB em WebP: uma vez por versão, por aparelho.

### 12.3 Widget, anexos de mensagem e o que o app faria com eles (PR-06)

> **O app não consome nada desta subseção hoje.** Ela existe por duas razões:
> (1) se um dia o app exibir o widget embutido, ou receber mensagens com
> anexo, este é o contrato exato; (2) a releitura do §12 precisa registrar o
> que as PR-05 e PR-06 acrescentaram sem inventar superfície nova para o app.
> Código de referência: `admin-api` `src/database/widget-runtime/widget-stand-map-attachment.ts`
> e `src/database/events/floor-plan/stand-map-crop-{link.service,file.controller}.ts`;
> `chat-web` `src/lib/widget/widgetStandMapAttachment.ts`,
> `src/app/api/widget/v1/assets/stand-map/route.ts` e `src/lib/widget/widgetClient.ts`.

**1. O que muda no widget (superfície WEB, não do app).** A mensagem do
assistente que levou mapa passa a carregar um anexo nas DUAS leituras do
visitante — `POST internal/widget/sessions/bootstrap` (campo `history[]`) e
`GET internal/widget/conversations/:id/messages/recent` (campo `messages[]`):

```jsonc
{
  "publicId": "…", "role": "assistant", "senderSource": "ai",
  "content": "[Mapa del stand 75]\niTAG está en Calle B, stand 75.",
  "attachment": {
    "kind": "stand_map",
    "standLabel": "75",
    "imageUrl": "/portal/media/stand-map-crops/<participationPublicId>?token=…",
    "expiresAt": "2026-11-11T13:02:00.000Z"
  }
}
```

- **Mensagem sem mapa não traz o campo** — é ausência, não `null`. Um cliente
  antigo que ignore `attachment` continua funcionando, mostrando só o texto.
- `imageUrl` é **caminho no `admin-api`**, como todo enlace assinado desta
  fase, e vale **120 s**. Ele **nunca é gravado**: a coluna `attachment` da
  mensagem guarda só identificadores públicos e o rótulo; a URL é assinada de
  novo a cada leitura. Reabrir a conversa devolve outro enlace.
- A imagem é o **recorte** (JPEG), com o stand já destacado no laranja
  canônico DENTRO do arquivo — não há área para calcular, nem canvas, nem
  zoom: é imagem estática.
- O cliente do widget na web **não carrega a imagem direto do `admin-api`**:
  o iframe roda sob `img-src 'self'` e a imagem passa por uma rota do próprio
  `chat-web` (`GET /api/widget/v1/assets/stand-map?participation=…&token=…`),
  que repassa os bytes. Um app nativo não tem essa restrição e poderia
  carregar o caminho do `admin-api` diretamente, como já faz com a mídia da
  ficha (§10.2).

**2. O marcador de texto, e por que ele existe.** O `content` da mesma
mensagem começa com `[Mapa del stand <rótulo>]` seguido de `\n` e do texto da
resposta (D-10). Ele é **linguagem do inbox do operador** (portal e admin-web
só leem `content` e não ganham miniatura). Quem desenha a imagem deve
escondê-lo, e **só pelo marcador exato daquela mensagem** — colchetes de
qualquer outro texto do assistente (`[Horario]`, `[Ticketop](https://…)`)
ficam intactos. Regra que o `chat-web` aplica: retirar o prefixo apenas
quando ele é `"[Mapa del stand " + standLabel + "]"` do próprio anexo.

**3. Renovação, falha e o que nunca acontece.**

- O enlace vence em 120 s. Quando a imagem falha ao carregar, o cliente
  **relê a mensagem** (uma única vez, nunca em laço) e usa o enlace novo; se
  falhar de novo, **a imagem some e o texto permanece inteiro** (D-09).
- Qualquer recusa da rota do recorte é o mesmo `404`
  (`EVENTS_STAND_MAP_CROP_LINK_INVALID`): enlace vencido, participação que
  perdeu o mapa, plano rebaixado. O gate do §5.5 é reaplicado a cada leitura
  — um expositor rebaixado a básico deixa de servir a imagem no mesmo
  instante, mesmo com enlace válido no bolso.
- **Nada é persistido**: nem `imageUrl`, nem `expiresAt`, em `localStorage`,
  `sessionStorage` ou equivalente do app. Um enlace guardado estaria morto na
  releitura, que é exatamente o cenário de reabrir a conversa.
- O enlace muda a cada leitura (o polling do widget assina outro a cada 3 s).
  Um cliente que compare mensagens por igualdade textual precisa **ignorar
  `imageUrl` e `expiresAt` nessa comparação**, ou repintará a conversa (e
  rebaixará a imagem) a cada consulta. O `chat-web` compara o anexo só por
  `kind` e `standLabel`.

**4. WhatsApp (contexto, não é superfície do app).** O mesmo recorte é
enviado como imagem, em **duas mensagens** (U-13): o texto primeiro, sozinho,
e a imagem depois, com legenda curta (`iTAG · Calle B, stand 75`). O inbox
grava UMA mensagem, de texto, com `messageType = text`, sem `mediaUrl`, e o
marcador só quando a imagem saiu de fato.

**5. Regras de tela, se o app um dia mostrar o anexo.**

- imagem **acima** do texto da resposta, com texto alternativo do tipo
  *"Mapa del predio con el stand 75 marcado"* e uma legenda curta com o
  rótulo;
- toque abre a mesma imagem maior; nada de zoom por gesto ou arrasto — o
  recorte já vem enquadrado (diferente do mapa do card da §12.2, que é a
  planta inteira e por isso tem zoom e arrasto);
- realce de UI ao redor da imagem usa o **mesmo laranja** do destaque
  (`#e4572e` no tema claro, `#f0683f` no escuro) — é a cor que o servidor
  desenhou dentro do JPEG;
- textos em **espanhol** (canal), como todo o resto do widget e do WhatsApp.



### 12.4 Logo do expositor no cartão da lista — `logoAssetPublicId` e a assinatura em lote (Fase 9.1, PR-01 `admin-api`)

> **Escrita contra o código em 2026-09-16** (`admin-api`, branch
> `feat/logo-na-lista`, **não mergeada**). Esta é a primeira etapa de uma
> mudança que atravessa `admin-api` → `mcp-server` → `ai-api` → `chat-web`:
> até ela, o logo do expositor PREMIUM só aparecia na ficha, e não no cartão
> compacto do bloco de expositores, porque o resumo do catálogo publicado não
> projetava nada de `media[]`. **O campo no bloco (`exhibitor_results`) e as
> regras de tela estão no §12.5**, escrito contra o código das outras três
> etapas (`mcp-server`, `ai-api` e `chat-web` em `feat/ficha-premium-unica`,
> também não mergeadas).

Código de referência (`admin-api`): `src/database/events/publication/published-catalog.contract.ts`
(`logoAssetPublicId`, `PublishedLogoLink`), `published-catalog.projection.ts`,
`published-catalog.service.ts` (`listPublishedLogos`),
`visitor/visitor-catalog.controller.ts` e
`visitor/dto/list-published-logos.dto.ts`.

**1. `logoAssetPublicId` no resumo e na ficha.** Campo `string | null`
acrescentado — nenhum campo existente mudou — ao resumo do catálogo publicado
e, por herança, à ficha:

- `GET {ADMIN_API}/events/me/current-edition/published-catalog/:participationPublicId`
  (ficha do visitante, §10.2/§12.1);
- `GET {ADMIN_API}/portal/editions/:editionPublicId/published-catalog` (cada
  item de `items[]`, inclusive na leitura por `?ids=`) e
  `.../published-catalog/:participationPublicId` — superfície do staff e da
  credencial de máquina `events-runtime` (é por ela que o `mcp-server` lê);
  **não é rota do app**.

É o **`publicId` do asset `LOGO`**, nunca uma URL: o resumo é cacheado no
servidor e um enlace de 120 s dentro dele voltaria vencido para o próximo
leitor. `null` quando a ficha não tem logo — e aí não há o que pedir. O
expositor tem no máximo um logo (slot único no portal).

**2. A rota que assina os logos do bloco — em LOTE.**

```
POST {ADMIN_API}/events/me/current-edition/published-catalog/logos
Authorization: Bearer <access_token>
Content-Type: application/json
```

Corpo:

```jsonc
{
  "participationPublicIds": ["8f2c…", "b1a7…"]   // UUID v4; até 40; lista vazia é válida
}
```

Resposta **200** (é `POST` por causa do corpo, mas é leitura — nada é criado):

```jsonc
{
  "items": [
    {
      "participationPublicId": "8f2c…",
      "signedUrl": "/portal/media/files/3d9e…?token=eyJ…",  // CAMINHO relativo ao admin-api
      "expiresAt": "2026-11-11T13:02:00.000Z"               // ISO 8601; 120 s após a assinatura
    }
  ]
}
```

- Autenticação e escopo: **os mesmos da ficha** (§10.2). A organização vem do
  token (relida no servidor a cada chamada) e a edição é a corrente dela — o
  app **não informa edição, organização nem usuário** em lugar nenhum; tentar
  mandá-los no corpo é `400`.
- **`items` traz só o que pode ser exibido.** Participação inexistente, de
  outra edição, não publicada ou sem logo **simplesmente não aparece** — sem
  erro e sem distinção entre os casos. O app casa a resposta por
  `participationPublicId` e desenha o cartão sem logo para quem não voltou.
- A ordem de `items` é a do pedido; id repetido volta uma vez só.
- **Uma chamada por bloco, não uma por expositor**: o bloco compacto mostra
  até 5 destaques e o painel "Ver todos" mostra o bloco inteiro — tudo cabe no
  teto de 40, que é o mesmo da leitura de fichas por `?ids=`.
- A resposta não carrega chave de armazenamento, nome de bucket nem URL do R2
  — só o caminho assinado do próprio `admin-api`, servido por
  `GET {ADMIN_API}/portal/media/files/:assetPublicId?token=…`.
- Sem edição corrente (organização que não é de evento, duas feiras vivas) a
  resposta é **`{"items": []}` com 200**, e não 404: a rota responde "destas,
  quais posso exibir".

Erros:

| Status | Quando | Corpo |
|---|---|---|
| `401` | sem Bearer ou sessão inválida | o 401 padrão do `JwtAuthGuard` (§4.2) |
| `400` | `participationPublicIds` ausente, não-lista, com elemento que não é UUID, acima de **40** elementos, ou qualquer propriedade extra no corpo | erro do `ValidationPipe`, mensagem em espanhol |

Não existe `404` nesta rota.

**3. Regra de não persistir o enlace (D-08 da Fase 9, vale igual aqui).**

- o `signedUrl` **nunca** é guardado em mensagem, `message_meta`, metadado de
  conversa ou histórico — o que a conversa carrega é o identificador do
  expositor (e, quando o bloco passar a trazê-lo, o `logoAssetPublicId`);
- o app chama esta rota **ao exibir** o bloco e **de novo ao reabrir a
  conversa**, com os ids do bloco rehidratado;
- **de novo antes de usar a imagem quando `expiresAt` já passou** (120 s). Não
  há renovação isolada do enlace: refaz-se a chamada do lote;
- **falha nunca vira erro de tela**: `400`, `401` tratado pelo fluxo de sessão,
  rede fora ou item ausente deixam o cartão exatamente como é hoje, sem logo.
  Nada de alerta e nada de "reintentar".

**4. Cache da imagem no aparelho.** Mesma regra do mapa (§12.1/§12.2): guardar
por **caminho sem a query** (`/portal/media/files/<assetPublicId>`), que só
muda quando o expositor troca o logo e republica; o `token` muda a cada chamada
e não pode entrar na chave.

### 12.5 `logo_asset_public_id` no bloco de expositores e regras de tela (Fase 9.1, `mcp-server` + `ai-api` + `chat-web`)

> Escrita contra o código em 2026-09-16 (`mcp-server`, `ai-api` e `chat-web`
> na branch `feat/ficha-premium-unica`, **não mergeadas**). A rota em lote que
> assina os logos está no §12.4 — aqui está o que o bloco passa a carregar e o
> que a tela faz com isso.

Código de referência: `mcp-server/src/tools/event_exhibitors_tool.py`
(`_project_card`), `ai-api/src/services/exhibitor_results.py`
(`_identity_and_place`, `_logo_from_media`, `project_card`) e, no `chat-web`,
`src/types/exhibitorResults.ts`, `src/types/exhibitorLogos.ts`,
`src/services/eventsApi.ts` (`fetchExhibitorLogos`),
`src/app/api/events/exhibitors/logos/route.ts`,
`src/components/chat/exhibitors/useExhibitorLogos.ts` e
`ExhibitorPremiumCard.tsx`.

**1. O campo novo no bloco: `logo_asset_public_id`.**

O evento `CUSTOM name="exhibitor_results"` (§10.1) ganha **um único campo**, em
cada item de `items[]`:

```jsonc
{
  "participation_public_id": "…",
  "plan": "PREMIUM",
  "company_name": "Solar Guaraní",
  "has_logo": null,                     // medição; continua nula no bloco de busca
  "logo_asset_public_id": "3d9e…"       // ← Fase 9.1; identidade do asset, ou null
}
```

- **Sempre presente**, com valor `null` quando não há logo — nunca ausente.
  Ausência de chave diria "bloco anterior a esta fase", e o cliente precisa
  distinguir as duas coisas. Sai também no item `BASIC` (lá é sempre `null`):
  não é corte de plano.
- **É identidade, nunca URL.** O que ele dá é o direito de *pedir* a
  assinatura (§12.4); o enlace de 120 s não entra no bloco nem em
  `message_meta` (D-08).
- **Não confundir com `has_logo`**, que é medição e continua `null` em bloco de
  busca (§10.1). Quem decide se o cartão pede logo é `logo_asset_public_id`.
- Vale nas três tools que produzem bloco: `search_exhibitors`,
  `get_exhibitor_details` (o `ai-api` deriva o campo do asset `LOGO` de
  `media[]`) e `search_exhibitors_semantic`.
- Forma inesperada (número, objeto, texto vazio) **lê-se como ausência**: o
  item continua de pé, só não pede assinatura nenhuma. É a mesma regra de
  `has_stand_map`.
- Nenhum outro campo do envelope mudou, nem a ordem dos eventos do run. App
  antigo que ignore a chave continua funcionando, com o monograma de hoje.

**2. Quando chamar a rota em lote (§12.4).**

- **uma chamada por BLOCO**, montada com os
  `participation_public_id` dos itens que (a) desenhariam cartão de destaque
  (`plan: "PREMIUM"`) e (b) têm `logo_asset_public_id` não nulo. **Nunca uma
  chamada por cartão**;
- **o pedido cobre o bloco inteiro**, não só os destaques visíveis: o painel
  "Ver todos" desenha os mesmos itens e **reaproveita o mesmo resultado**, sem
  uma segunda chamada. Os dois tetos são o mesmo 40;
- **ao exibir** o bloco e **de novo ao reabrir a conversa**: a rehidratação de
  `message.metadata.exhibitorResults` traz só o identificador;
- **de novo quando `expiresAt` já passou** (120 s) — no `chat-web`, antes de o
  painel "Ver todos" redesenhar os cartões. Não existe renovação isolada do
  enlace: refaz-se a chamada do lote. Data ilegível conta como vencida;
- **nunca**: bloco em que nenhum item tem `logo_asset_public_id` (não gasta
  chamada), item `BASIC` (vira linha de texto, sem logo), e nunca em laço de
  fundo com temporizador.

**3. Regras de tela (o que o `chat-web` faz, e o app deve espelhar).**

- Cartão compacto de destaque: o logo ocupa **a mesma caixa do monograma**
  (56 px no `chat-web`), com fundo neutro, borda e a imagem **contida**
  (`object-fit: contain`) — logo não é foto: nada de recorte, de distorção nem
  de ampliação além do tamanho natural. Numa lista mista, cartão com logo e
  cartão sem logo ocupam exatamente o mesmo espaço; **o resto do cartão não
  muda**.
- **Sem logo é o estado normal, não um erro**: expositor sem logo, item que não
  voltou no lote, chamada que falhou e imagem que não carregou caem todos no
  **monograma de iniciais** — sem alerta, sem "reintentar" e sem espaço
  reservado piscando.
- A imagem do logo é **decorativa** (`alt` vazio / sem rótulo acessível): o
  nome da empresa já é o texto do próprio cartão, e repeti-lo faria o leitor de
  tela dizer o nome duas vezes dentro do mesmo botão.
- **Resultado único premium**: quando o bloco tem um só destaque, a tela mostra
  a ficha inteira, e o logo vem da **mídia da própria ficha** (§10.2) — não se
  pede o lote nesse caso, para não assinar o mesmo asset duas vezes.
- O enlace assinado **não vai para log nenhum** (nem de rede, nem de erro):
  ele é credencial de leitura com 120 s de vida.

**4. Cache da imagem no aparelho.** Igual ao §12.4: chave pelo **caminho sem a
query** (`/portal/media/files/<assetPublicId>`), nunca com o `token`. O logo de
um expositor só muda quando ele republica a ficha.
