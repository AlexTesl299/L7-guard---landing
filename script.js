document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. АНИМАЦИИ ПОЯВЛЕНИЯ (REVEAL) Оставляем как было
    // ==========================================
    const reveals = document.querySelectorAll(".reveal");
    const revealOptions = {
        threshold: 0.15,
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // ==========================================
    // 2. УМНЫЙ СКРОЛЛ (1 КЛИК = 1 ЭКРАН)
    // ==========================================
    
    const sections = Array.from(document.querySelectorAll('section, .footer'));
    
    // 1. УМЕНЬШАЕМ ОТСТУП ОТ ШАПКИ (БЫЛО 80, СТАЛО 60)
    const headerOffset = 60; 
    let lastWheelTime = 0;

    // Главная функция плавного перелета
    function scrollToSection(direction) {
        const currentScroll = window.scrollY;
        let currentIndex = 0;

        // 1. Стандартная проверка: на каком экране мы сейчас
        sections.forEach((sec, index) => {
            if (sec.offsetTop - headerOffset - 10 <= currentScroll) {
                currentIndex = index;
            }
        });

        // 2. ИСПРАВЛЕНИЕ БАГА С ФУТЕРОМ: 
        // Если сумма прокрутки и высоты экрана равна всей высоте сайта (уперлись в дно),
        // принудительно говорим скрипту, что мы на последнем элементе (футере)
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
            currentIndex = sections.length - 1;
        }

        let nextIndex = currentIndex;

        // 3. Вычисляем куда летим
        if (direction === 1) {
            nextIndex = currentIndex + 1;
        } else if (direction === -1) {
            nextIndex = currentIndex - 1;
        }

        if (nextIndex < 0) nextIndex = 0;
        if (nextIndex >= sections.length) nextIndex = sections.length - 1;

        // 4. Летим
        window.scrollTo({
            top: sections[nextIndex].offsetTop - headerOffset,
            behavior: 'smooth'
        });
    }

    // Слушаем колесико мыши
    window.addEventListener('wheel', (e) => {
        // Игнорируем тачпады (они генерируют мелкие deltaY и и так скроллят идеально)
        if (Math.abs(e.deltaY) < 40) return;

        const now = Date.now();
        const timeDiff = now - lastWheelTime;
        lastWheelTime = now;

        // МАГИЯ СВОБОДНОГО СКРОЛЛА: 
        // Если юзер крутит колесико ОЧЕНЬ быстро (события идут с разницей меньше 60мс)
        if (timeDiff < 60) {
            // Не вмешиваемся! Пусть браузер сам летит вниз сколько угодно.
            return;
        }

        // Иначе это МЕДЛЕННЫЙ, ОДИНАРНЫЙ щелчок колесика.
        e.preventDefault(); // Запрещаем дергаться на 100 пикселей
        
        // Летим ровно на 1 секцию
        const direction = e.deltaY > 0 ? 1 : -1;
        scrollToSection(direction);

    }, { passive: false }); // passive: false обязательно для работы e.preventDefault()

    // Слушаем стрелочки на клавиатуре
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'PageDown' || e.key === 'PageUp') {
            e.preventDefault(); // Запрещаем дергаться
            
            let direction = 0;
            if (e.key === 'ArrowDown' || e.key === 'PageDown') direction = 1;
            if (e.key === 'ArrowUp' || e.key === 'PageUp') direction = -1;
            
            if (direction !== 0) {
                scrollToSection(direction);
            }
        }
    }, { passive: false });

});


// ==========================================
// ФУНКЦИЯ: СКРОЛЛ К ЦЕНТРУ И ПОДСВЕТКА
// ==========================================

function scrollToAndHighlight(targetId) {
    const targetBlock = document.getElementById(targetId);
    
    if (targetBlock) {
        // 1. Плавно скроллим так, чтобы блок встал ровно по ЦЕНТРУ экрана
        targetBlock.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });

        // 2. Добавляем класс, который запускает CSS-анимацию свечения
        targetBlock.classList.add('highlight-flash');

        // 3. Убираем класс через 2 секунды (когда анимация закончится), 
        // чтобы при повторном клике она сработала снова
        setTimeout(() => {
            targetBlock.classList.remove('highlight-flash');
        }, 2000);
    }
}