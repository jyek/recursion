// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (json) {	
	
	var value;  			// Place holder for the value function.
	var at = 0;     	// The index of the current character
	var ch = ' ';     /* The current character. Initial value is whitespace 
										 	 so that white() will extract the next non-whitespace character */
	var text = json;	// JSON to be parsed
	var escapee = {
		'"':  '"',
		'\\': '\\',
		'/':  '/',
		b:    'b',
		f:    '\f',
		n:    '\n',
		r:    '\r',
		t:    '\t'
	};

	var error = function (m) {
		// Call error when something is wrong.
		throw {
		   name: 'SyntaxError',
		   message: m,
		   at: at,
		   text: text
		};
	};

	var next = function (c) {
		// If a c parameter is provided, verify that it matches the current character.
		if (c && c !== ch) {
		   error("Expected '" + c + "' instead of '" + ch + "'");
		}

		// Get the next character. When there are no more characters,
		// return the empty string.
		ch = text.charAt(at);
		at += 1;
		return ch;
	};

	var number = function () {
		// Parse a number value.
	  var number;
	  var string = '';

		if (ch === '-') {
			string = '-';
			next('-');
		}
		while (ch >= '0' && ch <= '9') {
		  string += ch;
		  next();
		}
	  if (ch === '.') {
      string += '.';
      while (next() && ch >= '0' && ch <= '9') {
        string += ch;
      }
	  }
	  if (ch === 'e' || ch === 'E') {
			string += ch;
      next();
	    if (ch === '-' || ch === '+') {
        string += ch;
        next();
	    }
	    while (ch >= '0' && ch <= '9') {
	      string += ch;
	      next();
	    }
	  }
	  number = +string;
	  if (isNaN(number)) {
	    error("Bad number");
	  } else {
	   	return number;
	  }
	};

	var string = function () {
		// Parse a string value.
		var hex;
		var i;
		var string = '';
		var uffff;

		// When parsing for string values, we must look for " and \ characters.
		if (ch === '"') {
			while (next()) {
				if (ch === '"') {
				  next();
				  return string;
				} else if (ch === '\\') {
			 		next();
			  	if (ch === 'u') {
			      uffff = 0;
			      for (i = 0; i < 4; i += 1) {
			      	hex = parseInt(next(), 16);
		          if (!isFinite(hex)) {
		            break;
		          }
							uffff = uffff * 16 + hex;
			  		}
				    string += String.fromCharCode(uffff);
				  } else if (typeof escapee[ch] === 'string') {
				    string += escapee[ch];
				  } else {
						break;
				  }
			  } else {
			    string += ch;
			  }
			}
	   }
	   error("Bad string");
	};

	var white = function () {
		// Skip whitespace.
		while (ch && ch <= ' ') {
			next();
		}
	};

	var word = function () {
		// true, false, or null.
		switch (ch) {
			case 't':
				next('t');
				next('r');
				next('u');
				next('e');
				return true;
			case 'f':
				next('f');
				next('a');
				next('l');
				next('s');
				next('e');
				return false;
			case 'n':
				next('n');
				next('u');
				next('l');
				next('l');
				return null;
		}
		error("Unexpected '" + ch + "'");
	};

	var array = function () {
		// Parse an array value.
		var array = [];

		if (ch === '[') {
		   next('[');
		   white();
		   if (ch === ']') {
		     next(']');
		     return array;   // empty array
		   }
		   while (ch) {
		     array.push(value());
	       white();
	       if (ch === ']') {
	           next(']');
	           return array;
	       }
	       next(',');
	       white();
		  }
		}
		error("Bad array");
	};

	var object = function () {
		// Parse an object value.
		var key, object = {};

		if (ch === '{') {
		  next('{');
		  white();
		  if (ch === '}') {
		    next('}');
		    return object;   // empty object
		  }
		  while (ch) {
		    key = string();
		    white();
		    next(':');
		    object[key] = value();
		    white();
		    if (ch === '}') {
		      next('}');
		      return object;
		    }
		    next(',');
		    white();
		  }
		}
		error("Bad object");
	};

	value = function () {
		// Parse a JSON value. It could be an object, an array, a string, a number,
		// or a word.
		white();	// reads the first non-whitespace character
		switch (ch) {
		case '{':
		  return object();
		case '[':
		  return array();
		case '"':
		  return string();
		case '-':
		  return number();	// handles negative numbers
		default:
			// handles positive numbers or true, false, null
		  return ch >= '0' && ch <= '9' ? number() : word();
		}
	};

	// read in JSON value
	var result = value()
	
	// check that there is no invalid syntax at end of string (i.e. only whitespaces allowed)
	white();
	if (ch) {
	   error("Syntax error");
	}

  return result;
};