document.getElementById('searchBtn').addEventListener('click', function() {
    const input = document.getElementById('searchInput').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    const resultsDiv = document.getElementById('results');
    errorMsg.textContent = '';
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('active');
    if (!input) {
        errorMsg.textContent = 'Search field cannot be empty.';
        return;
    }
    fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(input)}`)
        .then(response => response.json())
        .then(data => {
            if (data.products && data.products.length > 0) {
                data.products.forEach(product => {
                    const div = document.createElement('div');
                    div.innerHTML = `<strong>${product.title}</strong><br>Price: $${product.price}<br><img src="${product.thumbnail}" width="100"><hr>`;
                    resultsDiv.appendChild(div);
                });
                resultsDiv.classList.add('active');
            } else {
                resultsDiv.textContent = 'No products found.';
                resultsDiv.classList.add('active');
            }
        })
        .catch(() => {
            errorMsg.textContent = 'Error fetching products.';
        });
});
// ...existing code...
