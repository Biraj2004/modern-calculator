class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (this.currentOperand.replace(/[,.]/g, '').length >= 19) return;
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        // Handle '00' button
        if (number === '00' && this.currentOperand === '00') {
            this.currentOperand = '0';
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        if (operation === '%') {
            this.percentage();
            return;
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand.replace(/,/g, ''));
        const current = parseFloat(this.currentOperand.replace(/,/g, ''));
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.textContent = `${this.getDisplayNumber(this.previousOperand)} ${this.operation} `;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const themeToggleButton = document.getElementById('theme-toggle');

const calculator = new Calculator(previousOperandElement, currentOperandElement);

function handleNumberClick(e) {
    calculator.appendNumber(e.target.innerText);
    calculator.updateDisplay();
}

function handleOperationClick(e) {
    calculator.chooseOperation(e.target.innerText);
    calculator.updateDisplay();
}

numberButtons.forEach(button => button.addEventListener('click', handleNumberClick));
operationButtons.forEach(button => button.addEventListener('click', handleOperationClick));

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

themeToggleButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');
});

document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9' || event.key === '.') {
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        let operation = event.key;
        if (operation === '*') operation = '×';
        if (operation === '/') operation = '÷';
        calculator.chooseOperation(operation);
        calculator.updateDisplay();
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    } else if (event.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (event.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (event.key === '%') {
        calculator.chooseOperation('%');
        calculator.updateDisplay();
    }
});

// Prevent double-tap zoom on mobile devices
document.addEventListener('touchend', (event) => {
    if (event.target.tagName === 'BUTTON') {
        event.preventDefault();
        event.target.click();
    }
}, { passive: false });

// Prevent context menu on long press
document.addEventListener('contextmenu', (event) => {
    if (event.target.tagName === 'BUTTON') {
        event.preventDefault();
    }
}, false);
