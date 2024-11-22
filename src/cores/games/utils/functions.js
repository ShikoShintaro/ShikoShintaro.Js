
function determineWinner(playerValue, dealerValue) {
    if (dealerValue > 21) {
        return 'Dealer busts! You win!';
    } else if (playerValue > dealerValue) {
        return 'You win!';
    } else if (playerValue === dealerValue) {
        return 'It\'s a tie!';
    } else {
        return 'Dealer wins. Better luck next time!';
    }
}

module.exports = {
    determineWinner
}