/*form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const data = inputData.value;
  const hora = inputHora.value;

  if (!servicoSelecionado) {
    alert("Escolha um serviço!");
    return;
  }

  if (!hora) {
    alert("Selecione um horário!");
    return;
  }

  try {
    await addDoc(collection(db, "agendamentos"), {
      nome,
      telefone,
      servico: servicoSelecionado,
      extras: extrasSelecionados,
      valor: valorTotal,
      tempo: tempoTotal,
      data,
      hora,
      status: "pendente"
    });

    // =========================
    // 📲 WHATSAPP (INTEGRADO CERTO)
    // =========================
    const numero = "5594981298951"; // 🔥 COLOCA SEU NÚMERO AQUI

    const mensagem = `📅 *Novo Agendamento!*

👤 Nome: ${nome}
📱 Telefone: ${telefone}
✂️ Serviço: ${servicoSelecionado}
📌 Extras: ${extrasSelecionados.join(", ") || "Nenhum"}
🗓️ Data: ${data}
⌚ Hora: ${hora}
💲Valor: R$ ${valorTotal}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    // =========================

    document.getElementById("mensagem").innerText =
      "Agendamento realizado com sucesso!";

    form.reset();
    grade.innerHTML = "";

  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao agendar!");
  }
});







// 🔐 PROTEÇÃO
const usuario = localStorage.getItem("usuario");
if (!usuario) {
  window.location.replace("login.html");
}

//000000000000000000000000000000000000000000000000000000000000000000000000000000000
// 🔥 FIREBASE

// 🔥 FIREBASE APP
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// 🔥 FIRESTORE
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
        apiKey: "AIzaSyD64nVKdxmTd3tNsgTMQ9HEal49AUVvIEs",
        authDomain: "barbearia-649d6.firebaseapp.com",
        projectId: "barbearia-649d6",
      };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);//000000000000000000000000000000000


async function corrigirDados() {
  const snapshot = await getDocs(collection(db, "agendamentos"));

  snapshot.forEach(async (docSnap) => {
    const ag = docSnap.data();
    const id = docSnap.id;

    let novaData = ag.data;
    let novoTempo = ag.tempo;

    // 🔄 Corrigir data BR → ISO
    if (typeof ag.data === "string" && ag.data.includes("/")) {
      const [d, m, y] = ag.data.split("/");
      novaData = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    // 🔢 Corrigir tempo
    if (typeof ag.tempo === "string") {
      novoTempo = Number(ag.tempo);
    }

    await updateDoc(doc(db, "agendamentos", id), {
      data: novaData,
      tempo: novoTempo
    });

    console.log("Corrigido:", id);
  });
}
corrigirDados();

// 🎯 ELEMENTOS
const grade = document.getElementById("grade");
const horariosDiv = document.getElementById("horarios");

// ⏰ GERAR HORÁRIOS (08:00 até 18:00)
for (let h = 8; h <= 18; h++) {
  ["00", "30"].forEach(min => {
    const div = document.createElement("div");
    div.innerText = `${String(h).padStart(2, "0")}:${min}`;
    horariosDiv.appendChild(div);
  });
}

// 🔢 CONVERTER HORA
function converterHoraParaMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// 📅 HOJE
const hoje = new Date().toISOString().split("T")[0];

// 🔥 LISTENER
onSnapshot(collection(db, "agendamentos"), (snapshot) => {

  grade.innerHTML = "";

  snapshot.forEach((docSnap) => {

    const ag = docSnap.data();
    const id = docSnap.id;

    // 🛑 VALIDAÇÕES
   // if (!ag.data || !ag.hora) return;

    // 🔄 GARANTE FORMATO DA DATA
    let dataAg;
    if (ag.data.includes("/")) {
      const [d, m, y] = ag.data.split("/");
      dataAg = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    } else {
      dataAg = ag.data;
    }

    // 📌 MOSTRAR SÓ HOJE
    if (dataAg !== hoje) return;

    // ❌ IGNORA CONCLUÍDOS
    if (ag.status === "concluido") return;

    // ⏰ POSIÇÃO
    const inicio = converterHoraParaMinutos(ag.hora);
    const base = 8 * 60;
    const limite = 18 * 60;

    // 🚫 FORA DA AGENDA
    if (inicio < base || inicio > limite) return;

    const top = (inicio - base);
    const altura = Number(ag.tempo) || 30;

    // 🧱 CARD
    const div = document.createElement("div");
    div.classList.add("agendamento");

    div.style.top = top + "px";
    div.style.height = altura + "px";

    div.innerHTML = `
      <strong>${ag.nome || "Cliente"}</strong><br>
      <span>${ag.servico || ""}</span><br>
      <span>${ag.hora}</span>
    `;

    // ✔️ CONCLUIR
    div.onclick = async () => {
      await updateDoc(doc(db, "agendamentos", id), {
        status: "concluido"
      });
    };

    grade.appendChild(div);

  });

});

// 🚪 LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

window.logout = logout; 000000000000000000000000000000


// 🔐 PROTEÇÃO
const usuario = localStorage.getItem("usuario");
if (!usuario) window.location.replace("login.html");

// 🔥 FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_CHAVE_AQUI",
  authDomain: "barbearia-649d6.firebaseapp.com",
  projectId: "barbearia-649d6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🎯 ELEMENTOS
const grade = document.getElementById("grade");
const horariosDiv = document.getElementById("horarios");

// ⏰ HORÁRIOS
for (let h = 8; h <= 18; h++) {
  ["00", "30"].forEach(min => {
    const div = document.createElement("div");
    div.innerText = `${String(h).padStart(2, "0")}:${min}`;
    horariosDiv.appendChild(div);
  });
}

// 🔢 FUNÇÃO
function horaParaMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// 📅 HOJE
const hoje = new Date().toISOString().split("T")[0];

// 🔥 LISTENER
onSnapshot(collection(db, "agendamentos"), (snapshot) => {

  grade.innerHTML = "";

  snapshot.forEach((docSnap) => {

    const ag = docSnap.data();
    const id = docSnap.id;

    // FILTRO SIMPLES E CORRETO
    if (ag.data !== hoje) return;

    const inicio = horaParaMinutos(ag.hora);
    const base = 8 * 60;

    const top = inicio - base;
    const altura = Number(ag.tempo);

    const div = document.createElement("div");
    div.classList.add("agendamento");

    div.style.top = top + "px";
    div.style.height = altura + "px";

    // 🎨 DIFERENCIAR STATUS
    if (ag.status === "concluido") {
      div.style.opacity = "0.4";
      div.style.textDecoration = "line-through";
    }

    div.innerHTML = `
      <strong>${ag.nome}</strong><br>
      <span>${ag.servico}</span><br>
      <span>${ag.hora}</span>
    `;

    // ✔️ CONCLUIR
    div.onclick = async () => {
      await updateDoc(doc(db, "agendamentos", id), {
        status: "concluido"
      });
    };

    grade.appendChild(div);

  });

});

// 🚪 LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
window.logout = logout;


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "barbearia-649d6.firebaseapp.com",
  projectId: "barbearia-649d6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const calendario = document.getElementById("calendario");

// 📅 DATA ATUAL
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = hoje.getMonth();

// 🔢 DIAS DO MÊS
const totalDias = new Date(ano, mes + 1, 0).getDate();

// 📆 CRIAR CALENDÁRIO
function criarCalendario(listaAgendamentos) {

  calendario.innerHTML = "";

  for (let dia = 1; dia <= totalDias; dia++) {

    const dataFormatada = `${ano}-${String(mes + 1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;

    const divDia = document.createElement("div");
    divDia.classList.add("dia");

    divDia.innerHTML = `<h3>${dia}</h3>`;

    // FILTRAR AGENDAMENTOS DO DIA
    const agsDoDia = listaAgendamentos.filter(ag => ag.data === dataFormatada);

    agsDoDia.forEach(ag => {

      const item = document.createElement("div");
      item.classList.add("agendamento");

      if (ag.status === "concluido") {
        item.classList.add("concluido");
      }

      item.innerHTML = `
        <strong>${ag.hora}</strong> - ${ag.nome}
      `;

      // ✔️ CONCLUIR
      item.onclick = async () => {
        await updateDoc(doc(db, "agendamentos", ag.id), {
          status: "concluido"
        });
      };

      divDia.appendChild(item);

    });

    calendario.appendChild(divDia);
  }
}

// 🔥 FIREBASE LISTENER
onSnapshot(collection(db, "agendamentos"), (snapshot) => {

  const lista = [];

  snapshot.forEach(docSnap => {
    lista.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  criarCalendario(lista);

});
// 🔐 PROTEÇÃO
// 🔐 PROTEÇÃO
const usuario = localStorage.getItem("usuario");
if (!usuario) window.location.replace("login.html");

// 🔥 FIREBASE
/*import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "barbearia-649d6.firebaseapp.com",
  projectId: "barbearia-649d6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ELEMENTOS
const headerDias = document.getElementById("headerDias");
const colunaHoras = document.getElementById("colunaHoras");
const gridAgenda = document.getElementById("gridAgenda");

// CONFIG
const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const horaInicio = 8;
const horaFim = 20;
const alturaHora = 60;

// DATA BASE
const hoje = new Date();
const inicioSemana = new Date(hoje);
inicioSemana.setDate(hoje.getDate() - hoje.getDay());

// CONVERTER HORA
function horaParaMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// HEADER DIAS
headerDias.innerHTML = "<div></div>";

for (let i = 0; i < 7; i++) {
  const d = new Date(inicioSemana);
  d.setDate(d.getDate() + i);

  const div = document.createElement("div");
  div.innerText = `${diasSemana[d.getDay()]} ${d.getDate()}`;
  headerDias.appendChild(div);
}

// HORÁRIOS
for (let h = horaInicio; h <= horaFim; h++) {
  const div = document.createElement("div");
  div.innerText = `${h}:00`;
  colunaHoras.appendChild(div);
}

// COLUNAS
const camadas = [];

for (let i = 0; i < 7; i++) {
  const coluna = document.createElement("div");
  coluna.classList.add("coluna-dia");

  for (let h = horaInicio; h <= horaFim; h++) {
    const linha = document.createElement("div");
    linha.classList.add("linha-hora");
    coluna.appendChild(linha);
  }

  const camada = document.createElement("div");
  camada.classList.add("camada-agendamentos");

  coluna.appendChild(camada);
  gridAgenda.appendChild(coluna);

  camadas.push(camada);
}

// FIREBASE
onSnapshot(collection(db, "agendamentos"), (snapshot) => {

  camadas.forEach(c => c.innerHTML = "");

  snapshot.forEach(docSnap => {

    const ag = docSnap.data();
    const id = docSnap.id;

    const dataAg = new Date(ag.data + "T00:00:00");

    const diff = Math.floor(
      (dataAg - inicioSemana) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0 || diff > 6) return;

    const camada = camadas[diff];

    const inicio = horaParaMinutos(ag.hora);
    const base = horaInicio * 60;

    const top = ((inicio - base) / 60) * alturaHora;
    const altura = Math.max((ag.tempo / 60) * alturaHora, 50);

    const div = document.createElement("div");
    div.classList.add("agendamento");

    if (ag.status === "concluido") {
      div.classList.add("concluido");
    }

    div.style.top = top + "px";
    div.style.height = altura + "px";

    div.innerHTML = `
      <strong>${ag.nome}</strong><br>
      <span>${ag.hora}</span>

      <div class="detalhes">
        <p>${ag.servico}</p>
        <p>R$ ${ag.valor}</p>
        <p>${(ag.extras || []).join(", ")}</p>
        <p>${ag.telefone}</p>

        <button class="btn-concluir">Concluir</button>
      </div>
    `;

    // EXPANDIR
    div.addEventListener("click", (e) => {

      if (e.target.classList.contains("btn-concluir")) return;

      e.stopPropagation();

      const aberto = div.classList.contains("expandido");

      document.querySelectorAll(".agendamento")
        .forEach(el => el.classList.remove("expandido"));

      if (!aberto) div.classList.add("expandido");
    });

    // BOTÃO
    const btn = div.querySelector(".btn-concluir");

    btn.addEventListener("click", async (e) => {
      e.stopPropagation();

      await updateDoc(doc(db, "agendamentos", id), {
        status: "concluido"
      });
    });

    camada.appendChild(div);
  });
});

// FECHAR AO CLICAR FORA
document.addEventListener("click", (e) => {
  if (!e.target.closest(".agendamento")) {
    document.querySelectorAll(".agendamento")
      .forEach(el => el.classList.remove("expandido"));
  }
});

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

window.logout = logout;


//agendados
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "barbearia-649d6.firebaseapp.com",
  projectId: "barbearia-649d6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 ESTADO GLOBAL (organizado)
let servicoSelecionado = "";
let tempoBase = 0;
let valorBase = 0;
let extrasSelecionados = [];
let tempoTotal = 0;
let valorTotal = 0;

// ELEMENTOS
const form = document.getElementById('formAgendamento');
const grade = document.getElementById("gradeHorarios");
const inputData = document.getElementById("data");
const inputHora = document.getElementById("hora");

// 🔥 CARREGAR DADOS DO LOCALSTORAGE
const dadosSalvos = JSON.parse(localStorage.getItem("agendamento"));

if (dadosSalvos) {

  servicoSelecionado = dadosSalvos.servico;
  tempoTotal = dadosSalvos.tempo;
  valorTotal = dadosSalvos.valor;
  extrasSelecionados = dadosSalvos.extras || [];

  tempoBase = dadosSalvos.tempo;
  valorBase = dadosSalvos.valor;

  // MOSTRAR RESUMO
  document.getElementById("res-servico").innerText =
    "Serviço: " + servicoSelecionado;

  document.getElementById("res-extras").innerText =
    "Extras: " + (extrasSelecionados.join(", ") || "Nenhum");

  document.getElementById("res-tempo").innerText =
    "Tempo: " + tempoTotal + " min";

  document.getElementById("res-valor").innerText =
    "Valor: R$ " + valorTotal;

  // 🔥 já libera horários automaticamente se tiver data
  if (document.getElementById("data").value) {
    carregarHorarios();
  }
}

// 🔥 HORÁRIOS
const horarios = [
  "08:00","09:00","10:00","11:00",
  "13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00","21:"
];

// =========================
// 🎯 CARREGAR HORÁRIOS
// =========================
inputData.addEventListener("change", carregarHorarios);

async function carregarHorarios() {

  const dataSelecionada = inputData.value;

  // 🔥 agora só depende da data
  if (!dataSelecionada || !tempoTotal) return;

  grade.innerHTML = "";

  let ocupados = [];

  try {
    const q = query(
      collection(db, "agendamentos"),
      where("data", "==", dataSelecionada),
      where("status", "==", "pendente")
    );

    const snapshot = await getDocs(q);

    ocupados = snapshot.docs.map(doc => ({
      hora: doc.data().hora,
      tempo: doc.data().tempo || 40
    }));

  } catch (error) {
    console.error("Erro ao buscar horários:", error);
  }

  horarios.forEach(hora => {

    const div = document.createElement("div");
    div.innerText = hora;
    div.classList.add("horario");

    const [h, m] = hora.split(":").map(Number);
    const inicioAtual = h * 60 + m;
    const fimAtual = inicioAtual + tempoTotal;

    let bloqueado = false;

    ocupados.forEach(ag => {
      const [oh, om] = ag.hora.split(":").map(Number);
      const inicioOcupado = oh * 60 + om;
      const fimOcupado = inicioOcupado + ag.tempo;

      if (
        (inicioAtual < fimOcupado && fimAtual > inicioOcupado)
      ) {
        bloqueado = true;
      }
    });

    if (bloqueado) {
      div.classList.add("ocupado");
    } else {
      div.classList.add("livre");

      div.onclick = () => {
        document.querySelectorAll(".horario").forEach(h => h.classList.remove("selecionado"));
        div.classList.add("selecionado");
        inputHora.value = hora;
      };
    }

    grade.appendChild(div);
  });
}

// =========================
// 🎯 CARDS DE SERVIÇO
// =========================
const cards = document.querySelectorAll(".servico-card");

cards.forEach(card => {
  card.addEventListener("click", () => {

    cards.forEach(c => c.classList.remove("ativo"));
    card.classList.add("ativo");

    servicoSelecionado = card.dataset.servico;
    tempoBase = Number(card.dataset.tempo);
    valorBase = Number(card.dataset.valor);

    atualizarResumo();
  });
});

// =========================
// 🎯 EXTRAS
// =========================
const extrasInputs = document.querySelectorAll(".extra");

extrasInputs.forEach(extra => {
  extra.addEventListener("change", atualizarResumo);
});

function atualizarResumo() {

  tempoTotal = tempoBase;
  valorTotal = valorBase;
  extrasSelecionados = [];

  extrasInputs.forEach(extra => {
    if (extra.checked) {
      tempoTotal += Number(extra.dataset.tempo);
      valorTotal += Number(extra.dataset.valor);
      extrasSelecionados.push(extra.dataset.nome);
    }
  });

  // RESUMO
  document.getElementById("res-servico").innerText =
    "Corte: " + (servicoSelecionado || "Nenhum");

  document.getElementById("res-extras").innerText =
    "Serviços Adicionais: " + (extrasSelecionados.join(", ") || "Nenhum");

  document.getElementById("res-tempo").innerText =
    "Tempo: " + tempoTotal + " min";

  document.getElementById("res-valor").innerText =
    "Valor: R$ " + valorTotal;

  carregarHorarios();
}

// =========================
// 📩 ENVIO
// =========================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const data = inputData.value;
  const hora = inputHora.value;

  if (!servicoSelecionado) {
    alert("Escolha um serviço!");
    return;
  }

  if (!hora) {
    alert("Selecione um horário!");
    return;
  }

  try {
    await addDoc(collection(db, "agendamentos"), {
      nome,
      telefone,
      servico: servicoSelecionado,
      extras: extrasSelecionados,
      valor: valorTotal,
      tempo: tempoTotal,
      data,
      hora,
      status: "pendente"
    });

    document.getElementById("mensagem").innerText =
      "Agendamento realizado com sucesso!";

    form.reset();
    grade.innerHTML = "";

  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao agendar!");
  }
});*/