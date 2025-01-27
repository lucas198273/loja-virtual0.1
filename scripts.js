document.addEventListener("DOMContentLoaded", async () => {
    // Aqui você pode adicionar os caminhos dos arquivos que deseja importar
    const productFiles = [
        // "./produtos/colection1.js",
        // "./produtos/colection2.js",
        // "./produtos/colection3.js",
        "./produtos/products.js",  // Caminho correto para o arquivo collection1.js
    ];

    try {
        const products = await importProducts(productFiles);
        initBannerRotation();
        renderProductCards(products);
        initModalCloseEvent();
    } catch (error) {
        console.error('Erro ao importar produtos:', error);
    }
});

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
    console.log(products);
    
    // Limpa o conteúdo das coleções
    const collection1Container = document.querySelector("#collection1");
    const collection2Container = document.querySelector("#collection2");
    const collection3Container = document.querySelector("#collection3");

    // Limpa os containers antes de adicionar os produtos
    collection1Container.innerHTML = "";
    collection2Container.innerHTML = "";
    collection3Container.innerHTML = "";

    // Adiciona produtos em coleções específicas (baseado no nome da coleção)
    products.forEach((product) => {
        const card = createProductCard(product);

        // Condiciona produtos para as coleções
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
            <p class="product-price text-xl font-semibold text-emerald-800 mt-2">${product.price}</p>
            <button class="w-full mt-4 py-2 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600">Ver detalhes</button>
        </div>
    `;
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
    document.getElementById("modalPrice").textContent = product.price;
    modal.classList.remove("hidden");
}

// Evento para fechar o modal
function initModalCloseEvent() {
    const closeModal = document.getElementById("closeModal");
    closeModal.addEventListener("click", () => {
        document.getElementById("productModal").classList.add("hidden");
    });
}
