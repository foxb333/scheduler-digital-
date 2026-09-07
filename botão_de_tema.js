function alternarTema() {
    document.body.classList.toggle('light-mode');
    
    // Salva a preferência do usuário no navegador
    if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
}

// Mantém o tema salvo ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
});