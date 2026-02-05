// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function() {
    // Elementos de navegación
    const navItems = document.querySelectorAll('.nav-icon-item[data-target]');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Elementos del título dinámico
    const dynamicTitle = document.getElementById('dynamic-title');
    const dynamicSubtitle = document.getElementById('dynamic-subtitle');
    
    // Textos para cada sección
    const sectionTexts = {
        about: {
            title: "Sobre mí",
            subtitle: "Analista programador junior, apasionado por la tecnología y la innovación"
        },
        cv: {
            title: "Curriculum Vitae",
            subtitle: "Formación académica y experiencia laboral"
        },
        projects: {
            title: "Proyectos",
            subtitle: "Desarrollos técnicos y trabajos destacados"
        },
        contact: {
            title: "Contacto",
            subtitle: "Puedes escribirme para colaboraciones o oportunidades profesionales"
        }
    };
    
    // Función para cambiar de sección
    function changeSection(target) {
        // Actualizar elementos de navegación
        navItems.forEach(item => {
            if (item.dataset.target === target) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Mostrar sección correspondiente
        contentSections.forEach(section => {
            if (section.id === `${target}-content`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        // Actualizar título y subtítulo con animación
        if (sectionTexts[target]) {
            // Añadir clase de animación
            dynamicTitle.classList.add('title-changing');
            dynamicSubtitle.classList.add('title-changing');
            
            // Cambiar texto después de un breve delay
            setTimeout(() => {
                dynamicTitle.textContent = sectionTexts[target].title;
                dynamicSubtitle.textContent = sectionTexts[target].subtitle;
                
                // Remover clase de animación
                setTimeout(() => {
                    dynamicTitle.classList.remove('title-changing');
                    dynamicSubtitle.classList.remove('title-changing');
                }, 300);
            }, 150);
        }
        
        // Scroll al inicio del contenido
        document.querySelector('.content-scrollable').scrollTop = 0;
    }
    
    // Agregar eventos a los íconos de navegación
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.dataset.target;
            changeSection(target);
        });
    });
    
    // ===== DESCARGA DE CV =====
    const downloadCvBtn = document.getElementById('cv-download-btn');

    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', function() {
            const link = document.createElement('a');
            link.href = 'Diego-Tardon.CV.pdf'; // nombre exacto del archivo
            link.download = 'Diego-Tardon.CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    
    // ===== FORMULARIO DE CONTACTO =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar formulario
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !subject || !message) {
                showNotification('Por favor, completa todos los campos', 'error');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Simular envío exitoso
            showNotification('Mensaje enviado correctamente. ¡Gracias por contactarme!', 'success');
            
            // Limpiar formulario
            contactForm.reset();
            
            // En una implementación real, aquí iría el código para enviar a un backend
            // Por ejemplo usando Formspree, EmailJS, o un servidor propio
        });
    }
    
    // ===== FUNCIÓN PARA MOSTRAR NOTIFICACIONES =====
    function showNotification(message, type = 'success') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Colores según el tipo
        let bgColor, borderColor;
        
        switch(type) {
            case 'error':
                bgColor = 'rgba(237, 135, 150, 0.95)';
                borderColor = 'rgba(237, 135, 150, 0.3)';
                break;
            case 'info':
                bgColor = 'rgba(138, 173, 244, 0.95)';
                borderColor = 'rgba(138, 173, 244, 0.3)';
                break;
            default: // success
                bgColor = 'rgba(166, 227, 161, 0.95)';
                borderColor = 'rgba(166, 227, 161, 0.3)';
        }
        
        // Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: #1e1e2e;
            padding: 12px 20px;
            border-radius: 10px;
            border: 1px solid ${borderColor};
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            backdrop-filter: blur(10px);
            max-width: 280px;
            font-size: 0.9rem;
            font-weight: 500;
            line-height: 1.4;
        `;
        
        document.body.appendChild(notification);
        
        // Remover notificación después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Crear estilos para animaciones de notificaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Inicializar con la sección activa
    const activeItem = document.querySelector('.nav-icon-item.active');
    if (activeItem) {
        changeSection(activeItem.dataset.target);
    }
    
    // Añadir efecto de carga inicial
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});