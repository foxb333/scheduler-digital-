const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
               "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
let ano = 2026, mes = 7; // Agosto (0 = Jan)

const titulo = document.getElementById("monthYear");
const corpo = document.getElementById("calendarBody");

function renderCalendar() {
    const inicio = new Date(ano, mes, 1).getDay();      // dia da semana do dia 1 (0 = Dom)
    const total = new Date(ano, mes + 1, 0).getDate();  // total de dias do mês
    const hoje = new Date();
    const ehHoje = d => d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();

    const celulas = [
        ...Array(inicio).fill('<td class="vazio"></td>'),
        ...Array.from({ length: total }, (_, i) => `<td class="dia${ehHoje(i + 1) ? " hoje" : ""}">${i + 1}</td>`)
    ];
    while (celulas.length % 7) celulas.push('<td class="vazio"></td>');

    corpo.innerHTML = Array.from({ length: celulas.length / 7 }, (_, s) =>
        `<tr>${celulas.slice(s * 7, s * 7 + 7).join("")}</tr>`).join("");
    titulo.textContent = `${MESES[mes]} ${ano}`;
}

// Um único ouvinte para todos os dias (em vez de um por célula)
corpo.addEventListener("click", e => {
    const td = e.target.closest("td.dia");
    if (!td) return;
    corpo.querySelector(".ativo")?.classList.remove("ativo");
    td.classList.add("ativo");
});

// O Date ajusta sozinho a virada de ano (mês -1 vira dezembro do ano anterior)
function mudarMes(delta) {
    const d = new Date(ano, mes + delta, 1);
    ano = d.getFullYear();
    mes = d.getMonth();
    renderCalendar();
}
document.getElementById("prevMonth").addEventListener("click", () => mudarMes(-1));
document.getElementById("nextMonth").addEventListener("click", () => mudarMes(1));

renderCalendar();