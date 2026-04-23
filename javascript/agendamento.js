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

  apiKey: "AIzaSyD64nVKdxmTd3tNsgTMQ9HEal49AUVvIEs",
  authDomain: "barbearia-649d6.firebaseapp.com",
  projectId: "barbearia-649d6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const diasFechados = [0]; // 0 = domingo

// =========================
// 🔥 ESTADO
// =========================
let servicoSelecionado = "";
let tempoTotal = 0;
let valorTotal = 0;
let extrasSelecionados = [];

// ELEMENTOS
const form = document.getElementById('formAgendamento');
const grade = document.getElementById("gradeHorarios");
const inputData = document.getElementById("data");
const inputHora = document.getElementById("hora");

// =========================
// 🔥 DADOS LOCALSTORAGE
// =========================
const dadosSalvos = JSON.parse(localStorage.getItem("agendamento"));

if (dadosSalvos) {
  servicoSelecionado = dadosSalvos.servico;
  tempoTotal = Number(dadosSalvos.tempo);
  valorTotal = Number(dadosSalvos.valor);
  extrasSelecionados = dadosSalvos.extras || [];

 document.getElementById("res-servico").innerText = "" +
   (servicoSelecionado || "Nenhum");

  document.getElementById("res-extras").innerText =
    "Adicional:" + (extrasSelecionados.join(", ") || "Nenhum");

  document.getElementById("res-tempo").innerText =
    "Tempo: " + tempoTotal + " min";

  document.getElementById("res-valor").innerText =
    "Valor: R$ " + valorTotal;

  carregarHorarios();
}

// =========================
// ⏰ HORÁRIOS
// =========================
const horarios = [
  "08:00","09:00","10:00","11:00",
  "13:00","14:00","15:00","16:00",
  "17:00","18:00","19:00","20:00","21:00"
];

// =========================
// 📅 CARREGAR HORÁRIOS
// =========================
inputData.addEventListener("change", carregarHorarios);

async function carregarHorarios() {

  const dataSelecionada = inputData.value;

  if (!dataSelecionada || !tempoTotal) return;

  grade.innerHTML = "";

  const diaSemana = new Date(dataSelecionada + "T00:00:00").getDay();

  // 🚫 BLOQUEIO TOTAL
  if (diasFechados.includes(diaSemana)) {
    grade.innerHTML = "<p style='color:#ff0000'>Fechado neste dia</p>";
    return;
  }

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
      tempo: Number(doc.data().tempo) || 40
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

      if (inicioAtual < fimOcupado && fimAtual > inicioOcupado) {
        bloqueado = true;
      }
    });

    if (bloqueado) {
      div.classList.add("ocupado");
    } else {
      div.classList.add("livre");

      div.onclick = () => {
        document.querySelectorAll(".horario")
          .forEach(h => h.classList.remove("selecionado"));

        div.classList.add("selecionado");
        inputHora.value = hora;
      };
    }

    grade.appendChild(div);
  });
}

// =========================
// 📩 ENVIO
// =========================
/*form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const data = inputData.value;
  const hora = inputHora.value;

  // 🔒 VALIDAÇÃO
  if (!servicoSelecionado) {
    alert("Escolha um serviço!");
    return;
  }

  if (!hora) {
    alert("Selecione um horário!");
    return;
  }

  if (!data) {
    alert("Selecione uma data!");
    return;

  }

  try {

    const dataISO = new Date(data).toISOString().split("T")[0];

    await addDoc(collection(db, "agendamentos"), {
      nome,
      telefone,
      servico: servicoSelecionado,
      extras: extrasSelecionados,
      valor: Number(valorTotal),
      tempo: Number(tempoTotal),
      data: dataISO,
      hora,
      status: "pendente"
    });
const diaSemana = new Date(data + "T00:00:00").getDay();
////////////////////////////////////////////
if (diasFechados.includes(diaSemana)) {
  alert("Não atendemos nesse dia.");
  return;
}
//////////////////////////////////////////////
    document.getElementById("mensagem").innerText =
      "Agendamento realizado com sucesso!";

    form.reset();
    grade.innerHTML = "";

  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao agendar!");
  }
});*/
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