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
  = Assignment
  / MathematicalExpression
  / IfStatement
  / IOStatement


  
IfStatement
  = IfToken _ condition:Condition _ ThenToken __
    consequent:Statements __
    ElseToken __ alternate:Statements __
    EndToken __ IfToken EOS? {
      return {
        "type": "ifstatement",
        "condition": condition,
        "consequent": consequent,
        "alternate": alternate
      }
    }
    / IfToken _ condition:Condition _ ThenToken __
    consequent:Statements __
    EndToken _ IfToken EOS? {
      return {
        "type": "ifstatement",
        "condition": condition,
        "consequent": consequent,
        "alternate": null
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
  = right:SimpleCondition __ token:LogicalToken __ left:SimpleCondition {
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
  = OutputToken __ value:Value {
  	return {
    	type: "outputstatement",
        value
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
  = __ symbol:Symbol __ EqualToken __ value:Value  {
    return {
        "type": "assignment",
        "into": symbol,
        "value": value
    }    
  }
  
MathematicalExpression
  = AdditiveExpression / MultiplicativeExpression
  
AdditiveExpression
  = head:MultiplicativeExpression tail:(__ ("+" / "-") __ MultiplicativeExpression)* {
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
  / ArrayAccessExpression
  / Symbol
  

/*
Mod
  = left:MathematicalValue __ ModuloToken __ right:MathematicalValue {
  	return {
    	type: "quotient",
        left,
        right
    }
  }
  
Quotient
  = left:MathematicalValue __ QuotientToken __ right:MathematicalValue {
  	return {
    	type: "remainder",
        left,
        right
    }
  }
  
MathematicalValue
  = Integer
  / Symbol
*/

Value
  = Array
  / ArrayAccessExpression
  / Symbol
  / MathematicalExpression
  / Integer
  / String

Symbol "Symbol"
  = name:[A-Z]+ {
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
    
ArrayAccessExpression "ArrayAccessExpression"
  = symbol:Symbol __ "[" __ index:MathematicalExpression __ "]" {
  	return {
		type: "arrayaccess",
        symbol,
        index
	}
  }
    
SingleStringCharacter
 = !("'" / "\\" / LineTerminator) SourceCharacter { return text(); }
 
DoubleStringCharacter
 = !('"' / "\\" / LineTerminator) SourceCharacter { return text(); }


Program
  = statements:Statements? __ {
    return {
        type: "program",
        statements: statements || []
    }
  }

Statements
  = head:Statement tail:(__ Statement)* {
    return [head].concat(tail.map(element => element[1]));
  }