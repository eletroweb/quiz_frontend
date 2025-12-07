# Guia: Usando @uiw/react-md-editor

Este guia mostra como usar o novo editor Markdown `@uiw/react-md-editor` no lugar do `react-markdown-editor-lite`.

## Instalação

Já instalado! ✅

```json
"@uiw/react-md-editor": "^4.0.11",
"@uiw/react-markdown-preview": "^5.1.5"
```

## Uso Básico

### Importar

```jsx
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
```

### Componente Simples

```jsx
import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

function MyEditor() {
  const [value, setValue] = useState('**Hello world!!!**');

  return (
    <MDEditor
      value={value}
      onChange={setValue}
      height={400}
    />
  );
}
```

### Preview Apenas (Somente Leitura)

```jsx
import MarkdownPreview from '@uiw/react-markdown-preview';

function MyPreview({ content }) {
  return (
    <MarkdownPreview 
      source={content}
      style={{ padding: 16 }}
    />
  );
}
```

## Exemplo Completo com Material-UI

```jsx
import React, { useState } from 'react';
import { Box, Paper } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';

function ContentEditor({ initialValue, onChange }) {
  const [value, setValue] = useState(initialValue || '');

  const handleChange = (newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <MDEditor
        value={value}
        onChange={handleChange}
        height={400}
        preview="edit" // 'edit' | 'live' | 'preview'
      />
    </Paper>
  );
}

export default ContentEditor;
```

## Propriedades Principais

### MDEditor

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `value` | string | - | Conteúdo markdown |
| `onChange` | function | - | Callback quando o valor muda |
| `height` | number/string | 200 | Altura do editor |
| `preview` | 'edit' \| 'live' \| 'preview' | 'live' | Modo de visualização |
| `hideToolbar` | boolean | false | Esconder barra de ferramentas |
| `enableScroll` | boolean | true | Habilitar scroll |

### MarkdownPreview

| Prop | Tipo | Descrição |
|------|------|-----------|
| `source` | string | Conteúdo markdown para renderizar |
| `style` | object | Estilos CSS customizados |
| `className` | string | Classe CSS |

## Modos de Visualização

```jsx
// Apenas edição
<MDEditor value={value} onChange={setValue} preview="edit" />

// Edição + Preview lado a lado
<MDEditor value={value} onChange={setValue} preview="live" />

// Apenas preview
<MDEditor value={value} onChange={setValue} preview="preview" />
```

## Customização de Tema

### Tema Escuro

```jsx
import MDEditor from '@uiw/react-md-editor';

<div data-color-mode="dark">
  <MDEditor value={value} onChange={setValue} />
</div>
```

### Tema Claro

```jsx
<div data-color-mode="light">
  <MDEditor value={value} onChange={setValue} />
</div>
```

## Integração com Formulários

```jsx
function ConteudoForm() {
  const [form, setForm] = useState({
    titulo: '',
    conteudo: ''
  });

  return (
    <Box>
      <TextField
        label="Título"
        value={form.titulo}
        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Conteúdo
      </Typography>
      <MDEditor
        value={form.conteudo}
        onChange={(value) => setForm({ ...form, conteudo: value })}
        height={400}
      />
    </Box>
  );
}
```

## Comparação com react-markdown-editor-lite

### Antes (react-markdown-editor-lite)

```jsx
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

<MdEditor
  value={value}
  style={{ height: '500px' }}
  renderHTML={(text) => mdParser.render(text)}
  onChange={({ text }) => setValue(text)}
/>
```

### Depois (@uiw/react-md-editor)

```jsx
import MDEditor from '@uiw/react-md-editor';

<MDEditor
  value={value}
  onChange={setValue}
  height={500}
/>
```

**Vantagens:**
- ✅ Mais simples (não precisa de parser externo)
- ✅ Melhor suporte a React 19
- ✅ Mais leve
- ✅ Melhor performance
- ✅ Temas dark/light integrados
- ✅ Sem conflitos no Netlify

## Recursos Adicionais

- [Documentação Oficial](https://uiwjs.github.io/react-md-editor/)
- [Exemplos no CodeSandbox](https://codesandbox.io/s/markdown-editor-for-react-izdd6)
- [GitHub](https://github.com/uiwjs/react-md-editor)

## Troubleshooting

### Editor não aparece

Certifique-se de importar os estilos:

```jsx
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
```

### Conflito com Material-UI

Envolva o editor em um container:

```jsx
<Box sx={{ '& .w-md-editor': { zIndex: 1 } }}>
  <MDEditor value={value} onChange={setValue} />
</Box>
```

### Build no Netlify

O editor funciona perfeitamente no Netlify sem configurações adicionais! 🎉
