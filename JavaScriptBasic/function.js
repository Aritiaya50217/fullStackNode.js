function sayHello(name) {
    console.log("sayHello : ", name)
}

const sayHi = (name, age) => {
    console.log("use arrow function")
    console.log("name : ", name)
    console.log("age : ", age)
}

function addNumber(x, y) {
    return x + y
}


sayHello("test");
sayHi("test", 27);
console.log("result : ", addNumber(5, 5));