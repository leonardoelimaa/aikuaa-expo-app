# SPEC — Aikuaa AI App

**Projeto:** Aikuaa AI Mobile App  
**Produto:** AI Assistant / Enterprise AI App  
**Plataforma inicial:** iOS + Android  
**Framework:** React Native + Expo  
**Escopo desta etapa:** Frontend / esqueleto do aplicativo  
**Objetivo inicial:** Demonstração do Aikuaa.ai em eventos  
**Objetivo futuro:** Aplicativo oficial de empresas clientes

---

# 1. Contexto

O Aikuaa.ai possui uma plataforma de inteligência artificial capaz de responder perguntas sobre empresas utilizando diferentes fontes e ferramentas disponíveis no backend.

Entre os serviços existentes estão:

- RAG SQL
- RAG Vetorial
- MCPs
- HTTP Tools
- outras ferramentas de AI existentes no backend
- sistemas de recuperação de informações
- sistemas de consulta estruturada
- agentes / workflows existentes

O aplicativo será inicialmente utilizado em **eventos corporativos**.

Durante o evento:

1. empresas participantes serão cadastradas;
2. seus dados serão disponibilizados ao Aikuaa;
3. convidados poderão acessar o aplicativo;
4. o convidado poderá fazer perguntas utilizando linguagem natural;
5. futuramente, o Aikuaa utilizará os serviços disponíveis no backend para encontrar a resposta;
6. o aplicativo apresentará a resposta de maneira semelhante a um chatbot moderno.

O objetivo é transformar o aplicativo em uma **demonstração prática do produto Aikuaa.ai**.

Posteriormente, a mesma base tecnológica deverá permitir que uma empresa contratante utilize o aplicativo como **seu próprio assistente de IA corporativo**.

---

# 2. Escopo desta etapa — MUITO IMPORTANTE

## O agente NÃO deve trabalhar no backend nesta etapa.

O objetivo deste trabalho é construir **somente o frontend e o esqueleto do aplicativo React Native**.

Não devem ser implementados, alterados ou refatorados:

- backend;
- APIs;
- banco de dados;
- RAG SQL;
- RAG Vetorial;
- MCPs;
- HTTP Tools;
- agentes de IA;
- autenticação backend;
- infraestrutura;
- endpoints reais;
- lógica de orchestration;
- integração real com LLM.

As funcionalidades de integração serão implementadas em uma etapa posterior.

### O que deve ser feito agora

O agente deve construir:

- projeto React Native + Expo;
- arquitetura do frontend;
- design system;
- navegação;
- telas;
- componentes;
- estados visuais;
- experiência de chat;
- histórico visual;
- contexto de evento visual;
- company cards;
- sources;
- estados de loading;
- estados de erro;
- empty states;
- animações;
- responsividade;
- acessibilidade;
- mocks locais quando necessários para demonstrar a interface.

### O que NÃO deve ser feito agora

Não conectar os componentes aos serviços reais do backend.

Quando uma funcionalidade depender do backend, criar uma **abstração/interface preparada para integração futura** e utilizar dados mockados/localmente para demonstrar o comportamento da UI.

Exemplo:

```typescript
interface AIService {
  sendMessage(input: SendMessageInput): Promise<AIResponse>;
}
```

Nesta etapa, implementar apenas algo como:

```typescript
MockAIService
```

A implementação real poderá ser adicionada posteriormente.

---

# 3. Pesquisa obrigatória antes da implementação

## O agente DEVE pesquisar o Aikuaa.ai na web antes de desenvolver a interface.

Esta etapa é obrigatória.

O agente deve acessar e analisar o site oficial:

**https://aikuaa.ai**

Além da página inicial, deve explorar outras páginas públicas relevantes do domínio para entender melhor:

- identidade visual;
- posicionamento da marca;
- linguagem;
- tipografia;
- cores;
- espaçamentos;
- bordas;
- radius;
- botões;
- cards;
- ícones;
- efeitos;
- animações;
- uso de imagens;
- uso de gradientes;
- composição visual;
- hierarquia de informação;
- tom da comunicação;
- estética geral;
- comportamento responsivo;
- elementos relacionados à inteligência artificial.

### Não assumir que as informações desta spec são suficientes para definir o design.

A pesquisa na web deve ser utilizada para **complementar e validar** as decisões de design.

O agente deve tratar o site atual como a principal referência visual da marca.

Se houver divergência entre uma decisão visual genérica desta spec e o site atual, deve-se priorizar a identidade visual observada no site.

---

# 4. Resultado esperado da pesquisa

Antes de implementar as telas, o agente deve formar uma compreensão clara de:

> "Como o Aikuaa se apresenta visualmente e como essa identidade pode ser traduzida para uma experiência mobile AI-first."

O agente deve identificar:

```text
Brand
├── Colors
├── Typography
├── Spacing
├── Components
├── Visual language
├── Tone of voice
├── Motion
└── AI/product patterns
```

Não é necessário criar um relatório separado se isso não for útil, mas as decisões devem estar refletidas no código e no design system.

---

# 5. Visão do produto

O aplicativo deve ser percebido como:

> **"Uma interface simples para conversar com a inteligência da empresa."**

O usuário não deve precisar saber:

- qual RAG foi utilizado;
- qual MCP foi chamado;
- qual banco foi consultado;
- qual ferramenta HTTP foi utilizada;
- qual agente executou a tarefa.

Toda essa complexidade permanecerá escondida do usuário.

Para o usuário, a experiência deve ser:

**Pergunta → processamento → resposta inteligente → fontes/contexto quando aplicável → próxima pergunta.**

Nesta etapa, o comportamento será simulado através de mocks.

---

# 6. Princípio central de UX

O app deve seguir a filosofia:

> **AI-first, interface-first, complexity-hidden.**

A interface não deve parecer um sistema empresarial tradicional.

Evitar:

- dashboards excessivos;
- tabelas desnecessárias;
- menus complexos;
- dezenas de configurações;
- excesso de cards;
- aparência de CRM;
- interface genérica de chatbot.

O foco deve estar na **conversa**.

---

# 7. Referências de UX

A experiência pode buscar inspiração em produtos como:

- ChatGPT
- Claude
- Perplexity
- Gemini
- Microsoft Copilot

Porém, **não copiar visualmente nenhum deles**.

A inspiração deve estar principalmente em:

- padrões de interação;
- simplicidade;
- organização da conversa;
- streaming;
- histórico;
- prompt composer;
- sources;
- respostas estruturadas.

A identidade visual deve continuar sendo do Aikuaa.

---

# 8. Direção visual

A interface deve transmitir:

- inteligência;
- sofisticação;
- tecnologia;
- confiança;
- simplicidade;
- modernidade;
- produto B2B premium.

Evitar estética:

- "robô";
- neon exagerado;
- cyberpunk;
- chatbot genérico;
- excesso de gradientes;
- interface infantil;
- excesso de elementos decorativos.

---

# 9. Identidade visual

O aplicativo deve utilizar a mesma linguagem visual do **aikuaa.ai**.

A implementação NÃO deve criar uma nova identidade visual exclusivamente para o app.

A referência principal deve ser o website atual do Aikuaa.

O agente deve validar visualmente suas decisões através da pesquisa do site antes de implementar o design system.

---

# 10. Tipografia

Utilizar a tipografia observada no ecossistema Aikuaa.

Como referência inicial, a identidade conhecida utiliza:

- **Manrope**
- **DM Sans**
- **DM Mono**

Porém, o agente deve **verificar no site atual** quais fontes estão realmente sendo utilizadas e priorizar essa implementação.

Sugestão de utilização:

### Manrope

Títulos e elementos de maior destaque.

### DM Sans

Corpo, mensagens e interface.

### DM Mono

Informações técnicas quando necessário.

---

# 11. Cores

Utilizar os tokens existentes da identidade Aikuaa.

Como referência inicial:

- background off-white / cream;
- navy como cor principal de ação;
- champagne gold discreto;
- tons neutros para elementos secundários.

**Não assumir que esses valores estão necessariamente atualizados.**

O agente deve consultar o site e extrair/identificar as cores relevantes antes de definir os tokens finais.

Não hardcodar cores diretamente nos componentes.

Criar um Design System centralizado contendo:

```text
colors
typography
spacing
radius
shadows
animations
```

---

# 12. Arquitetura do aplicativo

A arquitetura deve ser preparada desde o início para suportar dois modos.

## EVENT MODE

Utilizado em eventos.

```text
Aikuaa
   ↓
Evento
   ↓
Empresas participantes
   ↓
Conhecimento disponível
   ↓
Chat
```

## COMPANY MODE

Utilizado posteriormente por clientes.

```text
Aikuaa
   ↓
Empresa
   ↓
Knowledge Base
   ↓
Ferramentas
   ↓
Chat
```

O frontend não deve assumir que sempre haverá um único evento.

Criar uma abstração de contexto semelhante a:

```typescript
AppContext
```

contendo, por exemplo:

```typescript
{
  mode: "event" | "company",
  tenantId: string,
  eventId?: string,
  companyId?: string
}
```

Nesta etapa, esse contexto pode ser alimentado por mocks.

---

# 13. Multi-tenancy

A arquitetura deve considerar desde o início:

```text
Aikuaa Platform
│
├── Event A
│   ├── Company A
│   ├── Company B
│   └── Company C
│
├── Event B
│
└── Customer Company
```

Isso é importante porque posteriormente o aplicativo poderá ser utilizado diretamente por empresas clientes.

O frontend deve trabalhar com um contexto semelhante a:

```typescript
Tenant
```

ou equivalente.

---

# 14. Fluxo principal do evento

Ao abrir o aplicativo:

```text
Splash
   ↓
Welcome
   ↓
Selecionar / identificar evento
   ↓
Chat
```

Dependendo da infraestrutura futura, o evento poderá ser:

- selecionado;
- identificado por QR Code;
- identificado por código;
- configurado previamente;
- determinado por deep link.

Nesta etapa, implementar apenas o fluxo visual e utilizar dados mockados.

---

# 15. Tela principal — Chat

Essa é a tela mais importante do aplicativo.

A maior parte da experiência deve acontecer aqui.

Estrutura conceitual:

```text
┌─────────────────────────────┐
│ Aikuaa              ⋯       │
│ AI Assistant                │
│                             │
│      Welcome area           │
│                             │
│   "Como posso ajudar?"      │
│                             │
│  ┌────────┐ ┌────────┐      │
│  │Empresas│ │Evento  │      │
│  └────────┘ └────────┘      │
│                             │
│                             │
│                             │
│ ┌─────────────────────────┐ │
│ │ Pergunte ao Aikuaa...   │ │
│ │                    ↑    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

O layout final deve ser adaptado à identidade encontrada no site.

---

# 16. Estado inicial do Chat

Antes da primeira pergunta, não mostrar uma conversa vazia.

Criar um **Welcome State** elegante.

Exemplo:

> **Conheça as empresas do evento com o Aikuaa.**

Subtexto:

> Pergunte sobre empresas, produtos, serviços, pessoas, oportunidades e tudo o que estiver disponível no conhecimento do evento.

Abaixo, sugestões de perguntas.

Exemplos:

```text
Quais empresas participam do evento?
```

```text
Quais empresas trabalham com inteligência artificial?
```

```text
Encontre empresas de tecnologia
```

```text
Quais empresas oferecem soluções para o setor financeiro?
```

Os prompts devem ser mockados nesta etapa.

---

# 17. Prompt Composer

O campo de entrada deve ser o principal elemento interativo.

Características:

- grande;
- arredondado;
- confortável para digitação;
- suporte a múltiplas linhas;
- botão de enviar;
- animação discreta;
- keyboard-aware;
- suporte a prompt longo.

Placeholder:

> **Pergunte ao Aikuaa...**

ou equivalente definido pelo design.

---

# 18. Sugestões de prompts

O usuário deve poder iniciar uma conversa sem saber exatamente o que perguntar.

Exemplos:

```text
Explorar empresas
```

```text
Encontrar uma solução
```

```text
Comparar empresas
```

```text
Conhecer participantes
```

Essas sugestões podem apenas preencher/iniciar prompts nesta primeira versão.

---

# 19. Mensagens do usuário

Mensagens do usuário devem possuir aparência visual claramente diferente das respostas da AI.

Porém, evitar o clássico excesso de:

```text
User bubble
AI bubble
User bubble
AI bubble
```

A experiência deve parecer mais próxima de um **AI workspace moderno**.

---

# 20. Mensagens da AI

A resposta deve possuir suporte visual para:

- texto rico;
- Markdown;
- listas;
- tabelas quando necessário;
- links;
- citações;
- referências;
- informações estruturadas.

Nesta etapa, utilizar respostas mockadas.

Suporte recomendado:

```text
Markdown
Code blocks
Lists
Tables
Links
Bold
Italic
Headers
```

---

# 21. Streaming visual

Mesmo sem backend real, o frontend deve ser preparado para streaming.

Criar uma experiência mockada na qual a resposta aparece progressivamente.

Fluxo:

```text
Usuário envia
      ↓
"Pensando..."
      ↓
Primeiros tokens
      ↓
Texto aparecendo progressivamente
      ↓
Resposta final
```

A implementação real do streaming ficará para uma etapa posterior.

---

# 22. Estado "Thinking"

Enquanto o mock estiver processando:

Não utilizar uma animação genérica de loading.

Criar uma animação minimalista consistente com Aikuaa.

Exemplo:

```text
Aikuaa está analisando...
```

ou simplesmente uma animação de processamento.

A interface deve suportar futuramente estados como:

```text
Entendendo sua pergunta...
```

```text
Consultando o conhecimento...
```

```text
Encontrando informações relevantes...
```

```text
Preparando resposta...
```

Nesta etapa, isso pode ser simulado.

---

# 23. Tool transparency

Como o produto possui RAG SQL, RAG vetorial, MCPs e HTTP Tools, existe uma oportunidade importante de UX.

Por padrão, o usuário **não precisa ver detalhes técnicos**.

Porém, o frontend deve possuir um componente visual preparado para futuramente mostrar algo como:

> **Como o Aikuaa encontrou isso**

Ao expandir:

```text
Knowledge Search
SQL
Company Database
MCP
```

Nesta etapa, pode ser preenchido com dados mockados.

Nunca transformar a interface em uma tela de logs técnicos.

---

# 24. Sources / Citations

Quando o backend futuramente fornecer fontes, elas deverão ser exibidas.

Criar o componente desde já.

Exemplo:

```text
Resposta...

[1] Empresa XYZ
[2] Documento institucional
[3] Website
```

Ou uma apresentação mais elegante:

```text
Sources
────────────
Empresa XYZ
Website institucional

Relatório 2026
Documento
```

Nesta etapa, utilizar dados mockados.

---

# 25. Respostas estruturadas

O frontend deve estar preparado para renderizar informações estruturadas.

### Empresa

```text
┌──────────────────────────┐
│ LOGO                     │
│ Empresa XYZ              │
│ Tecnologia • São Paulo   │
│                          │
│ Descrição...             │
│                          │
│ Ver empresa →            │
└──────────────────────────┘
```

### Lista de empresas

```text
Empresa A
Empresa B
Empresa C
```

### Comparação

```text
              Empresa A   Empresa B
Setor         Fintech     SaaS
Localização   Goiânia     São Paulo
...
```

Criar componentes reutilizáveis.

---

# 26. Company Cards

Criar um componente:

```text
CompanyCard
```

Possíveis informações:

- logo;
- nome;
- descrição;
- setor;
- localização;
- website;
- stand;
- tags;
- informações relevantes.

Não mostrar todas as informações sempre.

O componente deve ser flexível para ser utilizado futuramente em respostas geradas pela AI.

---

# 27. Navegação

A navegação deve ser mínima.

Sugestão:

```text
Chat
History
Event / Company
Settings
```

Porém, a navegação não deve competir com o chat.

No MVP visual do evento, pode existir apenas:

```text
Chat
```

com um menu secundário.

---

# 28. Histórico

Criar a experiência visual de conversas anteriores.

Estrutura:

```text
Today

Como funciona a empresa X?
Quais empresas trabalham com IA?

Yesterday

Empresas de tecnologia do evento
```

Cada conversa deve possuir:

- título;
- timestamp;
- possibilidade de reabrir.

Nesta etapa, usar dados mockados.

---

# 29. Nova conversa

Botão:

```text
+ Nova conversa
```

Ao criar:

- limpar contexto visual;
- iniciar novo thread;
- manter tenant/event context;
- resetar o estado do mock.

---

# 30. Contexto da conversa

Criar o modelo de frontend:

```typescript
Conversation
```

com:

```typescript
{
  id,
  tenantId,
  eventId?,
  companyId?,
  messages[],
  createdAt,
  updatedAt
}
```

Não implementar persistência ou sincronização real nesta etapa.

---

# 31. API abstraction — preparar, não integrar

Criar uma camada de serviços preparada para a futura integração.

Exemplo:

```text
services/
├── ai/
├── conversations/
├── events/
└── companies/
```

Exemplo conceitual:

```typescript
aiService.sendMessage()
aiService.streamMessage()
conversationService.getConversations()
conversationService.getConversation()
eventService.getEvent()
companyService.getCompany()
```

Nesta etapa, essas funções devem utilizar mocks.

Não realizar chamadas para o backend real.

---

# 32. Mock data

Criar uma camada explícita para dados de demonstração.

Exemplo:

```text
mocks/
├── companies.ts
├── conversations.ts
├── messages.ts
├── events.ts
└── aiResponses.ts
```

Os mocks devem ser facilmente substituíveis pelas implementações reais posteriormente.

**Não espalhar dados fake diretamente pelos componentes.**

---

# 33. Error states

Criar visualmente estados para:

### Internet indisponível

> Não foi possível conectar ao Aikuaa.

### Backend indisponível

> O Aikuaa está temporariamente indisponível.

### Timeout

> Essa consulta demorou mais que o esperado.

### Pergunta sem resposta

> Não encontramos informação suficiente para responder.

Nesta etapa, os estados podem ser acionados artificialmente através dos mocks.

---

# 34. Offline

O aplicativo não precisa funcionar offline.

Porém:

- UI deve abrir mesmo sem conexão;
- mostrar estado offline;
- não tentar fingir que a AI está disponível.

---

# 35. QR Code / Deep Link

Preparar a arquitetura para futuramente suportar:

```text
QR Code
```

Exemplo:

```text
app.aikuaa.ai/event/tech-event-2026
```

Fluxo futuro:

```text
App
 ↓
Deep Link
 ↓
Event Context
 ↓
Chat
```

Nesta etapa, pode existir apenas uma simulação do evento selecionado.

---

# 36. Experiência do evento

O aplicativo deve funcionar especialmente bem em um cenário em que:

- o usuário acabou de chegar;
- possui pouco tempo;
- não conhece o Aikuaa;
- não quer criar uma conta;
- quer experimentar rapidamente.

Objetivo:

> **Do QR Code à primeira pergunta em menos de 30 segundos.**

O frontend deve ser otimizado para esse fluxo.

---

# 37. Demo Experience

O evento é também uma experiência de marketing.

O aplicativo deve incentivar perguntas interessantes.

Exemplos:

> "Quais empresas oferecem soluções de IA?"

> "Encontre empresas que trabalham com fintech."

> "Qual empresa seria mais indicada para resolver X?"

Isso demonstra o poder do sistema sem precisar explicar tecnicamente RAG, MCP etc.

---

# 38. Empty State inteligente

Em vez de:

> "Nenhuma conversa ainda."

usar:

> **O que você quer descobrir?**

E sugestões.

---

# 39. Responsividade

Apesar de ser mobile-first, o layout deve ser pensado para:

- iPhone;
- Android;
- tablets;
- eventualmente web.

Não assumir dimensões específicas de iPhone.

---

# 40. Animações

Animações devem ser:

- rápidas;
- suaves;
- discretas;
- premium.

Exemplos:

- entrada da mensagem;
- streaming;
- abertura de sources;
- transição entre conversas;
- keyboard;
- loading.

Evitar animações excessivas.

As animações devem seguir a linguagem visual observada no site Aikuaa sempre que possível.

---

# 41. Arquitetura React Native

Utilizar uma estrutura organizada por features.

Sugestão:

```text
src/
│
├── app/
│   ├── navigation/
│   └── providers/
│
├── features/
│   ├── chat/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── conversations/
│   ├── events/
│   ├── companies/
│   └── auth/
│
├── components/
│   ├── ui/
│   ├── company/
│   └── ai/
│
├── services/
│   ├── api/
│   ├── ai/
│   └── storage/
│
├── mocks/
│
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── radius.ts
│   └── index.ts
│
├── stores/
│
└── utils/
```

O agente pode adaptar a estrutura caso exista uma convenção melhor no projeto.

---

# 42. Estado

Separar claramente:

```text
Server state
UI state
Session state
Chat state
```

Nesta etapa, não haverá server state real, portanto utilizar mocks/adapters.

Evitar colocar todo o estado em um único global store.

---

# 43. Persistência local

Nesta etapa, persistência real não é obrigatória.

Se implementada, deve ser limitada a dados locais de demonstração, como:

- sessão mock;
- tenant/event context;
- histórico mock;
- preferências.

Não armazenar dados sensíveis desnecessariamente.

---

# 44. Segurança

Mesmo sendo apenas frontend nesta etapa, nunca colocar no aplicativo:

- API keys do LLM;
- credenciais de MCP;
- credenciais de banco;
- secrets;
- tokens administrativos.

Não criar nenhum mecanismo que dependa de secrets do backend no bundle mobile.

---

# 45. Observabilidade

Preparar pontos de integração para eventos como:

```text
app_open
event_selected
chat_started
message_sent
message_completed
message_failed
source_clicked
company_clicked
conversation_created
```

Nesta etapa, não é necessário conectar a uma plataforma real de analytics.

Pode existir uma interface:

```typescript
analytics.track()
```

com implementação mock/no-op.

---

# 46. Métricas do evento

A arquitetura deve permitir futuramente medir:

- usuários;
- perguntas;
- perguntas por usuário;
- empresas mais consultadas;
- perguntas sem resposta;
- tempo médio de resposta;
- sessões;
- conversões/interesse.

Não implementar infraestrutura de analytics real nesta etapa.

---

# 47. Futuro — Company App

A arquitetura deve permitir que o mesmo aplicativo seja transformado em:

> **"Seu AI Assistant corporativo."**

Exemplo:

```text
Aikuaa
    ↓
Empresa XYZ
    ↓
AI Assistant
```

O frontend deve estar preparado para perguntas como:

> "Quais foram nossas vendas no último trimestre?"

ou:

> "Qual é a política de férias?"

ou:

> "Crie um relatório com os dados do CRM."

A escolha entre SQL RAG, Vector RAG, MCP ou HTTP Tool ficará completamente no backend em uma etapa futura.

---

# 48. White-label futuro

Preparar o design system para permitir customização por tenant.

Exemplo:

```typescript
TenantTheme
```

com:

```typescript
logo
primaryColor
secondaryColor
font
name
avatar
welcomeMessage
suggestedPrompts
```

Porém:

**não implementar white-label completo no MVP.**

Apenas construir a arquitetura de forma que isso seja possível posteriormente.

---

# 49. AI Personality

A personalidade da AI deverá futuramente ser configurável pelo backend/tenant.

Para o evento:

> amigável, inteligente, objetiva e útil.

Para uma empresa:

> profissional, contextualizada e orientada ao negócio.

Nesta etapa, usar conteúdo mockado.

---

# 50. Prompt suggestions configuráveis

O frontend deve estar preparado para receber futuramente:

```typescript
suggestedPrompts
```

Exemplo:

```json
[
  "Quais empresas trabalham com IA?",
  "Encontre empresas de tecnologia",
  "Compare duas empresas"
]
```

Nesta etapa, esses dados podem vir de mocks.

---

# 51. Acessibilidade

Implementar:

- Dynamic Type;
- VoiceOver;
- TalkBack;
- contraste adequado;
- áreas de toque adequadas;
- labels;
- navegação por acessibilidade.

---

# 52. Performance

O app deve:

- iniciar rapidamente;
- não travar durante streaming simulado;
- virtualizar mensagens;
- evitar re-renderizações desnecessárias;
- lidar com conversas longas;
- suportar respostas extensas.

O streaming mockado não pode causar renderização excessiva a cada token.

Utilizar batching/throttling quando necessário.

---

# 53. Testes

Criar testes para:

### Unit

- message reducer;
- conversation state;
- tenant context;
- mock AI service;
- parsing/rendering de estados.

### Component

- composer;
- message;
- sources;
- company card;
- loading;
- empty state.

### Integration

Fluxo:

```text
send message
→ mock stream
→ render
→ complete
```

### E2E

Fluxo principal:

```text
Open App
→ Event
→ Chat
→ Prompt
→ Mock Response
→ Source
→ New Conversation
```

---

# 54. Fases de implementação

## Fase 0 — Pesquisa e entendimento

Obrigatoriamente:

1. acessar `https://aikuaa.ai`;
2. navegar pelas páginas públicas relevantes;
3. estudar a identidade visual;
4. identificar tipografia;
5. identificar cores;
6. identificar componentes;
7. observar espaçamento e composição;
8. entender o tom da marca;
9. analisar padrões de interação;
10. pesquisar referências de AI chat UX.

**Não iniciar a implementação visual antes desta etapa.**

---

## Fase 1 — Setup

Criar:

- projeto React Native + Expo;
- estrutura de pastas;
- navegação;
- providers;
- theme;
- lint;
- formatter;
- configuração básica de testes.

---

## Fase 2 — Design System

Criar:

```text
Colors
Typography
Spacing
Radius
Shadows
Buttons
Inputs
Cards
Icons
Animations
```

Todos baseados na identidade encontrada no site.

---

## Fase 3 — App Shell

Implementar:

- Splash;
- Welcome;
- Event Context;
- Navigation;
- Chat shell.

---

## Fase 4 — Chat UI

Implementar:

- welcome state;
- prompt suggestions;
- composer;
- messages;
- AI messages;
- user messages;
- thinking state;
- streaming mock;
- sources;
- company cards;
- structured responses.

---

## Fase 5 — Conversations

Implementar:

- history;
- conversation list;
- conversation screen;
- new conversation;
- mock persistence.

---

## Fase 6 — Polish

Implementar:

- animações;
- acessibilidade;
- responsive behavior;
- keyboard handling;
- empty states;
- error states;
- loading states;
- performance optimization.

---

## Fase 7 — Integration Preparation

Criar interfaces e adapters preparados para a integração futura:

```text
AIService
ConversationService
EventService
CompanyService
AnalyticsService
```

Implementar apenas mocks.

**Não conectar ao backend real.**

---

# 55. Critérios de aceite — Frontend MVP

O MVP visual será considerado concluído quando:

### Projeto

- [ ] app React Native + Expo funcionando;
- [ ] estrutura organizada;
- [ ] navegação funcionando;
- [ ] design system centralizado.

### Design

- [ ] identidade Aikuaa;
- [ ] design baseado em pesquisa do site oficial;
- [ ] tipografia consistente;
- [ ] cores consistentes;
- [ ] espaçamento consistente;
- [ ] componentes reutilizáveis.

### Chat

- [ ] usuário consegue iniciar conversa;
- [ ] usuário consegue enviar pergunta;
- [ ] resposta mock aparece;
- [ ] resposta aparece progressivamente;
- [ ] Markdown é renderizado;
- [ ] fontes são exibidas;
- [ ] company cards funcionam;
- [ ] erro é tratado;
- [ ] usuário pode continuar a conversa.

### Evento

- [ ] aplicativo consegue simular identificação de evento;
- [ ] contexto do evento é mantido;
- [ ] empresas mockadas podem aparecer nas respostas.

### Conversas

- [ ] nova conversa;
- [ ] histórico;
- [ ] reabrir conversa.

### UX

- [ ] welcome state;
- [ ] suggested prompts;
- [ ] loading;
- [ ] empty states;
- [ ] error states;
- [ ] keyboard handling;
- [ ] acessibilidade.

---

# 56. Critérios de arquitetura

O agente **não deve começar implementando telas imediatamente**.

A ordem obrigatória é:

```text
Pesquisa do Aikuaa.ai
        ↓
Definição do Design System
        ↓
Arquitetura do frontend
        ↓
App Shell
        ↓
Chat UI
        ↓
Mocks
        ↓
Polish
        ↓
Interfaces para integração futura
```

O backend deve permanecer intocado.

---

# 57. Regra importante para o agente

O agente deve:

> **pesquisar antes de implementar.**

Não assumir que sabe como o Aikuaa deve parecer.

Deve consultar o website oficial e, quando necessário, pesquisar na web por informações públicas relacionadas ao Aikuaa para compreender melhor:

- produto;
- posicionamento;
- branding;
- estética;
- linguagem;
- experiência.

O objetivo não é copiar o site literalmente.

É **traduzir a identidade do Aikuaa para uma experiência mobile de AI assistant**.

---

# 58. Regra de design

O agente deve evitar criar:

> "mais um clone do ChatGPT."

O produto deve parecer:

> **Aikuaa + AI**

e não:

> **ChatGPT com logo Aikuaa.**

A conversa é o paradigma de interação, mas toda a experiência visual, linguagem, componentes e hierarquia devem pertencer ao Aikuaa.

---

# 59. Regra de escopo

**Nesta etapa, frontend only.**

Se durante a implementação o agente identificar que precisa de alguma funcionalidade backend:

1. não implementar o backend;
2. não alterar o backend existente;
3. criar uma interface/abstração no frontend;
4. criar mock para demonstrar a UX;
5. documentar o ponto de integração futura.

Exemplo:

```text
Frontend
    │
    ├── AIService interface
    │
    └── MockAIService
             ↓
       UI funcionando
```

Futuramente:

```text
Frontend
    │
    ├── AIService interface
    │
    └── RealAIService
             ↓
          Backend
             ↓
       RAG / MCP / Tools
```

---

# 60. Resultado esperado

Ao final do MVP, abrir o aplicativo deve proporcionar aproximadamente esta experiência:

```text
                AIKUAA

        Conheça o evento

       O que você quer
          descobrir?

       Quais empresas...
       Quem oferece...
       Encontre soluções...

────────────────────────────────

Pergunte ao Aikuaa...       ↑
```

Depois:

```text
Você

Quais empresas oferecem
soluções de inteligência
artificial?


              Aikuaa

Encontrei 8 empresas no
evento que trabalham com
inteligência artificial.

[Empresa A]
AI • São Paulo

[Empresa B]
Enterprise AI • Goiânia

...

Sources
2 fontes
```

Tudo isso pode ser demonstrado com dados mockados nesta etapa.

---

# 61. Objetivo final desta etapa

O resultado não deve ser apenas um conjunto de telas bonitas.

Deve ser:

> **um frontend React Native sólido, visualmente refinado e arquiteturalmente preparado para se tornar o aplicativo oficial de AI do Aikuaa.**

O evento é o primeiro caso de uso.

O produto real é:

> **o AI Assistant corporativo do Aikuaa.**

Portanto, o frontend deve ser desenvolvido com visão de produto, e não como um protótipo descartável.
