const toggleBtn = document.getElementById("toggle-tema");
const body = document.body;

// Aplica tema salvo (se houver)
const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "claro") {
  body.setAttribute("data-tema", "claro");
}

// Alternância de tema
toggleBtn.onclick = () => {
  const temaAtual = body.getAttribute("data-tema");
  if (temaAtual === "claro") {
    body.removeAttribute("data-tema");
    localStorage.setItem("tema", "escuro");
  } else {
    body.setAttribute("data-tema", "claro");
    localStorage.setItem("tema", "claro");
  }
};
