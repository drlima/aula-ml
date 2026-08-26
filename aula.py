import marimo

__generated_with = "0.24.0"
app = marimo.App(width="medium", app_title="Aula 1 - Machine Learning do zero")


@app.cell
def _():
    import marimo as mo

    return (mo,)


@app.cell
def _(mo):
    mo.md(r"""
    # Machine Learning do zero

    **Uma aula ao vivo, guiada por perguntas.**

    Esta página roda Python de verdade **dentro do seu navegador**. Nada precisa ser instalado.
    Tudo o que você vê aqui é editável: mova os controles, mude o código, quebre as coisas.
    Se algo der errado, basta recarregar a página.

    > **Como usar durante a aula:** cada bloco abre com uma pergunta. Pense na sua resposta
    > (ou vote no chat) *antes* de abrir o painel **Revelar**. A graça está em errar primeiro.

    ---

    **Mapa da aula**

    1. O problema que não cabe em regras
    2. O que significa "aprender"?
    3. Tem gabarito ou não? (supervisionado vs não supervisionado)
    4. A resposta é um rótulo ou um número? (classificação vs regressão)
    5. Dados como tabela: escolha o seu problema
    6. O primeiro modelo: vizinhos mais próximos
    7. A armadilha do 100%
    8. Girando o botão: o hiperparâmetro k
    9. O que fica aberto
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 1. O problema que não cabe em regras

    Três mensagens chegaram na sua caixa de entrada:

    | | Mensagem |
    |---|---|
    | A | "PARABÉNS!!! Você ganhou um iPhone GRÁTIS, clique aqui" |
    | B | "Oi, chegou a fatura do cartão, está disponível no link" |
    | C | "Entrada grátis no show de sábado, bora? Me responde" |

    **Pergunta:** escreva, em uma linha, uma regra que separe spam de não-spam.
    """)
    return


@app.cell
def _(mo):
    regra = mo.ui.text(placeholder='ex.: contém a palavra "grátis"', label="Sua regra:", full_width=True)
    regra
    return (regra,)


@app.cell
def _(mo, regra):
    mo.accordion(
        {
            "Revelar": mo.md(
                f"""
    Sua regra: *{regra.value or "(em branco)"}*

    Qualquer regra que você tenha escrito tem um contra-exemplo na tabela:

    - "contém grátis" → a mensagem **C** é da sua amiga
    - "tem link" → a mensagem **B** é do seu banco
    - "tem letras maiúsculas" → e um e-mail urgente do trabalho?

    Você acabou de fazer o que engenheiros fizeram por 30 anos: **escrever regras à mão**.
    E acabou de descobrir por que isso não funciona: o mundo tem mais casos do que qualquer
    lista de regras consegue cobrir.

    **Machine Learning é a inversão dessa lógica.** Em vez de escrever a regra, damos
    exemplos e deixamos o computador *descobrir* a regra sozinho.

    Guarde essa frase. A aula inteira vai torná-la precisa.
    """
            )
        }
    )
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 2. O que significa "aprender"?

    **Pergunta:** quais destes sistemas *aprendem*? Marque todos que você acha que sim.
    """)
    return


@app.cell
def _(mo):
    aprende = mo.ui.multiselect(
        options=[
            "Termostato que liga o aquecedor abaixo de 18 °C",
            "Corretor ortográfico com dicionário fixo",
            "Aplicativo de música sugerindo a próxima faixa",
            "Calculadora",
            "Câmera do celular que reconhece o rosto do dono",
        ],
        label="Aprendem:",
    )
    aprende
    return (aprende,)


@app.cell
def _(aprende, mo):
    certos = {
        "Aplicativo de música sugerindo a próxima faixa",
        "Câmera do celular que reconhece o rosto do dono",
    }
    escolha = set(aprende.value)
    acertou = escolha == certos
    mo.accordion(
        {
            "Revelar": mo.md(
                f"""
    {"**Acertou em cheio.**" if acertou else "**Quase.** Compare com o critério abaixo."}

    Só o **app de música** e a **câmera** aprendem. O critério é preciso:

    > Um sistema aprende quando seu **desempenho** em uma **tarefa** melhora com a **experiência**.
    > *(Tom Mitchell, 1997)*

    O termostato de hoje se comporta exatamente como o de ontem, não importa quantos invernos
    passe. O app de música de hoje sugere diferente do de um mês atrás porque *viu mais dados*.

    Os três ingredientes de qualquer problema de ML:

    | Ingrediente | App de música | Câmera do celular | Filtro de spam |
    |---|---|---|---|
    | **Tarefa (T)** | sugerir a próxima faixa | reconhecer o dono | separar spam |
    | **Experiência (E)** | histórico de músicas ouvidas/puladas | fotos do dono na configuração | e-mails já marcados por usuários |
    | **Desempenho (P)** | quantas sugestões você ouviu até o fim | taxa de desbloqueio correto | % de e-mails classificados certo |

    Sempre que você se perder nesta aula, a pergunta de socorro é: *"isso é T, E ou P?"*
    """
            )
        }
    )
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 3. Tem gabarito ou não?

    Duas tabelas de clientes de uma operadora de celular. Mesmas colunas, uma diferença.

    **Tabela A**

    | idade | gasto mensal (R$) | ligações ao suporte | **cancelou?** |
    |---|---|---|---|
    | 34 | 89 | 0 | não |
    | 22 | 45 | 4 | sim |
    | 51 | 120 | 1 | não |

    **Tabela B**

    | idade | gasto mensal (R$) | ligações ao suporte |
    |---|---|---|
    | 34 | 89 | 0 |
    | 22 | 45 | 4 |
    | 51 | 120 | 1 |

    **Pergunta:** o que dá para fazer com a Tabela A que **não** dá com a B?
    """)
    return


@app.cell
def _(mo):
    mo.accordion(
        {
            "Revelar": mo.md(
                r"""
    Com a **A** podemos *prever* se um cliente novo vai cancelar, porque temos o
    **gabarito** (a coluna "cancelou?") para aprender a relação entre as medidas e o resultado.

    Com a **B** não há o que prever. O máximo que dá é *agrupar* clientes parecidos e descobrir,
    por exemplo, que existem três perfis distintos de consumo.

    | | Os dados vêm com a resposta? | Tarefa | Exemplos |
    |---|---|---|---|
    | **Supervisionado** | sim | aprender o mapa `entrada → resposta` | spam, diagnóstico médico, previsão de preço, reconhecimento de voz |
    | **Não supervisionado** | não | encontrar estrutura escondida | segmentar clientes, detectar fraude atípica, agrupar notícias por assunto |

    Existe uma terceira família, o **aprendizado por reforço** (o agente aprende por tentativa e
    recompensa, como em jogos e robôs), mas esta aula fica no supervisionado, onde estão a
    maioria das aplicações que você vai encontrar.
    """
            )
        }
    )
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 4. A resposta é um rótulo ou um número?

    Mesma tabela de imóveis (área, quartos, bairro, ano de construção). Duas perguntas:

    - **(a)** Quanto vale este apartamento?
    - **(b)** Ele vende em menos de 30 dias?

    **Pergunta:** são o mesmo tipo de problema?
    """)
    return


@app.cell
def _(mo):
    mo.accordion(
        {
            "Revelar": mo.md(
                r"""
    A **entrada** é idêntica. O que muda é o **tipo de saída**:

    - (a) a resposta é um **número contínuo** (R$ 480.000, R$ 512.300…) → **regressão**
    - (b) a resposta é uma **categoria** de um conjunto finito (sim / não) → **classificação**

    A distinção está *só* na saída. Não é "regressão usa mais matemática" nem "regressão tem
    números na entrada". A pergunta é uma só: *a resposta é um rótulo ou uma quantidade?*
    """
            )
        }
    )
    return


@app.cell
def _(mo):
    mo.md(r"""
    **Teste-relâmpago:** classifique cada problema. Você recebe a correção na hora.
    """)
    return


@app.cell
def _(mo):
    quiz_itens = [
        ("Prever a temperatura de amanhã", "Regressão"),
        ("Prever se vai chover amanhã", "Classificação"),
        ("Ler o dígito escrito à mão em um cheque", "Classificação"),
        ("Estimar a idade de uma pessoa pela foto", "Regressão"),
        ("Dizer se um tumor é benigno ou maligno", "Classificação"),
        ("Prever quantos dias um paciente ficará internado", "Regressão"),
    ]
    quiz = mo.ui.array(
        [mo.ui.radio(options=["Classificação", "Regressão"], label=q, inline=True) for q, _ in quiz_itens]
    )
    quiz
    return quiz, quiz_itens


@app.cell
def _(mo, quiz, quiz_itens):
    linhas = []
    pontos = 0
    for (pergunta, gabarito), resposta in zip(quiz_itens, quiz.value):
        if resposta is None:
            linhas.append(f"- {pergunta}: *(sem resposta)*")
        elif resposta == gabarito:
            pontos += 1
            linhas.append(f"- {pergunta}: **certo**")
        else:
            linhas.append(f"- {pergunta}: errado, é **{gabarito.lower()}**")
    mo.md(f"**{pontos} de {len(quiz_itens)}**\n\n" + "\n".join(linhas))
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 5. Dados como tabela: escolha o seu problema

    A partir daqui, tudo é código de verdade. E a ideia central desta aula é que
    **o mesmo código resolve problemas completamente diferentes.** Escolha um:

    | Problema | Área | O que é cada linha | Rótulo |
    |---|---|---|---|
    | Flores | botânica | uma flor, 4 medidas de pétala e sépala | 3 espécies |
    | Câncer de mama | medicina | um exame, 30 medidas do tumor | benigno / maligno |
    | Vinhos | química / alimentos | um vinho, 13 análises químicas | 3 produtores |
    | Dígitos | visão computacional | uma imagem 8×8 de um número escrito à mão | 0 a 9 |

    Você pode trocar de problema a qualquer momento. Todos os gráficos e resultados da aula
    se atualizam sozinhos.
    """)
    return


@app.cell
def _(mo):
    dataset_sel = mo.ui.dropdown(
        options={
            "Flores (Iris)": "iris",
            "Câncer de mama": "cancer",
            "Vinhos": "wine",
            "Dígitos escritos à mão": "digits",
        },
        value="Flores (Iris)",
        label="Problema:",
    )
    dataset_sel
    return (dataset_sel,)


@app.cell
def _(dataset_sel):
    from sklearn import datasets

    carregar = {
        "iris": datasets.load_iris,
        "cancer": datasets.load_breast_cancer,
        "wine": datasets.load_wine,
        "digits": datasets.load_digits,
    }[dataset_sel.value]
    dados = carregar()
    X = dados.data
    y = dados.target
    nomes_classes = [str(n) for n in dados.target_names]
    nomes_colunas = [str(n) for n in dados.feature_names] if hasattr(dados, "feature_names") else [f"pixel_{i}" for i in range(X.shape[1])]
    return X, nomes_classes, nomes_colunas, y


@app.cell
def _(mo):
    mo.md(r"""
    **Pergunta (antes de olhar):** os dados foram guardados em uma tabela. Quantas linhas e
    colunas ela tem? Onde fica o rótulo (a espécie, o diagnóstico, o dígito)?

    Rode o código e confira. `X.shape` devolve `(linhas, colunas)`.
    """)
    return


@app.cell
def _(X, y):
    print("Formato de X:", X.shape)
    print("Formato de y:", y.shape)
    print()
    print("Primeiras 3 linhas de X:")
    print(X[:3].round(2))
    print()
    print("Primeiros 20 rótulos em y:", y[:20])
    return


@app.cell
def _(X, mo, nomes_classes, nomes_colunas, y):
    import numpy as np

    contagem = ", ".join(f"{n}: {c}" for n, c in zip(nomes_classes, np.bincount(y)))
    mo.accordion(
        {
            "Revelar": mo.md(
                f"""
    O scikit-learn *separa* a tabela em dois objetos. Essa separação é o bloco 3 virando código:

    - **`X`** — a matriz de **atributos** (*features*). Cada linha é um exemplo, cada coluna uma
      medida. Aqui: **{X.shape[0]} exemplos × {X.shape[1]} atributos**.
      Primeiras colunas: *{", ".join(nomes_colunas[:4])}{"…" if len(nomes_colunas) > 4 else ""}*
    - **`y`** — o vetor de **rótulos** (*labels*). Um valor por exemplo, {len(nomes_classes)} classes:
      *{", ".join(nomes_classes)}*. Distribuição: {contagem}.

    A convenção **`X` maiúsculo, `y` minúsculo** é universal: maiúsculo porque é matriz, minúsculo
    porque é vetor. Você vai ver isso em todo código de ML pelo resto da vida.

    **Pergunta de checagem:** se este fosse um problema *não supervisionado*, o que sumiria daqui?
    O `y`.

    Repare também que os rótulos costumam vir **ordenados** (todos os 0 primeiro, depois os 1…).
    Guarde isso. Vai ser importante no bloco 7.
    """
            )
        }
    )
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 6. O primeiro modelo: vizinhos mais próximos

    O gráfico abaixo mostra duas colunas de `X`, cada classe com uma cor. O **X vermelho** é um
    exemplo novo, sem rótulo. Você pode arrastá-lo com os controles.

    **Pergunta:** você não sabe fórmula nenhuma. Como chuta a classe do ponto vermelho?
    """)
    return


@app.cell
def _(X, dataset_sel, mo, nomes_colunas):
    # duas colunas informativas por dataset, escolhidas para o gráfico ficar legível
    colunas_grafico = {
        "iris": (2, 3),
        "cancer": (0, 27),
        "wine": (6, 12),
        "digits": (42, 21),
    }[dataset_sel.value]
    ca, cb = colunas_grafico
    sl_x = mo.ui.slider(
        start=float(X[:, ca].min()), stop=float(X[:, ca].max()),
        step=(float(X[:, ca].max()) - float(X[:, ca].min())) / 100,
        value=float(X[:, ca].mean()), label=f"Ponto novo — {nomes_colunas[ca]}",
    )
    sl_y = mo.ui.slider(
        start=float(X[:, cb].min()), stop=float(X[:, cb].max()),
        step=(float(X[:, cb].max()) - float(X[:, cb].min())) / 100,
        value=float(X[:, cb].mean()), label=f"Ponto novo — {nomes_colunas[cb]}",
    )
    mo.vstack([sl_x, sl_y])
    return ca, cb, sl_x, sl_y


@app.cell
def _(X, ca, cb, nomes_classes, nomes_colunas, sl_x, sl_y, y):
    import matplotlib.pyplot as plt

    fig, ax = plt.subplots(figsize=(6, 4.2))
    cores = ["#2a9d8f", "#e76f51", "#264653", "#e9c46a", "#8ab17d", "#f4a261", "#6d597a", "#b56576", "#355070", "#eaac8b"]
    for k_cls in sorted(set(y)):
        m = y == k_cls
        ax.scatter(X[m, ca], X[m, cb], s=18, alpha=0.7, color=cores[k_cls % len(cores)], label=nomes_classes[k_cls])
    ax.scatter([sl_x.value], [sl_y.value], marker="x", s=220, color="red", linewidths=3, label="ponto novo")
    ax.set_xlabel(nomes_colunas[ca])
    ax.set_ylabel(nomes_colunas[cb])
    ax.legend(fontsize=7, ncol=2)
    ax.grid(alpha=0.2)
    fig.tight_layout()
    fig
    return


@app.cell
def _(mo):
    mo.accordion(
        {
            "Revelar": mo.md(
                r"""
    Você provavelmente pensou: *"olho a cor dos pontos ao redor"*. Isso tem nome:
    **k-vizinhos mais próximos** (*k-Nearest Neighbors*, k-NN). Para classificar um exemplo novo:

    1. Meça a distância dele a **todos** os exemplos que já temos.
    2. Pegue os **k** mais próximos.
    3. A classe vence **por votação**.

    Não há fórmula a descobrir. O modelo simplesmente *guarda* os exemplos. E ainda assim é
    ML legítimo: ele melhora com mais dados, porque a votação fica mais confiável.

    O código está logo abaixo. São três linhas, e elas são o esqueleto de **todo** modelo do
    scikit-learn. Nas próximas semanas você vai trocar o nome da classe dezenas de vezes e
    `fit` / `predict` nunca mudam.
    """
            )
        }
    )
    return


@app.cell
def _(X, ca, cb, nomes_classes, sl_x, sl_y, y):
    from sklearn.neighbors import KNeighborsClassifier

    modelo_2d = KNeighborsClassifier(n_neighbors=1)
    modelo_2d.fit(X[:, [ca, cb]], y)                      # "aprende" = guarda os exemplos
    palpite = modelo_2d.predict([[sl_x.value, sl_y.value]])  # lista de listas: uma tabela com 1 linha
    print("Classe prevista para o ponto vermelho:", nomes_classes[int(palpite[0])])
    return (KNeighborsClassifier,)


@app.cell
def _(mo):
    mo.md(r"""
    > **Atenção:** `predict` recebe uma *lista de listas* (`[[a, b]]`), não uma lista simples.
    > O modelo espera uma tabela, mesmo que com uma linha só. Este é o erro número 1 de quem começa.

    Agora com **todas** as colunas, não só duas. E vamos medir a nota do modelo com `score`,
    que devolve a fração de acertos (a **acurácia**).

    **Pergunta:** que número você espera ver?
    """)
    return


@app.cell
def _(KNeighborsClassifier, X, y):
    modelo = KNeighborsClassifier(n_neighbors=1)
    modelo.fit(X, y)
    print("Acurácia:", modelo.score(X, y))
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 7. A armadilha do 100%

    **Pergunta:** 100% de acerto. Podemos entregar isso para o cliente?

    Antes de responder, pense: com `k = 1`, quando pergunto sobre um exemplo que **já está**
    no conjunto de dados, qual é o vizinho mais próximo dele?
    """)
    return


@app.cell
def _(mo):
    mo.accordion(
        {
            "Revelar": mo.md(
                r"""
    **Ele mesmo.** Distância zero. O modelo "acertou" porque *decorou a resposta*.

    Avaliar no mesmo dado em que se aprendeu é como corrigir uma prova cujo gabarito o aluno
    já tinha lido. Isso leva ao conceito central de **toda** a disciplina:

    > O objetivo de um modelo não é acertar os exemplos que viu. É acertar os que **ainda não viu**.
    > Isso se chama **generalização**. Um modelo que só acerta o treino está **decorando** (*overfitting*).

    A solução é honesta e simples: **esconder uma parte dos dados** antes de treinar.
    Use o controle abaixo para decidir quanto esconder.
    """
            )
        }
    )
    return


@app.cell
def _(mo):
    sl_teste = mo.ui.slider(start=0.1, stop=0.9, step=0.05, value=0.3, label="Fração escondida para teste")
    sl_teste
    return (sl_teste,)


@app.cell
def _(KNeighborsClassifier, X, sl_teste, y):
    from sklearn.model_selection import train_test_split

    X_treino, X_teste, y_treino, y_teste = train_test_split(
        X, y, test_size=sl_teste.value, random_state=7
    )
    print("Treino:", X_treino.shape, "  Teste:", X_teste.shape)

    modelo_honesto = KNeighborsClassifier(n_neighbors=1)
    modelo_honesto.fit(X_treino, y_treino)              # aprende só com uma parte
    print("Acurácia no TREINO:", round(modelo_honesto.score(X_treino, y_treino), 3))
    print("Acurácia no TESTE :", round(modelo_honesto.score(X_teste, y_teste), 3))
    return X_teste, X_treino, y_teste, y_treino


@app.cell
def _(mo):
    mo.md(r"""
    A acurácia no teste caiu. **Isso é boa notícia**: agora o número significa alguma coisa.

    Duas perguntas de checagem, ligadas ao que ficou guardado no bloco 5:

    1. Os rótulos vinham **ordenados**. Se eu simplesmente pegasse as primeiras linhas para
       treino e as últimas para teste, o que aconteceria?
    2. Para que serve `random_state=7`?
    """)
    return


@app.cell
def _(mo):
    mo.accordion(
        {
            "Revelar": mo.md(
                r"""
    1. O teste teria só a última classe, e o treino quase nenhuma dela. O modelo nunca teria
       visto a classe que precisa prever. Por isso `train_test_split` **embaralha** antes de dividir.
    2. Para que todo mundo na aula tenha a *mesma* divisão e os mesmos números. Sem isso, cada
       execução embaralha diferente. Não há nada de mágico no 7.

    > **Regra de ouro:** o modelo **nunca** pode olhar `X_teste` durante o `fit`. No instante em
    > que o teste vaza para o treino, a nota vira mentira de novo. Esta é a regra mais violada
    > na prática real de ML.
    """
            )
        }
    )
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 8. Girando o botão: o hiperparâmetro k

    Escolhemos `k = 1` sem pensar. **Pergunta:** o que muda se for `k = 5`? E `k = 100`?

    Faça sua aposta e depois mova o controle.
    """)
    return


@app.cell
def _(X_treino, mo):
    sl_k = mo.ui.slider(start=1, stop=min(150, len(X_treino)), step=1, value=1, label="k (número de vizinhos)")
    sl_k
    return (sl_k,)


@app.cell
def _(KNeighborsClassifier, X_teste, X_treino, sl_k, y_teste, y_treino):
    modelo_k = KNeighborsClassifier(n_neighbors=sl_k.value)
    modelo_k.fit(X_treino, y_treino)
    print(f"k = {sl_k.value}")
    print("Acurácia no TREINO:", round(modelo_k.score(X_treino, y_treino), 3))
    print("Acurácia no TESTE :", round(modelo_k.score(X_teste, y_teste), 3))
    return


@app.cell
def _(KNeighborsClassifier, X_teste, X_treino, sl_k, y_teste, y_treino):
    import matplotlib.pyplot as _plt

    ks = list(range(1, min(120, len(X_treino)), 2))
    acc_treino, acc_teste = [], []
    for k_ in ks:
        m_ = KNeighborsClassifier(n_neighbors=k_).fit(X_treino, y_treino)
        acc_treino.append(m_.score(X_treino, y_treino))
        acc_teste.append(m_.score(X_teste, y_teste))

    fig_k, ax_k = _plt.subplots(figsize=(6, 3.6))
    ax_k.plot(ks, acc_treino, color="#2a9d8f", label="treino")
    ax_k.plot(ks, acc_teste, color="#e76f51", label="teste")
    ax_k.axvline(sl_k.value, color="gray", linestyle="--", linewidth=1)
    ax_k.set_xlabel("k (número de vizinhos)")
    ax_k.set_ylabel("acurácia")
    ax_k.legend()
    ax_k.grid(alpha=0.2)
    fig_k.tight_layout()
    fig_k
    return


@app.cell
def _(mo):
    mo.accordion(
        {
            "Revelar": mo.md(
                r"""
    Os dois extremos falham por razões **opostas**:

    - **k pequeno**: cada previsão depende de um único vizinho. Um exemplo estranho no treino
      contamina tudo ao redor. O modelo é *nervoso demais*: decora ruído. (Treino em 100%, teste abaixo.)
    - **k enorme**: o modelo consulta praticamente todo mundo e responde sempre a classe mais
      comum. Ignora o exemplo novo. É *preguiçoso demais*. (Treino e teste caem juntos.)
    - O meio costuma ser o melhor.

    `k` é um **hiperparâmetro**: um número que *nós* escolhemos antes do treino, não algo que o
    modelo aprende dos dados. Boa parte do trabalho prático em ML é girar esses botões e medir.

    Troque o problema lá no bloco 5 e volte aqui. A forma da curva muda, a lição não.

    **Última pergunta, para levar para casa:** eu escolhi o melhor `k` olhando a acurácia no
    *teste*. Tem algum problema nisso?
    """
            )
        }
    )
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 9. O que fica aberto

    O caminho de hoje, de trás para frente. Cada linha respondeu a uma pergunta que você fez:

    | Pergunta | Conceito | Onde apareceu no código |
    |---|---|---|
    | Como separar spam sem escrever regras? | aprender de exemplos | — |
    | O que é "aprender"? | Tarefa, Experiência, Desempenho | `fit`, `X`/`y`, `score` |
    | Temos o gabarito? | supervisionado vs não supervisionado | existência de `y` |
    | A resposta é rótulo ou número? | classificação vs regressão | `Classifier` no nome da classe |
    | Como chutar sem fórmula? | k-NN | `KNeighborsClassifier` |
    | 100% é confiável? | generalização, overfitting | `train_test_split` |
    | Qual k? | hiperparâmetro | `n_neighbors` |

    Três perguntas que a aula deixou abertas, e que são o programa das próximas:

    1. E se a saída for um **número**? → regressão linear
    2. Como escolher `k` **sem contaminar o teste**? → validação cruzada
    3. k-NN precisa guardar todos os dados. Existe modelo que *resume* os dados em uma regra?
       → árvores de decisão, regressão logística

    ---

    **Desafio para casa:** troque `KNeighborsClassifier` por `DecisionTreeClassifier`
    (`from sklearn.tree import DecisionTreeClassifier`) em qualquer célula acima.
    Repare que `fit`, `predict` e `score` não mudam. Essa é a promessa do scikit-learn.
    """)
    return


if __name__ == "__main__":
    app.run()
