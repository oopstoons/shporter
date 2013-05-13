fl.runScript(fl.configURI + "Shporter/png_exporter.jsfl");
fl.runScript(fl.configURI + "Shporter/logger.jsfl");

init();

function init(){
	Logger.log(">>> Export timline elements to PNGs: ");
	
	var exporter = new PNGExporter();
	
	var doc = fl.getDocumentDOM();
	var selected = doc.selection.slice();
	
	for(var i = 0; i < selected.length; i++){
		var element = selected[i];
		exporter.exportElement(element, element.name);
	}
	
	Logger.trace();
}