fl.runScript(fl.configURI + "Shporter/logger.jsfl");
fl.runScript(fl.configURI + "Shporter/spriter_exporter.jsfl");

init();

function init(){
	Logger.log(">>> Export selected library items to Spriter: ");

	var exporter = new SpriterExporter();
	exporter.exportSelectedItems();
	
	Logger.trace();
}