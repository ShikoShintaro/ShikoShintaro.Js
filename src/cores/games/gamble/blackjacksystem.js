const suits = [
    '♥', '♦', '♣', '♠'
];

const values = [
    '2','3','4','5','6','7','8','9','10','J','Q','K','A'
];

function iniDeck() {
    const deck = [];

    for (const suit of suits) {
        for (const value of values) {
            deck.push(
                { suit, value }
            )
        }
    }
    return shuffleDeck(deck);
}

function shuffleDeck(deck) {
    for ( let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * ( i + 1 ));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function calculateHandVal(hand) {
    let value = 0;
    let aceCount = 0;
    
    for (const card of hand) {
        if(
            ['K','Q','J'].includes(card.value)
        ) {
           value += 10; 
        } else if (card.value === 'A') {
            aceCount += 1;
            value += 11;
        } else {
            value += parseInt(card.value);
        }
    }

    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount -= 1;
    }

    return value;
}

module.exports = {
    iniDeck,
    shuffleDeck,
    calculateHandVal
}