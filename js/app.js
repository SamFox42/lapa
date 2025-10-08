const productDatabase = {
    cats: [
        { 
            id: 'cat-dry-sterilized-duck-turkey', 
            file: 'products/cats/dry-sterilized-duck-turkey.html' 
        },
        { 
            id: 'cat-dry-adult-beef-turkey', 
            file: 'products/cats/dry-adult-beef-turkey.html' 
        },
        { 
            id: 'cat-dry-sterilized-beef', 
            file: 'products/cats/dry-sterilized-beef.html' 
        },
        { 
            id: 'cat-dry-adult-duck', 
            file: 'products/cats/dry-adult-duck-beef-turkey.html' 
        }
    ],
    dogs: [
        { 
            id: 'dog-dry-puppy-beef', 
            file: 'products/dogs/dry-puppy-beef.html' 
        },
        { 
            id: 'dog-dry-adult-beef', 
            file: 'products/dogs/dry-adult-beef.html' 
        },
        { 
            id: 'dog-dry-adult-duck-beef-turkey', 
            file: 'products/dogs/dry-adult-duck-beef-turkey.html' 
        }
    ]
};


let currentFilters = {
    type: 'all',
    age: 'all',
    flavor: 'all',
    search: ''
};

let loadedProductsIndex = {};

async function loadProduct(productFile) {
    try {
        const response = await fetch(productFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error loading product:', error);
        return null;
    }
}

async function loadProducts(container, category, isLoadMore = false) {
    if (!container) return;

    const products = productDatabase[category] || [];
    
    if (!loadedProductsIndex[category]) {
        loadedProductsIndex[category] = 0;
    }

    const startIndex = isLoadMore ? loadedProductsIndex[category] : 0;
    const endIndex = Math.min(startIndex + 20, products.length);

    if (!isLoadMore) {
        container.innerHTML = '';
        loadedProductsIndex[category] = 0;
    }

    for (let i = startIndex; i < endIndex; i++) {
        const productHTML = await loadProduct(products[i].file);
        if (productHTML) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = productHTML;
            const productCard = tempDiv.firstElementChild;
            
            if (productCard && shouldShowProduct(productCard)) {
                container.appendChild(productCard);
            }
        }
    }

    loadedProductsIndex[category] = endIndex;
    updateLoadMoreButton(category);
}

function shouldShowProduct(productCard) {
    const type = productCard.getAttribute('data-type');
    const age = productCard.getAttribute('data-age');
    const flavor = productCard.getAttribute('data-flavor');
    const tags = productCard.getAttribute('data-tags') || '';

    if (currentFilters.type !== 'all' && type !== currentFilters.type) return false;
    if (currentFilters.age !== 'all' && age !== currentFilters.age) return false;
    if (currentFilters.flavor !== 'all' && flavor !== currentFilters.flavor) return false;
    
    if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        const tagsLower = tags.toLowerCase();
        const titleElement = productCard.querySelector('h3');
        const title = titleElement ? titleElement.textContent.toLowerCase() : '';
        
        if (!tagsLower.includes(searchLower) && !title.includes(searchLower)) {
            return false;
        }
    }

    return true;
}

function updateLoadMoreButton(category) {
    const loadMoreBtn = document.getElementById('loadMore');
    if (!loadMoreBtn) return;

    const products = productDatabase[category] || [];
    const currentIndex = loadedProductsIndex[category] || 0;
    
    if (currentIndex >= products.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
}

function setupFilters() {
    const filterChips = document.querySelectorAll('.filter-chips');
    
    filterChips.forEach(group => {
        const filterType = group.getAttribute('data-filter');
        const chips = group.querySelectorAll('.chip');
        
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                const value = chip.getAttribute('data-value');
                currentFilters[filterType] = value;
                
                const container = document.getElementById('productsContainer');
                const category = container?.getAttribute('data-category');
                if (category) {
                    loadProducts(container, category);
                }
            });
        });
    });
}

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const container = document.getElementById('productsContainer');
            const category = container?.getAttribute('data-category');
            if (category) {
                loadProducts(container, category, true);
            }
        });
    }
}

function setupGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            
            const container = document.getElementById('productsContainer');
            const category = container?.getAttribute('data-category');
            if (category) {
                loadProducts(container, category);
            }
            
            const hitsContainer = document.getElementById('hitsContainer');
            if (hitsContainer) {
                loadProducts(hitsContainer, 'hits');
            }
        });
    }
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formMessage = document.getElementById('formMessage');
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.';
            
            form.reset();
            
            setTimeout(() => {
                formMessage.className = 'form-message';
            }, 5000);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('productsContainer');
    const hitsContainer = document.getElementById('hitsContainer');
    
    if (productsContainer) {
        const category = productsContainer.getAttribute('data-category');
        loadProducts(productsContainer, category);
        setupLoadMore();
    }
    
    if (hitsContainer) {
        loadProducts(hitsContainer, 'hits');
    }
    
    setupFilters();
    setupGlobalSearch();
    setupContactForm();
});
