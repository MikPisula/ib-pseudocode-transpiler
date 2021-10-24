start
  = Program


SourceCharacter
  = .

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  
LineTerminator
  = [\n\r\u2028\u2029]
  
LineTerminatorSequence "LineTerminatorSequence"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"
  
__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

_ 
  = (WhiteSpace)*

Comment "Comment"
  = SingleLineComment 

SingleLineComment
  = "//" (!LineTerminator SourceCharacter)* EOF?
  
EOS
  = _ SingleLineComment? LineTerminatorSequence
  / __ EOF

EOF
  = !.

  
IfToken = "if"
ThenToken = "then"
ElseToken = "else"
EndToken = "end"

OutputToken = "output"
InputToken = "input"

WhileToken = "while"
LoopToken = "loop"
FromToken = "from"
ToToken = "to"
UntilToken = "until"

EqualToken = "="
GreaterThanToken = ">" 
LessThanToken = "<"
LessThanEqualToken = "<="
GreaterThanEqualToken = ">="
NotEqualToken = "!="

AndToken = "AND" // idiotyzm
OrToken = "OR"
NotToken = "NOT"

ModuloToken = "mod"
QuotientToken = "div"

Statement
  = ArrayAssignment
  / Assignment
  / PostfixOperation
  / MathematicalExpression
  / IfStatement
  / WhileStatement
  / IOStatement


WhileStatement
  = LoopToken _ WhileToken _ condition:Condition __
    statements: Statements __
    EndToken __ LoopToken {
  	  return {
      	type: "loopwhile",
        condition,
        statements
      }
    }
    / LoopToken _ symbol:Symbol _ FromToken _ from:Factor _ ToToken _ to:Factor __
    statements: Statements __
    EndToken __ LoopToken {
      return {
      	type: "loopfromto",
        symbol,
        from,
        to,
        statements
      }
    }
    / LoopToken _ UntilToken _ condition:Condition __
    statements: Statements __
    EndToken __ LoopToken {
  	  return {
      	type: "loopuntil",
        condition,
        statements
      }
    }

// removed the EOS? btw
IfStatement
  = IfToken _ condition:Condition _ ThenToken __
    consequent:Statements __
   	conditional_alternate:(ElseToken _ IfToken _ Condition _ ThenToken __ Statements __)*
    ElseToken __ alternate:Statements __
    EndToken __ IfToken {
      return {
        type: "ifstatement",
        condition,
        consequent,
        conditional_alternate: conditional_alternate.map(v => {
			return {
            	condition: v[4],
                consequent: v[8],
                alternate: [],
                conditional_alternate: []
            }
		}),
        alternate
      }
    }
    / IfToken _ condition:Condition _ ThenToken __
    consequent:Statements __
	conditional_alternate:(ElseToken _ IfToken _ Condition _ ThenToken __ Statements __)*
    EndToken _ IfToken {
      return {
        type: "ifstatement",
        condition,
        consequent,
        conditional_alternate: conditional_alternate.map(v => {
			return {
            	condition: v[4],
                consequent: v[8],
                alternate: [],
                conditional_alternate: []
            }
		}),
        alternate: null
      }
    }


Condition
  = LogicalCondition
  / SimpleCondition

//this is kinda wrong but eh

SimpleCondition "Condition"
  = negation:NotToken? left:Value __ token:ConditionToken __ right:Value {
	  let negate = negation !== undefined ? false : true
      return {
          type: "condition",
          token,
          negation: negate,
          left,
          right
      }
  }

ConditionToken
  = EqualToken
  / NotEqualToken
  / LessThanEqualToken
  / GreaterThanEqualToken
  / GreaterThanToken
  / LessThanToken


  
LogicalCondition "LogicalCondition"
  = left:SimpleCondition __ token:LogicalToken __ right:SimpleCondition {
	return {
    	type: "logicalcondition",
        token,
        right,
        left
    }
  }

LogicalToken
  = AndToken
  / OrToken

    
OutputStatement
  = OutputToken __ head:Value tail:(__ "," __ Value)* {
  	return {
    	type: "outputstatement",
        values: [head].concat(tail.map(v => v[3]))
	}
  }

InputStatement
  = InputToken __ symbol:Symbol {
    return {
    	type: "inputstatement",
        symbol,
    }
  }
  
IOStatement
  = OutputStatement
  / InputStatement

Assignment
  = symbol:Symbol __ EqualToken __ value:Value  {
    return {
        "type": "assignment",
        "into": symbol,
        "value": value
    }    
  }
  
ArrayAssignment
  = symbol:Symbol __ "[" __ index:MathematicalExpression __ "]" __ EqualToken __ value:Value {
  	return {
    	type: "arrayassignment",
        symbol,
        index,
        value
    }
  }
  
  
MathematicalExpression
  = AdditiveExpression / MultiplicativeExpression
  
Modulo
  = left:Factor __ ModuloToken __ right:Factor {
  	return {
    	type: "modulo",
        left,
        right
    }
  }
  
Quotient
  = left:Factor __ QuotientToken __ right:Factor {
  	return {
    	type: "quotient",
        left,
        right
    }
  }
  
  
AdditiveExpression
  = head:Term tail:(__ ("+" / "-") __ Term)* {
    return {
      	type: "additiveexpression",
        terms: [head].concat(tail.map(v => {
			return {
            	type: "operation",
            	operator: v[1],
                value: v[3]
            }
		}))
    }
  }

Term
  = Modulo / Quotient / MultiplicativeExpression

MultiplicativeExpression
  = head:Factor tail:(__ ("*" / "/") __ Factor)* {
    return {
      	type: "multiplicativeexpression",
        factors: [head].concat(tail.map(v => {
			return {
            	type: "operation",
            	operator: v[1],
                value: v[3]
            }
		}))
    }
  }
    
Factor
  = "(" __ expr:MathematicalExpression __ ")" { return expr; }
  / Integer
  / ArrayAccess
  / Symbol
  

Value
  = Array
  / PostfixOperation
  / MathematicalExpression
  / ArrayAccess
  / Symbol
  / Integer
  / String

Symbol "Symbol"
  = name:[A-Z_0-9]+ {
    return {
    	type: "symbol",
    	name: name.join("")
    }
  }

Integer "Integer"
  = [0-9]+ {
    return { type: "integer", value: parseInt(text(), 10) }
  }
  
String "String"
  = '"' chars:DoubleStringCharacter* '"' {
      return { type: "string", value: chars.join("") };
    }
  / "'" chars:SingleStringCharacter* "'" {
      return { type: "string", value: chars.join("") };
    }
    
Array "Array"
  = "[" __ elements:ElementList? __ "]" {
    return {
      type: "array",
      elements: elements || []
    };
  }

ElementList
  = head:(
      element:Value {
        return element;
      }
    )
    tail:(
      __ "," __ element:Value {
        return element;
      }
    )* { return [].concat(head, tail); }
    
ArrayAccess "ArrayAccess"
  = symbol:Symbol __ "[" __ index:MathematicalExpression __ "]" {
  	return {
		type: "arrayaccess",
        symbol,
        index
	}
  }
  
PostfixOperation "PostfixOperation"
  = symbol:Symbol __ operator:PostfixOperator {
  	return {
    	type: "postfixoperation",
        symbol: symbol,
        operator: operator
    }
  }
  
PostfixOperator "PostfixOperator"
  = operator:("--" / "++") { return operator }
    
SingleStringCharacter
 = !("'" / "\\" / LineTerminator) SourceCharacter { return text(); }
 
DoubleStringCharacter
 = !('"' / "\\" / LineTerminator) SourceCharacter { return text(); }


Program
  = __ statements:Statements? __ {
    return {
        type: "program",
        statements: statements || []
    }
  }

Statements
  = head:Statement tail:(__ Statement)* {
    return [head].concat(tail.map(element => element[1]));
  }