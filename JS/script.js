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
  body.classList.remove('fundo-padrao');
  body.classList.add('fundo-quiz');

  secaoAviso.style.display = "none";
  secaoQuiz.style.display = "block";
   
  indicePergunta = 0;
  acertos = 0;
  caixaResultado.classList.remove("mostrar");
  
  mostrarPergunta()
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
    btn.onclick = () => responderPergunta(alt.correta);
    caixaAlternativas.appendChild(btn);
  });
}

function responderPergunta(correta) {
  // Desabilita todos os botões para evitar múltiplos cliques
  const botoes = caixaAlternativas.querySelectorAll('button');
  botoes.forEach(btn => btn.disabled = true);

  // Mostra o feedback visual
  mostrarFeedback(correta);

  // Atualiza o contador de acertos
  if (correta) acertos++;

  // Aguarda um tempo antes de continuar
  setTimeout(() => {
    indicePergunta++;
    if (indicePergunta < perguntas.length) {
      mostrarPergunta();
    } else {
      mostrarResultado();
    }
  }, 2000); // 2 segundos para ver o feedback
}

function mostrarFeedback(correta) {
  // Remove feedback anterior se existir
  const feedbackExistente = document.querySelector('.feedback-visual');
  if (feedbackExistente) {
    feedbackExistente.remove();
  }

  // Cria o elemento de feedback
  const feedback = document.createElement('div');
  feedback.className = 'feedback-visual';
  
  if (correta) {
    feedback.innerHTML = `
      <div class="icone-feedback correto">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#00ff00" stroke-width="6"/>
          <path d="M30 50 L45 65 L70 35" stroke="#00ff00" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="icone-feedback incorreto">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="#ff0000" stroke-width="6"/>
          <path d="M35 35 L65 65" stroke="#ff0000" stroke-width="6" stroke-linecap="round"/>
          <path d="M65 35 L35 65" stroke="#ff0000" stroke-width="6" stroke-linecap="round"/>
        </svg>
      </div>
    `;
  }

  // Adiciona ao body
  document.body.appendChild(feedback);

  // Força um reflow para garantir que a animação funcione
  feedback.offsetHeight;

  // Adiciona a classe de animação
  feedback.classList.add('mostrar');

  // Remove o feedback após a animação
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.classList.remove('mostrar');
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.remove();
        }
      }, 300);
    }
  }, 1700);
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