# 📦 Sistema de Lotes - Configuração

Este documento explica como funciona o **sistema híbrido de lotes** usado no projeto.

---

## 🎯 Como Funciona

O sistema utiliza uma **abordagem híbrida**:

1. **Dados básicos** → Banco de dados (tabela `lotes`)
2. **Configurações de kit e requisitos** → Código (`config/lotes.ts`)

### Por que híbrido?

- ✅ **Flexibilidade**: Altere valores e status no banco instantaneamente
- ✅ **Controle**: Configure kits e requisitos no código com precisão
- ✅ **Manutenibilidade**: Separação clara de responsabilidades
- ✅ **Preparado para API**: Fácil migração futura

---

## 📊 1. Dados do Banco (Tabela `lotes`)

**O que está no banco:**
- Nome do lote (ex: "1º Lote", "2º Lote")
- Valor (ex: 79.90, 89.90)
- Total de vagas
- Status (true = lote ativo)

**Estrutura da tabela:**

```sql
CREATE TABLE lotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  total_vagas INTEGER NOT NULL,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Inserir lotes:**

```sql
INSERT INTO lotes (nome, valor, total_vagas, status) VALUES
  ('1º Lote', 79.90, 100, true),
  ('2º Lote', 89.90, 150, false),
  ('3º Lote', 99.90, 200, false);
```

---

## 🎨 2. Configurações no Código (`config/lotes.ts`)

Baseado no **nome** do lote que vem do banco, aplica:
- **Itens do kit** (quais itens incluir)
- **Requisitos especiais** (ex: trazer alimentos)

### Estrutura da Configuração

```typescript
import { LoteBasico, LoteComKit, KitItem } from "@/types";

// Itens disponíveis do kit
export const KIT_ITEMS: Record<string, KitItem> = {
  camiseta: {
    id: "camiseta",
    name: "Camiseta Oficial",
    description: "Camiseta oficial do evento",
    image: "/kit/camiseta.png",
    icon: "👕",
  },
  medalha: {
    id: "medalha",
    name: "Medalha de Participação",
    description: "Medalha comemorativa",
    image: "/kit/medalha.png",
    icon: "🏅",
  },
  bolsa: {
    id: "bolsa",
    name: "Bolsa Esportiva",
    description: "Bolsa para guardar seus pertences",
    image: "/kit/bolsa.png",
    icon: "🎒",
  },
  garrafa: {
    id: "garrafa",
    name: "Garrafa de Água",
    description: "Garrafa reutilizável",
    image: "/kit/garrafa.png",
    icon: "🍶",
  },
  barra: {
    id: "barra",
    name: "Barra Energética",
    description: "Barra energética de alta qualidade",
    image: "/kit/barra.png",
    icon: "🍫",
  },
};

// Aplica configuração baseada no nome do lote
export const aplicarConfiguracaoLote = (loteBasico: LoteBasico): LoteComKit => {
  const { camiseta, medalha, bolsa, garrafa, barra } = KIT_ITEMS;

  switch (loteBasico.nome) {
    case "1º Lote":
      return {
        ...loteBasico,
        kit_items: [camiseta, medalha, bolsa, garrafa, barra], // Kit completo (5 itens)
      };

    case "2º Lote":
      return {
        ...loteBasico,
        kit_items: [camiseta, medalha, barra], // Kit reduzido (3 itens)
        requisitos_especiais: "Para retirar o kit é necessário trazer 1kg de alimento não perecível",
      };

    case "3º Lote":
      return {
        ...loteBasico,
        kit_items: [camiseta, medalha], // Kit mínimo (2 itens)
        requisitos_especiais: "Para retirar o kit é necessário trazer 2kg de alimento não perecível",
      };

    default:
      // Se não houver configuração, retorna com kit vazio
      return {
        ...loteBasico,
        kit_items: [],
      };
  }
};
```

---

## 🔧 3. Mudanças Rápidas

### Ativar Próximo Lote

**No banco de dados:**

```sql
-- Desativar lote atual
UPDATE lotes SET status = false WHERE status = true;

-- Ativar próximo lote
UPDATE lotes SET status = true WHERE nome = '2º Lote';
```

✅ **Resultado:** Sistema automaticamente busca o novo lote ativo e aplica suas configurações.

### Alterar Valor do Lote

**No banco de dados:**

```sql
UPDATE lotes SET valor = 95.00 WHERE nome = '2º Lote';
```

✅ **Resultado:** Novo valor aparece instantaneamente no site.

### Alterar Número de Vagas

**No banco de dados:**

```sql
UPDATE lotes SET total_vagas = 200 WHERE nome = '2º Lote';
```

### Adicionar/Remover Itens do Kit

**No código (`config/lotes.ts`):**

```typescript
case "2º Lote":
  return {
    ...loteBasico,
    kit_items: [
      KIT_ITEMS.camiseta,    // ✅ Incluído
      KIT_ITEMS.medalha,     // ✅ Incluído
      // KIT_ITEMS.barra,    // ❌ Removido (comentado)
      KIT_ITEMS.garrafa,     // ✅ Adicionado
    ],
  };
```

✅ **Resultado:** Interface atualiza automaticamente mostrando/ocultando itens.

### Alterar/Adicionar Requisito Especial

**No código (`config/lotes.ts`):**

```typescript
case "2º Lote":
  return {
    ...loteBasico,
    kit_items: [...],
    requisitos_especiais: "Trazer 2kg de alimento não perecível", // ← Alterar texto
  };

// Ou remover requisito
case "1º Lote":
  return {
    ...loteBasico,
    kit_items: [...],
    // requisitos_especiais: undefined, // ← Sem requisito
  };
```

✅ **Resultado:** Mensagem aparece/desaparece na página de inscrição.

---

## 🆕 4. Adicionar Novo Item ao Kit

### Passo 1: Adicionar imagem

Coloque a imagem em `public/kit/novo-item.png`

### Passo 2: Definir o item

**Em `config/lotes.ts`:**

```typescript
export const KIT_ITEMS: Record<string, KitItem> = {
  // ... itens existentes
  
  toalha: {
    id: "toalha",
    name: "Toalha Esportiva",
    description: "Toalha de microfibra para atletas",
    image: "/kit/toalha.png",
    icon: "🧺",
  },
};
```

### Passo 3: Adicionar ao lote

```typescript
case "1º Lote":
  return {
    ...loteBasico,
    kit_items: [
      KIT_ITEMS.camiseta,
      KIT_ITEMS.medalha,
      KIT_ITEMS.bolsa,
      KIT_ITEMS.garrafa,
      KIT_ITEMS.barra,
      KIT_ITEMS.toalha, // ← Novo item
    ],
  };
```

---

## 🚀 5. Preparado para API

O sistema está preparado para migrar para uma API completa de lotes sem quebrar código:

### Atual (configuração local)

```typescript
export const fetchLoteVigente = async (): Promise<LoteComKit | null> => {
  // Busca do banco
  const loteBasico = await buscarLoteDoBanco();
  
  // Aplica configuração
  const loteComKit = aplicarConfiguracaoLote(loteBasico);
  
  return loteComKit;
};
```

### Futuro (API completa)

```typescript
export const fetchLoteVigente = async (): Promise<LoteComKit | null> => {
  // Busca tudo da API
  const response = await fetch('/api/lotes/vigente');
  return response.json();
};
```

✅ **Sem quebrar:** Os componentes não precisam ser alterados!

---

## ✅ Vantagens desta Abordagem

- ✅ **Simples**: Alterações rápidas no banco ou código
- ✅ **Rápido**: Sem complexidade desnecessária
- ✅ **Flexível**: Configure qualquer cenário de kit
- ✅ **Preparado**: Migração futura sem retrabalho
- ✅ **Visual**: Interface se adapta automaticamente
- ✅ **Testável**: Fácil de testar diferentes configurações
- ✅ **Manutenível**: Código limpo e organizado

---

## 🎯 Exemplo Prático Completo

### Cenário: Ativar 2º Lote com Kit Reduzido

**Objetivo:** Passar para o 2º lote, reduzir kit e exigir alimentos.

#### Passo 1: Banco de dados

```sql
-- Desativar 1º lote
UPDATE lotes SET status = false WHERE nome = '1º Lote';

-- Ativar 2º lote
UPDATE lotes SET status = true WHERE nome = '2º Lote';
```

#### Passo 2: Código (já configurado)

```typescript
case "2º Lote":
  return {
    ...loteBasico,
    kit_items: [camiseta, medalha, barra], // Apenas 3 itens
    requisitos_especiais: "Trazer 1kg de alimento não perecível",
  };
```

#### Resultado Automático:

- ✅ Valor muda para R$ 89,90
- ✅ Kit mostra apenas 3 itens (camiseta, medalha, barra)
- ⚠️ Aparece aviso: "Trazer 1kg de alimento não perecível"
- ✅ Mudanças aplicadas em todas as páginas instantaneamente

**Simples assim!** 🎉

---

## 📝 Notas Importantes

1. **Sempre teste localmente** antes de fazer mudanças em produção
2. **Nome do lote é case-sensitive** - "1º Lote" ≠ "1º lote"
3. **Status = true** indica o lote ativo (apenas um por vez)
4. **Imagens do kit** devem estar em `/public/kit/`
5. **Após alterar código**, restart do servidor dev é necessário

---

## 🔗 Links Úteis

- [Documentação Completa](../README.md)
- [Configuração do Evento](../config/event.ts)
- [Tipos TypeScript](../types/index.ts)

---

**Dúvidas?** Consulte a documentação principal no README.md da raiz do projeto.
