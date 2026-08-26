# Aula 1 — Machine Learning do zero

Aula ao vivo, interativa, hospedada no GitHub Pages. O Python roda **dentro do navegador**
(Pyodide/WebAssembly): os alunos abrem um link e já podem executar e editar o código, sem
instalar nada. Cada aluno tem sua própria cópia rodando localmente; mudanças não afetam os outros.

**Link da aula:** https://drlima.github.io/aula-ml/

## Estrutura

| Arquivo | O que é |
|---|---|
| `aula.py` | O conteúdo da aula (notebook reativo do [marimo](https://marimo.io)). Edite aqui. |
| `GUIA_DO_PROFESSOR.md` | Roteiro com tempos e os *punches* de cada bloco. |
| `.github/workflows/deploy.yml` | Publica automaticamente a cada `push` na branch `main`. |
| `site/` | Saída gerada (não versionada). |

## Como funciona a publicação

Toda alteração em `aula.py` enviada para `main` dispara o workflow (aba **Actions**, ~2 min),
que gera o HTML e publica no GitHub Pages. Não há servidor, deploy manual ou DNS para cuidar.

## Editar e testar localmente

```bash
pip install -r requirements.txt
marimo edit aula.py          # editor interativo no navegador
```

Para gerar o site exatamente como o GitHub vai gerar:

```bash
marimo export html-wasm aula.py -o site --mode edit
python -m http.server --directory site
```

## Observações para a aula ao vivo

- O primeiro carregamento baixa o Python + scikit-learn (~30 MB). Peça aos alunos que abram o
  link **antes** da aula começar.
- O site funciona em qualquer navegador moderno de desktop. Em celular funciona, mas a
  experiência de edição é ruim.
- As enquetes (os "Pense antes de revelar") são individuais. Para votação da turma inteira,
  use o chat/enquete da plataforma de vídeo; a página dá a cada aluno um ambiente para executar.
- `--mode edit` deixa o código editável. Se preferir só leitura (com os controles ainda
  funcionando), troque para `--mode run` no workflow.
