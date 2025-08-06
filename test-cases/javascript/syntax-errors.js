// Test case: JavaScript syntax errors
// This file contains intentional syntax errors to test AI code review capabilities

function calculateSum(a, b) {
    return a + b  // Missing semicolon
}

const user = {
    name: "John",
    age: 30,
    email: "john@example.com"  // Missing comma
    city: "New York"
}

let numbers = [1, 2, 3, 4, 5]
for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]  // Missing closing parenthesis
}

function validateEmail(email) {
    if (email.includes('@') && email.includes('.')) {
        return true
    else {  // Missing opening brace
        return false
    }
}

const result = calculateSum(5, 10
console.log("Result:", result)  // Missing closing parenthesis

// Unused variable
let unusedVar = "This variable is never used"

// Missing return statement
function getGreeting(name) {
    console.log("Hello, " + name)
}

// Incorrect function call
getGreeting()  // Missing parameter 