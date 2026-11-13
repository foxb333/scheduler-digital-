function alternarTema() {
    const claro = document.body.classList.toggle('light-mode');
    try { localStorage.setItem('theme', claro ? 'light' : 'dark'); } catch {}
}

window.addEventListener('DOMContentLoaded', () => {
    try { document.body.classList.toggle('light-mode', localStorage.getItem('theme') === 'light'); } catch {}
});