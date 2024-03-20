// a new file to re-do the javascript 

const products = [];

// selecting elements
const productForm = document.querySelector('.pharmacy__storage__form');

const name = document.querySelector('.product__name');
const productid = document.querySelector('.product__id');
const manufacturer = document.querySelector('.product__manufacturer');
const expiryDate = document.querySelector('.product__expiry');
const quantity = document.querySelector('.product__quantity');
const storageList = document.querySelector('.storage__list');

const positiveToast = document.querySelector('.submit__toast');
const negativeToast = document.querySelector('.submit__negative__toast');
const errorToast = document.querySelector('#errorID');

const displayStorage = document.querySelector('.display__storage');

// isFormFilledOut function
function isFormFilledOut(productForm) {
    const formInputs =  productForm.querySelectorAll('input[required]');
    for (const input of formInputs) {
        if(!input.value.trim()) {
            return false;
        }
    }
    return true;
}

// declaring the product class

class Product {
    constructor(name, manufacturer, expiryDate, quantity) {
        this.name = name;
        this.productID = Date.now();
        this.manufacturer = manufacturer;
        this.expiryDate = new Date(expiryDate);
        this.quantity = quantity;
    }

    static getStoredData() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    static addProduct(product) {
        const storedData = Product.getStoredData();
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

// render function
function renderProducts() {
    const storedData = JSON.parse(localStorage.getItem('products')) || [];
    storageList.innerHTML = '';

    storedData.forEach(product => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${product.name}</span>
            <span>${product.productID}</span>
            <span>${product.manufacturer}</span>
            <span>${product.expiryDate}</span>
            <span>${product.quantity}</span>
            <button class="delete-button" data-id="${product.productID}">Delete</button>
        `;

        storageList.appendChild(listItem);
    });

// add event listener for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            Product.deleteProduct(productId);
            renderProducts();
        });
    });
}

function displayFormData(product) {
    console.log(`Form Data: Name - ${product.name},  
    Manufacturer - ${product.manufacturer}, Expiry Date - ${product.expiryDate}, 
    Quantity - ${product.quantity}`);
}

// check if a product with the given ID already exists
/* function productIDExists(id) {
    const storedData = JSON.parse(localStorage.getItem('products')) || [];
    return storedData.some(product => product.productID === id);
}
 */
// call renderProducts and loadFormData when the page loads
window.addEventListener('load', () => {
    renderProducts();
    loadFormData();
});

// toast function
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isFormFilledOut(productForm)) {
        const newProduct = new Product(
            name.value,
           /*  productid.value, */
            manufacturer.value,
            expiryDate.value,
            quantity.value
        );

        if (!productIDExists(newProduct.productID)) {
            // check if the product with the same ID already exists
            Product.addProduct(newProduct);
            displayFormData(newProduct);

            saveFormData();
            positiveToast.style.display = 'block';
            negativeToast.style.display = 'none';
            errorToast.style.display = 'none';
            renderProducts();  // call to update the displayed list
            setTimeout(function () {
                positiveToast.style.display = 'none';
                productForm.reset();
            }, 2000);
        } else {
            errorToast.style.display = 'block';
        }
    } else {
        errorToast.style.display = 'none';
        negativeToast.style.display = 'block';
    }
});


// saving the form to local storage

function saveFormData() {
    const formData = {
        productName: name.value,
       /*  productID: productid.value, */
        manufacturer: manufacturer.value,
        productExpiry: new Date(expiryDate.value).toISOString(), // convert to ISO format
        productQuantity: quantity.value
    };

    localStorage.setItem('formData', JSON.stringify(formData));
}


function loadFormData() {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        name.value = parsedData.productName || '';
        /* productid.value = parsedData.productID || ''; */
        manufacturer.value = parsedData.manufacturer || '';
        
        // convert ISO date format
        const isoDate = parsedData.productExpiry || '';
        expiryDate.value = isoDate ? new Date(isoDate).toISOString().split('T')[0] : '';

        quantity.value = parsedData.productQuantity || '';
    }
}   