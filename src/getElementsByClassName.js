// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But in stead we're going to implement it from scratch:
var getElementsByClassName = function (className) {
	var arr = [];
	var searchNode = function (node) {
		// check if node contains target class
		var containsTargetClass = false;
		if (typeof node.classList !== 'undefined'){
			for (var i = 0; i < node.classList.length; i++){
				if ( node.classList[i] === className ){
					containsTargetClass = true;
				}
			}
		}
		
		if (containsTargetClass){
			// if node is of target class, add to output
			arr.push(node);
		} else {
			// otherwise, search child nodes
			var children = node.childNodes;
			for (var i = 0; i < children.length; i++){
				searchNode(children[i]);
			}
		}
	}
	searchNode(document.body);
	return arr;
};