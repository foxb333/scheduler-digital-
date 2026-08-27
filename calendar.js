// Controle de estado do calendário
let currentYear = 2026;
let currentMonth = 7; // Agosto (0 = Jan, 7 = Ago)

// Elementos do DOM
const monthYearText = document.getElementById("monthYear");
const calendarBody = document.getElementById("calendarBody");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function renderCalendar() {
    // Limpa a tabela antes de redesenhar
    calendarBody.innerHTML = "";

    // Atualiza o título (Mês Ano)
    monthYearText.innerText = `${months[currentMonth]} ${currentYear}`;

    // Descobre o primeiro dia da semana do mês (0 = Dom, 1 = Seg, etc.)
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    // Descobre o total de dias do mês atual
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Data real de hoje para marcação fixa
    const today = new Date();
    const realDay = today.getDate();
    const realMonth = today.getMonth();
    const realYear = today.getFullYear();

    let dayCounter = 1;
    let row = document.createElement("tr");

    // Preenche os espaços vazios iniciais antes do primeiro dia do mês
    for (let i = 0; i < firstDayIndex; i++) {
        let cell = document.createElement("td");
        cell.classList.add("vazio");
        row.appendChild(cell);
    }

    // Preenche os dias do mês
    for (let i = firstDayIndex; dayCounter <= totalDays; i++) {
        // Se a semana completou 7 dias, cria uma nova linha
        if (i % 7 === 0 && dayCounter > 1) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
        }

        let cell = document.createElement("td");
        cell.innerText = dayCounter;
        cell.classList.add("dia");

        // Verifica se é o dia de HOJE
        if (
            dayCounter === realDay &&
            currentMonth === realMonth &&
            currentYear === realYear
        ) {
            cell.classList.add("hoje");
        }

        // Evento de seleção ao clicar no dia
        const selectedDay = dayCounter;
        cell.addEventListener("click", () => {
            document.querySelectorAll(".calendar-table td").forEach(td => td.classList.remove("ativo"));
            cell.classList.add("ativo");
        });

        row.appendChild(cell);
        dayCounter++;
    }

    // Completa os espaços vazios da última semana se necessário
    while (row.children.length < 7) {
        let cell = document.createElement("td");
        cell.classList.add("vazio");
        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}

// Botões de Navegação Infinita (Sem erro de pulo de mês)
prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

// Inicialização
renderCalendar();