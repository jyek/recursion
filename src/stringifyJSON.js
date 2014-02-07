// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to have to write it from scratch:
var stringifyJSON = function (obj) {
	memo = '';
	if (typeof obj === 'object'){
		if (obj instanceof Array) {
			// handles array
			memo += '[';
			for (var i = 0; i < obj.length; i++){
				if (i !== 0){
					memo += ',';
				}
				memo += stringifyJSON(obj[i]);
			}
			memo += ']';
		} else if (obj === null) {
			// handles null
			memo += 'null'
		} else {
			// handles object			
			memo += '{';
			var firstKey = true;
			for (key in obj){
				if (typeof obj[key] === 'function' || typeof obj[key] === 'undefined'){
					// skips values that are functions or undefined
				} else {
					// otherwise, continue				
					if (firstKey){
						firstKey = false;
					} else {
						memo += ',';
					}
					memo += '"' + key + '":';
					memo += stringifyJSON(obj[key]);
				}
			}			
			memo += '}';
		}
	} else if (typeof obj === 'function'){
		// handles function
		if (memo === ''){
			return undefined;
		} else {
			memo += 'null';
		}
	}
	else {
		if (typeof obj === 'string'){
			// handles string		
			memo += '"' + addSlashes(obj) + '"';
		} else if (typeof obj === 'undefined'){
			// handles null
			memo += 'null';
		}
		else {
			// handles numbers, booleans and everything else
			memo += obj;
		}
	}
	return memo;
};

/* Escapes special characters in string */
var addSlashes = function(str){
	return str.replace(/\\/g, "\\\\") // \ --> '\\'
					 .replace(/\n/g, "\\n")	  // \n --> '\n'
				   .replace(/\"/g, '\\"')		// " --> '\"'
				   .replace(/\r/g, "\\r")		// \r --> '\r'
				   .replace(/\t/g, "\\t");	// \t --> '\t'
};