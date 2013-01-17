fl.runScript(fl.configURI + "Spriter/png_exporter.jsfl");
fl.runScript(fl.configURI + "Spriter/logger.jsfl");

init();

function init(){
	Logger.log(">>> Export library items to PNGs: ");
	
	var exporter = new PNGExporter();
	
	var doc = fl.getDocumentDOM();
	var selected = doc.library.getSelectedItems();
	
	for(var i = 0; i < selected.length; i++){
		var item = selected[i];
		var fileName = item.name.replace(/^(.+\/)/igm, "").replace(/\W+/ig, "_");
		exporter.exportItem(item, item.name);
	}
	
	Logger.trace();
}