$(document).ready(() => {
    loadStoreItems();
    loadUserItems();
})



// Lista predeterminada de ítems
const defaultItems = [
    { name: "Error! No hay conexión con el servidor.", price: 0 }
];

// Función para renderizar ítems
function renderStoreItems(items, listId) {
    const list = $(listId);
    list.empty(); // Lo he usado para limpiar la lista antes de añadir nuevos elementos pa evitar errores
    items.forEach(item => {
        list.append(`<li class="list-group-item">${item.name} - ${item.price} coins</li>`);
    });
}

// Función para cargar ítems desde la API o mostrar los predeterminados
function loadStoreItems() {
    $.ajax({
        url: 'http://localhost:8080/dsaApp/shop/listObjects',
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
        url: 'http://localhost:8080/dsaApp/users/getObjects/' + username,
        method: 'GET',

        success: function (items) {
            if (items) {
                renderUserItems(items, "#userItemsList"); // Renderiza los ítems recibidos del backend
            } else {
                alert("No items received from the server. Showing default items.");
                renderUserItems(defaultItems, "#userItemsList");
            }
        },
        error: function () {
            alert("Error loading items from the server. Showing default items.");
            renderUserItems(defaultItems, "#userItemsList");
        }
    });
}

