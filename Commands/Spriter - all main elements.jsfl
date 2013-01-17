fl.outputPanel.clear();
fl.trace(">>> Export Timeline to Spriter: ");
fl.runScript(fl.configURI + "Spriter/spriter_exporter.jsfl");

var exporter = new SpriterExporter();
exporter.exportMainTimeline();