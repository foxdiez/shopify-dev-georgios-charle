class ProductCarousel extends HTMLElement {
    constructor() {
        super();

        this.fetchProductMethod = this.fetchMockProducts();

        const swiper = new Swiper('.swiper-product-carousel', {  
            init: false,
            slidesPerView: 1.4,
            spaceBetween: 20,
            lazyPreloadPrevNext: 1,
            pagination: {
              el: '.swiper-pagination',
              type: 'progressbar',
            },
            breakpoints: {
                768: {
                    lazyPreloadPrevNext: 2,
                    slidesPerView: 3,
                    spaceBetween: 24,
                },
                1024: {
                    slidesPerView: 4,
                    grabCursor: true,
                    preventClicks: true,
                },
            },
        });

        swiper.on('afterInit', function() {
            this.fetchProductMethod;
        });

        swiper.init();
    }

    fetchMockProducts() {
        if (this.hasAttribute('mockshop-products')) {
            fetch('https://mock.shop/api?query={products(first:%2020){edges%20{node%20{id%20title%20description%20featuredImage%20{id%20url}%20variants(first:%203){edges%20{node%20{price%20{amount%20currencyCode}}}}}}}}', {
                method: 'GET', 
                credentials: 'same-origin', 
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then((response) => response.json())
            .then((response) => {
                const fetchedProducts = response.data.products.edges;

                for(let i = 0; i < fetchedProducts.length; i++) {
                    const variants = fetchedProducts[i].node.variants.edges[0];

                    const productBlock = 
                        '<product-block class="swiper-slide mb-4 group">\n' +
                            '<div class="media--hover-effect overflow-hidden">\n' +
                                '<img class="transition-transform duration-500 group-hover:scale-[1.03]" src="'+ fetchedProducts[i].node.featuredImage.url +'" loading="lazy" width="600"/>\n' +
                                '<div class="swiper-lazy-preloader"></div>\n' +
                            '</div>\n' +
                            '<div class="py-[1.7rem]">\n' +
                                '<p class="text-xl text-black mt-4 mb-1 group-hover:underline group-hover:underline-offset-[0.3rem]">'+ fetchedProducts[i].node.title +'</p>\n' +
                                '<product-price class="text-3xl font-bold text-black flex mt-[0.7rem]">\n' +
                                    '<p>\n' + 
                                        variants.node.price.currencyCode + ' ' +
                                        variants.node.price.amount +
                                    '</p>\n' +
                                '</product-price>\n' +
                            '</div>\n' +
                        '</product-block>\n'
                    ;

                    this.querySelector('.swiper-wrapper').innerHTML += productBlock;
                }
            })
            .catch((error) => {
                console.error('Mockshop Error: ' + error);
            });
        }
    }
}

customElements.define('product-carousel', ProductCarousel);