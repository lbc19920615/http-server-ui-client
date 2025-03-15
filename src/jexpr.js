import {parse, EvalAstFactory} from "jexpr";


// An EvalAstFactory produces an AST that can be evaluated
const astFactory = new EvalAstFactory();

export function getAll(ast, type = "ID") {
    let ids = [];
    function  travel(v) {
        if (v.type === type) {
            ids.push(v);
        }
        else {
            if (v.left) {
                travel(v.left, type);
            }
            if (v.right) {
                travel(v.right, type);
            }
        }
    }
    travel(ast);
    console.log(ids);
    return ids;
}

export function getExprAst(code) {
    return  parse(code, astFactory);
}


export function runExpr(code = '', data = {}) {
    // parse() returns the AST
    let expr = parse(code, astFactory);
    let result = expr.evaluate(data);
    expr = null
    return result  
}
