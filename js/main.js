// Интерактивная логика лендинга RONIK
document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ RONIK Landing Page Initialized');

    // Клик по кнопке для копирования никнейма в буфер
    const copyTriggers = document.querySelectorAll('[data-copy]');
    const toast = document.getElementById('toast');

    copyTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Скопировано: ${textToCopy}`);
            }).catch(err => {
                console.error('Ошибка копирования:', err);
            });
        });
    });

    function showToast(message) {
        if (!toast) return;
        toast.textContent = `✓ ${message}`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // Круговая 3D Карусель с прокруткой колёсиком мыши
    const container = document.getElementById('carouselContainer');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');

    if (slides.length > 0) {
        let currentIndex = 0;
        const total = slides.length;
        let isThrottled = false;

        // Добавляем оверлей-гарды над видео для перехвата скролла
        slides.forEach(slide => {
            const wrapper = slide.querySelector('.video-frame-wrapper');
            if (wrapper && !wrapper.querySelector('.slide-wheel-guard')) {
                const guard = document.createElement('div');
                guard.className = 'slide-wheel-guard';
                wrapper.appendChild(guard);
            }
        });

        function loadSlideIframe(slide) {
            const iframe = slide.querySelector('.video-iframe');
            const targetSrc = slide.getAttribute('data-src');
            if (iframe && targetSrc && !iframe.getAttribute('src')) {
                iframe.setAttribute('src', targetSrc);
            }
        }

        function renderCarousel(index) {
            currentIndex = (index + total) % total;

            slides.forEach((slide, i) => {
                slide.className = 'carousel-slide';

                let diff = (i - currentIndex + total) % total;
                if (diff > total / 2) {
                    diff -= total;
                }

                if (diff === 0) {
                    slide.classList.add('active');
                    loadSlideIframe(slide);
                } else if (diff === -1) {
                    slide.classList.add('prev');
                    loadSlideIframe(slide);
                } else if (diff === 1) {
                    slide.classList.add('next');
                    loadSlideIframe(slide);
                } else if (diff === -2) {
                    slide.classList.add('far-prev');
                } else if (diff === 2) {
                    slide.classList.add('far-next');
                }
            });

            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        function nextSlide() {
            renderCarousel(currentIndex + 1);
        }

        function prevSlide() {
            renderCarousel(currentIndex - 1);
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Клик по боковым карточкам
        slides.forEach((slide, i) => {
            slide.addEventListener('click', (e) => {
                if (i !== currentIndex) {
                    e.preventDefault();
                    renderCarousel(i);
                }
            });
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
                if (!isNaN(targetIdx)) {
                    renderCarousel(targetIdx);
                }
            });
        });

        // ПЕРЕХВАТ КОЛЁСИКА МЫШИ НА ВСЕМ БЛОКЕ КАРУСЕЛИ
        if (container) {
            container.addEventListener('wheel', (e) => {
                // Всегда крутим слайды карусели
                e.preventDefault();
                e.stopPropagation();

                if (isThrottled) return;

                if (e.deltaY > 0 || e.deltaX > 0) {
                    nextSlide();
                } else if (e.deltaY < 0 || e.deltaX < 0) {
                    prevSlide();
                }

                isThrottled = true;
                setTimeout(() => {
                    isThrottled = false;
                }, 300);
            }, { passive: false });
        }

        // Свайпы на тач-экранах
        let touchStartX = 0;
        let touchEndX = 0;

        if (container) {
            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 40) {
                    if (diff > 0) nextSlide();
                    else prevSlide();
                }
            }, { passive: true });
        }

        // Запуск
        renderCarousel(0);
    }
});
