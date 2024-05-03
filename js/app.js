const products = [];

// Selecting elements
const productForm = document.querySelector('.pharmacy__storage__form');
const liquidStorageList = document.querySelector('.storage__list__liquids');
const storageList = document.querySelector('.storage__list');

const toggleGeneralButton = document.querySelector('.toggle__general__button');
const toggleLiquidButton = document.querySelector('.toggle__liquid__button');

const name = document.querySelector('.product__name');
const manufacturer = document.querySelector('.product__manufacturer');
const expiryDate = document.querySelector('.product__expiry');
const quantity = document.querySelector('.product__quantity');
const type = document.querySelector('.product__type');

const positiveToast = document.querySelector('.submit__toast');
const negativeToast = document.querySelector('.submit__negative__toast');
const errorToast = document.querySelector('#errorID');

// Base class for capsules
class Product {
    constructor(name, manufacturer, expiryDate, quantity, type) {
        this.name = name;
        this.productID = `${type}_${Date.now()}`; // generates an ID for the input
        this.manufacturer = manufacturer;
        this.expiryDate = new Date(expiryDate).toISOString(); // converts it to ISO
        this.quantity = quantity;
        this.type = type;
    }

    static getStoredData() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    static addProduct(product) {
        const storedData = Product.getStoredData();

        // check if the ID already exists
        const existingProduct = storedData.find(prod => prod.name === product.name &&
            prod.manufacturer === product.manufacturer &&
            prod.expiryDate === product.expiryDate &&
            prod.quantity === product.quantity &&
            prod.type === product.type
            );
        if(existingProduct) {
            errorToast.style.display = 'block';
            return; 
        }

        storedData.push(product);
        localStorage.setItem('products', JSON.stringify(storedData));
    }

    static deleteProduct(id) {
        const storedData = Product.getStoredData();
        const index = storedData.findIndex((product) => product.productID.toString() === id.toString());
        if (index !== -1) {
            storedData.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(storedData));
        }
    }
}

// Extended class for liquid products
class LiquidProduct extends Product {
    constructor(name, manufacturer, expiryDate, quantity) {
        super(name, manufacturer, expiryDate, quantity, 'Liquid'); // 
        this.productID = Date.now();
    }
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

// Render function
function renderProducts() {
    const storedData = JSON.parse(localStorage.getItem('products')) || [];
    storageList.innerHTML = '';
    liquidStorageList.innerHTML = '';

    storedData.forEach(product => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${product.name}</span>
            <span>${product.type}</span>
            <span>${product.manufacturer}</span>
            <span>${product.expiryDate}</span>
            <span>${product.productID}</span> 
            <span>${product.quantity}</span>
            
            <button class="delete__button" data__id="${product.productID}">Delete</button>
        `;

        if (product.type === 'Liquid' && toggleLiquidButton.classList.contains('active')) {
            liquidStorageList.appendChild(listItem);
        } else if (product.type !== 'Liquid' && toggleGeneralButton.classList.contains('active')) {
            storageList.appendChild(listItem);
        }
    });

    // Add event listener for delete buttons
    const deleteButtons = document.querySelectorAll('.delete__button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data__id');
            Product.deleteProduct(productId);
            renderProducts(); // Re-render products after deletion
        });
    });
}

// Call renderProducts and loadFormData when the page loads
window.addEventListener('load', () => {
    loadFormData(); // Load form data
    toggleGeneralButton.classList.add('active'); // Set general button as active initially
    renderProducts(); // Render products based on the initial state
});


// Function to display form data
function displayFormData(product) {
    console.log(`Form Data: Name - ${product.name}, Manufacturer - ${product.manufacturer}, Type - ${product.type} 
    Expiry Date - ${product.expiryDate}, Quantity - ${product.quantity}`);
}

// Toast function
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isFormFilledOut(productForm)) {
        const newProduct = (type.value === 'Liquid') ?  
            new LiquidProduct(name.value, manufacturer.value, expiryDate.value, quantity.value) :
            new Product(name.value, manufacturer.value, expiryDate.value, quantity.value, 'Capsule');

        Product.addProduct(newProduct); // Add the new product to local storage
        displayFormData(newProduct);

        saveFormData();
        positiveToast.style.display = 'block';
        negativeToast.style.display = 'none';
        errorToast.style.display = 'none';
        renderProducts();  // Call to update the displayed list
        setTimeout(function () {
            positiveToast.style.display = 'none';
            productForm.reset();
        }, 2000);
    } else {
        errorToast.style.display = 'none';
        negativeToast.style.display = 'block';
    }
});


// Saving the form data to local storage
function saveFormData() {
    const formData = {
        productName: name.value,
        manufacturer: manufacturer.value,
        productExpiry: new Date(expiryDate.value).toISOString(),
        productQuantity: quantity.value
    };

    localStorage.setItem('formData', JSON.stringify(formData));
}

// Function to load form data from local storage
function loadFormData() {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        name.value = parsedData.productName || '';
        manufacturer.value = parsedData.manufacturer || '';

        const isoDate = parsedData.productExpiry || '';
        expiryDate.value = isoDate ? new Date(isoDate).toISOString().split('T')[0] : '';

        quantity.value = parsedData.productQuantity || '';
    }
}

// Toggle buttons functionality
toggleGeneralButton.addEventListener('click', () => {
    toggleGeneralButton.classList.add('active');
    toggleLiquidButton.classList.remove('active'); 
    storageList.style.display = 'block'; 
    liquidStorageList.style.display = 'none'; 
    renderProducts(); 
});

toggleLiquidButton.addEventListener('click', () => {
    toggleLiquidButton.classList.add('active'); 
    toggleGeneralButton.classList.remove('active'); 
    storageList.style.display = 'none'; 
    liquidStorageList.style.display = 'block'; 
    renderProducts(); 
});

// Call renderProducts when the page loads
window.addEventListener('load', () => {
    loadFormData(); 
    toggleGeneralButton.classList.add('active'); 
    storageList.style.display = 'block'; 
    renderProducts(); 
});