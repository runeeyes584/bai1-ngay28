document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-btn');
    const htmlElement = document.documentElement; // Or document.body, but root is safer for vars

    // Check local storage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️';
    } else {
         themeBtn.textContent = '🌙';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Save preference
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeBtn.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeBtn.textContent = '🌙';
        }
    });

    const tableBody = document.querySelector('#product-table tbody');

    // Fetch data from local json file
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderTable(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Failed to load data. Please ensure you are running this on a local server.</td></tr>`;
        });

    function renderTable(products) {
        // Clear existing content
        tableBody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');

            // Handle image: use first image from array or placeholder
            // Clean up image string if needed (sometimes API strings are messy)
            let imageUrl = 'https://placehold.co/50x50';
            if (product.images && product.images.length > 0) {
                 // Simple validation to check if it's a valid looking URL string
                 let imgRaw = product.images[0];
                 // Remove potential brackets or weird formatting if they exist in raw string (based on common issues with this specific mock API)
                 if (typeof imgRaw === 'string' && imgRaw.startsWith('["')) {
                     try {
                         const parsed = JSON.parse(imgRaw);
                         if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
                     } catch(e) {
                         imageUrl = imgRaw;
                     }
                 } else {
                     imageUrl = imgRaw;
                 }
            }

            // Create cells
            row.innerHTML = `
                <td data-label="ID">#${product.id}</td>
                <td data-label="Name" style="font-weight:500;">${product.title}</td>
                <td data-label="Slug" style="color: var(--slug-color); font-style: italic;">${product.slug}</td>
                <td data-label="Price" class="price">$${product.price}</td>
                <td data-label="Description" style="font-size: 0.9em; color: var(--desc-color);">
                    ${product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}
                </td>
                <td data-label="Category">
                    <span class="category-badge">${product.category ? product.category.name : 'Uncategorized'}</span>
                </td>
                <td data-label="Image">
                    <img src="${imageUrl}" alt="${product.title}" class="product-img" onerror="this.src='https://placehold.co/50x50?text=No+Img'">
                </td>
            `;

            tableBody.appendChild(row);
        });
    }
});
