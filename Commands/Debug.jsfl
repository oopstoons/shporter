fl.runScript(fl.configURI + "Spriter/math.jsfl");

init();

function init(){
	var doc = fl.getDocumentDOM();
	var out = "";
	var selected = doc.selection.slice();
	
	for(var i = 0; i < selected.length; i++){
		var element = selected[i];
		if (element.elementType == "instance" && element.instanceType == "symbol"){
			var matrix = element.matrix;
			
			out += "========== " + element.name + " : " + element.libraryItem.name + "\r";
			out += "matrix: a=" + MathUtil.round(matrix.a, .001) + " b=" + MathUtil.round(matrix.b, .001) + " c=" + MathUtil.round(matrix.c, .001) + " d=" + MathUtil.round(matrix.d, .001) + "\r";
			out += "scale: x=" + MathUtil.round(element.scaleX, .001) + " y=" + MathUtil.round(element.scaleY, .001) + "\r";
			out += "angle: r=" + MathUtil.round(element.rotation, .001) + "\r";
			out += "skew:  x=" + Math.round(element.skewX) + " y=" + Math.round(element.skewY) + "\r";
			
			var scaleX = matrix.a >= 0 ? element.scaleX : -element.scaleX;
			var scaleY = matrix.d >= 0 ? element.scaleY : -element.scaleY;
			var angle = 0;
			if (isNaN(element.rotation)){
				angle = element.skewX;
			} else {
				angle = element.rotation;
			}
			if (scaleX < 0 || scaleY < 0){
				angle = angle - 180;
			}
			
			out += "scale: x=" + MathUtil.round(scaleX, .001) + " y=" + MathUtil.round(scaleY, .001) + "\r";
			out += "scale: x=" + Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b) + " y=" + Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d) + "\r";
			out += "angle: a=" + MathUtil.round(angle, .001) + "\r";
		}
	}
	
	if (out){
		alert(out);
	}
}