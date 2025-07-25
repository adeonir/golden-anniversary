# PRD - Documento de Requisitos do Produto

## Visão Geral

**Objetivo**: Criar um site comemorativo para promover e celebrar os 50 anos de casamento de Iria & Ari.

**Cronograma**: Festa em 8 de novembro de 2025

**Público-alvo**: Família e amigos do casal

## Objetivos do Produto

### Objetivo Principal

Promover os 50 anos de casamento de Iria & Ari e proporcionar uma experiência digital memorável para celebrar essa conquista.

## Personas

### Convidado/Visitante

- Família e amigos do casal
- Idades variadas (20-80 anos)
- Diferentes níveis de familiaridade com tecnologia
- Acesso via mobile e desktop
- Quer deixar uma mensagem carinhosa

### Administrador

- Desenvolvedor e familiar responsável pelo site
- Controle total sobre o conteúdo
- Moderação de mensagens
- Gerenciamento da galeria de fotos

## Funcionalidades

### 1. Header/Seção Hero

- **Descrição**: Seção principal com nomes do casal, data especial e design elegante
- **Conteúdo**: Estático
- **Responsabilidade**: Apresentar o casal e o motivo da celebração

### 2. Contador Regressivo

- **Descrição**: Contador regressivo para a data da festa
- **Data alvo**: 8 de novembro de 2025, 18:30
- **Formato**: Dias, horas, minutos, segundos
- **Comportamento**: Atualizações em tempo real

### 3. Galeria de Fotos

- **Controle**: Upload inicial manual (admin via painel no backlog)
- **Visualização**: Carousel principal + grid de miniaturas
- **Performance**: Lazy loading e otimização de imagens
- **Navegação**: Setas, miniaturas clicáveis
- **Responsividade**: Adaptável para mobile e desktop

### 4. Mensagens da Família

- **Descrição**: Seção especial com mensagens dos filhos e netos

### 5. Livro de Visitas

- **Postagem**: Qualquer visitante pode enviar uma mensagem
- **Moderação**: Todas as mensagens requerem aprovação do admin
- **Notificação**: Digest diário às 20h com todas as mensagens pendentes (via Vercel Cron)
- **Limite**: 500 caracteres por mensagem
- **Campos obrigatórios**: Nome e mensagem
- **Exibição**: 5 mensagens por página (paginação)
- **Status**: Pendente → Aprovada → Visível

### 6. Linha do Tempo

- **Descrição**: Seção dedicada aos marcos importantes na vida do casal
- **Visualização**: Timeline interativa com datas e eventos
- **Design**: Timeline com cards de eventos

### 7. Rodapé

- **Conteúdo**: Citação inspiradora, créditos
- **Links futuros**: Website do desenvolvedor

### 8. Painel Administrativo

- **Acesso**: Autenticação via Supabase Auth
- **Notificações**:
  - Email alias via variável de ambiente
  - Digest diário fixo às 20h
  - Cron job via Vercel Cron + backup GitHub Actions
- **Funcionalidades**:
  - Aprovar/rejeitar mensagens do livro de visitas
  - Upload e gerenciamento de fotos da galeria
  - Visualizar estatísticas básicas

## Critérios de Sucesso

### Técnicos

- **Performance**: Tempo de carregamento < 3 segundos
- **Responsividade**: Funciona em mobile (375px+) e desktop (1024px+)
- **Escalabilidade**: Suporte até 1.000 mensagens
- **Disponibilidade**: 99.9% uptime durante período ativo

### UX/UI

- **Acessibilidade**: Contraste adequado, navegação por teclado
- **Usabilidade**: Fluxo intuitivo de envio de mensagens
- **Design**: Elegante, temático (dourado), celebrativo

### Funcionais

- **Livro de Visitas**: Sistema de moderação 100% funcional
- **Galeria**: Exibição suave de fotos otimizadas
- **Admin**: Interface de moderação simples e eficaz

## Definição de Pronto

O produto será considerado pronto quando:

- Todas as funcionalidades principais estiverem implementadas
- Design responsivo estiver funcionando
- Sistema de moderação estiver operacional
- Performance atender aos critérios
- Deploy concluído e domínio configurado
- Admin treinado para uso básico
