/**
 * Debug contains debugging utils for Flash.
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 * @see https://github.com/oopstoons/shporter
 */
var Debug = {

	//-----------------------------------------------------------------------------------------------------------------------------
	// PROPERTIES
	
	/** Max dump levels. */
	dumpMaxLevels:3,
	
	/** Trace dumps or not. */
	traceDump:true,

	//-----------------------------------------------------------------------------------------------------------------------------
	// DUMP METHOD

	/**
	 * Traces the contents of objects in a human readable format.
	 */
	dump:function(obj, name) {
		var out = this._dump(obj);
		out = out.search(/[\r\n]/g) >= 0 ? "{\r" + out + "\r}" : out;
		out = name ? name + ": " + out : out;
		if (this.traceDump){
			fl.trace(out);
		}
		return out;
	},

	/**
	 * Dumps the contents of objects in a human readable format.
	 * @see http://www.openjs.com/scripts/others/dump_function_php_print_r.php
	 */
	_dump:function(obj, level) {
		var output = "";
		if(!level) level = 1;

		// line padding
		var padding = "";
		for(var j = 1; j <= level; j++) padding += "    ";
			
		// complex objects
		if (typeof(obj) == 'object' && obj != null) {
			for(var item in obj) {

				// catch errors and unreadable properties
				//fl.trace("> :item  " +level+" " +padding+item);
				var error = false;
				if (item == "brightness" || item == "tintColor" || item == "tintPercent" || item == "toolObjs" || item == "activeTool" || item == "screenTypes"){
					error = true;
				} else {
					try{
						var value = obj[item];
					} catch (e) {
						error = true;
					}
				}
				
				// log different types of objects
				if (error){
					output = padding + item + " => <Unable to Read>\n";
					
				} else if(value == null) {
					output += padding + item + " => null\n";
					
				} else if(typeof(value) == 'function') {
					output += padding + item + " => function()\n";
					
				} else if(typeof(value) == 'object') {
					if (level > this.dumpMaxLevels - 1){
						output += padding + item + " ... <Max Depth Reached>\n";
					} else {
						output += padding + item + " ...\n";
						output += this._dump(value, level + 1);
					}
						
				} else if(typeof(value) == 'string' && value.search(/[\r\n]/g) > -1) {
					output += padding + item + " => <Multilined String>\n";
					
				} else {
					output += padding + item + " => " + value + "\n";
				}
			}
			
		// simple objects
		} else {
			output = obj != null ? obj : "null";
		}
			
		return output;
	}
}