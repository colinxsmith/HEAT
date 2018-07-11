//var testex = require("./nbind");
var safeqp=10;
export function tests() {
    return 'Inside safeqp';
}

console.log(safeqp);
/*var a = [1.0, 2.0, 3.0, 4.0], b = [1, 1, 1, 1];
var dot = opt(a.length, a, b);
console.log(dot);
console.log(b);
console.log(Return_Message(6));
console.log(version());
var idot = iopt(b.length, b, b);
console.log(idot);
console.log(b);*/
export {safeqp};