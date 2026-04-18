const secoes = document.querySelectorAll(".Ambiente");
const container = document.querySelector(".apresentação-barbearia");

let index = 0;
let intervalo;

/* atualizar classe ativa */
function atualizar() {
  secoes.forEach(sec => sec.classList.remove("ativa"));
  secoes[index].classList.add("ativa");
}

/* próximo */
function proximo() {
  index++;
  if (index >= secoes.length) index = 0;
  atualizar();
}

/* anterior */
function anterior() {
  index--;
  if (index < 0) index = secoes.length - 1;
  atualizar();
}

/* automático */
function iniciar() {
  intervalo = setInterval(proximo, 3000);
}

/* parar */
function parar() {
  clearInterval(intervalo);
}

/* pausa ao clicar */
container.addEventListener("click", parar);

/* botões criados via JS */
const btnPrev = document.createElement("button");
btnPrev.innerHTML = "❮";
btnPrev.classList.add("btn-nav", "btn-prev");

const btnNext = document.createElement("button");
btnNext.innerHTML = "❯";
btnNext.classList.add("btn-nav", "btn-next");

container.appendChild(btnPrev);
container.appendChild(btnNext);

/* eventos */
btnNext.addEventListener("click", (e) => {
  e.stopPropagation();
  proximo();
});

btnPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  anterior();
});

/* iniciar */
atualizar();
iniciar();