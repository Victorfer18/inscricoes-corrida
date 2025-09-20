# 📦 Sistema Híbrido: Banco + Configuração

Sistema que busca dados básicos do banco de dados (lote com status = true) e aplica configurações de kit e requisitos no código.

## 🎯 Como Funciona

### 1. Dados do Banco (Tabela `lotes`)
- **Nome do lote** (ex: "1º Lote", "2º Lote")
- **Valor** (ex: 79.9, 89.9)
- **Total de vagas**
- **Status** (true = lote vigente)

### 2. Configurações no Código (`config/lotes.ts`)
Baseado no **nome** do lote que vem do banco, aplica:

```typescript
export const aplicarConfiguracaoLote = (loteBasico: LoteBasico): LoteComKit => {
  switch (loteBasico.nome) {
    case "1º Lote":
      return {
        ...loteBasico,
        kit_items: [camiseta, medalha, bolsa, garrafa, barra], // Kit completo
      };

    case "2º Lote":
      return {
        ...loteBasico,
        kit_items: [camiseta, barra, medalha], // Apenas 3 itens
        requisitos_especiais: "Para retirar o kit é necessário trazer 1kg de alimento não perecível",
      };
  }
};
```

## 🔧 Mudanças Rápidas

### Ativar Segundo Lote
**No banco de dados:**
```sql
-- Desativar lote atual
UPDATE lotes SET status = false WHERE status = true;

-- Ativar segundo lote
UPDATE lotes SET status = true WHERE nome = '2º Lote';
```

### Alterar Valor
**No banco de dados:**
```sql
UPDATE lotes SET valor = 95.0 WHERE nome = '2º Lote';
```

### Adicionar/Remover Itens do Kit
**No código (`config/lotes.ts`):**
```typescript
case "2º Lote":
  return {
    ...loteBasico,
    kit_items: [
      KIT_ITEMS.camiseta,    // ← Manter
      KIT_ITEMS.medalha,     // ← Manter
      // KIT_ITEMS.barra,    // ← Remover (comentar)
      KIT_ITEMS.garrafa,     // ← Adicionar
    ],
  };
```

### Alterar Requisito Especial
**No código (`config/lotes.ts`):**
```typescript
case "2º Lote":
  return {
    ...loteBasico,
    requisitos_especiais: "Trazer 2kg de alimento não perecível", // ← Alterar
    // requisitos_especiais: undefined, // ← Remover
  };
```

## 📦 Itens Disponíveis

Todos os itens estão pré-definidos em `KIT_ITEMS`:

- `KIT_ITEMS.camiseta` - Camiseta Oficial
- `KIT_ITEMS.medalha` - Medalha de Participação  
- `KIT_ITEMS.bolsa` - Bolsa Esportiva
- `KIT_ITEMS.garrafa` - Garrafa de Água
- `KIT_ITEMS.barra` - Barra Energética

### Adicionar Novo Item
```typescript
export const KIT_ITEMS: Record<string, KitItem> = {
  // ... itens existentes
  
  novo_item: {
    id: "novo_item",
    name: "Novo Item",
    description: "Descrição do novo item",
    image: "/kit/novo-item.png", // ← Adicionar imagem em public/kit/
    icon: "🆕",
  },
};
```

## 🚀 Preparado para API

O sistema está preparado para migrar para API sem quebrar:

```typescript
// Atual (configuração local)
export const fetchLoteVigente = async (): Promise<LoteConfig | null> => {
  return getLoteVigente();
};

// Futuro (API)
export const fetchLoteVigente = async (): Promise<LoteConfig | null> => {
  const response = await fetch('/api/lotes/vigente');
  return response.json();
};
```

## ✅ Vantagens

- ✅ **Simples**: Uma única alteração no arquivo
- ✅ **Rápido**: Sem banco de dados complexo
- ✅ **Flexível**: Fácil de configurar qualquer cenário
- ✅ **Preparado**: Migração para API sem quebrar código
- ✅ **Visual**: Interface se adapta automaticamente

## 🎯 Exemplo Prático

**Para ativar o segundo lote com requisito de alimento:**

1. Abrir `config/lotes.ts`
2. Alterar `status: false` para `status: true` no lote-2
3. Alterar `status: true` para `status: false` no lote-1
4. Salvar arquivo

**Resultado automático:**
- ✅ Valor muda para R$ 89,90
- ✅ Kit mostra apenas 3 itens (camiseta, barra, medalha)
- ⚠️ Aparece aviso: "Trazer 1kg de alimento não perecível"
- ✅ Mudanças em todas as páginas instantaneamente

Simples assim! 🎉
