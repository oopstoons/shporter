fl.runScript(fl.configURI + "Shporter/logger.jsfl");
fl.runScript(fl.configURI + "Shporter/spriter_exporter.jsfl");

init();

function init(){
	Logger.log(">>> Export all elements on main timeline to Spriter: ");

	var exporter = new SpriterExporter();
	exporter.exportMainTimeline();
	
	Logger.trace();
}