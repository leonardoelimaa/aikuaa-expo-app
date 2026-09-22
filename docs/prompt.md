# Prompt de partida — agente do app móvel aiKuaa

> Cole este arquivo inteiro como primeira mensagem do agente que vai construir o
> app. Os quatro arquivos citados vêm junto com ele.

---

## Quem você é e o que vai construir

Você é o agente responsável por construir um **aplicativo móvel React Native**
para o aiKuaa. O app é um binário único que atende **várias organizações**
(multi-tenant). O código do app fica **fora** do monorepo aiKuaa — você não
tem, e não precisa ter, acesso ao backend.

O que o app precisa fazer, nesta ordem de prioridade:

1. o usuário identifica a organização — por QR code ou digitando o endereço;
2. faz login;
3. cria conta, **quando aquela organização permitir**;
4. envia perguntas e recebe respostas em streaming;
5. vê o histórico de conversas.

Tudo isso **já existe e está em produção**. Você não está esperando backend: está
consumindo um produto que funciona. Se algo parecer faltar, quase sempre é você
que ainda não achou — procure antes de concluir que não existe.

## Os quatro arquivos que você recebeu

| Arquivo | O que é | Como usar |
|---|---|---|
| `PACOTE_INICIO_MOBILE.md` | **Ponto de entrada.** Escopo, o que existe, caminho do MVP, acessos a pedir | Leia **inteiro**, primeiro, antes de qualquer coisa |
| `integracao-mobile.md` | **Referência de contrato.** ~3400 linhas | Não leia inteiro. Consulte por seção, conforme o pacote de início mandar |
| `openapi/ai-api.mobile.json` | 26 rotas do chat. Respostas **100% tipadas** | Gere o cliente daqui. Confiável de ponta a ponta |
| `openapi/admin-api.mobile.json` | 67 rotas de auth/perfil/modelos | Gere o cliente, mas: **só as requisições são confiáveis** (100% tipadas). As respostas não (16%) — elas estão escritas à mão no guia, seções §4 e §11 |

## Sequência de trabalho

### Passo 0 — Leia, e pare de ler na hora certa

1. `PACOTE_INICIO_MOBILE.md`, inteiro.
2. Do `integracao-mobile.md`, **só** o §0 (introdução e ordem de leitura) e o
   §9.0 (o bloqueador conhecido e por que ele não te impede).
3. Pare. Não leia as 3400 linhas agora — você vai voltar nelas por seção.

### Passo 1 — Peça os acessos (faça isto no primeiro dia)

Peça ao time aiKuaa, e **não comece a codar esperando**:

- ambiente de **staging** com uma organização de teste;
- **credencial de um usuário** nessa organização;
- confirmação de que o app pode consumir o BFF do `chat-web` (§1.1 do guia,
  caminho A) — é uma decisão de time, não técnica.

### Passo 2 — Gere os clientes OpenAPI

```bash
npx openapi-typescript openapi/ai-api.mobile.json    -o src/api/ai-api.d.ts
npx openapi-typescript openapi/admin-api.mobile.json -o src/api/admin-api.d.ts
```

Cinco minutos. Evita uma classe inteira de erro — ver "Armadilhas" abaixo.

### Passo 3 — Prove o caminho com `curl`, antes de escrever o app

**Este passo não é opcional e não é perda de tempo.** São seis chamadas; o bloco
pronto está no §4A do pacote de início. Se as seis funcionarem, o app vira
trabalho de interface. Se alguma falhar, você descobriu numa tarde em vez de na
terceira sprint.

Só siga para o passo 4 quando as seis responderem como o guia descreve.

### Passo 4 — Construa, nesta ordem

1. **Descoberta da organização** (§3 e §3.4) — QR e digitação convergem na
   mesma tela de confirmação. Construa **uma** tela com duas entradas, não dois
   fluxos.
2. **Login** (§4.1 e §1.1 caminho A).
3. **Sessão e renovação** (§4.3) — isolada atrás de uma interface, ver
   "Decisões de arquitetura" abaixo.
4. **Inferência** (§5.1) — corpo do `run`, SSE, catálogo de eventos.
5. **Histórico** (§5.6).
6. **Cadastro de conta** (§11) — **só** se a organização-alvo for de evento.

### Passo 5 — Antes de estimar prazo

Leia o §8 do pacote de início. Há mudança de contrato de sessão **já aprovada e
a caminho** que altera como o app guarda o token. Estimar sem saber disso gera
retrabalho.

## Armadilhas que custam um dia cada

Todas já foram verificadas no código. Não as redescubra.

**1. A base do `ai-api` é `api.aikuaa.ai`, não `chat.aikuaa.ai`.**
O prefixo `/py` é removido pela borda. `chat.aikuaa.ai/py/...` responde `404` em
produção. Versões antigas do guia diziam o contrário — está corrigido no §0.1.

**2. O corpo do `run` recusa campo a mais com `422`.**
`extra="forbid"`. Um `reasoningEffort` em camelCase em vez de `reasoning_effort`
quebra sem diagnóstico útil. É por isso que o passo 2 existe.

**3. `metadata.allowed_domains` é obrigatório na prática.**
Sem ele a chamada responde normalmente, o modelo responde de cabeça, e **nada no
stream avisa que o acervo ficou de fora**. Mande sempre o
`capabilities.allowedDomains` inteiro, vindo do `/auth/me`.

**4. Os dois cabeçalhos de canal, desde a primeira versão.**
```
X-Client-App: mobile
X-Client-Platform: ios      ← ou "android"
```
Sem eles o app é contabilizado como chat web. Sem erro, sem aviso.

**5. `GET /auth/tenant-branding` não confirma existência para cliente nativo.**
Responde `200` com campos vazios quando o tenant não resolve, e `404` só para
organização **inativa**. Leia o §2 antes de construir a tela de confirmação.

**6. Nunca renderize raciocínio.**
Mesmo com `reasoning_enabled: true`. Mantenha um filtro defensivo local.

**7. Texto visível ao usuário segue a regra do `chat-web`: espanhol.**
As telas de cadastro são bilíngues `es-PY` / `pt-BR` com seletor (§11.5).
Confirme com o time aiKuaa se vale para o app inteiro antes de escrever as
strings.

## Decisões de arquitetura que você deve tomar agora

**Isole login, sessão e renovação atrás de uma interface.** Existem dois
caminhos (§1.1): pelo BFF do `chat-web` (caminho A, zero backend novo, é o
recomendado para o MVP) e o modo nativo com Bearer (caminho B, o destino). A
troca entre eles precisa ser local, num arquivo, não espalhada pelo app.

**Renove pelo `expires_in` da resposta, nunca por prazo fixo.** Há uma mudança
de contrato em andamento que altera a validade do token; código que assume "1
hora" ou "30 dias" vai quebrar.

**Prepare o modelo de dados para várias contas, mas exponha uma.** Hoje um
usuário pertence a uma organização só. Há iniciativa de multi-organização em
aberto.

## Como trabalhar quando travar

**O guia é o contrato. Se você precisar de código do backend para saber o que
enviar, isso é um defeito do guia — reporte, não normalize.** Você não tem
acesso ao repositório do aiKuaa e não deveria precisar.

**Não invente endpoint.** Se uma rota não está no guia nem nos arquivos OpenAPI,
ela provavelmente não existe, ou existe e o guia falhou em documentá-la.
Pergunte.

**Pare e pergunte** — em vez de contornar — quando:

- uma resposta divergir do que o guia descreve (anote a rota, o corpo enviado e
  o recebido);
- faltar contrato para algo do escopo;
- você for tentado a mandar credencial, chave de API ou segredo no corpo de uma
  requisição;
- uma decisão sua amarrar o app a um comportamento não documentado.

**Ao encontrar erro no guia, reporte com evidência**: seção, o que ela afirma, o
que você observou. O guia já foi corrigido várias vezes assim.

## Fora do escopo — não tente

Registrado para você não perder tempo:

- **OAuth Google/Microsoft dentro do app** — o retorno do provedor não chega a
  app nativo; falta universal link (§9.2).
- **Redefinir senha e aceitar convite dentro do app** — os links do e-mail abrem
  o navegador; o usuário volta pelo login (§4.7).
- **Notificações push** — não existe infraestrutura.
- **Upload de arquivos por TUS** — a política exige `Origin` de navegador.
- **Retomar turno depois do app ir para segundo plano** — o stream cai e o turno
  é cancelado. Trate como erro e ofereça reenviar.
- **Cadastro com Google** — só web, mesmo quando `signup.methods.google` vier
  `true`.

## Primeira resposta esperada de você

Antes de escrever qualquer código, responda com:

1. confirmação de que leu o `PACOTE_INICIO_MOBILE.md` e o §0 do guia;
2. a lista de acessos que você precisa (passo 1);
3. sua leitura do caminho A × caminho B e qual você propõe para o MVP, com o
   porquê;
4. qualquer contradição ou lacuna que você já tenha encontrado nos quatro
   arquivos.

Só depois disso comece o passo 2.
