import {parse, EvalAstFactory} from "jexpr";


// An EvalAstFactory produces an AST that can be evaluated
const astFactory = new EvalAstFactory();



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
