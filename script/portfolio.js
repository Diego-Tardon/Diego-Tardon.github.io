document.addEventListener('DOMContentLoaded', () => {

    const CV_FILENAME = 'Cv.Diego-Tardon.pdf';

    const SECTIONS = {
        about:    { title: 'Sobre mí',         subtitle: 'Desarrollador de Software Junior, apasionado por la tecnología y la innovación' },
        cv:       { title: 'Curriculum Vitae',  subtitle: 'Formación académica y experiencia laboral' },
        projects: { title: 'Proyectos',         subtitle: 'Desarrollos técnicos y trabajos destacados' },
        contact:  { title: 'Contacto',          subtitle: 'Puedes escribirme para colaboraciones o oportunidades profesionales' }
    };

    const NOTIF = {
        success: { bg: 'rgba(var(--m),.95)',  border: 'rgba(var(--m),.3)',  icon: 'fa-check-circle' },
        error:   { bg: 'rgba(243,139,168,.95)', border: 'rgba(243,139,168,.3)', icon: 'fa-exclamation-circle' },
        info:    { bg: 'rgba(var(--b),.95)',  border: 'rgba(var(--b),.3)',  icon: 'fa-info-circle' }
    };

    const navItems     = document.querySelectorAll('.nav-icon-item[data-target]');
    const sections     = document.querySelectorAll('.content-section');
    const titleEl      = document.getElementById('dynamic-title');
    const subtitleEl   = document.getElementById('dynamic-subtitle');
    const scrollable   = document.querySelector('.content-scrollable');
    const contactForm  = document.getElementById('contactForm');
    const downloadBtn  = document.getElementById('cv-download-btn');
    const targets      = [...navItems].map(n => n.dataset.target);

    let current = null;

    function goTo(target) {
        if (target === current || !SECTIONS[target]) return;
        current = target;

        navItems.forEach(n => n.classList.toggle('active', n.dataset.target === target));
        sections.forEach(s => s.classList.toggle('active', s.id === `${target}-content`));

        const { title, subtitle } = SECTIONS[target];
        titleEl.classList.add('title-changing');
        subtitleEl.classList.add('title-changing');
        setTimeout(() => {
            titleEl.textContent    = title;
            subtitleEl.textContent = subtitle;
            titleEl.classList.remove('title-changing');
            subtitleEl.classList.remove('title-changing');
        }, 150);

        if (scrollable) scrollable.scrollTop = 0;
    }

    navItems.forEach(n => n.addEventListener('click', () => goTo(n.dataset.target)));

    document.addEventListener('keydown', ({ key }) => {
        const i = targets.indexOf(current);
        if (key === 'ArrowRight' && i < targets.length - 1) goTo(targets[i + 1]);
        if (key === 'ArrowLeft'  && i > 0)                  goTo(targets[i - 1]);
    });

    if (downloadBtn) {
        downloadBtn.href     = CV_FILENAME;
        downloadBtn.download = CV_FILENAME;
        downloadBtn.addEventListener('click', () => notify('Descargando CV…', 'info'));
    }

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            const get = id => document.getElementById(id)?.value.trim() ?? '';
            const name    = get('name');
            const email   = get('email');
            const subject = get('subject');
            const message = get('message');

            if (!name || !email || !subject || !message) {
                return notify('Por favor, completa todos los campos', 'error');
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return notify('Por favor, ingresa un email válido', 'error');
            }

            const btn = contactForm.querySelector('.submit-btn');
            const original = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando…';

            setTimeout(() => {
                notify('¡Mensaje enviado! Gracias por contactarme.', 'success');
                contactForm.reset();
                btn.disabled  = false;
                btn.innerHTML = original;
            }, 1200);
        });
    }

    function notify(message, type = 'success') {
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const { bg, border, icon } = NOTIF[type] ?? NOTIF.success;

        const el = document.createElement('div');
        el.className = 'notification';
        el.innerHTML = `<i class="fas ${icon}" style="margin-right:8px"></i>${message}`;
        el.style.cssText = `
            position:fixed; top:20px; right:20px;
            background:${bg}; color:#1e1e2e;
            padding:12px 18px; border-radius:10px;
            border:1px solid ${border};
            box-shadow:0 6px 18px rgba(0,0,0,.3);
            z-index:10000; animation:slideInRight .3s ease;
            backdrop-filter:blur(12px);
            max-width:280px; font-size:.88rem;
            font-weight:600; line-height:1.4;
            display:flex; align-items:center;
            pointer-events:none;
        `;

        document.body.appendChild(el);
        setTimeout(() => {
            el.style.animation = 'slideOutRight .3s ease';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    }

    document.querySelectorAll('.contact-detail-item').forEach(item => {
        const text = item.querySelector('p')?.textContent;
        if (!text) return;
        item.style.cursor = 'pointer';
        item.title = 'Clic para copiar';
        item.addEventListener('click', () =>
            navigator.clipboard.writeText(text)
                .then(() => notify(`"${text}" copiado`, 'info'))
                .catch(() => notify('No se pudo copiar', 'error'))
        );
    });

    document.body.style.cssText = 'opacity:0; transition:opacity .5s ease';
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.style.opacity = '1'));

    goTo('about');
});