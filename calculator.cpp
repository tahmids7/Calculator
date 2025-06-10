#include "calculator.h"
#include <sstream>
#include <iomanip>
#include <emscripten/bind.h>

using namespace emscripten;

Calculator::Calculator() : 
    currentValue(0.0),
    storedValue(0.0),
    memoryValue(0.0),
    operation(""),
    newInput(true),
    hasDecimal(false),
    errorState(false) {}

void Calculator::add(double num) {
    storedValue = currentValue;
    currentValue = num;
    operation = "+";
    newInput = true;
    hasDecimal = false;
}

void Calculator::subtract(double num) {
    storedValue = currentValue;
    currentValue = num;
    operation = "-";
    newInput = true;
    hasDecimal = false;
}

void Calculator::multiply(double num) {
    storedValue = currentValue;
    currentValue = num;
    operation = "*";
    newInput = true;
    hasDecimal = false;
}

void Calculator::divide(double num) {
    storedValue = currentValue;
    currentValue = num;
    operation = "/";
    newInput = true;
    hasDecimal = false;
}

void Calculator::squareRoot() {
    if (currentValue < 0) {
        errorState = true;
        return;
    }
    currentValue = sqrt(currentValue);
    newInput = true;
    hasDecimal = false;
}

void Calculator::percentage() {
    if (operation == "+" || operation == "-") {
        currentValue = storedValue * (currentValue / 100.0);
    } else if (operation == "*" || operation == "/") {
        currentValue = currentValue / 100.0;
    } else {
        currentValue = currentValue / 100.0;
    }
    newInput = true;
    hasDecimal = false;
}

void Calculator::negate() {
    currentValue = -currentValue;
}

void Calculator::memoryStore() {
    memoryValue = currentValue;
    newInput = true;
}

void Calculator::memoryRecall() {
    currentValue = memoryValue;
    newInput = true;
}

void Calculator::memoryAdd() {
    memoryValue += currentValue;
    newInput = true;
}

void Calculator::memoryClear() {
    memoryValue = 0.0;
}

double Calculator::getCurrentValue() {
    return currentValue;
}

std::string Calculator::getDisplayValue() {
    if (errorState) {
        return "Error";
    }
    
    std::ostringstream ss;
    ss << std::fixed;
    
    // If the number is an integer, don't show decimal points
    if (std::floor(currentValue) == currentValue && !hasDecimal) {
        ss << std::setprecision(0);
    } else {
        ss << std::setprecision(10);
    }
    
    ss << currentValue;
    std::string result = ss.str();
    
    // Remove trailing zeros after decimal point
    if (result.find('.') != std::string::npos) {
        result = result.substr(0, result.find_last_not_of('0') + 1);
        if (result.back() == '.') {
            result.pop_back();
        }
    }
    
    return result;
}

void Calculator::setOperation(const std::string& op) {
    if (operation != "" && !newInput) {
        calculate();
    }
    operation = op;
    storedValue = currentValue;
    newInput = true;
    hasDecimal = false;
}

void Calculator::addDigit(int digit) {
    if (errorState) {
        return;
    }
    
    if (newInput) {
        currentValue = digit;
        newInput = false;
    } else {
        if (hasDecimal) {
            std::string current = getDisplayValue();
            size_t decimalPos = current.find('.');
            if (decimalPos != std::string::npos) {
                int decimalPlaces = current.length() - decimalPos - 1;
                currentValue = currentValue + (digit / std::pow(10, decimalPlaces + 1));
            }
        } else {
            currentValue = currentValue * 10 + digit;
        }
    }
}

void Calculator::addDecimal() {
    if (errorState) {
        return;
    }
    
    if (newInput) {
        currentValue = 0.0;
        newInput = false;
    }
    
    hasDecimal = true;
}

void Calculator::clear() {
    currentValue = 0.0;
    storedValue = 0.0;
    operation = "";
    newInput = true;
    hasDecimal = false;
    errorState = false;
}

void Calculator::clearEntry() {
    currentValue = 0.0;
    newInput = true;
    hasDecimal = false;
    errorState = false;
}

void Calculator::calculate() {
    if (errorState) {
        return;
    }
    
    if (operation == "+") {
        currentValue = storedValue + currentValue;
    } else if (operation == "-") {
        currentValue = storedValue - currentValue;
    } else if (operation == "*") {
        currentValue = storedValue * currentValue;
    } else if (operation == "/") {
        if (currentValue == 0) {
            errorState = true;
            return;
        }
        currentValue = storedValue / currentValue;
    }
    
    operation = "";
    newInput = true;
    hasDecimal = false;
}

bool Calculator::isInErrorState() {
    return errorState;
}

void Calculator::resetErrorState() {
    errorState = false;
}

// Binding code for Emscripten
EMSCRIPTEN_BINDINGS(calculator_module) {
    class_<Calculator>("Calculator")
        .constructor<>()
        .function("add", &Calculator::add)
        .function("subtract", &Calculator::subtract)
        .function("multiply", &Calculator::multiply)
        .function("divide", &Calculator::divide)
        .function("squareRoot", &Calculator::squareRoot)
        .function("percentage", &Calculator::percentage)
        .function("negate", &Calculator::negate)
        .function("memoryStore", &Calculator::memoryStore)
        .function("memoryRecall", &Calculator::memoryRecall)
        .function("memoryAdd", &Calculator::memoryAdd)
        .function("memoryClear", &Calculator::memoryClear)
        .function("getCurrentValue", &Calculator::getCurrentValue)
        .function("getDisplayValue", &Calculator::getDisplayValue)
        .function("setOperation", &Calculator::setOperation)
        .function("addDigit", &Calculator::addDigit)
        .function("addDecimal", &Calculator::addDecimal)
        .function("clear", &Calculator::clear)
        .function("clearEntry", &Calculator::clearEntry)
        .function("calculate", &Calculator::calculate)
        .function("isInErrorState", &Calculator::isInErrorState)
        .function("resetErrorState", &Calculator::resetErrorState);
}
