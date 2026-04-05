# Assets - Instruções

## Imagens Necessárias

Para o funcionamento completo do aplicativo, você precisa adicionar as seguintes imagens na pasta `assets/`:

### 1. default-avatar.png

**Descrição:** Imagem padrão do avatar do usuário  
**Dimensões recomendadas:** 200x200 pixels  
**Formato:** PNG com fundo transparente  
**Sugestão:** Ícone de pessoa ou silhueta genérica

**Como criar:**

- Use um editor como Canva, Figma ou Photoshop
- Crie um ícone circular de pessoa
- Cores sugeridas: Cinza ou azul claro
- Exporte como PNG

### 2. icon.png

**Descrição:** Ícone do aplicativo  
**Dimensões:** 1024x1024 pixels  
**Formato:** PNG  
**Sugestão:** Ícone de filme (🎬) ou câmera

### 3. splash.png

**Descrição:** Tela de splash (carregamento inicial)  
**Dimensões:** 1242x2436 pixels (ou maior)  
**Formato:** PNG  
**Fundo:** Vermelho (#E50914 - Netflix red)

### 4. adaptive-icon.png (Android)

**Descrição:** Ícone adaptativo para Android  
**Dimensões:** 1024x1024 pixels  
**Formato:** PNG com área de segurança
**Fundo transparente**

### 5. favicon.png (Web)

**Descrição:** Favicon para versão web  
**Dimensões:** 48x48 pixels  
**Formato:** PNG

## Onde Baixar Ícones Gratuitos

### Sites Recomendados:

1. **Flaticon** (https://www.flaticon.com/)
   - Busque por: "movie", "cinema", "film", "avatar"

2. **Icons8** (https://icons8.com/)
   - Seção de ícones de cinema e entretenimento

3. **Freepik** (https://www.freepik.com/)
   - Ícones vetoriais gratuitos

4. **Expo Icon Tool** (https://icon.expo.fyi/)
   - Gera automaticamente todos os ícones necessários

## Instalação Rápida

Se você não quiser criar ícones agora, pode:

1. Usar os ícones padrão do Expo (já incluídos)
2. Adicionar depois conforme necessário
3. O app funcionará mesmo sem esses assets personalizados

## Nota sobre default-avatar.png

O arquivo `default-avatar.png` é usado quando o usuário ainda não definiu uma foto de perfil. Enquanto você não adicionar, pode:

1. Temporariamente usar um require vazio (o app mostrará um placeholder)
2. Comentar a linha de importação e usar apenas o Ionicons como fallback
3. Baixar um avatar genérico de sites como: https://www.pngwing.com/en/search?q=default+avatar

**Exemplo alternativo temporário:**
Em vez de `require('../../assets/default-avatar.png')`, você pode usar:

```javascript
const DEFAULT_AVATAR = {
  uri: "https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Avatar",
};
```

Isso usará um placeholder online até você adicionar a imagem real.
