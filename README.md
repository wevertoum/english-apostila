# Apostila de inglês

App para falantes de português brasileiro treinarem a lógica da frase, não uma lista de regras.

**[Abrir o app](https://weverton.me/english-apostila/)**

> **AFIRMAR → NEGAR → PERGUNTAR**  
> **PRESENT → PAST → FUTURE**

O auxiliar carrega tempo, negação e pergunta. O verbo principal quase sempre fica na forma base. O objetivo é montar frases novas sem traduzir palavra por palavra.

---

## O app

A home mostra o mapa 3×3, o progresso e o capítulo em que você parou. Cada capítulo abre a lição, os exercícios e o gabarito — o gabarito só aparece quando você pede para conferir. O treino 3×3 pede uma frase (sujeito, verbo, tempo, intenção) e corrige na hora. `I'll` e `I will` contam igual.

O progresso fica neste aparelho, no navegador. Sem conta. No celular, use **Adicionar à tela inicial** para abrir como app. Depois da primeira visita, o material abre offline.

O texto continua nos Markdown em [`apostila/`](apostila/). O app em [`web/`](web/) só lê esses arquivos.

---

## Como estudar

1. Leia a explicação em voz alta nos exemplos.
2. Faça os exercícios antes de abrir o gabarito.
3. Repita o treino 3×3 até a frase sair sem pensar.
4. Fale. Escrever sozinho não automatiza.

Prioridade: **lógica → padrão → exemplos → repetição → automatização → fala.**

---

## Índice

| Cap. | Conteúdo |
|---|---|
| 1 | [Como pensar em inglês](apostila/cap1.md) |
| 2 | [O segredo dos auxiliares](apostila/cap2.md) |
| 3 | [Present Simple](apostila/cap3.md) |
| 4 | [Past Simple](apostila/cap4.md) |
| 5 | [Future](apostila/cap5.md) |
| 6 | [To be](apostila/cap6.md) |
| 7 | [Can, could e modais](apostila/cap7.md) |
| 8 | [Have](apostila/cap8.md) |
| 9 | [Os 60 verbos mais importantes](apostila/cap9.md) |
| 10 | [Transformação de frases](apostila/cap10.md) |
| 11 | [Português → inglês](apostila/cap11.md) |
| 12 | [Inglês → português](apostila/cap12.md) |
| 13 | [Erros comuns de brasileiros](apostila/cap13.md) |
| 14 | [Contrações e inglês real](apostila/cap14.md) |
| 15 | [Respostas curtas](apostila/cap15.md) |
| 16 | [WH questions](apostila/cap16.md) |
| 17 | [Treino de automatização](apostila/cap17.md) |
| 18 | [Speaking drills](apostila/cap18.md) |
| 19 | [Frases do dia a dia](apostila/cap19.md) |
| 20 | [Resumo visual](apostila/cap20.md) |
| Extra | [100 frases essenciais](apostila/frases-essenciais.md) |
| Extra | [Desafio final](apostila/desafio-final.md) |

---

## As quatro estruturas

1. **Verbos comuns** — do / does / did / will
2. **To be** — am / is / are / was / were / will be
3. **Modais** — can, could, should, would, may, might, must
4. **Have** — verbo principal e auxiliar dos perfect tenses

### Mapa 3×3

Verbo-modelo: **need**

|  | Presente | Passado | Futuro |
|---|---|---|---|
| Afirmar | I need. | I needed. | I will need. |
| Negar | I don't need. | I didn't need. | I won't need. |
| Perguntar | Do you need? | Did you need? | Will you need? |

Quando um auxiliar indica tempo, negação ou pergunta, o verbo principal normalmente fica na **forma base**.

---

## Rodar local

```bash
cd web
npm install
npm run dev
```

Abre em `http://localhost:5173/english-apostila/`. Push em `main` publica o app pelo GitHub Actions.
