document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();

        updateProductListings(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    function updateProductListings(products) {
        const productContainer = document.getElementById("product-listings");

        productContainer.innerHTML = "";

        if (Array.isArray(products)) {
            products.forEach((product, index) => {
                const productCard = createProductCard(product);
                productContainer.appendChild(productCard);

                if (index === 0) {
                    productCard.click();
                }
            });
        } else {
            console.error("Invalid products array:", products);
        }
    }


    function createProductCard(product) {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.dataset.productId = product.id;
    
        productCard.innerHTML = `
            <img src="${product.url}" alt="${product.productName}">
            <h3>${product.productName}</h3>
            <p class="sustainability-metrics">${product.sustainabilityMetrics}</p>
            <p class="certification-badges">${product.certificationBadges ? product.certificationBadges.join(", ") : ''}</p>
            <p class="category">${product.category}</p>
            <button class="add-to-cart-btn">Add to Cart</button>
        `;
    
        productCard.addEventListener("click", onProductCardClick);
    
        const addToCartButton = productCard.querySelector(".add-to-cart-btn");
        addToCartButton.addEventListener("click", onAddToCartButtonClick);
    
        return productCard;
    }
    

    function onProductCardClick(event) {
        const productId = event.currentTarget.dataset.productId;
    
        fetchProductInformationById(productId)
            .then((productInfo) => {
                const ratingElement = document.getElementById("rating");
                ratingElement.innerHTML = `
                    <h2>${productInfo.productName} Rating</h2>
                    ${generateStarRating(productInfo.rating)}
                `;

                const user = document.getElementById("user-info");
                user.innerHTML = `
                    <img class= 'user-icon' src="${productInfo.userIconUrl}" alt="${productInfo.userName}">
                    <span class="username">${productInfo.userName}</span>
                `;

                const userFeedback = document.getElementById("feedback");
                userFeedback.innerHTML = `
                    <p>${productInfo.feedback}</p>
                `;
    
                const educationalContent = document.querySelector("#educational-content .article");
                educationalContent.innerHTML = `
                    <h2>Educational Information on ${productInfo.productName}</h2>
                    <h3>Environmental Impact</h3>
                    <p>${productInfo.environmentalImpact}</p>
                    <h3>Production Process</h3>
                    <p>${productInfo.productionProcess}</p>
                `;
            })
            .catch((error) => {
                console.error("Error fetching product information:", error);
            });
    }
    
    
    async function fetchProductInformationById(productId) {
        const productInfoUrl = `http://localhost:3000/products/${productId}`;
    
        try {
            const response = await fetch(productInfoUrl);
            const productInfo = await response.json();
            return productInfo;
        } catch (error) {
            console.error("Error fetching product information:", error);
            throw error; 
        }
    }
    
    
    
    function generateStarRating(rating) {
        const fullStars = "★".repeat(Math.floor(rating));
        const halfStar = rating % 1 === 0.5 ? "½" : "";
        const emptyStars = "☆".repeat(Math.floor(5 - rating));
    
        return fullStars + halfStar + emptyStars;
    }
    

    function onAddToCartButtonClick(event) {
        console.log("Add to Cart button clicked");
    
        event.stopPropagation();
    }
});
