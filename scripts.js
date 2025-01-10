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
let pedidoTipo = null; // 'mesa' ou 'entrega'
let mesaNumero = null; // Número da mesa, caso o tipo de pedido seja 'mesa'


const mesaBtn = document.getElementById("mesa-btn");
const entregaBtn = document.getElementById("entrega-btn");
const mesaForm = document.getElementById("mesa-form");
const entregaForm = document.getElementById("entrega-form");
const mesaButtonsContainer = document.getElementById("mesa-buttons");

mesaButtonsContainer.addEventListener("click", (event) => {
    if (event.target.dataset.mesa) {
        mesaNumero = event.target.dataset.mesa; // Atualiza o número da mesa selecionada
        document.getElementById("selected-mesa").querySelector("span").textContent = mesaNumero; // Atualiza o display
        document.getElementById("selected-mesa").classList.remove("hidden"); // Mostra a mesa selecionada
    }
});

mesaBtn.addEventListener("click", () => {
    pedidoTipo = 'mesa';
    mesaForm.classList.remove("hidden");
    entregaForm.classList.add("hidden");
});

entregaBtn.addEventListener("click", () => {
    pedidoTipo = 'entrega';
    entregaForm.classList.remove("hidden");
    mesaForm.classList.add("hidden");
});



// menu.addEventListener("click", function(event) {
//     console.log(event.target);
// });



const closeModalhorarios = document.getElementById("close-modal-horarios");
const addressInputNome = document.getElementById("nome-completo");
const addressInputRuaNumero = document.getElementById("rua-numero");
const addressInputBairro = document.getElementById("Bairro");
const addressInputReferencia = document.getElementById("Referencia");

function openModal() {
    const modal = document.getElementById('modal-horarios');
    modal.style.display = 'flex';
}

closeModalhorarios.addEventListener("click", function(){
    const modal = document.getElementById('modal-horarios');
    modal.style.display = 'none';
});
    
function showToast(message) {
    Toastify({
        text: message,
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
}
checkoutBtn.addEventListener("click", function() {
    const isOpen = checkRestauranteOpen();
    if (!isOpen) {
        showToast("⚠️ Ops, estamos fechados no momento!");
        return;
    }
    
    if (cart.length === 0) {
        showToast("⚠️ Ops, seu carrinho esta vazio!");
        return;
    }
    if (pedidoTipo === null) {
        showToast("⚠️ Ops, você precisa escolher um tipo de serviço!");
        return;
    }
    if (pedidoTipo === 'entrega' && !validateAddress()) {
        showToast("⚠️ Ops, preencha todos os campos!");
        return;
    }

    if (pedidoTipo === 'mesa' && mesaNumero === null) {
        showToast("⚠️ Ops, você precisa selecionar uma mesa!");
        return;
    }
    cart.forEach(item => {
        const button = document.querySelector(`[data-name="${item.name}"]`);
        if (button) {
            button.classList.remove("bg-green-500");
            button.classList.add("bg-gray-900");
        }
    });
    itemQuanty = 0;
    cartCount.innerHTML = itemQuanty;
    // Adicione lógica para processar o pedido conforme o tipo
    const msg = createWhatsAppMessage();
    const phone = "31999918730";
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
    const fieldsToValidate = [
        { input: addressInputNome, name: "Nome Completo" },
        { input: addressInputRuaNumero, name: "Rua, Número" },
        { input: addressInputBairro, name: "Bairro" },
        { input: addressInputReferencia, name: "Referencia" }
    ];

    let valid = true;

    // Remove todas as classes de erro antes de validar
    fieldsToValidate.forEach(field => {
        field.input.classList.remove("border-red-300");
    });

    // Verifica cada campo
    fieldsToValidate.forEach(field => {
        if (field.input.value.trim() === "") {
            valid = false;
            field.input.classList.add("border-red-300");
        }
    });

    // Atualiza o aviso de erro
    if (!valid) {
        addressWarn.classList.remove("hidden");
    } else {
        addressWarn.classList.add("hidden");
    }

    return valid;
}


function createWhatsAppMessage() {
    const cartItems = cart.map(item => 
        `${item.name} - Quantidade: ${item.quantity} - Preço: R$${(item.price * item.quantity).toFixed(2)}`
    ).join("\n");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    
    let additionalInfo = '';
    if (pedidoTipo === 'mesa') {
        additionalInfo = `Número da mesa: ${mesaNumero}\n`;
    } else if (pedidoTipo === 'entrega') {
        additionalInfo = `Nome do cliente: ${addressInputNome.value},\n
        Endereço: ${addressInputRuaNumero.value}, ${addressInputBairro.value},\n
        Referência: ${addressInputReferencia.value}\n`;
    }
    
    return encodeURIComponent(
        `Olá, gostaria de fazer um pedido:\n
${cartItems}\n
Total: R$${total}\n
${additionalInfo}`
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
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });    // Função otimizada 
    }

    itemQuanty++;
    cartCount.textContent = itemQuanty;
    updateModal();
    updateCartTotal();
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
    itemQuanty --;
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
    return hora >= 9 && hora < 24;



}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();
const statusText = document.getElementById('status-text');
if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600"); // Corrigido "bg-freen-600" para "bg-green-600"
    statusText.textContent = "Estamos funcionando"; 
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
    statusText.textContent = "Estamos fechados"; 
}


// Mostrar formulário de mesa e ocultar formulário de entrega
mesaBtn.addEventListener("click", () => {
    mesaForm.classList.remove("hidden");
    entregaForm.classList.add("hidden");
});

// Mostrar formulário de entrega e ocultar formulário de mesa
entregaBtn.addEventListener("click", () => {
    entregaForm.classList.remove("hidden");
    mesaForm.classList.add("hidden");
});

// Gerar botões de mesas ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 20; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = "bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700";
        button.dataset.mesa = i;

        // Adicionar evento de clique para seleção de mesa
        button.addEventListener("click", () => {
            mesaInput.value = i; // Atualizar input oculto
            selectedMesaText.textContent = i; // Atualizar display
            selectedMesaDisplay.classList.remove("hidden"); // Mostrar texto
        });

        mesaButtonsContainer.appendChild(button); // Adicionar botão ao contêiner
    }
});
