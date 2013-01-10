fl.runScript(fl.configURI + "Spriter/spriter_exporter.jsfl");

var exporter = new SpriterExporter();
exporter.pngExporter.onElementPrep = test;
//exporter.exportImages = false;
exporter.exportMainTimeline();

//exporter.pngExporter.exportElement("test", "doobie");
//exporter.pngExporter.exportStage("donkey");

function test(instance){
}