fl.outputPanel.clear();
fl.trace(">>> Export to Spriter: ");
fl.runScript(fl.configURI + "Spriter/spriter_exporter.jsfl");

var exporter = new SpriterExporter();
exporter.pngExporter.onElementPrep = test;
exporter.exportImages = false;
exporter.exportMainTimeline();

//exporter.pngExporter.exportElement("simple", "doobie");
//exporter.pngExporter.exportLibraryItem("c1 animation/_graphics/baby1 head", "doops");
//exporter.pngExporter.exportStage("donkey");

function test(instance){
}


//var originPath = fl.getDocumentDOM().pathURI
//var folder = originPath.replace(/[^.\/]+.fla/, "");
//fl.trace("originPath: "+originPath);
//fl.trace("folder: "+folder);

//Debug.dump(fl.getDocumentDOM());