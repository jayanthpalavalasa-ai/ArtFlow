const PRICE_TABLE ={
    A4: {
        1: 2000,
    },
    A3: {
        1: 2500,
        2: 3500,
        3: 4000,
    },
};

function getPrice(size, numberOfPeople) {
    if (size === 'A2'){
        return null;
    }
    const price = PRICE_TABLE[size]?.[numberOfPeople];
    return price ?? null;
}
module.exports = { getPrice, PRICE_TABLE };