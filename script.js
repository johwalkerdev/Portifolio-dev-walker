document.addEventListener('DOMContentLoaded', () => {

    const initSkillOrbit = () => {
        const orbitContainer = document.querySelector('.orbit-container');
        const skillIcons = document.querySelectorAll('.skill-icon');

        if (!orbitContainer || skillIcons.length === 0) return;

        const containerSize = orbitContainer.offsetWidth;
        const baseRadius = containerSize / 2;
        const iconSizeOffset = 30; 

        const orbitData = Array.from(skillIcons).map((icon, index) => {
            const initialAngle = (2 * Math.PI / skillIcons.length) * index;
            const radiusMultiplier = parseFloat(icon.dataset.radiusMultiplier || 1.0);
            const speedMultiplier = parseFloat(icon.dataset.speed || 0.005);

            return {
                element: icon,
                angle: initialAngle + (Math.random() * Math.PI / 4),
                currentRadius: baseRadius * radiusMultiplier,
                speed: speedMultiplier
            };
        });

        const renderOrbit = () => {
            orbitData.forEach(data => {
                data.angle += data.speed;
                const x = data.currentRadius * Math.cos(data.angle) - iconSizeOffset;
                const y = data.currentRadius * Math.sin(data.angle) - iconSizeOffset;

                data.element.style.left = `${baseRadius + x}px`;
                data.element.style.top = `${baseRadius + y}px`;

                const normalizedY = -(y + iconSizeOffset - baseRadius) / baseRadius; 
                
                data.element.style.zIndex = normalizedY < 0 ? 5 : 15; 

                const scale = 0.8 + 0.2 * (normalizedY + 1) / 2;
                const opacity = 0.2 + 0.4 * (normalizedY + 1) / 2;

                data.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
                data.element.style.opacity = opacity;
            });

            requestAnimationFrame(renderOrbit);
        };

        orbitContainer.addEventListener('animationend', (e) => {
            if (e.animationName === 'slideInRight') renderOrbit();
        }, { once: true });
        
        renderOrbit();
    };

    const initHeroLoop = () => {
        const textoElement = document.querySelector('.textos');
        const orbitElement = document.querySelector('.orbit-container');
        const mainSection = document.querySelector('.caixa-principal'); 

        if (!textoElement || !orbitElement || !mainSection) return;

        let intervalId = null;
        const cycleDuration = 4500; 

        const restartAnimation = () => {
            textoElement.classList.add('reset');
            orbitElement.classList.add('reset');
            
            void textoElement.offsetWidth;
            void orbitElement.offsetWidth; 
            
            textoElement.classList.remove('reset');
            orbitElement.classList.remove('reset');

            textoElement.classList.add('loop');
            orbitElement.classList.add('loop');
        };

        const stopLoop = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                textoElement.classList.remove('loop');
                orbitElement.classList.remove('loop');
            }
        };

        const startLoop = () => {
            if (!intervalId) {
                restartAnimation();
                intervalId = setInterval(restartAnimation, cycleDuration);
            }
        };
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 
        };

        const mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startLoop();
                } else {
                    stopLoop();
                }
            });
        }, observerOptions);

        textoElement.classList.remove('loop');
        orbitElement.classList.remove('loop');

        mainObserver.observe(mainSection);
    };

    
    initSkillOrbit();
    initHeroLoop();
});