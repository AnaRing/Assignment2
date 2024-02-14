const products = [];
document.addEventListener('DOMContentLoaded', function() {

// date to - iso convertion

document.querySelector('#expiryDate').addEventListener('change', function() {
    const dateInput = this.value;

    const isoDate = new Date(dateInput).toISOString();

    console.log(isoDate);
});

// selecting elements from the dom

const productName = document.querySelector('.product__name');
const productID = document.querySelector('.product__id');
const manufacturer = document.querySelector('.product__manufacturer');
const productExpiry = document.querySelector('.product__expiry');
const productQuantity = document.querySelector('.product__quantity');

const positiveToast = document.querySelector('.submit__toast');
const negativeToast = document.querySelector('.submit__negative__toast');
const errorToast = document.querySelector('#errorID');

const inputForm = document.querySelector('.pharmacy__storage__form')
const displayStorage = document.querySelector('.display__storage__container');

loadFormData();
// adding eventlisteners



// toast function
    inputForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (isFormFilledOut()) {
            const newProduct = new Product(
                productName.value,
                productID.value,
                manufacturer.value,
                productExpiry.value,
                quantity.value
            );

            Product.addProduct(newProduct);
            displayFormData(newProduct);

            saveFormData();
            positiveToast.style.display = 'block';
            negativeToast.style.display = 'none';
            errorToast.style.display = 'none';
            displayFormData();
            setTimeout(function () {
                positiveToast.style.display = 'none';
                inputForm.reset();
            }, 2000);
        } else {
            if (productIDExists(productID.value)) {
                errorToast.style.display = 'block';
                negativeToast.style.display = 'none';
            } else {
                errorToast.style.display = 'none';
                negativeToast.style.display = 'block';
            }
        }
    });
});

// isFormFilledOut function
function isFormFilledOut(inputForm) {
    const formInputs =  inputForm.querySelectorAll('input[required]');
    for (const input of formInputs) {
        if(!input.value.trim()) {
            return false;
        }
    }
    return true;
}

// does ID exist
 
function productIDExists(id) {
    const storedData = JSON.parse(localStorage.getItem('products')) || [];
    return storedData.some(product => product.id === id);
}

// saving the form to local storage

function saveFormData() {
    const formData = {
        productName: productName.value,
        productID: productID.value,
        manufacturer: manufacturer.value,
        productExpiry: productExpiry.value,
        productQuantity: productQuantity.value
    };

    localStorage.setItem('formData', JSON.stringify(formData));
}

function loadFormData() {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
        const parsedData =  JSON.parse(storedData);
        productName.value =parsedData.productName || '';
        productID.value= parsedData.productID || '';
        manufacturer.value = parsedData.manufacturer|| '';
        productExpiry.value = parsedData.productExpiry || '';
        productQuantity.value = parsedData.productQuantity || '';
    }
}
loadFormData();
UI.renderProducts();


// declaring the Product class

class Product {
    constructor (name, id, manufacturer, expiryDate, quantity){
        this.productName = name;
        this.productID = id;
        this.manufacturer = manufacturer;
        this.expiryDate = Date.now(); 
        this.quantity = quantity;
} 

static addProduct(product) {
    const storedData = JSON.parse(localStorage.getItem('products')) || [];
    storedData.push(product);
    localStorage.setItem('products', JSON.stringify(storedData));
}

static deleteProduct(id) {
    const storedData = JSON.parse(localStorage.getItem('products')) || [];
    const index = storedData.findIndex((product) => product.ID.toString() === id.toString());
    if (index !== -1) {
        storedData.splice(index, 1)
        localStorage.setItem( 'products' ,JSON.stringify(storedData));
        UIEvent.renderProducts();
        }
    }
}

// declare the UI class

class UI {
    static renderProducts() {
        const storageUl = document.querySelector('.storage__list');
        const storedData = JSON.parse(localStorage.getItem('products')) ||  [];
        storageUl.innerHTML = '';

        storedData.forEach((product) => {
            const liRow = document.createElement('li');
            const renderedName = document.createElement('span');
            const renderedID = document.createElement('span');
            const renderedManufacturer = document.createElement('span');
            const renderedExpiry = document.createElement('span');
            const renderedQuantity = document.createElement('span');
            const deleteButtonContainer = document.createElement('span');
            const deleteButton = document.createElement('button');

            renderedName.textContent = productName;
            renderedID.textContent = productID;
            renderedManufacturer.textContent = product.manufacturer;
            renderedExpiry.textContent = product.expiryDate;
            renderedQuantity.textContent = product.quantity;
            deleteButton.textContent = 'DELETE X';

            liRow.classList.add('products__row');
            deleteButton.classList.add('delete__button');

            liRow.dataset.id = product.ID;

            storageUl.append(liRow);
            liRow.append(
            renderedName,
            renderedID,
            renderedManufacturer,
            renderedExpiry,
            renderedQuantity,
            deleteButtonContainer
           );

           deleteButtonContainer.append(deleteButton);

           deleteButton.addEventListener('click', (e) => {
            const rowID = e.currentTarget.parentElement.parentElement.dataset.id;
            Product.deleteProduct(rowID);
           });
        });
    }
}

function displayFormData(product){
    UI.renderProducts();
}