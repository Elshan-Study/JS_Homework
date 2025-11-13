Function.prototype.myBind = function(context, ...bindArgs) {
    const fn = this;

    function boundFunction(...callArgs) {
        const isNew = this instanceof boundFunction;
        return fn.apply(isNew ? this : context, [...bindArgs, ...callArgs]);
    }

    boundFunction.prototype = Object.create(fn.prototype);

    return boundFunction;
};
function greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`);
}

const user = { name: "Elshan" };
const greetUser = greet.myBind(user, "Hello");

greetUser("!");
greetUser("?");

function Person(name, age) {
    this.name = name;
    this.age = age;
}

const BoundPerson = Person.myBind({ irrelevant: true }, "Elshan");
const p = new BoundPerson(25);

console.log(p.name);
console.log(p.age);
console.log(p instanceof Person);