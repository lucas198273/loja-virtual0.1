document.addEventListener("DOMContentLoaded", async () => {
    const productFiles = [
        "./produtos/products.js", // Caminho correto para o arquivo de produtos
    ];

    try {
        const products = await importProducts(productFiles);
        initBannerRotation();
        renderProductCards(products);
        initModalCloseEvent();

        // Agora a variável cartModal é definida fora da função de clique
        const cartModal = document.getElementById("cart-modal");
        const cartBtn = document.getElementById("cart-btn");

        cartBtn.addEventListener("click", function() {
            cartModal.style.display = "flex"; // Para mostrar o modal
        });
    } catch (error) {
        console.error('Erro ao importar produtos:', error);
    }
});

let cart = [];
// Fechar o modal do carrinho


// Função para importar vários arquivos de produtos
async function importProducts(files) {
    const productsArray = await Promise.all(
        files.map(file => import(file).then(module => module.default))
    );
    return productsArray.flat(); // Retorna um array plano com todos os produtos
}

// Função para inicializar o banner rotativo
function initBannerRotation() {
    const banners = document.querySelectorAll(".banner");
    let currentIndex = 0;

    function showNextBanner() {
        banners[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % banners.length;
        banners[currentIndex].classList.add("active");
    }

    setInterval(showNextBanner, 3000);
}

// Função para renderizar os cards de produtos
function renderProductCards(products) {
    const collection1Container = document.querySelector("#collection1");
    const collection2Container = document.querySelector("#collection2");
    const collection3Container = document.querySelector("#collection3");

    // Limpa os containers antes de adicionar os produtos
    collection1Container.innerHTML = "";
    collection2Container.innerHTML = "";
    collection3Container.innerHTML = "";

    products.forEach((product) => {
        const card = createProductCard(product);

        if (product.collection === "Outono") {
            collection1Container.appendChild(card);
        } else if (product.collection === "Verão") {
            collection2Container.appendChild(card);
        } else if (product.collection === "Casual") {
            collection3Container.appendChild(card);
        }
    });
}

// Função para criar o card do produto
function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card bg-white rounded-lg shadow-md overflow-hidden w-64 flex-shrink-0";
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="product-title text-lg font-semibold text-gray-800">${product.title}</h3>
            <p class="product-description text-sm text-gray-600">${product.description}</p>
            <p class="product-price text-xl font-semibold text-emerald-800 mt-2">R$: ${product.price.toFixed(2)}</p>
            <div class="flex justify-between gap-2 mt-4">
                <button class="flex-1 py-2 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600">
                    Ver detalhes
                </button>
                <button class="add-to-cart-btn flex-1 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600" data-product='${JSON.stringify(product)}'>
                    Adicionar ao carrinho
                </button>
            </div>
        </div>
    `;

    card.querySelector(".add-to-cart-btn").addEventListener("click", (event) => {
        alert("click")
        event.stopPropagation();
        addToCart(product);
    });

    card.addEventListener("click", () => {
        openModal(product);
    });

    return card;
}

// Função para abrir o modal
function openModal(product) {
    const modal = document.getElementById("productModal");
    document.getElementById("modalTitle").textContent = product.title;
    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalDescription").textContent = product.description;
    document.getElementById("modalPrice").textContent = `R$: ${product.price.toFixed(2)}`;
    modal.classList.remove("hidden");
}

// Evento para fechar o modal
function initModalCloseEvent() {
    const closeModal = document.getElementById("closeModal");
    closeModal.addEventListener("click", () => {
        document.getElementById("productModal").classList.add("hidden");
    });
}

// Função para adicionar produtos ao carrinho


function addToCart(product) {
    cart.push(product);
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    // Atualiza a contagem de itens no carrinho
    cartCount.textContent = cart.length;

    // Atualiza os itens no carrinho
    cartItemsContainer.innerHTML = "";
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.textContent = item.title;
        cartItemsContainer.appendChild(cartItem);
    });

    // Atualiza o total do carrinho
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = `R$: ${total.toFixed(2)}`;
}


// Função para exibir notificações
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast bg-gray-800 text-white px-4 py-2 rounded-md fixed bottom-4 right-4 shadow-lg";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
