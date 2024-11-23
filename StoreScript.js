$(document).ready(() => {
    loadStoreItems();
    loadUserItems();
})

let itemToBuy = null;

// Lista predeterminada de ítems
const defaultItems = [
    { name: "Error! No hay conexión con el servidor.", price: 0 }
];

function goToLogin(reason = null){
    if(reason == null){
        window.location.href = "LoginRegister.html"
    }else{
        window.location.href = "LoginRegister.html?reason=" + reason;
    }
    
}

// Función para renderizar ítems
function renderStoreItems(items, listId) {
    const list = $(listId);
    list.empty(); // Lo he usado para limpiar la lista antes de añadir nuevos elementos pa evitar errores
    items.forEach(item => {
        list.append(`<li class="list-group-item list-group-item-action" onclick="storeItemClick('${item.name}')">${item.name} - ${item.price} coins</li>`);
    });
}

// Función para cargar ítems desde la API o mostrar los predeterminados
function loadStoreItems() {
    $.ajax({
        url: 'dsaApp/shop/listObjects',
        method: 'GET',

        success: function (items) {
            if (items) {
                renderStoreItems(items, "#storeItemsList"); // Renderiza los ítems recibidos del backend
            } else {
                alert("No items received from the server. Showing default items.");
                renderStoreItems(defaultItems, "#storeItemsList");
            }
        },
        error: function () {
            alert("Error loading items from the server. Showing default items.");
            renderStoreItems(defaultItems, "#storeItemsList");
        }
    });
}

function renderUserItems(items, listId) {
    const list = $(listId);
    list.empty(); // Lo he usado para limpiar la lista antes de añadir nuevos elementos pa evitar errores
    items.forEach(item => {
        list.append(`<li class="list-group-item">${item.name} - quantity: ${item.quantity}</li>`);
    });
}

function loadUserItems() {
    const username = localStorage.getItem("username");
    $.ajax({
        url: 'dsaApp/users/getObjects/' + username,
        method: 'GET',
        statusCode: {
            200: (items) => {
                if (items) {
                    renderUserItems(items, "#userItemsList"); // Renderiza los ítems recibidos del backend
                } else {
                    alert("No items received from the server. Showing default items.");
                    renderUserItems(defaultItems, "#userItemsList");
                }
            },
            403: () => {
                goToLogin("session-expired");
            },
            404: () => {
                alert("Error: user not found");
            },
            500: () => {
                alert("Internal server error");
            }
        }
    });
}

function storeItemClick(itemName){
    $("#shopError").hide();
    $("#buyOverlay").fadeIn(150);
    $("#buyCard").show();
    $("#buyCard").animate({top: '50%'}, 150);
    $("#buyCard div h5").text("Comprar " + itemName);
    $("#buyCard div div p").text("Cuántas unidades quieres?");
    itemToBuy = itemName
}

function closeOverlay(){
    $("#buyOverlay").fadeOut(150);
    $("#buyCard").animate({top: '130%'}, 150, "swing", () => $("#buyCard").hide());
    itemToBuy = null
}

function buyItem(){
    $("#buyError").hide();
    if(itemToBuy == null) return;

    const username = localStorage.getItem("username");
    if(username == null){
        goToLogin("unauthenticated");
    }
    const units = Number($("#buyUnits").val());
    if(isNaN(units) || !Number.isInteger(units) || units <= 0){
        $("#buyError").text("Número inválido! Introduzca un entero mayor que 0");
        $("#buyError").show();
        return;
    }

    $.ajax({
        url: `dsaApp/shop/buy/${itemToBuy}/${username}/${units}`,
        method: "POST",
        statusCode: {
            200: () => {
                itemToBuy = null;
                loadUserItems();
                closeOverlay();
            },
            403: () => {
                goToLogin("session-expired");
            },
            404: () => {
                $("#buyError").text("Error! Objeto no encontrado");
                $("#buyError").show();
            },
            402: () => {
                $("#buyError").text("No tienes suficiente dinero!");
                $("#buyError").show();
            },
            500: () => {
                $("#buyError").text("Error interno :(");
                $("#buyError").show();
            }
        }
    })
}
