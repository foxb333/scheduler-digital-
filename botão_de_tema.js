// Tema claro/escuro compartilhado: cria o botão, estiliza e faz a troca com transição suave.
(() => {
    const CHAVE = 'theme', DURACAO = 600;
    const SELETOR_BOTAO = '[data-tema], [data-acao="tema"], [data-a="tema"]';
    const html = document.documentElement;
    const lerTema = () => { try { return localStorage.getItem(CHAVE); } catch { return null; } };
    const aplicar = claro => document.body.classList.toggle('light-mode', claro);

    document.head.insertAdjacentHTML('beforeend', `<style>
        .btn-tema { background: transparent; border: 1px solid var(--border-main); color: var(--text-main); cursor: pointer; }
        .sidebar-footer .btn-tema { background: var(--bg-hover); text-align: center; }
        ::view-transition-old(root), ::view-transition-new(root) { animation-duration: ${DURACAO}ms; animation-timing-function: ease-in-out; }
        .trocando-tema, .trocando-tema *, .trocando-tema *::before, .trocando-tema *::after {
            transition: background-color ${DURACAO}ms ease, color ${DURACAO}ms ease, border-color ${DURACAO}ms ease, box-shadow ${DURACAO}ms ease !important;
        }
    </style>`);

    let timer;
    // Função interna: não depende do nome global, então funciona mesmo que a página defina o próprio alternarTema()
    const trocar = () => {
        const claro = !document.body.classList.contains('light-mode');
        const mudar = () => {
            aplicar(claro);
            try { localStorage.setItem(CHAVE, claro ? 'light' : 'dark'); } catch {}
        };
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return mudar();
        if (document.startViewTransition) return document.startViewTransition(mudar); // fade da página inteira
        html.classList.add('trocando-tema');                                          // alternativa para navegadores antigos
        mudar();
        clearTimeout(timer);
        timer = setTimeout(() => html.classList.remove('trocando-tema'), DURACAO + 50);
    };
    window.alternarTema = trocar;

    // Cria o botão se a página não tiver um (navbar ou rodapé da barra lateral)
    function montarBotao() {
        const existentes = document.querySelectorAll(SELETOR_BOTAO);
        if (existentes.length) {
            existentes.forEach(b => b.getAttribute('aria-label') || b.setAttribute('aria-label', 'Alternar tema claro/escuro'));
            return;
        }
        const local = document.querySelector('[data-tema-slot], .nav-links, .auth-group, .sidebar-footer');
        if (!local) return;
        const lateral = !!local.closest('.sidebar');
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.setAttribute('data-tema', '');
        botao.setAttribute('aria-label', 'Alternar tema claro/escuro');
        botao.className = (lateral ? 'btn-logout' : 'nav-btn') + ' btn-tema';
        botao.textContent = lateral ? '☀️ / 🌙 Tema' : '☀️ / 🌙';
        local.append(botao);
    }

    // Clique em qualquer botão de tema
    document.addEventListener('click', e => {
        if (!e.target.closest(SELETOR_BOTAO)) return;
        e.stopImmediatePropagation();
        trocar();
    }, true);

    // Se o tema mudar em outra aba aberta, esta acompanha
    addEventListener('storage', e => { if (e.key === CHAVE) aplicar(e.newValue === 'light'); });

    aplicar(lerTema() === 'light');
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', montarBotao) : montarBotao();
})();