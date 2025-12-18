# Instruções de Deploy - Frontend Quiz Concursos

## Requisitos para SPA (Single Page Application)

Este frontend é uma aplicação React que funciona como SPA. Todas as rotas devem ser servidas pelo `index.html` para que o roteamento funcione corretamente.

### Para Apache/Laragon

O arquivo `.htaccess` na pasta `dist/` já está configurado para fazer o roteamento correto. Certifique-se de que:

1. `mod_rewrite` está ativado no Apache
2. `AllowOverride All` está configurado no virtual host
3. O arquivo `.htaccess` foi copiado para a pasta `dist/`

**Teste:**

```bash
curl -i https://quizconcursos.com/login
# Deve retornar 200 (não 404)
```

### Para Nginx

Se usando Nginx, adicione as seguintes rules ao bloco `server`:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location ~ \.(js|css|png|jpg|jpeg|gif|svg|webp|woff2|woff|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location = /index.html {
    expires 0;
    add_header Cache-Control "public, max-age=0, must-revalidate";
}
```

### Para IIS

O arquivo `web.config` na pasta `dist/` já está configurado. Certifique-se de que o `URL Rewrite Module` está instalado.

### Para Vercel/Netlify

O arquivo `_redirects` já está configurado para redirecionamento correto.

## Problemas Comuns

### Erro 404 em rotas do SPA

**Sintoma:** `GET /login 404 (Not Found)`

**Solução:** Verifique se:

1. O servidor está configurado para servir `index.html` para rotas inexistentes
2. O `.htaccess` ou `web.config` está na pasta correta
3. Para Apache: `AllowOverride All` está habilitado

### Erro MIME Type para JavaScript

**Sintoma:** `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/jsx"`

**Causa:** O servidor está servindo arquivos JavaScript com MIME type incorreto.

**Soluções:**

1. **Apache (.htaccess)** - Já configurado, mas verifique:

```apache
AddType application/javascript js
AddType application/javascript mjs
AddType application/javascript jsx
```

2. **Nginx** - Use o arquivo `nginx.conf.example` como referência:

```nginx
types {
    application/javascript js mjs jsx;
}
```

3. **IIS** - Já configurado em `web.config`. Se não funcionar:

   - Abra IIS Manager
   - Vá para MIME Types
   - Certifique-se de que `.js`, `.mjs` e `.jsx` mapeiam para `application/javascript`

4. **cPanel/Plesk** - Configure MIME types via painel:

   - Acesse Configurações → MIME Types
   - Adicione: `.js` → `application/javascript`
   - Adicione: `.jsx` → `application/javascript`
   - Adicione: `.mjs` → `application/javascript`

5. **Verificar no servidor:**

```bash
# Linux/Mac
file -i dist/assets/index.js

# Deve retornar algo como:
# dist/assets/index.js: text/plain; charset=utf-8
# Se retornar text/jsx, o MIME type está errado
```

## Verificação Pós-Deploy

1. Abra o navegador e acesse https://quizconcursos.com
2. Clique em um curso para comprar
3. Se não está logado, deve redirecionar para `/login`
4. Verifique se a página de login carrega corretamente
5. Faça login
6. Prossiga para o checkout do PIX ou Mercado Pago
