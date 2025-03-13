import {BaseEle} from "./core.js"

class ImageSlideshow extends BaseEle {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentIndex = 0;
        this.autoPlay = true;
        this.intervalDuration = 3000;
        this.isTransitioning = false;

        this.shadowRoot.innerHTML = /*html*/`
            <style>
                :host {
                    display: block;
                    width: var(--slide-width, 100%);
                    max-width: 100%;
      
                    position: relative;
                    overflow: hidden;
                }

                .slides-container {
                    position: relative;
                    width: 100%;
                  min-height: var( --slide-min-height, 300px);
                }

                ::slotted(img) {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    object-fit: contain;
                    opacity: 0;
                    transition: opacity var(--transition-duration) ease-in-out;
                }

                ::slotted(img.active) {
                    opacity: 1;
                }

                .navigation-button {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0,0,0,0.5);
                    color: white;
                    border: none;
                    padding: 15px;
                    cursor: pointer;
                    font-size: 18px;
                    transition: opacity 0.3s;
                    z-index: 10;
                }

                .navigation-button:hover {
                    opacity: 0.8;
                }

                .prev {
                    left: 0;
                    border-radius: 0 5px 5px 0;
                    z-index: 30;
                }

                .next {
                    right: 0;
                    border-radius: 5px 0 0 5px;
                    z-index: 30;
                }

                .slides-control {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                } 

                .volume {
                    width: 100%
                }

                .place {
                    opacity: 0;
                    width: 100%;
                }

                
                @media (max-width: 768px) {
                    .navigation-button {
                        padding: 10px;
                        font-size: 16px;
                    }
                }
            </style>

            <div class="slides-control">
                <div class="total"></div>
                <input type="number" class="volume" name="volume" value="1" min="1" max="3" />
                <button class="submit" type="button">submit</button>
            </div>
            
            <div class="slides-container">
                <div style="height: max-content;"><img class="place" /></div>    
                <slot></slot>
            </div>
            <button class="navigation-button prev">❮</button>
            <button class="navigation-button next">❯</button>

        `;
    }

    connectedCallback() {
        this.slides = this.querySelectorAll('img');
        this.setupClones();
        this.allSlides = this.querySelectorAll('img');
        this.slidesContainer = this.shadowRoot.querySelector('.slides-container');
        this.setupEventListeners();
        this.initializeSlides();
        this.startAutoPlay();
    }

    onStateUpdate(states) {
        this.classList.toggle("is_inner", states.has('is-inner'))
    }

    setupClones() {
        // 克隆第一个和最后一个元素实现无限循环
        this.initSlide(this.slides[0])
        this.initSlide(this.slides[this.slides.length - 1])

        const firstClone = this.slides[0].cloneNode(true);
        const lastClone = this.slides[this.slides.length - 1].cloneNode(true);

        this.appendChild(firstClone);
        this.insertBefore(lastClone, this.slides[0]);
    }

    initializeSlides() {
        this.shadowRoot.querySelector('.volume').setAttribute('max', this.allSlides.length - 2)
        this.shadowRoot.querySelector('.total').textContent = this.allSlides.length - 2
        this.allSlides.forEach((slide, index) => {
            slide.classList.remove('active');
        });
        // 初始显示真实的第一张
        this.allSlides[1].classList.add('active');
        this.currentIndex = 1;
        this.shadowRoot.querySelector('.place').setAttribute('src', this.allSlides[1].getAttribute('src'))
    }

    setupEventListeners() {
        this.shadowRoot.querySelector('.prev').addEventListener('click', () => this.prevSlide());
        this.shadowRoot.querySelector('.next').addEventListener('click', () => this.nextSlide());

        this.shadowRoot.querySelector('.submit').addEventListener('click', (e) => {
            // console.log(e.currentTarget.value);
            this.jumpToSlide( parseInt(this.shadowRoot.querySelector('.volume').value))
        })
        
        // console.log(  this.slidesContainer )

        let handleStopInner = () => {
            // clearInterval(this.interval)
            this._internals.addState('is-inner')
        }

        let handleResetInner = () => {
            // console.log('ssssssssssssssss');
            
            this._internals.deleteState('is-inner')
            this.startAutoPlay()
        }

        this.addEventListener('pointerenter', handleStopInner);
        this.addEventListener('pointerleave', handleResetInner)
        this.addEventListener('mouseenter', handleStopInner);
        this.addEventListener('mouseleave', handleResetInner);

        this.shadowRoot.addEventListener('transitionstart', () => {
            this.initSlide(this.allSlides[this.currentIndex])
            this.shadowRoot.querySelector('.place').setAttribute('src', this.allSlides[this.currentIndex].getAttribute('src'))
        });

        this.shadowRoot.addEventListener('transitionend', () => {
            // console.log('transitionend')
            this.handleTransitionEnd()
        });
    }

    initSlide(slide) {
        if (slide && !slide.hasAttribute('src')) {
            slide.setAttribute('src', slide.getAttribute('srcres'))
        }
    }

    handleTransitionEnd() {
        this.isTransitioning = false;
        // 在克隆项时立即切换到真实项
        if (this.currentIndex === 0) {
            this.jumpToSlide(this.slides.length, false);
        } else if (this.currentIndex === this.allSlides.length - 1) {
            this.jumpToSlide(1, false);
        }

        this.shadowRoot.querySelector('.volume').value = this.currentIndex;        
    }

    get realIndex() {
        const total = this.slides.length;
        return ((this.currentIndex - 1) % total + total) % total;
    }

    preloadData() {
        this.initSlide(this.allSlides[ this.currentIndex + 1])
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        const currentSlide = this.allSlides[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.allSlides.length;
        const nextSlide = this.allSlides[this.currentIndex];


        currentSlide.classList.remove('active');
        nextSlide.classList.add('active');
        this.preloadData()
        this.resetAutoPlay();
    }

    prevSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        const currentSlide = this.allSlides[this.currentIndex];
        this.currentIndex = (this.currentIndex - 1 + this.allSlides.length) % this.allSlides.length;
        const prevSlide = this.allSlides[this.currentIndex];

        currentSlide.classList.remove('active');
        prevSlide.classList.add('active');
        this.preloadData()
        this.resetAutoPlay();
    }

    jumpToSlide(index, withAnimation = true) {
        const previousIndex = this.currentIndex;
        this.currentIndex = index;

   
        this.allSlides[previousIndex].classList.remove('active');
        this.allSlides[this.currentIndex].classList.add('active');
        
        if (!withAnimation) {
            this.allSlides.forEach(slide => {
                slide.style.transition = 'none';
            });
            setTimeout(() => {
                this.allSlides.forEach(slide => {
                    slide.style.transition = '';
                });
            }, 50);
        }
    }

    startAutoPlay() {
        const interval = parseInt(this.getAttribute('interval')) || this.intervalDuration;
        this.interval = setInterval(() => this.nextSlide(), interval);
    }

    resetAutoPlay() {
        if ( this._internals.states.has('is-inner') ) {
            return
        }
        clearInterval(this.interval);
        this.startAutoPlay();
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }
}

customElements.define('image-slideshow', ImageSlideshow);