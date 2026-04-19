const servicos = document.querySelectorAll("#servico section");
const extras = document.querySelectorAll(".extras input");
const btn = document.getElementById("continuar");

let servicoSelecionado = null;

// 🎯 SELECIONAR SERVIÇO
servicos.forEach(servico => {
  servico.addEventListener("click", () => {

    servicos.forEach(s => s.classList.remove("ativo"));
    servico.classList.add("ativo");

    servicoSelecionado = {
      nome: servico.dataset.nome,
      valor: Number(servico.dataset.valor),
      tempo: Number(servico.dataset.tempo)
    };

    atualizarResumo();
  });
});

// 🎯 EXTRAS
extras.forEach(extra => {
  extra.addEventListener("change", atualizarResumo);
});

function atualizarResumo() {

  let valorTotal = servicoSelecionado ? servicoSelecionado.valor : 0;
  let tempoTotal = servicoSelecionado ? servicoSelecionado.tempo : 0;

  let listaExtras = [];

  extras.forEach(extra => {
    if (extra.checked) {
      valorTotal += Number(extra.dataset.valor);
      tempoTotal += Number(extra.dataset.tempo);
      listaExtras.push(extra.dataset.nome);
    }
  });

  document.getElementById("total").innerText = `Total: R$ ${valorTotal}`;
  document.getElementById("tempo").innerText = `Tempo: ${tempoTotal} min`;

  // 🔥 SALVAR DADOS
  if (servicoSelecionado) {
    localStorage.setItem("agendamento", JSON.stringify({
      servico: servicoSelecionado.nome,
      valor: valorTotal,
      tempo: tempoTotal,
      extras: listaExtras
    }));
  }
}

// 🚀 CONTINUAR
btn.addEventListener("click", () => {

  if (!servicoSelecionado) {
    alert("Escolha um serviço!");
    return;
  }

  window.location.href = "../pages/agendarServico.html";
});
