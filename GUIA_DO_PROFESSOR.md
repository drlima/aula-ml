# Guia do professor — Aula 1 ao vivo (~1h30)

A página publicada é o material dos alunos. Este guia é o seu: tempos, o *setup* de cada
bloco, o *punch* que a página revela e o que fazer ao vivo enquanto a turma pensa.

**Regra do formato:** você lança a pergunta em voz alta, pede votos no chat, espera 60–90 s,
comenta duas ou três respostas, e só então diz "agora abram o Revelar". Os alunos que abrem
antes estragam a própria surpresa, não a dos outros.

**Antes de começar (5 min antes):** peça que todos abram o link. O primeiro carregamento baixa
o Python no navegador. Enquanto carrega, peça que digitem no chat de onde são e o que fazem.
Você vai usar isso nos exemplos.

| Bloco da página | Tempo | O que acontece ao vivo |
|---|---|---|
| 1. Regras | 5 min | Pede regras no chat. Você derruba cada uma com um contra-exemplo na hora. Punch: ML inverte a lógica. |
| 2. Aprender | 10 min | Votação por multiselect. Punch: definição T/E/P. Pergunte "qual é o T, E e P do filtro de spam?" |
| 3. Gabarito | 10 min | Tabela A vs B. Peça um exemplo não supervisionado da área profissional de alguém do chat. |
| 4. Rótulo ou número | 10 min | Quiz de 6 itens com correção instantânea. Peça que digitem a pontuação no chat. Quem errou "idade pela foto" é ótimo gancho: "a saída é um número, não importa que a entrada seja imagem". |
| 5. Escolha o problema | 10 min | **Peça que cada aluno escolha um dataset diferente.** Rode `X.shape` e pergunte "quem tem 569 linhas? quem tem 1797?". A turma percebe que o mesmo código carregou botânica, medicina, química e imagens. |
| 6. Vizinhos | 15 min | Arrastam o ponto vermelho. Pergunta-chave: "como chutam sem fórmula?". Punch: k-NN. Depois `score` = 1.0. **Não comente o 100%.** Vá para o intervalo ou para o bloco 7 com a turma achando que resolveu ML. |
| 7. Armadilha | 15 min | "Podemos entregar?" Deixe a euforia durar. Punch: vizinho mais próximo é ele mesmo. `train_test_split` com o slider: peça que testem 0.1 e 0.9 e digam o que acontece com o tamanho do treino. |
| 8. k | 10 min | Apostas no chat antes de mover o slider. Gráfico treino×teste. Peça que troquem de dataset e vejam a curva mudar. Deixe a última pergunta ("escolhi k olhando o teste — tem problema?") sem resposta. |
| 9. Fechamento | 5 min | Tabela-resumo. Anuncie as três perguntas abertas como programa da próxima aula. |

## Variabilidade de exemplos (por onde passam)

- Spam / e-mail (bloco 1)
- Recomendação de música, câmera do celular, termostato, corretor, calculadora (bloco 2)
- Churn de operadora de celular, fraude, notícias, segmentação (bloco 3)
- Imóveis, clima, cheques, idade por foto, tumor, internação hospitalar (bloco 4)
- Botânica, oncologia, enologia, visão computacional — **executados** (blocos 5–8)

## Planos B

- **Turma silenciosa:** substitua perguntas abertas por votação binária no chat ("1 ou 2").
- **Site não carrega para alguém:** compartilhe sua tela; a aula funciona em modo demonstração. O aluno abre o link depois.
- **Sobrou tempo:** o desafio de casa (`DecisionTreeClassifier`) vira demonstração ao vivo. Reforça `fit`/`predict`/`score` sem conceito novo.
- **Faltou tempo:** corte o bloco 8 (vira tarefa: "mova o slider e explique a curva"). Blocos 6 e 7 são inegociáveis.
