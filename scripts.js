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
    // Inicializa variáveis para armazenar o texto e os totais
    let cartItemsText = "";
    let totalProducts = 0;
    let totalCombos = 0;

    // Itera sobre os itens do carrinho para montar a mensagem e calcular os totais
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity; // Valor total do produto
        totalProducts += itemTotal;

        let itemText = `\n${item.name} - Quantidade: ${item.quantity} - Subtotal: R$${itemTotal.toFixed(2)}`;

        if (item.isCombo) {
            const comboTotal =  item.comboQuantity * 12.90; // Valor do combo
            totalCombos += comboTotal;
           


            itemText += ` \nQuantidade de Combos: ${item.comboQuantity} , Total dos combos: R$${comboTotal.toFixed(2)}\n`;
        }

        cartItemsText += `${itemText}\n`;
    });

    // Calcula o total geral
    const totalGeral = totalProducts + totalCombos;

    // Adiciona informações de tipo de pedido, se necessário
    let additionalInfo = "";
    if (pedidoTipo === 'mesa') {
        additionalInfo = `\nNúmero da mesa: ${mesaNumero}`;
    } else if (pedidoTipo === 'entrega') {
        additionalInfo = `\nNome do cliente: ${addressInputNome.value}` +
            `\nEndereço: ${addressInputRuaNumero.value}, ${addressInputBairro.value}` +
            `\nReferência: ${addressInputReferencia.value}`;
    }

    // Monta a mensagem final
    const message = `Olá, gostaria de fazer um pedido:\n\n` +
        `${cartItemsText}\n` +
        `Total dos produtos: R$${totalProducts.toFixed(2)}\n` +
        `Total dos combos: R$${totalCombos.toFixed(2)}\n` +
        `Total geral: R$${totalGeral.toFixed(2)}\n` +
        `${additionalInfo}`;

    // Retorna a mensagem codificada para o WhatsApp
    return encodeURIComponent(message);
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
    const buttonElement = document.querySelector(`[data-name="${name}"]`);
    const isHamburguer = buttonElement.closest(".card-burguer") !== null; // Agora verifica a classe
   
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
        if (isHamburguer) {
            existingItem.isBurguers = true; // Define como hamburguer
            console.log("true");
        }else{
            console.log("false");
        }
       
    } else {
        // Adiciona o item ao carrinho com a propriedade isBurguers
        cart.push({ 
            name, 
            price, 
            quantity: 1, 
            comboQuantity: 0, 
            isCombo: false, 
            isBurguers: isHamburguer || false,  // Define aqui
        });
    }
  

    itemQuanty++;
    cartCount.textContent = itemQuanty;
    updateModal();
    updateCartTotal();
}







function updateModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col", "p-4", "border", "rounded-lg", "shadow-md");
        const comboButtonsVisibility = item.isBurguers ? "flex" : "hidden";
        // Adiciona a mensagem de combo se o item estiver em combo
        const comboMessage = item.isCombo ? 
        `<p class="text-red-500 font-semibold">Combo: ${item.comboQuantity} (R$ ${item.price.toFixed(2)})</p>` : '';
            cartItemElement.innerHTML = `
  <div class="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200">
    <!-- Informações do item -->
  
    <div>
            <p class="text-lg font-semibold">${item.name}</p>
            <p>Quantidade: ${item.quantity}</p>
            <p class="text-green-500">R$ ${item.price.toFixed(2)}</p>
            ${item.isCombo ? `<p class="text-red-500 font-semibold">Combo: ${item.comboQuantity}</p>` : ""}
    </div>

    <!-- Opções de combo -->
    <div class="${comboButtonsVisibility} flex-col items-center space-y-2 min-w-[150px]">
    
      <button 
        class="add-combo bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        data-name="${item.name}">
        Adicionar Combo
      </button>
      <button 
        class="remove-combo bg-yellow-500 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        data-name="${item.name}">
        Remover Combo
      </button>
    </div>

    <!-- Botão remover do carrinho -->
    <div class="min-w-[100px]">
      <button 
        class="remove-from-cart bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        data-name="${item.name}">
        Remover
      </button>
    </div>
  </div>
`;


        total += item.price * item.quantity; // Calcula o total
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });
}






function updateCombo(itemName, action) {
    const item = cart.find(i => i.name === itemName);
    if (!item) return;

    const comboPrice = 12.90; // Valor unitário do combo

    if (action === "add") {
        // Adicionar um combo
        if (item.quantity > item.comboQuantity) {
            item.comboQuantity++; // Aumenta a quantidade de combos
            item.isCombo = true; // Marca o item como tendo combo
            showToast(`Combo adicionado para ${item.name}!`);
        } else {
            showToast(`Quantidade insuficiente para adicionar combo.`);
        }
    } else if (action === "remove") {
        // Remover um combo
        if (item.comboQuantity > 0) {
            item.comboQuantity--; // Reduz a quantidade de combos
            if (item.comboQuantity === 0) {
                item.isCombo = false; // Remove o status de combo, se aplicável
            }
            showToast(`Combo removido de ${item.name}!`);
        } else {
            showToast(`Não há combos para remover.`);
        }
    }

    updateModal();
    updateCartTotal(); // Recalcula o total do carrinho
}

function updateCartTotal() {
    // Calcula o total do carrinho
    const currentTotal = cart.reduce((sum, item) => {
        const itemBaseTotal = item.price * item.quantity; // Total base do item
        const comboTotal = item.comboQuantity * 12.90; // Total dos combos adicionados
        return sum + itemBaseTotal + comboTotal;
    }, 0);
    
    // Atualiza o texto do total no carrinho
    cartTotal.textContent = currentTotal.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });
}


cartItemsContainer.addEventListener("click", function (event) {
    const button = event.target;
    const itemName = button.dataset.name;

    if (event.target.classList.contains("remove-from-cart")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
    if (button.classList.contains("add-combo")) {
        updateCombo(itemName, "add");
    } else if (button.classList.contains("remove-combo")) {
        updateCombo(itemName, "remove");
    }
});

function removeItemCart(name) {
    // Encontra o índice do item no carrinho
    const itemIndex = cart.findIndex(item => item.name === name);

    // Se o item não estiver no carrinho, não faz nada
    if (itemIndex === -1) {
        return;
    }

    const item = cart[itemIndex];
    const button = document.querySelector(`[data-name="${name}"]`);
    const comboPrice = 12.90; // Valor unitário do combo

    // Diminui a quantidade de itens no carrinho
    if (item.quantity > 1) {
        item.quantity -= 1;

        // Se houver combos, reduz a quantidade de combos também
        if (item.comboQuantity > 0) {
            item.comboQuantity -= 1; // Remove um combo
            showToast(`Combo removido automaticamente de ${item.name}!`);
        }
    } else {
        // Se a quantidade for 1, remove o item completamente
        cart.splice(itemIndex, 1);
        updateButtonState(button, false);
    }

    // Atualiza o contador do carrinho e o modal
    itemQuanty--; // Atualiza o número total de itens no carrinho
    cartCount.innerHTML = itemQuanty;
    updateModal();
    updateCartTotal(); // Atualiza o total do carrinho com os ajustes
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
    return hora >= 19 && hora < 2;



}
// segunda a quinta
// sexta sabado e domingo fecha as 3 
// terça fechado


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
