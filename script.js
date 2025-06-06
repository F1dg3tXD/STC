// Statewide sales tax rates (2024). This does not include local sales taxes.
const taxRates = {
    "Alabama": 0.04,
    "Alaska": 0.00,
    "Arizona": 0.056,
    "Arkansas": 0.065,
    "California": 0.0725,
    "Colorado": 0.029,
    "Connecticut": 0.0635,
    "Delaware": 0.00,
    "District of Columbia": 0.06,
    "Florida": 0.06,
    "Georgia": 0.04,
    "Hawaii": 0.04,
    "Idaho": 0.06,
    "Illinois": 0.0625,
    "Indiana": 0.07,
    "Iowa": 0.06,
    "Kansas": 0.065,
    "Kentucky": 0.06,
    "Louisiana": 0.0445,
    "Maine": 0.055,
    "Maryland": 0.06,
    "Massachusetts": 0.0625,
    "Michigan": 0.06,
    "Minnesota": 0.06875,
    "Mississippi": 0.07,
    "Missouri": 0.04225,
    "Montana": 0.00,
    "Nebraska": 0.055,
    "Nevada": 0.0685,
    "New Hampshire": 0.00,
    "New Jersey": 0.06625,
    "New Mexico": 0.05125,
    "New York": 0.04,
    "North Carolina": 0.0475,
    "North Dakota": 0.05,
    "Ohio": 0.0575,
    "Oklahoma": 0.045,
    "Oregon": 0.00,
    "Pennsylvania": 0.06,
    "Rhode Island": 0.07,
    "South Carolina": 0.06,
    "South Dakota": 0.045,
    "Tennessee": 0.07,
    "Texas": 0.0625,
    "Utah": 0.0485,
    "Vermont": 0.06,
    "Virginia": 0.053,
    "Washington": 0.065,
    "West Virginia": 0.06,
    "Wisconsin": 0.05,
    "Wyoming": 0.04
};

const locationStatusEl = document.getElementById('location-status');
const priceInput = document.getElementById('price');
const taxRateInput = document.getElementById('tax-rate-input');
const salesTaxEl = document.getElementById('sales-tax');
const totalAmountEl = document.getElementById('total-amount');

let currentTaxRate = 0.0;

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function updateCalculation() {
    const price = parseFloat(priceInput.value) || 0;
    const taxRatePercent = parseFloat(taxRateInput.value) || 0;
    const currentTaxRate = taxRatePercent / 100.0;
    const tax = price * currentTaxRate;
    const total = price + tax;

    salesTaxEl.textContent = formatCurrency(tax);
    totalAmountEl.textContent = formatCurrency(total);
}

async function fetchStateAndSetTaxRate(latitude, longitude) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }
        const data = await response.json();
        
        const state = data.address.state;
        if (state && taxRates.hasOwnProperty(state)) {
            const stateTaxRate = taxRates[state];
            locationStatusEl.textContent = `Using tax rate for: ${state}. You can change it below.`;
            taxRateInput.value = (stateTaxRate * 100).toFixed(3);
        } else {
            locationStatusEl.textContent = 'Could not determine tax rate for your location.';
        }
    } catch (error) {
        console.error('Error getting state:', error);
        locationStatusEl.textContent = 'Error finding your location.';
    }
    updateCalculation();
}

function handleLocationError(error) {
    let message = 'Could not get your location.';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = 'Location access denied. Please enter tax rate manually.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            message = 'The request to get user location timed out.';
            break;
    }
    locationStatusEl.textContent = message;
}

function init() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchStateAndSetTaxRate(latitude, longitude);
            },
            handleLocationError
        );
    } else {
        locationStatusEl.textContent = 'Geolocation not supported. Please enter tax rate manually.';
    }

    priceInput.addEventListener('input', updateCalculation);
    taxRateInput.addEventListener('input', updateCalculation);
}

init();