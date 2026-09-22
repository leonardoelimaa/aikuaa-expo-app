# Pacote de início — app móvel aiKuaa

**Para:** equipe de desenvolvimento do aplicativo móvel.
**Escrito em:** 2026-09-20, conferido contra o código e contra a configuração de
produção no Railway.

Este é o ponto de entrada. Leia esta página inteira antes de abrir qualquer
outra, e comece pelo **§4A — os primeiros cinco passos**.

> **Nota sobre links.** Este pacote e o guia citam documentos internos do
> aiKuaa em `docs/TODO/…` (SDDs, propostas, auditorias). Esses arquivos **não
> fazem parte da entrega para a equipe do app** e os links para eles não
> resolvem aqui — são rastro de decisão, não contrato. Tudo o que vocês
> precisam para construir está neste pacote, no guia e nos dois arquivos
> OpenAPI. Se algum deles for necessário para entender um contrato, isso é um
> defeito do guia: reportem.

---

## 1. O escopo, nas palavras de quem pediu

> Usuários do app entram na aplicação validando a organização — por QR code ou
> digitando —, fazem login, enviam perguntas ao `ai-api`, recebem as respostas e
> veem o histórico de conversas, como o `chat-web` hoje, só que com interface
> móvel. E os logs precisam registrar de onde veio o turno: `chat-web`,
> `widget`, `whatsapp` ou `mobile`.

## 2. Resposta curta: dá para começar hoje

**Os seis itens já existem e estão em produção.** Nenhum backend novo é
necessário para o aplicativo funcionar de ponta a ponta.

| # | O que o escopo pede | Existe? | Como |
|---|---|---|---|
| 1 | Validar a organização por QR | **Sim, sem backend** | O QR carrega `https://<slug>.aikuaa.ai`; o app extrai o slug. Nada a construir do lado do servidor — §3.4 do guia |
| 2 | Validar digitando | **Sim** | Mesma normalização do `chat-web`; o usuário digita `expo.aikuaa.ai` ou só `expo` — §3.1 |
| 3 | Login | **Sim** | Pelo BFF do `chat-web` (§1.1, caminho A) — nenhuma mudança de servidor |
| 4 | Enviar pergunta e receber resposta | **Sim** | `POST /py/api/agent/run`, SSE — contrato completo no §5.1 |
| 5 | Histórico de conversas | **Sim** | `GET /py/api/threads/*` — contrato completo no §5.6 |
| 6 | **Canal nos logs** | **Sim** | Entregue e **em produção desde 2026-09-20** (`ai-api` v1.41.0). O app só precisa mandar dois cabeçalhos — §4 |

**Cadastro de conta** entra junto quando a organização permitir (§0.4 e §11 do
guia) — também já existe, e também sem backend novo.

## 3. O caminho recomendado para o MVP

O `chat-web` expõe um BFF de autenticação completo. Um app nativo consegue
usá-lo, e isso **contorna o único bloqueador de infraestrutura** que existia
(§9.0 do guia).

```
1. Descobrir a organização        QR ou digitação  →  slug (ex.: "expo")
2. Login                          POST https://<slug>.aikuaa.ai/api/auth/login
                                  Origin: https://<slug>.aikuaa.ai
                                  { email, password, remember }
                                  → Set-Cookie (guardar com @react-native-cookies/cookies)
3. Perfil e capacidades           GET  https://api.aikuaa.ai/auth/me
4. Catálogo de modelos            GET  https://api.aikuaa.ai/db/llm-organization/organization/:id
5. Perguntar                      POST https://api.aikuaa.ai/py/api/agent/run   (SSE)
6. Histórico                      GET  https://api.aikuaa.ai/py/api/threads/
```

**Por que os cookies do passo 2 funcionam nos passos 3 a 6:** confirmado no
Railway em 2026-09-20 que `AUTH_COOKIE_DOMAIN = .aikuaa.ai` em produção. O
cookie emitido em `<slug>.aikuaa.ai` é enviado para `api.aikuaa.ai`. Detalhes e
os demais atributos (`SameSite=none`, `Secure`) no §4.1 do guia.

**Isole login, sessão e renovação atrás de uma interface no app.** O destino
arquitetural é o modo nativo com Bearer (§1.1, caminho B), e a troca deve ser
local quando ele existir.

### Duas armadilhas que custam um dia cada

1. **A base do `ai-api` é `api.aikuaa.ai`, não `chat.aikuaa.ai`.** O prefixo
   `/py` é removido pelo edge-proxy. `chat.aikuaa.ai/py/...` responde `404` em
   produção — §0.1 do guia.
2. **O corpo do `run` recusa campo a mais com `422`** (`extra="forbid"`). Um
   `reasoningEffort` em camelCase quebra sem diagnóstico — §5.1.

## 4. Canal de origem — entregue; o app só precisa de dois cabeçalhos

O escopo pedia que o log dissesse se o turno veio de `chat-web`, `widget`,
`whatsapp` ou `mobile`. **Isso foi implementado e está em produção desde
2026-09-20** (`ai-api` v1.41.0, PR #137).

**O que o app precisa fazer — e é tudo:** mandar estes dois cabeçalhos em
`POST /py/api/agent/run` e `POST /py/api/chat`:

```
X-Client-App: mobile
X-Client-Platform: ios          ← ou "android"
```

Com eles, o turno é registrado como `app-ios` ou `app-android` no log, no span,
nas tarefas de fila e na telemetria de billing, e a conversa nasce carimbada
(sai em `channel` do `GET /py/api/threads/`, §5.6 do guia).

**Sem eles, o app é contado como chat web.** Não há erro, não há aviso: o
servidor cai no padrão `denes-chat`, que é o mesmo do navegador. Mande desde a
primeira versão.

**Quem decide o canal é o servidor.** Antes desta entrega o canal saía de
`metadata.channel`, no corpo, sem validação. Agora sai dos cabeçalhos: declarar
um canal no corpo **não muda mais nada** (o campo segue aceito no contrato, mas
não decide). É a mesma regra do `admin-api` — um cliente que escolhe o próprio
canal contamina o agregado que alguém vai ler.

`metadata.client_channel` (`APP_IOS` / `APP_ANDROID`) continua valendo a pena
mandar: ele alimenta a exposição de expositores do aiKuaa Events e serve de
sinal de divergência durante a transição.

**Vocabulário completo**, caso vocês precisem ler o campo `channel` de uma
conversa:

| Valor | Origem |
|---|---|
| `denes-chat` | chat web (nome de marca antiga, mantido de propósito) |
| `app-ios` | app iOS |
| `app-android` | app Android |
| `widget` | widget embutido |
| `whatsapp` | WhatsApp |
| `null` | conversa anterior a 2026-09-20 — "não registrado", nunca um canal inventado |

## 4A. Os primeiros cinco passos — nesta ordem

Escrito para o agente/dev que abrir este pacote. **Não comece pelo app.**

**1. Peça staging e uma credencial de teste.** Sem bater na API de verdade,
tudo o que vier a seguir é leitura. É o item que mais atrasa se ficar para
depois — peça no primeiro dia.

**2. Gere os dois clientes OpenAPI** (§6 abaixo). Cinco minutos, e mata classes
inteiras de erro — principalmente o `422` do `run`, que recusa qualquer campo
não declarado.

**3. Faça o caminho completo com `curl`, antes de qualquer código de app.**
São seis chamadas, na ordem do §3. Se as seis funcionarem, o app é trabalho de
interface; se alguma falhar, você descobriu isso em uma tarde em vez de na
terceira sprint:

```bash
SLUG=expo          # o slug da organização de teste
API=https://api.aikuaa.ai

# 1. a organização existe? (atenção: ver a ressalva do §2 do guia)
curl -s "https://$SLUG.aikuaa.ai/api/auth/session"

# 2. login pelo BFF — guarde os cookies
curl -s -c cookies.txt -X POST "https://$SLUG.aikuaa.ai/api/auth/login" \
  -H "Origin: https://$SLUG.aikuaa.ai" -H "Content-Type: application/json" \
  -d '{"email":"...","password":"...","remember":true}'

# 3. sessão e capacidades
curl -s -b cookies.txt "$API/auth/me"

# 4. catálogo de modelos (organizationId = tenant.id do passo 3)
curl -s -b cookies.txt "$API/db/llm-organization/organization/<tenant.id>"

# 5. um turno de chat (SSE) — com os cabeçalhos de canal
curl -N -b cookies.txt -X POST "$API/py/api/agent/run" \
  -H "Content-Type: application/json" \
  -H "X-Client-App: mobile" -H "X-Client-Platform: ios" \
  -d @run.json

# 6. o histórico
curl -s -b cookies.txt "$API/py/api/threads/?user_id=<identity.id>&limit=50"
```

O corpo do passo 5 está no §5.1 do guia, campo a campo.

**4. Só então comece o app** — e isole login, sessão e renovação atrás de uma
interface. O modo nativo (§1.1, caminho B) é o destino, e a troca precisa ser
local.

**5. Leia o §8 antes de estimar.** Tem mudança de contrato de sessão já aprovada
e a caminho, que altera como o app guarda o token.

## 5. O que a equipe precisa ler, nesta ordem

| Documento | Para quê |
|---|---|
| [`integracao-mobile.md`](./integracao-mobile.md) **§0** | Introdução, ordem de leitura, os três caminhos pelos quais uma conta nasce |
| **§1.1** | As duas arquiteturas (BFF × nativo) e por que o widget não é precedente |
| **§2, §3** | Cabeçalhos de tenant, descoberta da organização, QR e alternativas |
| **§4** | Autenticação: login, sessão, renovação, senha, convite, catálogo de modelos |
| **§5** | Inferência: corpo do `run`, catálogo de eventos SSE, conversas |
| **§11** | Cadastro do visitante (só em organização de evento) |
| [`openapi/ai-api.mobile.json`](./openapi/ai-api.mobile.json) | 26 rotas, respostas 100% tipadas — gere o cliente daqui |
| [`openapi/admin-api.mobile.json`](./openapi/admin-api.mobile.json) | 67 rotas; **requisições confiáveis, respostas não** (16% tipadas) — as respostas estão no guia |

```bash
npx openapi-typescript docs/chat-web/openapi/ai-api.mobile.json -o src/api/ai-api.d.ts
```

## 6. Acessos e ferramentas — o que providenciar

| Item | Por quê | Quem provê |
|---|---|---|
| **Ambiente de staging com organização de teste** | Mais valioso que o código. A equipe precisa *bater* na API, não ler NestJS | Time de infraestrutura |
| **Credencial de um usuário de teste** nessa organização | Login, histórico, inferência | Time aiKuaa |
| **Leitura nos repositórios `admin-api`, `ai-api` e `chat-web`** | Diagnóstico ("por que esse 422?"). O `chat-web` é a implementação de referência | — |
| **Sem escrita em lugar nenhum**, sem acesso ao Railway, sem `.env` | O Railway aplica migration Prisma no deploy, e o schema do `admin-api` tem deriva destrutiva. Um `prisma migrate dev` bem-intencionado derruba a API em produção | — |
| **Um dono de contrato nomeado** do lado aiKuaa | Metade das perguntas será "isso é intencional ou é bug?", e só código não responde | — |

**Regra de convivência:** o guia é a fonte de verdade do **contrato**; o
repositório serve para **diagnóstico**. Se for preciso ler código para saber o
que enviar, isso é bug do guia — reporte, não normalize.

## 7. O que continua fora deste escopo

Registrado para não virar surpresa:

- **OAuth (Google/Microsoft) no app** — o retorno do provedor não chega a um app
  nativo; falta o universal link (§9.2 do guia).
- **Redefinir senha e aceitar convite dentro do app** — os links do e-mail abrem
  o navegador; o usuário volta ao app pelo login (§4.7, §9.2).
- **Notificações push** — não existe infraestrutura (§9.4).
- **Upload de arquivos por TUS** — a política exige `Origin` de navegador.
- **Retomar um turno após o app ir para segundo plano** — o stream cai e o turno
  é cancelado; precisa de "runs resumíveis", que é projeto à parte.
- **Multi-organização** — hoje um usuário pertence a uma organização só. Deixe o
  modelo de dados do app preparado para várias contas, mas exponha uma.

## 8. Mudança de contrato já aprovada, a caminho

A entrega **Sessões com Estado** está em review no `admin-api` (branch
`feat/sessoes-com-estado`, sem merge). Quando entrar:

- o token de acesso passa a durar **no máximo 1 h sempre** — `remember` deixa de
  esticá-lo e vale só para a renovação;
- a renovação **rotaciona** e derruba a sessão inteira diante de um token já
  rotacionado;
- o logout passa a **revogar de verdade** no servidor.

**Desenhe a camada de sessão do app para esse modelo desde já** (§4.1, §4.3,
§4.5 e §4.6 do guia): renove sempre pelo `expires_in` da resposta, nunca por um
prazo fixo, e serialize as renovações.
