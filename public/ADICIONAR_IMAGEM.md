# Como Adicionar a Imagem do Evento

Para substituir o placeholder pela imagem oficial do evento, siga estes passos:

## 📁 Passo 1: Salvar a Imagem
1. Salve a imagem fornecida na pasta `public/` com um destes nomes:
   - `corrida-outubro-rosa.png` (preferível)
   - `corrida-outubro-rosa.jpg` (alternativo)

## 📍 Localização Correta
```
projeto/
├── public/
│   ├── corrida-outubro-rosa.png  ← Adicione aqui
│   └── ...outros arquivos
```

## 🔄 Resultado
Após adicionar a imagem:
- O placeholder será automaticamente substituído pela imagem real
- A imagem aparecerá em duas posições na página inicial
- Não é necessário reiniciar o servidor

## 📏 Especificações da Imagem
- **Formato**: PNG ou JPG
- **Tamanho recomendado**: 300x300px ou maior
- **Qualidade**: Alta resolução para melhor visualização

## ❗ Importante
- O nome do arquivo deve ser exatamente `corrida-outubro-rosa.png` ou `corrida-outubro-rosa.jpg`
- A imagem deve estar diretamente na pasta `public/`, não em subpastas
- Após adicionar, recarregue a página no navegador (F5)

## 🎯 Placeholder Atual
Enquanto a imagem não for adicionada, será exibido um placeholder com:
- Emoji de corrida 🏃‍♀️
- Texto "1ª CORRIDA E CAMINHADA"
- "PROJETO JAÍBA"
- "OUTUBRO ROSA"
- Cores rosa e roxo do tema
