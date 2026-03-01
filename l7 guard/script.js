// Ждем, пока вся страница загрузится
document.addEventListener("DOMContentLoaded", function() {
    
    // Находим все элементы, у которых есть класс 'reveal'
    const reveals = document.querySelectorAll(".reveal");

    // Настраиваем "Наблюдателя"
    const revealOptions = {
        threshold: 0.15, // Блок начнет появляться, когда хотя бы 15% его высоты покажется на экране
        rootMargin: "0px 0px -50px 0px" // Небольшой отступ, чтобы анимация срабатывала чуть раньше
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            // Если блок появился в зоне видимости
            if (entry.isIntersecting) {
                // Добавляем ему класс 'active', который запустит CSS-анимацию
                entry.target.classList.add("active");
                // Перестаем следить за этим блоком (чтобы он не мигал при скролле туда-сюда)
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Даем команду Наблюдателю следить за каждым блоком с классом 'reveal'
    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

});

// ==========================================
    // ЛОГИКА ДЛЯ ВАРИАНТА 2 (БЕЗУПРЕЧНЫЙ СКРОЛЛ)
    // ==========================================
    
    const v2Layout = document.querySelector('.v2-layout'); 
    const v2Tabs = document.querySelectorAll('.v2-tab-item');
    const dynamicTitle = document.getElementById('dynamic-visual-title');
    
    let currentTabIndex = 0;
    let isScrollLocked = false;

    function activateTabByIndex(index) {
        v2Tabs.forEach(t => t.classList.remove('active'));
        v2Tabs[index].classList.add('active');
        dynamicTitle.textContent = v2Tabs[index].getAttribute('data-title');
        currentTabIndex = index;
    }

    // Слушаем скролл ТОЛЬКО когда курсор на блоке с контентом (.v2-layout)
    if (v2Layout) {
        v2Layout.addEventListener('wheel', (e) => {
            
            if (isScrollLocked) {
                e.preventDefault(); 
                return;
            }

            const scrollingDown = e.deltaY > 0;

            if (scrollingDown) {
                // Если мы ЕЩЕ НЕ на последнем пункте — переключаем пункт внутри блока
                if (currentTabIndex < v2Tabs.length - 1) {
                    e.preventDefault(); // Блокируем скролл страницы
                    activateTabByIndex(currentTabIndex + 1);
                    lockScroll(500); // Задержка 0.5с между переключениями (можешь менять)
                } 
                // Если пункт ПОСЛЕДНИЙ — мы просто ничего не делаем (не вызываем preventDefault).
                // Страница сама естественно перемагнитится к следующему блоку!
                
            } else {
                // Если мы ЕЩЕ НЕ на первом пункте — идем вверх по списку
                if (currentTabIndex > 0) {
                    e.preventDefault(); 
                    activateTabByIndex(currentTabIndex - 1);
                    lockScroll(500); 
                } 
                // Если пункт ПЕРВЫЙ — ничего не делаем, браузер сам вернет нас на прошлый экран.
            }
        }, { passive: false });
    }

    function lockScroll(time) {
        isScrollLocked = true;
        setTimeout(() => {
            isScrollLocked = false;
        }, time); 
    }

    v2Tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            activateTabByIndex(index);
        });
    });