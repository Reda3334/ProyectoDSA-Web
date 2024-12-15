let itemToBuy = null;
const storeItems = new Map();
let username
let userID

$(function () {
    $('[data-toggle="popover"]').popover()
})

$(document).ready(() => {
    username = localStorage.getItem("username");
    userID = localStorage.getItem("userID");
    if(username == null){
        goToLogin("unauthenticated");
        return;
    }
    $("#username-btn").text(username);
    renderPoints();
    renderCoins();
    loadStoreItems();
    loadUserItems();
})

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

function exitStore(){
    window.location.href = "index.html"
}

function renderPoints(){
    $.ajax({
        url: 'dsaApp/users/puntos/' + userID,
        method: 'GET',
        statusCode: {
            200: (response) => {
                $("#username-btn").attr("data-content", `<strong>Puntos:</strong> ${response}`);
            },
            403: () => goToLogin("session-expired")
        }
    })
}

// render the number of coins that the user has
function renderCoins(){
    $.ajax({
        url: 'dsaApp/shop/money/' + userID,
        method: 'GET',

        statusCode: {
            200: (response) => {
                $("#num-coins").text(Number.parseFloat(response).toFixed(2));
            },
            403: () => goToLogin("session-expired")
        }
    })
}

// Función para renderizar ítems
function renderStoreItems(items, listId) {
    const list = $(listId);
    list.empty(); // Lo he usado para limpiar la lista antes de añadir nuevos elementos pa evitar errores
    storeItems.clear();
    items.forEach(item => {
        storeItems.set(item.id, item);
        list.append(`<li class="list-group-item list-group-item-action d-flex" onclick="storeItemClick('${item.name}', '${item.id}')">
                        <img src="${item.url}" class="item-image mr-2">
                        <div style="flex-grow: 1">
                            <div class="justify-content-between d-flex">
                                <h5>${item.name}</h5>
                                <span>${item.price} <img src="images/coin.png" style="height: 1em"></span>
                            </div>
                            <p class="mb-0">{{descripció}}</p>
                        </div>
                    </li>`);
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
                renderStoreItems(defaultItems, "#storeItemsList");
            }
        },
        error: function () {
            renderStoreItems(defaultItems, "#storeItemsList");
        }
    });
}

function renderUserItems(items) {
    const inventory = $("#inventory");
    inventory.empty(); // Lo he usado para limpiar la lista antes de añadir nuevos elementos pa evitar errores
    items.forEach(item => {
        inventory.append(`
            <div>
                <img src="${storeItems.get(item.objectID).url}">
                <div>${item.quantity}</div>
            </div>
            `);
    });
}

function loadUserItems() {
    $.ajax({
        url: 'dsaApp/users/getObjects/' + userID,
        method: 'GET',
        statusCode: {
            200: (items) => {
                if (items) {
                    renderUserItems(items); // Renderiza los ítems recibidos del backend
                } else {
                    alert("No items received from the server");
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

function storeItemClick(itemName, itemID){
    $("#shopError").hide();
    $("#buyOverlay").fadeIn(150);
    $("#buyCard").show();
    $("#buyCard").animate({top: '50%'}, 150);
    $("#buyCard div h5").text("Comprar " + itemName);
    $("#buyCard div div p").text("Cuántas unidades quieres?");
    $("#buyUnits").val(1)
    itemToBuy = itemID
}

function closeOverlay(){
    $("#buyOverlay").fadeOut(150);
    $("#buyCard").animate({top: '130%'}, 150, "swing", () => $("#buyCard").hide());
    itemToBuy = null
}

function buyItem(pointerEvent){
    $("#buyError").hide();
    if(itemToBuy == null) return;

    const units = Number($("#buyUnits").val());
    if(isNaN(units) || !Number.isInteger(units) || units <= 0){
        $("#buyError").text("Número inválido! Introduzca un entero mayor que 0");
        $("#buyError").show();
        return;
    }

    $.ajax({
        url: `dsaApp/shop/buy/${itemToBuy}/${userID}/${units}`,
        method: "POST",
        statusCode: {
            200: () => {
                itemToBuy = null;
                createParticles(10, pointerEvent);
                renderCoins();
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

function createParticles(num, pointerEvent){
    for(let i = 0; i < num; i++){
        createParticle(pointerEvent);
    }
}

async function createParticle(pointerEvent){
    let x = pointerEvent.clientX;
    let y = pointerEvent.clientY;
    let vx = Math.random() * 10 - 5;
    let vy = -20 + Math.random() * 10;

    let particle = document.createElement('img');
    particle.src = "images/coin.png";
    particle.style.height = "1rem";
    particle.classList.add("particle");
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    document.documentElement.appendChild(particle);

    let height = window.innerHeight;

    let interval = setInterval(() => {
        vy += 1;
        x += vx;
        y += vy;

        particle.style.left = x + "px";
        particle.style.top = y + "px";
        
        if(y > height){
            particle.remove();
            clearInterval(interval)
        }

    }, 20);
}
