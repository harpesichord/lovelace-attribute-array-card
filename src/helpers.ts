export const operators = {
    '<': function(a, b): boolean { return a < b; },
    '>': function(a, b): boolean { return a > b; },
    '<=': function(a, b): boolean { return a <= b; },
    '>=': function(a, b): boolean { return a >= b; },
    '==': function(a, b): boolean { return a == b; },
    '!=': function(a, b): boolean { return a != b; },
};