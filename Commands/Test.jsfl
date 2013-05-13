fl.runScript(fl.configURI + "Shporter/spriter_exporter.jsfl");
fl.runScript(fl.configURI + "Shporter/debug.jsfl");
fl.runScript(fl.configURI + "Shporter/logger.jsfl");

init();

function init(){
	Logger.log(">>> Test: ");
	
	var doc = fl.getDocumentDOM();

	test = function (instance){
	}

	var exporter = new SpriterExporter();
	exporter.pngExporter.onElementPrep = test;
	exporter.exportImages = false;
	exporter.exportMainTimeline();

	
	Logger.trace();
}