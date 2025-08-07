import { perguntas } from "./perguntas.js";

const comecarLeituraBtn = document.querySelector(".comecar-leitura-btn");
const iniciarQuizBtn = document.querySelector(".iniciar-quiz-btn");
const novamenteBtn = document.querySelector(".novamente-btn");

const secaoAviso = document.querySelector(".aviso");
const secaoTextos = document.querySelector(".textos");
const secaoQuiz = document.querySelector(".quiz");

const caixaPerguntas = document.querySelector(".caixa-perguntas");
const caixaAlternativas = document.querySelector(".caixa-alternativas");
const caixaResultado = document.querySelector(".caixa-resultado");
const textoResultado = document.querySelector(".texto-resultado");

let indicePergunta = 0;
let acertos = 0;

comecarLeituraBtn.onclick = () => {
  secaoAviso.style.display = "none";
  secaoTextos.style.display = "block";
};

iniciarQuizBtn.onclick = () => {
  secaoTextos.style.display = "none";
  secaoQuiz.style.display = "block";
  iniciarQuiz();
};

function iniciarQuiz() {
  indicePergunta = 0;
  acertos = 0;
  caixaResultado.classList.remove("mostrar");
  mostrarPergunta();
}

function mostrarPergunta() {
  const pergunta = perguntas[indicePergunta];
  caixaPerguntas.textContent = pergunta.enunciado;
  caixaAlternativas.innerHTML = "";

  pergunta.alternativas.forEach((alt) => {
    const btn = document.createElement("button");
    btn.textContent = alt.texto;
    btn.onclick = () => {
      if (alt.correta) acertos++;
      indicePergunta++;
      if (indicePergunta < perguntas.length) {
        mostrarPergunta();
      } else {
        mostrarResultado();
      }
    };
    caixaAlternativas.appendChild(btn);
  });
}

function mostrarResultado() {
  caixaResultado.classList.add("mostrar");
  textoResultado.textContent = `Você acertou ${acertos} de ${perguntas.length} perguntas.`;
  caixaPerguntas.textContent = "";
  caixaAlternativas.innerHTML = "";
}

novamenteBtn.onclick = iniciarQuiz;
