document.addEventListener("DOMContentLoaded", function () {
    const productListNavItem = document.getElementById('nav-products');

    productListNavItem.addEventListener('click', function (event) {
        event.preventDefault(); 
        
        const leftSection =document.getElementById('left-section');
        leftSection.style.display ='flex';

        const rightSection =document.getElementById('right-section');
        rightSection.style.display ='flex';

        fetchDataAndDisplay("http://localhost:3000/products");
    });

    const loginItem = document.getElementById('login');

    loginItem.addEventListener('click', function (event) {
        event.preventDefault();  
        loginPage();
    });

    const aboutItem = document.getElementById('nav-about');

    aboutItem.addEventListener('click', function (event) {
        event.preventDefault();  
        aboutPage();
    });

    const sustainabilityFilter = document.getElementById('sustainability-filter');

    sustainabilityFilter.addEventListener('change', function () {
        fetchSustainabilityAndFilter("http://localhost:3000/products") 
    });

    const categoryFilter = document.getElementById('category-filter');

    categoryFilter.addEventListener('change', function () {
        fetchCategoryAndFilter("http://localhost:3000/products") 
    });

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', function () {
        
        const leftSection =document.getElementById('left-section');
        leftSection.style.display ='flex';

        const rightSection =document.getElementById('right-section');
        rightSection.style.display ='flex';

        fetchAndDisplaySearchResults("http://localhost:3000/products");
        
    });


    async function fetchDataAndDisplay(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            updateProductListings(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function fetchSustainabilityAndFilter(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            const selectedSustainability = sustainabilityFilter.value;
    
            let filteredData = data;
    
            if (selectedSustainability) {
                const sustainabilityFilterLowerCase = selectedSustainability.toLowerCase();
                filteredData = data.filter(product => {
                    const productSustainability = product.sustainabilityMetrics.toLowerCase();
                    return productSustainability.includes(sustainabilityFilterLowerCase);
                });
            }

            updateProductListings(filteredData);
    
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function fetchCategoryAndFilter(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            const selectedCategory = categoryFilter.value;
    
            let filteredData = data;
    
            if (selectedCategory) {
                const categoryFilterLowerCase = selectedCategory.toLowerCase();
                filteredData = data.filter(product => {
                    const productCategory = product.category.toLowerCase();
                    return productCategory.includes(categoryFilterLowerCase);
                });
            }

            updateProductListings(filteredData);
    
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function fetchAndDisplaySearchResults(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            const searchquery = searchInput.value;
    
            let filteredData = data;
    
            if (searchquery) {
                const searchQueryLowerCase = searchquery.toLowerCase();
                filteredData = data.filter(product => {
                    const productName = product.productName.toLowerCase();
                    return productName.includes(searchQueryLowerCase);
                });
            }

            updateProductListings(filteredData);
    
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    

    function updateProductListings(products) {
        const productContainer = document.getElementById("product-listings");

        sustainabilityFilter.value = "";
        categoryFilter.value = "";

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
            <p class="price">${product.price}</p>
            <button class="add-to-cart-btn">Add to Cart</button>
        `;
    
        productCard.addEventListener("click", onProductCardClick);
    
        const addToCartButton = productCard.querySelector(".add-to-cart-btn");
addToCartButton.dataset.productId = product.id;  // Add this line
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
        const productId = event.currentTarget.dataset.productId;

        fetchProductInformationById(productId)
            .then((productInfo) => {
                addItemToCart(productInfo);
            })
            .catch((error) => {
                console.error("Error fetching product information:", error);
            });
    
        event.stopPropagation();
    }
    
    async function addItemToCart(productInfo) {
        const cartEndpoint = "http://localhost:3000/cart";

        console.log(productInfo)
    
        try {
            const response = await fetch(cartEndpoint);
            const cartItems = await response.json();
    
            const existingItem = cartItems.find(item => item.productId === productInfo.id);
    
            if (existingItem) {
                console.log(existingItem)
                existingItem.quantity++;

                await fetch(`${cartEndpoint}/${productInfo.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(existingItem),
                });
    
                updateCartCount();
                alert("Added to cart!");
            } else {
                const newItem = {
                    productId: productInfo.id,
                    productName: productInfo.productName,
                    price: productInfo.price,
                    quantity: 1,
                };
    
                await fetch(cartEndpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newItem),
                });
    
                updateCartCount();
                alert("Added to cart!");

            }
    
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    }
    
    function updateCartCount() {
        const cartCountElement = document.getElementById("cart-count");
        cartCountElement.textContent ++;
    }
    

    const communityEndpoint = "http://localhost:3000/community";


async function fetchAndDisplayCommunityData() {
    try {
        const response = await fetch(communityEndpoint);
        const communityData = await response.json();
        updateCommunitySection(communityData);
    } catch (error) {
        console.error("Error fetching community data:", error);
    }
}


function updateCommunitySection(communityData) {
    const communityContainer = document.getElementById("forum");

    communityContainer.innerHTML = "";

    if (Array.isArray(communityData)) {
        communityData.forEach((communityItem) => {
            const communityCard = createCommunityCard(communityItem);
            communityContainer.appendChild(communityCard);
        });
    } else {
        console.error("Invalid community data:", communityData);
    }
}


function createCommunityCard(communityItem) {
    const communityCard = document.createElement("div");
    communityCard.className = "post";

    communityCard.innerHTML = `
        <img src="${communityItem.userIconUrl}" alt="${communityItem.username}">
        <h3 class='username'>${communityItem.username}</h3>
        <p class='post-message'>${communityItem.comment}</p>
        <p class="date">${communityItem.date}</p>
    `;

    return communityCard;
}

function loginPage() {
    const leftSection = document.getElementById('left-section');
    leftSection.style.display = 'none';

    const rightSection = document.getElementById('right-section');
    rightSection.style.display = 'none';

    const productContainer = document.getElementById("product-listings");
    productContainer.innerHTML = '';

    const loginContainer = document.createElement('div');
    loginContainer.id = 'login-container';

    const loginForm = document.createElement('form');
    loginForm.className = 'login-form';

    const usernameLabel = document.createElement('label');
    usernameLabel.for = 'username';
    usernameLabel.textContent = 'Username:';

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.name = 'username';
    usernameInput.required = true;

    const passwordLabel = document.createElement('label');
    passwordLabel.for = 'password';
    passwordLabel.textContent = 'Password:';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.required = true;

    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.textContent = 'Login';

    loginForm.appendChild(usernameLabel);
    loginForm.appendChild(usernameInput);
    loginForm.appendChild(passwordLabel);
    loginForm.appendChild(passwordInput);
    loginForm.appendChild(loginButton);

    loginContainer.appendChild(loginForm);

    const signUpPrompt = document.createElement('p');
    signUpPrompt.textContent = "Not a user? Sign up now!";
    signUpPrompt.className = 'sign-up-prompt';

    const signUpLink = document.createElement('p');
    signUpLink.textContent = 'Sign Up';
    signUpLink.className = 'sign-up-link';

    signUpPrompt.appendChild(signUpLink);
    loginContainer.appendChild(signUpPrompt);

    productContainer.appendChild(loginContainer);

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

    checkforUser(username,password,'http://localhost:3000/users');

        loginForm.reset();
    });

    signUpLink.addEventListener('click', function () {
        createSignupForm();
    });
}

async function checkforUser(username, password, apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const foundUser = data.find(user => {
            return user.username.toLowerCase() === username.toLowerCase();
        });

        if (foundUser) {
        
            if (foundUser.password === password) {
            
                alert(`Welcome back, ${foundUser.username}!`);
                const user = document.getElementById('login');
                user.textContent = `${foundUser.username}`;
                user.style.pointerEvents = 'none';
                productListNavItem.click();
                
            } else {
            
                alert("Incorrect password. Please try again.");
        
            }
        } else {
            
            alert("User not found. Please sign up.");
            
        }


    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function createSignupForm() {
    const container = document.getElementById('login-container');
    container.innerHTML = '';

    const signupForm = document.createElement('form');
    signupForm.className = 'signup-form';

    const usernameLabel = document.createElement('label');
    usernameLabel.for = 'signup-username';
    usernameLabel.textContent = 'Username:';

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'signup-username';
    usernameInput.name = 'signup-username';
    usernameInput.required = true;

    const passwordLabel = document.createElement('label');
    passwordLabel.for = 'signup-password';
    passwordLabel.textContent = 'Password:';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'signup-password';
    passwordInput.name = 'signup-password';
    passwordInput.required = true;

    const confirmPasswordLabel = document.createElement('label');
    confirmPasswordLabel.for = 'confirm-password';
    confirmPasswordLabel.textContent = 'Confirm Password:';

    const confirmPasswordInput = document.createElement('input');
    confirmPasswordInput.type = 'password';
    confirmPasswordInput.id = 'confirm-password';
    confirmPasswordInput.name = 'confirm-password';
    confirmPasswordInput.required = true;

    const signupButton = document.createElement('button');
    signupButton.type = 'submit';
    signupButton.textContent = 'Sign Up';

    signupForm.appendChild(usernameLabel);
    signupForm.appendChild(usernameInput);
    signupForm.appendChild(passwordLabel);
    signupForm.appendChild(passwordInput);
    signupForm.appendChild(confirmPasswordLabel);
    signupForm.appendChild(confirmPasswordInput);
    signupForm.appendChild(signupButton);

    container.appendChild(signupForm);

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            signupForm.reset();
            return;
        }

        handleSignup(username, password);

        signupForm.reset();
    });
}

function handleSignup(username, password) {

    fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
    
        alert(`Welcome ${data.username}!`);
        const user = document.getElementById('login');
        user.textContent = `${data.username}`;
        user.style.pointerEvents = 'none';
        productListNavItem.click();
    })
    .catch(error => {
        console.error('Error during signup:', error);
        alert('Error during signup. Please try again.');
    });
}

function aboutPage(){
    const leftSection = document.getElementById('left-section');
    leftSection.style.display = 'none';

    const rightSection = document.getElementById('right-section');
    rightSection.style.display = 'none';

    const productContainer = document.getElementById("product-listings");
    productContainer.innerHTML = '';

    const infoContainer = document.createElement('div');
    infoContainer.id = 'info-container';
    infoContainer.style.flex='5';
    
    infoContainer.innerHTML = `
    <h2>About Eco-Friendly Market Place</h2>
    <p>Join our platform and discover how you can access information, training, and customers for your eco-friendly products and services. Register now and get a chance to win a free smartphone and solar charger. Don’t miss this opportunity to grow your green livelihood.</p>

    <h3>About Us</h3>
    <p>At Eco-Friendly Market Place, we believe in harnessing the power of digital innovation to cultivate a sustainable future for farmers and artisans worldwide. Our mission is to empower these vital contributors to our society with the tools they need to thrive in the face of climate change and market challenges.</p>

    <h4>The Problem</h4>
    <p>Climate change casts a long shadow over millions of producers worldwide, particularly farmers and art crafters whose livelihoods depend heavily on natural resources. Limited access to information, skills, and markets leaves them vulnerable to environmental uncertainties, hindering their ability to adapt, thrive, and secure sustainable income.</p>

    <h4>The Solution</h4>
    <p>Enter a revolutionary green marketplace built on the pillars of blockchain and artificial intelligence. We envision a platform that transcends the limitations of conventional channels, empowering producers to embrace sustainability and connect with a global audience of eco-conscious consumers.</p>

    <h3>How it Works</h3>
    <ul>
        <li><strong>Beyond Crafts & Crops:</strong> Our marketplace extends beyond traditional offerings, encompassing a diverse range of eco-friendly products and services.</li>
        <li><strong>Powered by Blockchain:</strong> Transparency and trust are woven into the fabric of our platform. Blockchain technology ensures traceability, authenticity, and secure transactions.</li>
        <li><strong>AI-Driven Insights:</strong> Leveraging the power of artificial intelligence, we provide producers with personalized insights and recommendations.</li>
        <li><strong>Connecting Communities:</strong> Our platform fosters a vibrant community of producers and consumers through interactive forums, workshops, and live events.</li>
    </ul>

    <h3>The Impact</h3>
    <p>This green marketplace is not just a platform; it's a catalyst for change. By empowering producers, promoting sustainable practices, and fostering environmental consciousness, we aim to:</p>
    <ul>
        <li>Boost Economic Sustainability</li>
        <li>Drive Environmental Stewardship</li>
        <li>Empower Communities</li>
    </ul>

    <h3>Ensuring Accessibility</h3>
    <p>Accessibility is an important aspect of designing inclusive digital solutions for farmers and art crafters with low digital skills. Here are some tips to ensure the accessibility of your platform:</p>
    <ul>
        <li>Use simple and clear language</li>
        <li>Use appropriate media and tailor user interfaces</li>
        <li>Provide initial and ongoing training and support</li>
        <li>Constantly monitor, measure, and improve the platform</li>
    </ul>

    <h3>Join the Movement</h3>
    <p>Beyond Craft & Crop is not just a marketplace; it's a movement. Join us in building a future where sustainability thrives, producers prosper, and consumers make informed choices for the good of the planet.</p>

    <p><strong>Together, let's rewrite the narrative. Let's grow a greener future, one click at a time.</strong></p>
`;



productContainer.appendChild(infoContainer);

const contactinfo = document.createElement('div');
contactinfo.id='contact-info'
contactinfo.style.flex='1';
contactinfo.innerHTML = `
    <h2>Contact Us</h2>
    <p>If you have any questions or need assistance, feel free to reach out to us. We are here to help!</p>
    <ul>
        <li><strong>Email:</strong> info@ecofriendlymarketplace.com</li>
        <li><strong>Phone:</strong> +1 (555) 123-4567</li>
    </ul>
    <h2>Follow Us</h2>
    <p>Stay connected with us on social media for the latest updates and eco-friendly living tips.</p>
    <div class="social-media">
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><img src="images/x.png" alt="Twitter"></a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><img src="images/fb.png" alt="Facebook"></a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><img src="images/ig.jpeg" alt="Instagram"></a>
    </div>
`;

productContainer.appendChild(contactinfo);







}

    fetchAndDisplayCommunityData();


    productListNavItem.click();
});

