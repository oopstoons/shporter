fl.outputPanel.clear();
fl.trace(">>> Export to Spriter: ");
fl.runScript(fl.configURI + "Spriter/spriter_exporter.jsfl");
fl.runScript(fl.configURI + "Spriter/debug.jsfl");

var exporter = new SpriterExporter();
exporter.pngExporter.onElementPrep = test;
exporter.exportImages = false;
//exporter.exportMainTimeline();

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

init();

function init(){
	var doc = fl.getDocumentDOM();
	
	
	//doc.exitEditMode();
	//doc.mouseClick({x:328, y:181.5}, false, true);
	//doc.enterEditMode('inPlace');
	
	doc.selectAll();
	var selected = doc.selection.slice();
	//doc.exitEditMode();
	fl.trace("########################################");
	fl.trace("selected:" + selected);
	fl.trace("selection:" + doc.selection);
	fl.trace("########################################");

	
	for(var i = 0; i < selected.length; i++){
		var element = selected[i];
		fl.trace("================ " + element.name + " " + element);
		fl.trace("bounds: l=" + element.objectSpaceBounds.left + " r=" + element.objectSpaceBounds.right);
		fl.trace("w: reported=" + element.width + " bounds=" + (element.objectSpaceBounds.right - element.objectSpaceBounds.left));
		
		fl.trace(element.timeline);
		
		fl.trace(1);
		doc.selectNone();
		fl.trace(2);
		fl.selectElement(element, false);
		fl.trace(3);
		doc.clipCopy();
		fl.trace(4);
		
		//exporter.pngExporter.exportElement(element, element.name);
		
		
		
		//doc.selectAll();
		fl.trace("selected:" + selected);
		fl.trace("selection:" + doc.selection);
	}
}
/*

    left => -25
    top => -25
    width => 50
    height => 50
    x => 0
    y => 0
    transformX => 0
    transformY => 0
    scaleX => 1
    scaleY => 1
    skewX => 0
    skewY => 0
    rotation => 0
    objectSpaceBounds ...
        left => -26.999
        top => -26.999
        right => 27
        bottom => 27
    duration => 0
    framerate => 0
	
	
	
    left => -143.55
    top => -212.55
    width => 81
    height => 81
    x => -143.55
    y => -212.55
    objectSpaceBounds ...
        left => -9.299
        top => -9.299
        right => 133.05
        bottom => 90.3
		*/