document.querySelector('#expiryDate').addEventListener('change', function() {
    const dateInput = this.value;

    const isoDate = new Date(dateInput).toISOString();

    console.log(isoDate);
});
