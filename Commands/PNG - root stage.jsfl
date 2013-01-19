fl.runScript(fl.configURI + "Spriter/png_exporter.jsfl");
fl.runScript(fl.configURI + "Spriter/logger.jsfl");

init();

function init(){
	Logger.log(">>> Export root stage to PNGs: ");
	
	var exporter = new PNGExporter();
	exporter.exportStage();
	
	Logger.trace();
}