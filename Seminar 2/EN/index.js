// var, const, let

var x = 120;
x = "Ionut";
x = {};
console.log(x);

// if (1 != 1){
//     var a = 8;
//     let b = 9;
// }

// console.log(a);
//console.log(b);

console.log(3 + 3);
console.log(3 - 3);

console.log(3 + "3");
console.log(3 - "3");

console.log(3 + "Ana");
console.log(3 - "Ana");

if (1 == "1") // compare on value
    console.log("enter")
else
    console.log("not enter")

if (1 === "1") // compare on type and value
    console.log("enter")
else
    console.log("not enter")

let g = "";

if (!g){
    console.log("g is not defined")
}


let arr = ["Ionut", "Mihai", "Marcela"];

// for in - clasic for
for (let i in arr)
    console.log(i)

// for of - foreach clasic
for (let i of arr)
    console.log(i)

let ob = {
    x: 1,
    y: 2
}

for (let i in ob)
    console.log(i)

// for (let i of ob)
//     console.log(i)

arr.forEach((item, index) => {
    console.log(item + index)
})

// ------------------------------------------------------------------
// Array methods examples (appended without deleting previous code)
// ------------------------------------------------------------------

console.log("\n=== Array methods examples ===\n");

const numbers = [10, 20, 30, 40];
console.log("Original array:", numbers);

// pop() - removes the last element and returns it
const poppedValue = numbers.pop();
console.log("After pop():", numbers, "Removed:", poppedValue);

// push() - adds elements to the end of the array
numbers.push(50, 60);
console.log("After push():", numbers);

// join() - converts array to string
const joined = numbers.join(" - ");
console.log("After join():", joined);

// unshift() - adds elements to the beginning
numbers.unshift(5);
console.log("After unshift():", numbers);

// shift() - removes the first element and returns it
const shiftedValue = numbers.shift();
console.log("After shift():", numbers, "Removed first:", shiftedValue);

// splice() - removes/replaces elements from a given index
numbers.splice(1, 2, 25, 35);
console.log("After splice():", numbers);

const names = ["Ana", "Ion", "Maria", "Andrei"];

// some() - true if at least one element matches
console.log("some() length > 4:", names.some(name => name.length > 4));

// every() - true if all elements match
console.log("every() length > 2:", names.every(name => name.length > 2));

// map() - creates a new array with transformed values
const upperNames = names.map(name => name.toUpperCase());
console.log("map() uppercase:", upperNames);

// filter() - keeps elements that match condition
const filteredNames = names.filter(name => name.includes("a"));
console.log("filter() names with 'a':", filteredNames);

// reduce() - reduce all values to one result
const total = [10, 20, 30, 40].reduce((sum, value) => sum + value, 0);
console.log("reduce() total:", total);

// reduceRight() - same as reduce but from right to left
const totalRight = [10, 20, 30, 40].reduceRight((sum, value) => sum + value, 0);
console.log("reduceRight() total:", totalRight);

console.log("\n=== Method explanations ===");
console.log("pop(): removes the last element and returns it.");
console.log("push(): adds one or more elements to the end of the array.");
console.log("join(): creates a string from array elements using a separator.");
console.log("shift(): removes the first element and returns it.");
console.log("unshift(): adds one or more elements to the beginning.");
console.log("splice(start, deleteCount, item1, ...): removes or inserts elements at a chosen index.");
console.log("some(): returns true if at least one element passes a test.");
console.log("every(): returns true if all elements pass a test.");
console.log("map(): creates a new array after changing each element.");
console.log("filter(): creates a new array with only matching elements.");
console.log("reduce(): combines values into a single result.");
console.log("reduceRight(): combines values from right to left.");

console.log("\nThis file now includes both the original code and new array examples.");

// ------------------------------------------------------------------
// filter, map, reduce with an array of objects (3 properties each)
// ------------------------------------------------------------------

console.log("\n=== filter, map, reduce with objects ===\n");

const products = [
    { id: 1, name: "Laptop", price: 1500, category: "Tech" },
    { id: 2, name: "Phone", price: 700, category: "Tech" },
    { id: 3, name: "Book", price: 50, category: "Education" },
    { id: 4, name: "Desk", price: 300, category: "Furniture" },
    { id: 5, name: "Monitor", price: 900, category: "Tech" }
];

console.log("Products array:", products);

// filter() - keep only Tech products
// filter is the same thing like WHERE in SQL
const techProducts = products.filter(product => product.category === "Tech");
console.log("filter() => Tech products:", techProducts);

// map() - create a new array with product names and prices
// map is the same thing like SELECT in SQL
const productSummary = products.map(product => ({
    name: product.name,
    price: product.price,
    label: `${product.name} costs ${product.price} USD`
}));
console.log("map() => product summary:", productSummary);

// reduce() - calculate total price of all products
// reduce is the same thing like SUM (or maybe a function that return only one element) in SQL
const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
console.log("reduce() => total price:", totalPrice);

// Example: use filter + map + reduce together
const totalTechPrice = products
    .filter(product => product.category === "Tech")
    .map(product => product.price)
    .reduce((sum, price) => sum + price, 0);

console.log("filter + map + reduce => total price of Tech products:", totalTechPrice);

// One-pass version: does the same calculation in a single iteration
const totalTechPriceSinglePass = products.reduce((sum, product) => {
    if (product.category === "Tech") {
        return sum + product.price;
    }
    return sum;
}, 0);

console.log("single-pass reduce => total price of Tech products:", totalTechPriceSinglePass);

// for...of version: one pass through the array, no extra arrays created
let totalTechPriceForOf = 0;
for (const product of products) {
    if (product.category === "Tech") {
        totalTechPriceForOf += product.price;
    }
}
console.log("for...of => total price of Tech products:", totalTechPriceForOf);

console.log("\nExplanation:");
console.log("filter() keeps only objects that meet a condition.");
console.log("map() creates a new array with transformed object values.");
console.log("reduce() adds all values together into one final result.");
console.log("Single-pass reduce checks each object once and adds only Tech prices.");
console.log("for...of also checks each object once and adds only Tech prices without creating intermediate arrays.");

// ------------------------------------------------------------------
// Simple array proof of concept
// ------------------------------------------------------------------

const arrayBasicsDemo = ["apple", "banana", "orange"];
console.log("\n=== Simple array example ===");
console.log("First item (index 0):", arrayBasicsDemo[0]);
console.log("Number of items:", arrayBasicsDemo.length);

arrayBasicsDemo.push("pear");
console.log("After adding pear:", arrayBasicsDemo);
