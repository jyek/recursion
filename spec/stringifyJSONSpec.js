// test cases are described in fixtures.js
describe("stringifyJSON", function(){
  it("should match the result of calling JSON.stringify", function(){

    arrayWithValidElements.forEach(function(obj){
      var result = stringifyJSON(obj);
      var expected = JSON.stringify(obj);
      expect(result).toEqual(expected);
    });

    objectWithInvalidAttributes.forEach(function(obj){
      var result = stringifyJSON(obj);
      var expected = JSON.stringify(obj);
      expect(result).toEqual(expected);
    });
  });
});

describe("stringifyJSON", function(){
	it("should match JSON.stringify for extra credit strings", function(){
	  extraCreditStrings.forEach(function(obj){
	    var result = stringifyJSON(obj);
	    var expected = JSON.stringify(obj);
	    expect(result).toEqual(expected);
	  });
	});	
});