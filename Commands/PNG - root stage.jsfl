fl.runScript(fl.configURI + "Shporter/png_exporter.jsfl");
fl.runScript(fl.configURI + "Shporter/logger.jsfl");

init();

function init(){
	Logger.log(">>> Export root stage to PNGs: ");
	
	var exporter = new PNGExporter();
	exporter.exportStage();
	
	Logger.trace();
}