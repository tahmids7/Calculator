#ifndef CALCULATOR_H
#define CALCULATOR_H

#include <string>
#include <cmath>
#include <vector>
#include <emscripten/bind.h>

class Calculator {
private:
    double currentValue;
    double storedValue;
    double memoryValue;
    std::string operation;
    bool newInput;
    bool hasDecimal;
    bool errorState;
    
public:
    Calculator();
    
    // Basic operations
    void add(double num);
    void subtract(double num);
    void multiply(double num);
    void divide(double num);
    
    // Additional operations
    void squareRoot();
    void percentage();
    void negate();
    
    // Memory operations
    void memoryStore();
    void memoryRecall();
    void memoryAdd();
    void memoryClear();
    
    // Display and state management
    double getCurrentValue();
    std::string getDisplayValue();
    void setOperation(const std::string& op);
    void addDigit(int digit);
    void addDecimal();
    void clear();
    void clearEntry();
    void calculate();
    
    // Helper functions
    bool isInErrorState();
    void resetErrorState();
};

#endif // CALCULATOR_H
