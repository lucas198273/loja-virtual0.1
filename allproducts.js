import products from './produtos/products.js';

const productsGrid = document.getElementById('productsGrid');
const filterAll = document.getElementById('filterAll');
const filterOutono = document.getElementById('filterOutono');
const filterVerao = document.getElementById('filterVerao');
const filterCasual = document.getElementById('filterCasual');

// Função para exibir os produtos no grid
const displayProducts = (filter = null) => {
    productsGrid.innerHTML = ''; // Limpa o grid antes de adicionar os produtos
    const filteredProducts = filter
        ? products.filter(product => product.collection === filter) // Filtra os produtos com base na coleção
        : products; // Se não houver filtro, exibe todos os produtos

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover mb-4">
            <h3 class="font-semibold text-lg text-gray-800">${product.title}</h3>
            <p class="text-gray-600">${product.description}</p>
            <p class="text-xl font-semibold text-emerald-800">R$: ${product.price.toFixed(2)}</p>
            <button class="w-full mt-4 py-2 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600" data-product='${JSON.stringify(product)}'>Ver detalhes</button>
        `;

        productsGrid.appendChild(productCard);
    });

    // Adiciona evento de clique nos botões de detalhes
    const detailButtons = document.querySelectorAll('[data-product]');
    detailButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = JSON.parse(button.getAttribute('data-product'));
            openModal(product);
        });
    });
};

// Função para abrir o modal
const openModal = (product) => {
    const modal = document.getElementById('productModal');
    document.getElementById('modalTitle').innerText = product.title;
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalDescription').innerText = product.description;
    document.getElementById('modalPrice').innerText = product.price;
    modal.classList.remove('hidden');
};

// Evento para fechar o modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('productModal').classList.add('hidden');
});

// Adiciona os event listeners aos botões de filtro
filterAll.addEventListener('click', () => displayProducts());
filterOutono.addEventListener('click', () => displayProducts('Outono'));
filterVerao.addEventListener('click', () => displayProducts('Verão'));
filterCasual.addEventListener('click', () => displayProducts('Casual'));

// Exibe todos os produtos inicialmente
displayProducts();
