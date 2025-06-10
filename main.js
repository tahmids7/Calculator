// Calculator class implementation in JavaScript
class Calculator {
    constructor() {
        this.currentValue = 0;
        this.storedValue = 0;
        this.memoryValue = 0;
        this.operation = "";
        this.newInput = true;
        this.hasDecimal = false;
        this.errorState = false;
    }

    // Basic operations
    add(num) {
        this.storedValue = this.currentValue;
        this.currentValue = num;
        this.operation = "+";
        this.newInput = true;
        this.hasDecimal = false;
    }

    subtract(num) {
        this.storedValue = this.currentValue;
        this.currentValue = num;
        this.operation = "-";
        this.newInput = true;
        this.hasDecimal = false;
    }

    multiply(num) {
        this.storedValue = this.currentValue;
        this.currentValue = num;
        this.operation = "*";
        this.newInput = true;
        this.hasDecimal = false;
    }

    divide(num) {
        this.storedValue = this.currentValue;
        this.currentValue = num;
        this.operation = "/";
        this.newInput = true;
        this.hasDecimal = false;
    }

    // Additional operations
    squareRoot() {
        if (this.currentValue < 0) {
            this.errorState = true;
            return;
        }
        this.currentValue = Math.sqrt(this.currentValue);
        this.newInput = true;
        this.hasDecimal = false;
    }

    percentage() {
        if (this.operation === "+" || this.operation === "-") {
            this.currentValue = this.storedValue * (this.currentValue / 100.0);
        } else if (this.operation === "*" || this.operation === "/") {
            this.currentValue = this.currentValue / 100.0;
        } else {
            this.currentValue = this.currentValue / 100.0;
        }
        this.newInput = true;
        this.hasDecimal = false;
    }

    negate() {
        this.currentValue = -this.currentValue;
    }

    // Memory operations
    memoryStore() {
        this.memoryValue = this.currentValue;
        this.newInput = true;
    }

    memoryRecall() {
        this.currentValue = this.memoryValue;
        this.newInput = true;
    }

    memoryAdd() {
        this.memoryValue += this.currentValue;
        this.newInput = true;
    }

    memoryClear() {
        this.memoryValue = 0;
    }

    // Display and state management
    getCurrentValue() {
        return this.currentValue;
    }

    getDisplayValue() {
        if (this.errorState) {
            return "Error";
        }
        
        // If the number is an integer, don't show decimal points
        if (Math.floor(this.currentValue) === this.currentValue && !this.hasDecimal) {
            return this.currentValue.toFixed(0);
        } else {
            // Format with appropriate decimal places
            let result = this.currentValue.toString();
            
            // Remove trailing zeros after decimal point
            if (result.includes('.')) {
                result = parseFloat(this.currentValue).toString();
            }
            
            return result;
        }
    }

    setOperation(op) {
        if (this.operation !== "" && !this.newInput) {
            this.calculate();
        }
        this.operation = op;
        this.storedValue = this.currentValue;
        this.newInput = true;
        this.hasDecimal = false;
    }

    addDigit(digit) {
        if (this.errorState) {
            return;
        }
        
        if (this.newInput) {
            this.currentValue = digit;
            this.newInput = false;
        } else {
            if (this.hasDecimal) {
                const current = this.getDisplayValue();
                const decimalPos = current.indexOf('.');
                if (decimalPos !== -1) {
                    const decimalPlaces = current.length - decimalPos - 1;
                    this.currentValue = this.currentValue + (digit / Math.pow(10, decimalPlaces + 1));
                }
            } else {
                this.currentValue = this.currentValue * 10 + digit;
            }
        }
    }

    addDecimal() {
        if (this.errorState) {
            return;
        }
        
        if (this.newInput) {
            this.currentValue = 0;
            this.newInput = false;
        }
        
        this.hasDecimal = true;
    }

    clear() {
        this.currentValue = 0;
        this.storedValue = 0;
        this.operation = "";
        this.newInput = true;
        this.hasDecimal = false;
        this.errorState = false;
    }

    clearEntry() {
        this.currentValue = 0;
        this.newInput = true;
        this.hasDecimal = false;
        this.errorState = false;
    }

    calculate() {
        if (this.errorState) {
            return;
        }
        
        if (this.operation === "+") {
            this.currentValue = this.storedValue + this.currentValue;
        } else if (this.operation === "-") {
            this.currentValue = this.storedValue - this.currentValue;
        } else if (this.operation === "*") {
            this.currentValue = this.storedValue * this.currentValue;
        } else if (this.operation === "/") {
            if (this.currentValue === 0) {
                this.errorState = true;
                return;
            }
            this.currentValue = this.storedValue / this.currentValue;
        }
        
        this.operation = "";
        this.newInput = true;
        this.hasDecimal = false;
    }

    isInErrorState() {
        return this.errorState;
    }

    resetErrorState() {
        this.errorState = false;
    }
}

// Global variables
let calculator = new Calculator();
let operationDisplay = "";

// DOM Elements
const displayElement = document.getElementById('display');
const operationDisplayElement = document.getElementById('operation-display');

// Function to update the calculator display
function updateDisplay() {
    // Update the main display
    const displayValue = calculator.getDisplayValue();
    displayElement.textContent = displayValue;
    
    // Update the operation display
    operationDisplayElement.textContent = operationDisplay;
}

// Setup all event listeners for calculator buttons
function setupEventListeners() {
    // Number keys
    for (let i = 0; i <= 9; i++) {
        const button = document.getElementById(`key-${i}`);
        if (button) {
            button.addEventListener('click', () => {
                calculator.addDigit(i);
                updateDisplay();
            });
        }
    }
    
    // Operation keys
    document.getElementById('add').addEventListener('click', () => {
        operationDisplay = calculator.getCurrentValue() + ' +';
        calculator.setOperation("+");
        updateDisplay();
    });
    
    document.getElementById('subtract').addEventListener('click', () => {
        operationDisplay = calculator.getCurrentValue() + ' -';
        calculator.setOperation("-");
        updateDisplay();
    });
    
    document.getElementById('multiply').addEventListener('click', () => {
        operationDisplay = calculator.getCurrentValue() + ' ×';
        calculator.setOperation("*");
        updateDisplay();
    });
    
    document.getElementById('divide').addEventListener('click', () => {
        operationDisplay = calculator.getCurrentValue() + ' ÷';
        calculator.setOperation("/");
        updateDisplay();
    });
    
    // Function keys
    document.getElementById('decimal').addEventListener('click', () => {
        calculator.addDecimal();
        updateDisplay();
    });
    
    document.getElementById('negate').addEventListener('click', () => {
        calculator.negate();
        updateDisplay();
    });
    
    document.getElementById('percentage').addEventListener('click', () => {
        calculator.percentage();
        updateDisplay();
    });
    
    document.getElementById('square-root').addEventListener('click', () => {
        operationDisplay = '√(' + calculator.getCurrentValue() + ')';
        calculator.squareRoot();
        updateDisplay();
    });
    
    document.getElementById('clear').addEventListener('click', () => {
        calculator.clear();
        operationDisplay = "";
        updateDisplay();
    });
    
    document.getElementById('clear-entry').addEventListener('click', () => {
        calculator.clearEntry();
        updateDisplay();
    });
    
    document.getElementById('calculate').addEventListener('click', () => {
        operationDisplay = operationDisplay + ' ' + calculator.getCurrentValue() + ' =';
        calculator.calculate();
        updateDisplay();
        // Reset operation display after calculation
        setTimeout(() => {
            operationDisplay = "";
            updateDisplay();
        }, 2000);
    });
    
    // Memory keys
    document.getElementById('memory-clear').addEventListener('click', () => {
        calculator.memoryClear();
        updateDisplay();
    });
    
    document.getElementById('memory-recall').addEventListener('click', () => {
        calculator.memoryRecall();
        updateDisplay();
    });
    
    document.getElementById('memory-add').addEventListener('click', () => {
        calculator.memoryAdd();
        updateDisplay();
    });
    
    document.getElementById('memory-store').addEventListener('click', () => {
        calculator.memoryStore();
        updateDisplay();
    });
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyPress);
}

// Function for handle keyboard input
function handleKeyPress(event) {
    // Numbers
    if (/^[0-9]$/.test(event.key)) {
        calculator.addDigit(parseInt(event.key));
        updateDisplay();
    }
    // Operators
    else if (event.key === '+') {
        operationDisplay = calculator.getCurrentValue() + ' +';
        calculator.setOperation("+");
        updateDisplay();
    }
    else if (event.key === '-') {
        operationDisplay = calculator.getCurrentValue() + ' -';
        calculator.setOperation("-");
        updateDisplay();
    }
    else if (event.key === '*') {
        operationDisplay = calculator.getCurrentValue() + ' ×';
        calculator.setOperation("*");
        updateDisplay();
    }
    else if (event.key === '/') {
        operationDisplay = calculator.getCurrentValue() + ' ÷';
        calculator.setOperation("/");
        updateDisplay();
    }
    // Decimal
    else if (event.key === '.') {
        calculator.addDecimal();
        updateDisplay();
    }
    // Enter/equals
    else if (event.key === 'Enter' || event.key === '=') {
        operationDisplay = operationDisplay + ' ' + calculator.getCurrentValue() + ' =';
        calculator.calculate();
        updateDisplay();
        // Reset operation display after calculation
        setTimeout(() => {
            operationDisplay = "";
            updateDisplay();
        }, 2000);
    }
    // Backspace for CE
    else if (event.key === 'Backspace') {
        calculator.clearEntry();
        updateDisplay();
    }
    // Delete or Escape for C
    else if (event.key === 'Delete' || event.key === 'Escape') {
        calculator.clear();
        operationDisplay = "";
        updateDisplay();
    }
    // Prevent default for keys we're handling
    if (['+', '-', '*', '/', '.', 'Enter', '=', 'Backspace', 'Delete', 'Escape'].includes(event.key) || 
        /^[0-9]$/.test(event.key)) {
        event.preventDefault();
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    setupEventListeners();
});
