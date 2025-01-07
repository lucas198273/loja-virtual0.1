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
let itemQuanty = 0;
console.log(cartCount)




// menu.addEventListener("click", function(event) {
//     console.log(event.target);
// });



const addressInputNome = document.getElementById("nome-completo");
const addressInputRuaNumero = document.getElementById("rua-numero");
const addressInputBairro = document.getElementById("Bairro");
const addressInputReferencia = document.getElementById("Referencia");



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
    if(cart.length === 0){
        
        Toastify({
            text: "⚠️ Ops, seu carrinho esta vazio!",
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
                x: 0, // Distância da borda lateral
                y: 50, // Distância do topo
            },
            onClick: function () {
                console.log("Toast clicado!"); // Callback após clique
            },
        }).showToast();
        return;
    }

    if (!validateAddress()) {
        return;
    }
    itemQuanty = 0;
   
    const msg = createWhatsAppMessage();
    const phone = "31999918730";
    
    
    // Redireciona para o 
    cart.forEach(item => {
        const button = document.querySelector(`[data-name="${item.name}"]`);
        if (button) {
            button.classList.remove("bg-green-500");
            button.classList.add("bg-gray-900");
        }
    });
    cartCount.innerHTML = itemQuanty;
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    resetCart();
});
function showClosedToast() {
    // Crie um elemento de toast (notificação) simples
    const toast = document.createElement("div");
    toast.className = "toast"; // Você pode adicionar estilos a essa classe no CSS
    toast.textContent = "O restaurante está fechado. Tente novamente mais tarde.";

    // Adicione o toast ao corpo do documento
    document.body.appendChild(toast);

    // Remova o toast após alguns segundos
    setTimeout(() => {
        toast.remove();
    }, 3000); // 3000 milissegundos = 3 segundos
}

function validateAddress() {
    let valid = true;

    if (addressInputNome.value.trim() === "") {
        valid = false;
    }
    
    if (addressInputRuaNumero.value.trim() === "") {
        valid = false;
    }

    if (addressInputBairro.value.trim() === "") {
        valid = false;
    }

    if (!valid) {
        addressWarn.classList.remove("hidden");
        addressInputNome.classList.add("border-red-500");
        addressInputRuaNumero.classList.add("border-red-500");
        addressInputBairro.classList.add("border-red-500");
        return false;
    } else {
        addressWarn.classList.add("hidden");
        addressInputNome.classList.remove("border-red-500");
        addressInputRuaNumero.classList.remove("border-red-500");
        addressInputBairro.classList.remove("border-red-500");
        return true;
    }
}

function createWhatsAppMessage() {
    const cartItems = cart.map(item => 
        `${item.name} - Quantidade: ${item.quantity} - Preço: R$${(item.price * item.quantity).toFixed(2)}`
    ).join("\n");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    
    return encodeURIComponent(
        `Olá, gostaria de fazer um pedido:\n
${cartItems}\n
Total: R$${total}\n
Nome do cliente: ${addressInputNome.value},\n
Endereço:  ${addressInputRuaNumero.value}, ${addressInputBairro.value},\n
Referencia:${addressInputReferencia.value}
`



    );
}

function resetCart() {

    cart = [];
 
    updateCartTotal();
    updateModal();
}


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


let isProcessingClick = false;
menu.addEventListener("click", function (event) {
    if (isProcessingClick) return;
    isProcessingClick = true;
    setTimeout(() => isProcessingClick = false, 300); // Limita a 1 clique a cada 300ms

    const parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
            // Sua lógica
               // Remove a classe cinza e adiciona a verde
        parentButton.classList.remove("bg-gray-900");
        parentButton.classList.add("bg-green-500");

        // Força o navegador a processar a alteração
        setTimeout(() => {
            parentButton.style.backgroundColor = ""; // Apenas para garantir a renderização
        }, 0);

        // Recupera as informações do produto
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        // Adiciona ao carrinho
        addToCart(name, price);
    }
});





function addToCart(name, price) {
    // Verifica se o item já existe no carrinho
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        // Incrementa a quantidade do item existente
        existingItem.quantity += 1;
        itemQuanty += 1;
    } else {
        // Adiciona um novo item ao carrinho
        cart.push({
            name,
            price,
            quantity: 1,
        });
        itemQuanty += 1;
    }
   
    cartCount.innerHTML = itemQuanty;
    
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
           <button class="remove-from-cart bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out" data-name="${item.name}">
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
    // Encontra o índice do item no carrinho
    const itemIndex = cart.findIndex(item => item.name === name);

    // Se o item não estiver no carrinho, não faz nada
    if (itemIndex === -1) {
        return;
    }

    const item = cart[itemIndex];
    const button = document.querySelector(`[data-name="${name}"]`);
    itemQuanty -= 1;
    // Se a quantidade for maior que 1, diminui a quantidade
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        // Se a quantidade for 1, remove o item do carrinho
        cart.splice(itemIndex, 1);
        updateButtonState(button, false);
    }

    // Atualiza a quantidade total e o contador do carrinho
    
    cartCount.innerHTML = itemQuanty;
    updateModal();
}

// Atualiza o estado do botão baseado na presença do item no carrinho
function updateButtonState(button, isInCart) {
    if (button) {
        if (isInCart) {
            button.classList.remove("bg-gray-900");
            button.classList.add("bg-green-500");
        } else {
            button.classList.remove("bg-green-500");
            button.classList.add("bg-gray-900");
        }
    }
}






function checkRestauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 14 && hora < 24;



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
