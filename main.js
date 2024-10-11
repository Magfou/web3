// Получаем элементы

const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const overlay = document.getElementById('overlay');
const closeLoginModalBtn = document.getElementById('closeLoginModal');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const loginForm = document.getElementById('loginForm');

// Открытие модального окна
loginBtn.addEventListener('click', function() {
    loginModal.classList.add('active');
    overlay.classList.add('active');
});

// Закрытие модального окна по кнопке "крестик"
closeLoginModalBtn.addEventListener('click', function() {
    loginModal.classList.remove('active');
    overlay.classList.remove('active');
});

// Закрытие модального окна по нажатию на затемненный фон
overlay.addEventListener('click', function() {
    loginModal.classList.remove('active');
    overlay.classList.remove('active');
});

// Логика для переключения видимости пароля
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.textContent = type === 'password' ? 'Показать' : 'Скрыть';
});

// Обработка нажатия клавиши "Enter" на форме
loginForm.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // предотвращает стандартное поведение "Enter" для отправки формы
        loginForm.submit(); // имитируем нажатие на кнопку "Войти"
    }
});

// Валидация почты и пароля
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email); // Проверка почты с помощью регулярного выражения
}

function validatePassword(password) {
    return password.length >= 6; // Проверка, что пароль не короче 6 символов
}

// Отправка формы при нажатии на кнопку "Войти"
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validateEmail(email)) {
        alert("Введите корректную почту.");
        return;
    }

    if (!validatePassword(password)) {
        alert("Пароль должен содержать не менее 6 символов.");
        return;
    }

    // Если валидация прошла, можно выполнить вход
    alert(`Вход выполнен для: ${email}`);
    
    // Дополнительная логика для отправки данных на сервер и закрытие окна
    loginModal.classList.remove('active');
    overlay.classList.remove('active');
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}


const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.querySelector(".cart-window .close-btn");
const checkoutBtn = document.getElementById("checkoutBtn");
const paymentForm = document.getElementById("paymentForm");
const paymentOverlay = document.getElementById("paymentOverlay");
const closePaymentBtn = document.querySelector(".payment-form .close-btn");
const cartItems = document.getElementById("cartItems");
const totalPriceElement = document.getElementById('totalPrice'); // Элемент для итоговой суммы в корзине
const modalTotalPriceElement = document.getElementById('modalTotalPrice'); // Элемент для итоговой суммы в модальном окне
const paymentMethodSelect = document.getElementById('paymentMethod');
const sberbankLogo = document.getElementById('sberbank-logo');
const tinkoffLogo = document.getElementById('tinkoff-logo');

// Открытие корзины
cartButton.addEventListener("click", () => {
    cartOverlay.classList.add("active");
});

// Закрытие корзины
closeCartBtn.addEventListener("click", () => {
    cartOverlay.classList.remove("active");
});

// Добавление товара в корзину
document.querySelectorAll('.game-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('p').textContent.replace('₽', '').replace(/\s/g, ''));
        const productImgSrc = productCard.querySelector('img').src;

        const productItem = {
            name: productName,
            price: productPrice,
            imgSrc: productImgSrc,
            quantity: 1 // Добавляем товар с количеством 1
        };

        addToCart(productItem);
    });
});

// Функция добавления товара в корзину
function addToCart(product) {
    let cart = getCartFromStorage();
    
    // Проверяем, есть ли товар уже в корзине
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1; // Увеличиваем количество, если товар уже в корзине
    } else {
        cart.push(product); // Добавляем новый товар
    }

    saveCartToStorage(cart);
    renderCartItems();
}

// Функция отображения товаров в корзине
function renderCartItems() {
    cartItems.innerHTML = ''; // Очищаем корзину перед рендерингом
    let cart = getCartFromStorage();
    let total = 0;

    cart.forEach(product => {
        let productItem = document.createElement('li');
        productItem.classList.add('cart-item');
        productItem.innerHTML = `
            <div class="cart-item-content">
                <img src="${product.imgSrc}" alt="${product.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <p class="price">${(product.price * product.quantity).toLocaleString()} ₽</p>
                    <div class="quantity-controls">
                        <button class="decrease-qty">-</button>
                        <span class="quantity">${product.quantity}</span>
                        <button class="increase-qty">+</button>
                    </div>
                </div>
                <button class="remove-item">X</button>
            </div>
        `;

        // Увеличение количества товара
        productItem.querySelector('.increase-qty').addEventListener('click', () => {
            product.quantity += 1;
            saveCartToStorage(cart);
            renderCartItems();
        });

        // Уменьшение количества товара
        productItem.querySelector('.decrease-qty').addEventListener('click', () => {
            if (product.quantity > 1) {
                product.quantity -= 1;
                saveCartToStorage(cart);
                renderCartItems();
            }
        });

        // Удаление товара из корзины
        productItem.querySelector('.remove-item').addEventListener('click', () => {
            cart = cart.filter(item => item.name !== product.name);
            saveCartToStorage(cart);
            renderCartItems();
        });

        cartItems.appendChild(productItem);
        total += product.price * product.quantity; // Подсчет общей стоимости
    });

    document.querySelector('.empty-message').style.display = cart.length === 0 ? 'block' : 'none';
    updateTotalPrice(total); // Обновляем итоговую стоимость
}

// Обновление общей суммы
function updateTotalPrice(total) {
    totalPriceElement.textContent = `Итого: ${total.toLocaleString()} ₽`;
    modalTotalPriceElement.textContent = `Итого: ${total.toLocaleString()} ₽`; // Обновляем итоговую сумму в модальном окне
}

// Сохранение корзины в localStorage
function saveCartToStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Получение корзины из localStorage
function getCartFromStorage() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Отображение товаров при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    renderCartItems();
});

// Открытие формы оплаты
checkoutBtn.addEventListener("click", () => {
    paymentOverlay.style.display = "block";
    paymentForm.style.display = "block";
});

// Закрытие формы оплаты
closePaymentBtn.addEventListener("click", () => {
    paymentOverlay.style.display = "none";
    paymentForm.style.display = "none";
});

// Выбор способа оплаты и показ логотипа
paymentMethodSelect.addEventListener('change', (e) => {
    sberbankLogo.classList.add('hidden');
    tinkoffLogo.classList.add('hidden');

    if (e.target.value === 'sberbank') {
        sberbankLogo.classList.remove('hidden');
    } else if (e.target.value === 'tinkoff') {
        tinkoffLogo.classList.remove('hidden');
    }
});














