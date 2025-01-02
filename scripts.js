const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModal = document.getElementById("close-modal-btn");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const cartCount = document.getElementById("cart-count")
const dateSpan  = document.getElementById("date-span")
const buttons = document.querySelectorAll(".add-to-cart-btn");
let cart = [];
console.log(cartCount)
menu.addEventListener("click", function(event) {
    console.log(event.target);
});

cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModal.addEventListener("click", function() {
    cartModal.style.display = "none";
});
function removegreenaddgray(parentButton){

    
    parentButton.classList.remove("bg-green-500");
    parentButton.classList.add("bg-gray-900");
}
function removegrayaddgreen(parentButton){
    parentButton.classList.remove("bg-gray-900");
    parentButton.classList.add("bg-green-500");
}


menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
     
        addToCart(name, price); // Adiciona ao carrinho
        // Atualizar o total do carrinho
        removegrayaddgreen(parentButton);
        // Muda a cor do botão para verde
 
    }
});


function addToCart(name, price) {
    // Verifica se o item já existe no carrinho
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        // Incrementa a quantidade do item existente
        existingItem.quantity += 1;
    } else {
        // Adiciona um novo item ao carrinho
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }
   
    cartCount.innerHTML = cart.length;
    
    // Atualiza o modal após a adição
    updateModal();
    updateCartTotal()
}
function updateCartTotal() {
    // Calcula o total do carrinho
    const currentTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Atualiza o texto do total no carrinho
    cartTotal.textContent = currentTotal.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });
}

function updateModal(){
    cartItemsContainer.innerHTML = ""
    let total = 0;

    cart.forEach(item =>{
        const cartItemElemente = document.createElement("div");
       
        cartItemElemente.classList.add("flex","justify-beteween","mb-4","flex-col")
        cartItemElemente.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium"> ${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p>R$ ${item.price.toFixed(2)}</p>            </div>
            <div>
                <button class="remove-from-cart" data-name="${item.name}">
                   Remover
                </button>
            </div>
        </div>
        `

    total += item.price * item.quantity; // Calcula o total
    
    cartItemsContainer.appendChild(cartItemElemente)

    });
    cartTotal.textContent = total.toLocaleString("pt-br",{
        style:"currency",
        currency:"BRL"
    });
    
}


cartItemsContainer.addEventListener("click",function(event){
    if(event.target.classList.contains("remove-from-cart")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name)
    }
})
function removeItemCart(name) {
    // Remove o item do carrinho
    const itemIndex = cart.findIndex(item => item.name === name);

    if (itemIndex !== -1) {
        const item = cart[itemIndex];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateModal();
            return;
        }

        // Remove o item do carrinho se a quantidade for 1
        const buttons = document.querySelectorAll('[data-name]');
        buttons.forEach(button => {
            if (button.getAttribute("data-name") === name) {
                // Atualiza imediatamente a classe do botão
                button.classList.remove("bg-green-500");
                requestAnimationFrame(() => {
                    button.classList.add("bg-gray-900");
                });
            }
        });

        // Atualiza o array do carrinho
        cart.splice(itemIndex, 1);
        updateModal();
    }

    // Atualiza o contador do carrinho
    cartCount.innerHTML = cart.length;
}




checkoutBtn.addEventListener("click", function() {

    const isOpen = checkRestauranteOpen();
    if(!isOpen){
        Toastify({
            text: "⚠️ Ops, estamos fechados no momento!",
            duration: 4000, // Um pouco mais de tempo para leitura
            close: true, // Botão de fechamento
            gravity: "top", // `top` ou `bottom`
            position: "right", // `left`, `center` ou `right`
            stopOnFocus: true, // Evita fechar ao passar o mouse
            style: {
                background: "linear-gradient(to right, #ff416c, #ff4b2b)", // Gradiente com cores quentes
                color: "#fff", // Texto em branco para contraste
                fontSize: "16px", // Tamanho da fonte
                fontWeight: "bold", // Deixa o texto mais destacado
                borderRadius: "8px", // Bordas arredondadas
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Adiciona sombra para profundidade
                padding: "10px 20px", // Aumenta o espaço interno
            },
            offset: {
                x: 10, // Distância da borda lateral
                y: 50, // Distância do topo
            },
            onClick: function () {
                console.log("Toast clicado!"); // Callback após clique
            },
        }).showToast();
        
   
        return;
    }
    
    // Verifica se o campo de endereço está vazio
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden"); // Exibe o aviso
        addressInput.classList.add("border-red-500"); // Exibe o aviso
        return;
    } else {
        addressWarn.classList.add("hidden"); // Oculta o aviso se o campo estiver preenchido
        addressInput.classList.remove("border-red-500")
        // Lógica para proceder com o checkout, por exemplo
    }

    // evnviar pedido para whats
    const cartItems = cart.map(item => 
        `${item.name} - Quantidade: ${item.quantity} - Preço: R$${(item.price * item.quantity).toFixed(2)}`
    ).join("\n");
    
    const total = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);
    
    // Adiciona uma mensagem de cabeçalho e total do pedido
    const msg = encodeURIComponent(
        `Olá, gostaria de fazer um pedido:\n\n${cartItems}\n\nTotal: R$${total}`
    );
    
    // Número de telefone do WhatsApp
    const phone = "31992311011";


    // Redireciona para o WhatsApp
    window.open(    `https://wa.me/${phone}?text=${msg} Endereço ${addressInput.value}`
        , "_blank");
    cart = [];
    updateCartTotal();
    updateModal();
});

// Opcional: Se você quiser esconder o aviso ao digitar no campo de endereço
addressInput.addEventListener("input", function() {
    if (addressInput.value !== "") {
        addressWarn.classList.add("hidden"); // Oculta o aviso enquanto o usuário digita
    }
});
function checkRestauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 17 && hora < 24;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600"); // Corrigido "bg-freen-600" para "bg-green-600"
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
