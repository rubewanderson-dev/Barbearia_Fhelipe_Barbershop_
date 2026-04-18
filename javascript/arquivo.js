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
    const numero = "5591999999999"; // 🔥 COLOCA SEU NÚMERO AQUI

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