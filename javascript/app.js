// 🔥 FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey:"AIzaSyD64nVKdxmTd3tNsgTMQ9HEal49AUVvIEs",
  authDomain: "barbearia-649d6.firebaseapp.com",
  projectId: "barbearia-649d6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupConteudo = document.getElementById("popupConteudo");

// ELEMENTOS
const horasDiv = document.getElementById("horas");
const diasDiv = document.getElementById("dias");

// CONFIG
const horaInicio = 8;
const horaFim = 20;
const alturaHora = 60;

// DATA BASE (SEMANA ATUAL)
const hoje = new Date();
const inicioSemana = new Date(hoje);
inicioSemana.setDate(hoje.getDate() - hoje.getDay());

// GERAR HORAS
for (let h = horaInicio; h <= horaFim; h++) {
  const div = document.createElement("div");
  div.innerText = h + ":00";
  horasDiv.appendChild(div);
}

// GERAR DIAS
const colunas = [];

for (let i = 0; i < 7; i++) {
  const col = document.createElement("div");
  col.classList.add("coluna");

  for (let h = horaInicio; h <= horaFim; h++) {
    const linha = document.createElement("div");
    linha.classList.add("linha");
    col.appendChild(linha);
  }

  diasDiv.appendChild(col);
  colunas.push(col);
}

// CONVERTER HORA
function horaParaMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// 🔥 FIREBASE LISTENER
// 🔥 ORGANIZAR POR DIA
const agendaPorDia = [[], [], [], [], [], [], []];

snapshot.forEach(docSnap => {
  const ag = docSnap.data();

  if (!ag.data || !ag.hora) return;

  const dataAg = new Date(ag.data + "T00:00:00");

  const diff = Math.floor(
    (dataAg - inicioSemana) / (1000 * 60 * 60 * 24)
  );

  if (diff < 0 || diff > 6) return;

  agendaPorDia[diff].push(ag);
});

// LIMPAR
colunas.forEach(col => {
  col.querySelectorAll(".card").forEach(c => c.remove());
});

// 🔥 RENDER COM COLISÃO
agendaPorDia.forEach((lista, diaIndex) => {

  const col = colunas[diaIndex];

  lista.forEach((ag, i) => {

    const inicio = horaParaMinutos(ag.hora);
    const base = horaInicio * 60;

    const top = ((inicio - base) / 60) * alturaHora;
    const altura = (ag.tempo / 60) * alturaHora;

    // 🔥 DETECTAR CONFLITOS SIMPLES
    const conflitos = lista.filter(outro => {
      const ini1 = horaParaMinutos(ag.hora);
      const fim1 = ini1 + ag.tempo;

      const ini2 = horaParaMinutos(outro.hora);
      const fim2 = ini2 + outro.tempo;

      return (ini1 < fim2 && fim1 > ini2);
    });

    const largura = 100 / conflitos.length;
    const posicao = conflitos.indexOf(ag);

    const card = document.createElement("div");
    card.classList.add("card");

    card.style.top = top + "px";
    card.style.height = altura + "px";

    // 🔥 POSIÇÃO LADO A LADO
    card.style.width = `calc(${largura}% - 10px)`;
    card.style.left = `calc(${posicao * largura}% + 5px)`;

    card.innerHTML = `
      <strong>${ag.nome}</strong>
      <span>${ag.hora}</span>
    `;

    // POPUP
    card.addEventListener("click", () => {

      popupConteudo.innerHTML = `
        <h3>${ag.nome}</h3>
        <p><strong>Serviço:</strong> ${ag.servico}</p>
        <p><strong>Hora:</strong> ${ag.hora}</p>
        <p><strong>Telefone:</strong> ${ag.telefone}</p>
        <p><strong>Status:</strong> ${ag.status}</p>

        <button id="fechar">Fechar</button>
      `;

      overlay.classList.add("ativo");
      popup.classList.add("ativo");

      document.getElementById("fechar").onclick = fecharPopup;
    });

    col.appendChild(card);
  });

});