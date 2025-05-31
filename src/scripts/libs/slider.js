import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
// import Swiper and modules styles
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";

// Инициализация слайдеров
export function initSliders() {
    // Перечень слайдеров
    // Проверяем, есть ли слайдер на странице
    if (document.querySelector(".swiper")) {
        // Указываем класс нужного слайдера
        // Создаем слайдер
        new Swiper(".swiper", {
            // Указываем класс нужного слайдера
            // Подключаем модули слайдера для конкретного случая
            modules: [Navigation, Pagination],
            observer: true,
            observeParents: true,
            slidesPerView: "auto",
            centeredSlides: true, // Центрировать слайд
            spaceBetween: 0,
            //autoHeight: true,
            speed: 800,

            //touchRatio: 0,
            //simulateTouch: false,
            loop: true,
            //preloadImages: false,
            //lazy: true,

            /*
			// Эффекты
			effect: 'fade',
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			*/

            // Пагинация

            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },

            // Скроллбар
            /*
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			*/

            // Кнопки "влево/вправо"
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next",
            },

            // Брейкпоинты
            /*
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 0,
					autoHeight: true,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},
			*/
            // События
            on: {},
        });
    }
}
// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
    // Добавление классов слайдера
    // при необходимости отключить
    bildSliders();

    let sliderScrollItems = document.querySelectorAll(".swiper_scroll");
    if (sliderScrollItems.length > 0) {
        for (let index = 0; index < sliderScrollItems.length; index++) {
            const sliderScrollItem = sliderScrollItems[index];
            const sliderScrollBar = sliderScrollItem.querySelector(".swiper-scrollbar");
            const sliderScroll = new Swiper(sliderScrollItem, {
                observer: true,
                observeParents: true,
                direction: "vertical",
                slidesPerView: "auto",
                freeMode: {
                    enabled: true,
                },
                scrollbar: {
                    el: sliderScrollBar,
                    draggable: true,
                    snapOnRelease: false,
                },
                mousewheel: {
                    releaseOnEdges: true,
                },
            });
            sliderScroll.scrollbar.updateSize();
        }
    }
}

// window.addEventListener("load", function (e) {
//     // Запуск инициализации слайдеров
//     initSliders();
//     // Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
//     //initSlidersScroll();
// });
