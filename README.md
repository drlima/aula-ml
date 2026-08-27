# Aula 1 — Machine Learning do zero

Aula ao vivo, interativa, para iniciantes absolutos. Uma única página HTML hospedada no
GitHub Pages: `site/index.html`. Sem build, sem servidor, sem dependências.

**Link da aula:** https://drlima.github.io/aula-ml/

## Estrutura

| Arquivo | O que é |
|---|---|
| `site/index.html` | A aula inteira: texto, ilustrações interativas (SVG/JS puro) e um bloco final de Python que roda no navegador via Pyodide. |
| `GUIA_DO_PROFESSOR.md` | Roteiro com tempos e os *punches* de cada bloco. |
| `.github/workflows/deploy.yml` | Publica a pasta `site/` a cada push na `main`. |

## Editar

Abra `site/index.html` em qualquer editor. Para ver localmente, basta abrir o arquivo no
navegador (ou `python -m http.server --directory site`). Cada bloco da aula é uma
`<section class="block">`; os widgets são funções curtas no `<script>` ao final, uma por bloco.

## Publicar

`git push` na `main`. O GitHub Pages precisa estar configurado com **Source: GitHub Actions**
(Settings → Pages).

## Na aula ao vivo

- Peça que abram o link antes de começar. A página em si carrega instantaneamente; só o
  bloco 8 (Python) baixa ~20 MB, e só quando o aluno clica em "Rodar Python".
- As interações são individuais. Para votação da turma, use o chat da plataforma de vídeo.
