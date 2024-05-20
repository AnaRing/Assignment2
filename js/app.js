// here comes the winning code

// load products from localStorage
const products = JSON.parse(localStorage.getItem('products')) || [];

// select elements
const productForm = document.querySelector('.pharmacy__storage__form');
const liquidStorageList = document.querySelector('.storage__list__liquids');
const storageList = document.querySelector('.storage__list');

const toggleGeneralButton = document.querySelector('.toggle__general__button');
const toggleLiquidButton = document.querySelector('.toggle__liquid__button');

const nameInput = document.querySelector('.product__name');
const manufacturerInput = document.querySelector('.product__manufacturer');
const expiryDateInput = document.querySelector('.product__expiry');
const quantityInput = document.querySelector('.product__quantity');
const typeSelect = document.querySelector('.product__type');

const positiveToast = document.querySelector('.submit__toast');
const negativeToast = document.querySelector('.submit__negative__toast');
const errorToast = document.querySelector('#errorID');

// class introduction
class Product {
    constructor(name, manufacturer, expiryDate, quantity, type) {
        this.name = name;
        this.manufacturer = manufacturer;
        this.expiryDate = new Date(expiryDate).toISOString(); // converts date to ISO format
        this.quantity = quantity;
        this.type = type;
        this.id = `${name}-${manufacturer}-${expiryDate}`; // generate a unique ID based on product details
    }

    display() {
        const shortId = this.id.substring(0, 5);
        return `
            <li id="${this.id}">
                <span>${this.name}</span>
                <span>${this.type}</span>
                <span>${this.manufacturer}</span>
                <span>${this.expiryDate.split('T')[0]}</span>
                <span>${shortId}</span>
                <span>${this.quantity}</span>
                <button class="delete__button" onclick="deleteProduct('${this.id}')">Delete</button>
            </li>
        `;
    }
}

class Capsules extends Product {
    constructor(name, manufacturer, expiryDate, quantity) {
        super(name, manufacturer, expiryDate, quantity, 'Capsule');
    }
}

class Liquids extends Product {
    constructor(name, manufacturer, expiryDate, quantity) {
        super(name, manufacturer, expiryDate, quantity, 'Liquid');
    }
}

// function to add products to storage
function addProduct(event) {
    event.preventDefault();

    const name = nameInput.value;
    const manufacturer = manufacturerInput.value;
    const expiryDate = expiryDateInput.value;
    const quantity = quantityInput.value;
    const type = typeSelect.value;

    let product;

    if (type === 'capsule') {
        product = new Capsules(name, manufacturer, expiryDate, quantity);
    } else if (type === 'liquid') {
        product = new Liquids(name, manufacturer, expiryDate, quantity);
    }

    // check for duplicate ID
    if (products.some(p => p.id === product.id)) {
        showErrorToast(errorToast);
        return;
    }

    products.push(product);
    saveProductsToLocalStorage();
    showPositiveToast(positiveToast);
    displayProducts();
    productForm.reset();
}

// function to save products to localStorage
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// function to load products from the local storage
function loadProductsFromLocalStorage() {
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    if (storedProducts) {
        products.length = 0;
        storedProducts.forEach(p => {
            if (p.type === 'Capsule') {
                products.push(new Capsules(p.name, p.manufacturer, p.expiryDate, p.quantity, p.type));
            } else if (p.type === 'Liquid') {
                products.push(new Liquids(p.name, p.manufacturer, p.expiryDate, p.quantity, p.type));
            }
        });
        displayProducts();
    }
}

// function to display products in their respective lists
function displayProducts() {
    storageList.innerHTML = '';
    liquidStorageList.innerHTML = '';

    products.forEach(product => {
        if (product instanceof Product) {
            if (product.type === 'Capsule') {
                storageList.innerHTML += product.display();
            } else if (product.type === 'Liquid') {
                liquidStorageList.innerHTML += product.display();
            }
        }
    });
}

// function to delete a product
function deleteProduct(productId) {
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex > -1) {
        products.splice(productIndex, 1);
        localStorage.setItem('products', JSON.stringify(products)); // Update localStorage
        displayProducts();
    }
}

// event listeners
productForm.addEventListener('submit', addProduct);

toggleGeneralButton.addEventListener('click', () => {
    document.querySelector('.display__storage').classList.add('active');
    document.querySelector('.display__storage__liquids').classList.remove('active');
});

toggleLiquidButton.addEventListener('click', () => {
    document.querySelector('.display__storage').classList.remove('active');
    document.querySelector('.display__storage__liquids').classList.add('active');
});

// helper functions
function showPositiveToast(toast) {
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

function showErrorToast(toast) {
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

// isFormFilledOut function
function isFormFilledOut(productForm) {
    const formInputs = productForm.querySelectorAll('input[required]');
    for (const input of formInputs) {
        if (!input.value.trim()) {
            return false;
        }
    }
    return true;
}



window.addEventListener('load', () => {
    loadProductsFromLocalStorage();
    console.log('Products after loading:', products);
    toggleGeneralButton.classList.add('active'); 
    storageList.style.display = 'block'; 
});

// display
displayProducts();
