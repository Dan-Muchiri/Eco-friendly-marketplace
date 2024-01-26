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
        products.forEach((product) => {
          const productCard = createProductCard(product);
          productContainer.appendChild(productCard);
        });
      } else {
        console.error("Invalid products array:", products);
      }
    }

    function createProductCard(product) {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
  
      productCard.innerHTML = `
        <img src="${product.url}" alt="${product.productName}">
        <h3>${product.productName}</h3>
        <p class="sustainability-metrics">${product.sustainabilityMetrics}</p>
        <p class="certification-badges">${product.certificationBadges ? product.certificationBadges.join(", ") : ''}</p>
        <p class="category">${product.category}</p>
        <button>Add to Cart</button>
      `;
  
      return productCard;
    }
  });
  