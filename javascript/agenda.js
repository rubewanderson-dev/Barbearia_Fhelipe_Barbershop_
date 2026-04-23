// 🔐 PROTEÇÃO+
    const usuario = localStorage.getItem("usuario");
if (!usuario) {
  window.location.replace("login.html");
}
  



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const app = initializeApp({
  apiKey: "AIzaSyD64nVKdxmTd3tNsgTMQ9HEal49AUVvIEs",
  authDomain: "barbearia-649d6.firebaseapp.com",
  projectId: "barbearia-649d6",
});

const db = getFirestore(app);

const horasDiv = document.getElementById("horas");
const diasDiv = document.getElementById("dias");
const cabecalho = document.getElementById("cabecalho");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupConteudo = document.getElementById("popupConteudo");

const horaInicio = 8;
const horaFim = 21;

/* HORAS */
for (let h = horaInicio; h < horaFim; h++) {
  ["00", "30"].forEach(m => {
    const div = document.createElement("div");
    div.innerText = `${h.toString().padStart(2,"0")}:${m}`;
    horasDiv.appendChild(div);
  });
}

/* SEMANA */
const hoje = new Date();
const inicioSemana = new Date();
inicioSemana.setHours(0, 0, 0, 0);
inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
inicioSemana.setDate(hoje.getDate() - hoje.getDay());

const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

cabecalho.appendChild(document.createElement("div"));
for (let i = 0; i < 7; i++) {
  const d = new Date(inicioSemana);
  d.setDate(d.getDate() + i);

  const el = document.createElement("div");
  el.innerText = `${diasSemana[d.getDay()]} ${d.getDate()}`;
  cabecalho.appendChild(el);
}

/* COLUNAS */
const colunas = [];

for (let i = 0; i < 7; i++) {
  const col = document.createElement("div");
  col.className = "coluna";

  const grade = document.createElement("div");
  grade.className = "grade";

  for (let j = 0; j < 26; j++) {
    const linha = document.createElement("div");
    linha.className = "linha";
    if (j % 2 === 0) linha.classList.add("hora");
    grade.appendChild(linha);
  }

  const conteudo = document.createElement("div");
  conteudo.className = "conteudo";

  col.appendChild(grade);
  col.appendChild(conteudo);

  diasDiv.appendChild(col);
  colunas.push(conteudo);
}

function min(h) {
  const [a,b] = h.split(":").map(Number);
  return a*60 + b;
}
async function horarioOcupado(data, hora) {
  const q = query(
    collection(db, "agendamentos"),
    where("data", "==", data),
    where("hora", "==", hora)
  );

  const snap = await getDocs(q);

  return !snap.empty;
}

/* FIREBASE */
onSnapshot(collection(db, "agendamentos"), (snap) => {

  colunas.forEach(c => c.innerHTML = "");

  snap.forEach((docSnap) => {
    const ag = docSnap.data();

  const [y, m, d] = ag.data.split("-").map(Number);
const data = new Date(y, m - 1, d);

const diff = Math.floor((data - inicioSemana) / (1000 * 60 * 60 * 24));

    if (diff < 0 || diff > 6) return;

    const inicio = min(ag.hora);
    const base = horaInicio * 60;

    const linhaInicio = Math.floor((inicio - base)/30) + 1;
    const tempoReal = Math.min(ag.tempo || 60, 90);
    const duracao = Math.ceil(tempoReal / 30);

 const card = document.createElement("div");
card.className = "card";

if (ag.status === "Concluído") {
  card.classList.add("concluido");
}

    card.style.gridRow = `${linhaInicio} / span ${duracao}`;

    card.innerHTML = `<strong>${ag.nome}</strong><br>${ag.hora}`;

    card.onclick = () => {

      popupConteudo.innerHTML = `
        <h3>${ag.nome}</h3>

        <div class="info"><span>Serviço</span><span>${ag.servico}</span></div>
        <div class="info"><span>Horário</span><span>${ag.hora}</span></div>
        <div class="info"><span>Telefone</span><span>${ag.telefone || '-'}</span></div>

        <div class="status ${ag.status === "Concluído" ? "concluido" : ""}">
          ${ag.status || "Pendente"}
        </div>

        <button id="concluir">✔ Concluir</button>
        <button id="fechar">Fechar</button>
      `;

      overlay.classList.add("ativo");
      popup.classList.add("ativo");

      const btnFechar = document.getElementById("fechar");
      const btnConcluir = document.getElementById("concluir");

      btnFechar.onclick = () => {
        overlay.classList.remove("ativo");
        popup.classList.remove("ativo");
      };

      btnConcluir.onclick = async () => {
        await updateDoc(doc(db, "agendamentos", docSnap.id), {
          status: "Concluído"
        });

        overlay.classList.remove("ativo");
        popup.classList.remove("ativo");
      };
    };

    colunas[diff].appendChild(card);
  });
});

overlay.onclick = () => {
  overlay.classList.remove("ativo");
  popup.classList.remove("ativo");
};
// 🚪 LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

window.logout = logout;