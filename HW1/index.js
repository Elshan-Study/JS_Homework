//  отбрасывает дробную часть (в сторону 0)
function myTrunc(x) {
    x = Number(x) || 0;
    return x - (x % 1);
}

// Абсолютное значение
function myAbs(x) {
    x = Number(x) || 0;
    return x < 0 ? -x : x;
}

// Добавить ведущий ноль для двух знаков
function pad2(n) {
    n = myTrunc(Number(n) || 0);
    return n < 10 ? "0" + n : String(n);
}

// ------------------ @Task1 ------------------

// Task1.1
function filesOnFlash(gb, use1024 = true) {
    gb = Number(gb) || 0;
    const mbPerGb = use1024 ? 1024 : 1000;
    const fileSizeMb = 820;
    const totalMb = gb * mbPerGb;
    return myTrunc(totalMb / fileSizeMb);
}
console.log("// Task1.1");
console.log("filesOnFlash(65) =>", filesOnFlash(65)); // пример

// Task1.2
function reverseThreeDigitNumber(n) {
    n = Number(n);
    if (isNaN(n)) return null;
    const sign = n < 0 ? -1 : 1;
    n = myAbs(n);
    n = myTrunc(n);
    if (n < 100 || n > 999) return null; // не трёхзначное
    const hundreds = myTrunc(n / 100);
    const tens = myTrunc((n % 100) / 10);
    const ones = n % 10;
    return sign * (ones * 100 + tens * 10 + hundreds);
}
console.log("// Task1.2");
console.log("reverseThreeDigitNumber(123) =>", reverseThreeDigitNumber(123)); // 321
console.log("reverseThreeDigitNumber(-405) =>", reverseThreeDigitNumber(-405)); // -504

// Task1.3
function evenOrOddNoIf(n) {
    n = Number(n);
    if (isNaN(n)) return "Неверный ввод";
    return (n % 2 === 0) && "Четное" || "Нечетное";
}
console.log("// Task1.3");
console.log("evenOrOddNoIf(8) =>", evenOrOddNoIf(8)); // Четное
console.log("evenOrOddNoIf(7) =>", evenOrOddNoIf(7)); // Нечетное

// ------------------ @Task2 ------------------

// Task2.1
function ageCategory(age) {
    age = myTrunc(Number(age) || -1);
    if (age < 0) return "Неверный возраст";
    if (age <= 12) return "Ребёнок (0-12)";
    else if (age <= 17) return "Подросток (13-17)";
    else if (age <= 59) return "Взрослый (18-59)";
    else return "Пенсионер (60+)";
}
console.log("// Task2.1");
console.log("ageCategory(5) =>", ageCategory(5));
console.log("ageCategory(16) =>", ageCategory(16));
console.log("ageCategory(30) =>", ageCategory(30));
console.log("ageCategory(70) =>", ageCategory(70));

// Task2.2
function symbolForDigit(d) {
    d = myTrunc(Number(d));
    if (isNaN(d) || d < 0 || d > 9) return "Неверный ввод";
    const symbols = [')','!','@','#','$','%','^','&','*','('];
    return symbols[d];
}
console.log("// Task2.2");
console.log("symbolForDigit(1) =>", symbolForDigit(1));
console.log("symbolForDigit(0) =>", symbolForDigit(0));
console.log("symbolForDigit(9) =>", symbolForDigit(9));

// Task2.3
function isLeapYear(year) {
    year = myTrunc(Number(year));
    if (isNaN(year)) return false;
    return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}
console.log("// Task2.3");
console.log("isLeapYear(2020) =>", isLeapYear(2020));
console.log("isLeapYear(1900) =>", isLeapYear(1900));
console.log("isLeapYear(2000) =>", isLeapYear(2000));

// ------------------ @Task3 ------------------

// Task3.1
function statsFromArray(arr) {
    // если передали не массив — вернуть null
    if (!Array.isArray(arr)) return null;
    let positives = 0, negatives = 0, zeros = 0, evens = 0, odds = 0;
    for (let i = 0; i < arr.length && i < 10; i++) {
        const val = Number(arr[i]);
        if (isNaN(val)) {
            zeros++;
            evens++;
            continue;
        }
        if (val > 0) positives++;
        else if (val < 0) negatives++;
        else zeros++;

        if (val % 2 === 0) evens++;
        else odds++;
    }
    return {positives, negatives, zeros, evens, odds};
}
console.log("// Task3.1");
console.log("statsFromArray([1,-2,0,3,4,-5,6,0,9,-1]) =>", statsFromArray([1,-2,0,3,4,-5,6,0,9,-1]));

// Task3.2
function runCalculator(ops) {
    if (!Array.isArray(ops)) return [];
    const results = [];
    for (let i = 0; i < ops.length; i++) {
        const item = ops[i];
        const a = Number(item.a) || 0;
        const b = Number(item.b) || 0;
        const op = String(item.op || "+");
        let res;
        if (op === "+") res = a + b;
        else if (op === "-") res = a - b;
        else if (op === "*") res = a * b;
        else if (op === "/") {
            res = (b === 0) ? "Ошибка: деление на 0" : (a / b);
        } else res = "Неизвестный оператор";
        results.push(res);
    }
    return results;
}
console.log("// Task3.2");
console.log("runCalculator([{a:2,b:3,op:'+'},{a:5,b:0,op:'/'}]) =>", runCalculator([{a:2,b:3,op:'+'},{a:5,b:0,op:'/'}]));

// ------------------ @Task4 ------------------

// Task4.1
function compare(a, b) {
    a = Number(a);
    b = Number(b);
    if (isNaN(a) || isNaN(b)) return null;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}
console.log("// Task4.1");
console.log("compare(2,5) =>", compare(2,5));
console.log("compare(5,2) =>", compare(5,2));
console.log("compare(3,3) =>", compare(3,3));

// Task4.2
function factorial(n) {
    n = myTrunc(Number(n));
    if (isNaN(n) || n < 0) return null;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}
console.log("// Task4.2");
console.log("factorial(5) =>", factorial(5));

// Task4.3
function timeToSeconds(hours, minutes, seconds) {
    hours = myTrunc(Number(hours) || 0);
    minutes = myTrunc(Number(minutes) || 0);
    seconds = myTrunc(Number(seconds) || 0);
    return hours * 3600 + minutes * 60 + seconds;
}
console.log("// Task4.3");
console.log("timeToSeconds(1,2,3) =>", timeToSeconds(1,2,3));

// Task4.4
function secondsToHHMMSS(totalSeconds) {
    totalSeconds = myTrunc(Number(totalSeconds) || 0);
    if (totalSeconds < 0) totalSeconds = 0;
    const hours = myTrunc(totalSeconds / 3600);
    const minutes = myTrunc((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return pad2(hours) + ":" + pad2(minutes) + ":" + pad2(seconds);
}
console.log("// Task4.4");
console.log("secondsToHHMMSS(3723) =>", secondsToHHMMSS(3723));

// Task4.5
function sumAll() {
    let s = 0;
    for (let i = 0; i < arguments.length; i++) {
        s += Number(arguments[i]) || 0;
    }
    return s;
}
console.log("// Task4.5");
console.log("sumAll(1,2,3,4) =>", sumAll(1,2,3,4));
console.log("sumAll(5,'6','a') =>", sumAll(5,'6','a'));