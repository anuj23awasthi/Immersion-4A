document.getElementById('searchBtn').addEventListener('click', function() {
    const input = document.getElementById('searchInput').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = '';
    if (!input) {
        // If search is empty, show all products
        currentProducts = allProducts;
        populateBrandFilter(allProducts);
        applyFiltersAndSort();
        return;
    }
    fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(input)}`)
        .then(response => response.json())
        .then(data => {
            if (data.products && data.products.length > 0) {
                currentProducts = data.products;
                populateBrandFilter(currentProducts);
                applyFiltersAndSort();
            } else {
                currentProducts = [];
                renderProducts([]);
            }
        })
        .catch(() => {
            errorMsg.textContent = 'Error fetching products.';
        });
});

let currentProducts = [];
let allProducts = [];

function renderProducts(products) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (products.length === 0) {
        resultsDiv.textContent = 'No products found.';
        resultsDiv.classList.add('active');
        return;
    }
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-brand">Brand: ${product.brand || 'N/A'}</p>
                <p class="product-price">Price: $${product.price}</p>
                <p class="product-rating">Rating: ${product.rating || 'N/A'}</p>
            </div>
        `;
        resultsDiv.appendChild(card);
    });
    resultsDiv.classList.add('active');
}

function applyFiltersAndSort() {
    let filtered = [...currentProducts];
    // Filter by brand
    const brand = document.getElementById('brandFilter').value;
    if (brand !== 'all') {
        filtered = filtered.filter(p => p.brand === brand);
    }
    // Filter by price range
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    // Sort
    const sort = document.getElementById('sortSelect').value;
    if (sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating-desc') {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'rating-asc') {
        filtered.sort((a, b) => a.rating - b.rating);
    }
    renderProducts(filtered);
}

function populateBrandFilter(products) {
    const brandSet = new Set(products.map(p => p.brand).filter(Boolean));
    const brandFilter = document.getElementById('brandFilter');
    brandFilter.innerHTML = '<option value="all">All Brands</option>';
    brandSet.forEach(brand => {
        const opt = document.createElement('option');
        opt.value = brand;
        opt.textContent = brand;
        brandFilter.appendChild(opt);
    });
}

// Fetch all products on page load
window.addEventListener('DOMContentLoaded', function() {
    fetch('https://dummyjson.com/products?limit=100')
        .then(response => response.json())
        .then(data => {
            allProducts = data.products;
            currentProducts = allProducts;
            populateBrandFilter(allProducts);
            applyFiltersAndSort();
        });
});

document.getElementById('sortSelect').addEventListener('change', applyFiltersAndSort);
document.getElementById('brandFilter').addEventListener('change', applyFiltersAndSort);
document.getElementById('minPrice').addEventListener('input', applyFiltersAndSort);
document.getElementById('maxPrice').addEventListener('input', applyFiltersAndSort);

