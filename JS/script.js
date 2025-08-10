import { perguntas } from "./perguntas.js";

const body = document.body;

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

comecarLeituraBtn.addEventListener('click', () => {
  body.classList.remove('fundo-padrao', 'fundo-quiz');
  body.classList.add('fundo-textos');

  secaoAviso.style.display = "none";
  secaoTextos.style.display = "block";

  // Reset scroll para topo da página ao começar a leitura
  window.scrollTo(0, 0);

  // Reset da posição do background para o topo (estrelas)
  body.style.backgroundPosition = "center top";
});

iniciarQuizBtn.addEventListener('click', () => {
  body.classList.remove('fundo-padrao', 'fundo-textos');
  body.classList.add('fundo-quiz');

  secaoTextos.style.display = "none";
  secaoQuiz.style.display = "block";
  iniciarQuiz();
});

novamenteBtn.addEventListener('click', () => {
  body.classList.remove('fundo-quiz');
  body.classList.add('fundo-padrao');

  secaoQuiz.style.display = "none";
  secaoAviso.style.display = "block";

  // Reset das variáveis do quiz
  indicePergunta = 0;
  acertos = 0;
  caixaResultado.classList.remove("mostrar");
});

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

// Nova função para parallax sincronizado com o scroll
function atualizarParallaxTextos() {
  // Verifica se a seção textos está visível
  if (secaoTextos.style.display === "none" || !body.classList.contains("fundo-textos")) return;

  // Calcula o progresso do scroll
  const alturaDocumento = document.documentElement.scrollHeight - window.innerHeight;
  const scrollAtual = window.pageYOffset;
  const progressoScroll = Math.min(scrollAtual / alturaDocumento, 1); // de 0 a 1

  // Calcula a posição Y do background baseada no progresso
  // 0% = center top (estrelas)
  // 100% = center bottom (colinas)
  const posicaoY = progressoScroll * 100;

  // Atualiza a posição do background
  body.style.backgroundPosition = `center ${posicaoY}%`;
}

// Versão alternativa baseada na altura da seção de textos
function atualizarParallaxTextosPorSecao() {
  // Verifica se a seção textos está visível
  if (secaoTextos.style.display === "none" || !body.classList.contains("fundo-textos")) return;

  // Pega as dimensões da seção de textos
  const rectTextos = secaoTextos.getBoundingClientRect();
  const alturaSecao = secaoTextos.offsetHeight;
  const topoSecao = secaoTextos.offsetTop;
  const scrollAtual = window.pageYOffset;

  // Calcula quanto da seção já foi scrollada
  const scrollDentroSecao = Math.max(0, scrollAtual - topoSecao);
  const progressoSecao = Math.min(scrollDentroSecao / alturaSecao, 1);

  // Calcula a posição Y do background baseada no progresso da seção
  const posicaoY = progressoSecao * 100;

  // Atualiza a posição do background
  body.style.backgroundPosition = `center ${posicaoY}%`;
}

// Event listener para o scroll com throttle para melhor performance
let scrollTimeout;
window.addEventListener("scroll", () => {
  // Cancela o timeout anterior se existir
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // Define um novo timeout para executar a função
  scrollTimeout = setTimeout(() => {
    // Use a função que preferir:
    // atualizarParallaxTextos(); // baseada no scroll total da página
    atualizarParallaxTextosPorSecao(); // baseada na seção de textos
  }, 16); // ~60fps
});

// Também atualiza no resize da janela
window.addEventListener("resize", () => {
  if (body.classList.contains("fundo-textos")) {
    setTimeout(() => {
      atualizarParallaxTextosPorSecao();
    }, 100);
  }
});

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  // Garante que o background comece na posição correta
  if (body.classList.contains("fundo-textos")) {
    body.style.backgroundPosition = "center top";
  }
});