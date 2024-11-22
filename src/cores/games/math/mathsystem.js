function createRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.max(1, Math.floor(Math.random() * (max - min + 1)) + min);
}

function isPrime(num) {
    if (num < 2) {
        return false;
    }

    let sqrt_num = Math.floor(Math.sqrt(num));
    for (let i = 2; i < sqrt_num; i++) {
        if (num % i === 0) return false;
    }

    return true;
}

function calculateFactorial(num) {
    let result = num;
    while (num > 1) {
        --num;
        result *= num;
    }
    return result;
}

function generateNumber(level, operator) {
    switch (operator) {
        case "+":
        case "-":
            return createRandomNumber(Math.random() * 2.5 * level, Math.max(2.5 * level, Math.random() * 7.5 * level));
        case "/":
        case "*":
            return createRandomNumber(Math.random() * 5 * Math.max(1, Math.random() * level / 2), Math.random() * 10 * Math.max(1, Math.random() * level / 2));
        case "!":
            return createRandomNumber(Math.random() * (level - 10) / 5, Math.random() * 3 * Math.max(1 + (level - 10) / 5, Math.random() * (level - 10) / 5));
    }
}

async function generateEquation(level, operator_amount) {
    const operators = ['/', '*', '+', '-'];
    let prev_operator_amount = operator_amount;
    let equation = '';
    let real_equation = '';
    let answer = Number.NaN;
    let prime_count = 0;
    let last_operator = '';
    let attempts = 0;
    const maxThreshold = 10 * level * operator_amount;
    const minThreshold = maxThreshold / 2;

    while (!Number.isInteger(answer)) {
        if (attempts === 500) {
            break;
        }

        while (operator_amount > 0) {
            const index = Math.floor(Math.random() * operators.length);
            const operator = operators[index];
            let number = generateNumber(level, operator);
            const mul_or_div = operator === '/' || operator === '*' || last_operator === '/' || last_operator === '*';
            if (mul_or_div) {
                while (!isPrime(number) && prime_count < Math.floor(level / 10)) {
                    number = generateNumber(level, operator);
                }
                ++prime_count;
            }


            const factorial = level >= 11 && level + Math.random() * level >= 20;
            if (factorial) {

                number = generateNumber(level, "!");
                while (number < 2 || number > 4) {
                    number = generateNumber(level, "!");
                }
            }

            last_operator = operator;

            if (factorial) {
                equation += `${calculateFactorial(number)} ${operator} `;
                real_equation += `${number}! ${operator} `;
            } else {
                equation += `${number} ${operator} `;
                real_equation += `${number} ${operator} `;
            }

            --operator_amount;
        }

        let number = generateNumber(level, last_operator);
        const mul_or_div = last_operator === '/' || last_operator === '*';
        if (mul_or_div) {
            while (!isPrime(number) && prime_count < Math.floor(level / 5)) {
                number = generateNumber(level, last_operator);
            }
        }


        const factorial = level >= 11 && Math.random() >= 1 - level / 25;
        if (factorial) {

            number = generateNumber(level, "!");
            while (number < 2 || number > 4) {
                number = generateNumber(level, "!");
            }
        }

        if (factorial) {
            equation += calculateFactorial(number);
            real_equation += `${number}!`;
        } else {
            equation += number;
            real_equation += number;
        }
        answer = eval(equation);

        const min_mul_div_threshold = Math.min(prev_operator_amount, Math.floor(level / 10));
        const max_mul_div_threshold = level / 5;
        const mul_div_amount = (equation.match(/\//g) || []).length + (equation.match(/\*/g) || []).length;
        if (
            !Number.isInteger(answer) ||

            (level >= 5 && mul_div_amount < min_mul_div_threshold && mul_div_amount > max_mul_div_threshold) ||

            (answer > 0 && (answer > maxThreshold || answer < minThreshold)) ||

            (answer < 0 && (answer < -maxThreshold || answer > -minThreshold))
        ) {
            answer = Number.NaN;
            equation = '';
            real_equation = '';
            operator_amount = prev_operator_amount;
        }
        ++attempts;
    }

    return [real_equation, answer];
}

module.exports = {
    createRandomNumber,
    isPrime,
    calculateFactorial,
    generateNumber,
    generateEquation,
}