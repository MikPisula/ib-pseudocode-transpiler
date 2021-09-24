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
  / IfStatement
  / OutputStatement


  
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
    	"type": "outputstatement",
        "value": value
	}
  }

Assignment
  = __ symbol:Symbol __ EqualToken __ value:Value  {
    return {
        "type": "assignment",
        "into": symbol,
        "value": value
    }    
  }
  
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
  
MathematicalOperation
 = Mod / Quotient
    
Value
  = MathematicalOperation
  / Symbol
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
  = [0-9]+ { return parseInt(text(), 10); }
  
String "String"
  = '"' chars:DoubleStringCharacter* '"' {
      return { type: "string", value: chars.join("") };
    }
  / "'" chars:SingleStringCharacter* "'" {
      return { type: "string", value: chars.join("") };
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