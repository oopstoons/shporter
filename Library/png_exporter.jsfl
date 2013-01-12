/**
 * PNGExporter allows you to export a library item, timeline element or the main stage as a PNG.
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 * @see http://abitofcode.com/2011/11/export-flash-library-items-as-pngs-with-jsfl/
 *
 * May have to load in: fl.configURI + 'Javascript/ObjectFindAndSelect.jsfl'.
 * Uses reported size (width/height) to position items for cropping so unreported size (filters, stroke width) may get clipped.
 */
function PNGExporter(doc, savePath) {
	this.constructer(doc, savePath);
}

PNGExporter.prototype = {

	//-----------------------------------------------------------------------------------------------------------------------------
	// PROPERTIES
	
	/** The origin document. */
	originDoc:"",
	
	/** The origin document folder. */
	originPath:"",
	
	/** The save PNG path. */
	savePath:"",
	
	/** The export document. */
	exportdoc:"",
	
	/** Callback on element preparation. */
	onElementPrep:null,
	
	/** Callback on temp doc preparation. */
	onStagePrep:null,

	//-----------------------------------------------------------------------------------------------------------------------------
	// CONSTRUCTER METHOD
	
	constructer:function(doc, savePath) {
		fl.trace("PNGExporter: "+doc);
		this.originDoc = doc;
		this.originPath = this.originDoc.pathURI.replace(/[^.\/]+\.fla/, "");
		this.savePath = savePath ? savePath : this.originPath;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// EXPORT METHODS
	
	/**
	 * Export a library item as a png.
	 */
	exportLibraryItem: function(libraryName, fileName, frameNum) {
		// checks if item exists in library
		var exists = this.originDoc.library.selectItem(libraryName, true);
		if (!exists) {
			alert('Item named "' + libraryName + '" not found in the library!');
			return null;
		}
		
		// create temp scene to add item to, cut the item and kill the temp scene
		this.originDoc.addNewScene("__temp__");
		var selectedItems = this.originDoc.library.getSelectedItems();
		var success = this.originDoc.library.addItemToDocument({x:0, y:0}, libraryName);
		this.originDoc.clipCut();
		this.originDoc.deleteScene();

		// create new export doc
		fl.createDocument();
		this.exportdoc = fl.getDocumentDOM();

		// pastes the clipboard item and choose frame
		this.exportdoc.clipPaste();
		var selectedElement = this.exportdoc.selection[0];
		selectedElement.symbolType = 'graphic';
		selectedElement.firstFrame = frameNum ? frameNum : 0;
		
		// prep the element
		var data = this.prepElement(selectedElement);

		// export png
		this.saveStage(fileName);
		
		// return item data
		return data;
	},

	/**
	 * Export an element item as a png.
	 */
	exportElement: function(elementName, fileName) {
		// find object
		this.originDoc.selectNone();
		var results = flash.findObjectInDocByName(elementName, this.originDoc);
		if (results.length > 0)	{
			fl.selectElement(results[0], false);
			fl.getDocumentDOM().clipCopy();
		} else {
			alert('Element named "' + elementName + '" not found on main timeline!');
			return null;
		}

		// create new export doc
		fl.createDocument();
		this.exportdoc = fl.getDocumentDOM();

		// pastes the clipboard item
		this.exportdoc.clipPaste();
		var selectedElement = this.exportdoc.selection[0];
		
		// prep the element
		var data = this.prepElement(selectedElement);

		// export png
		this.saveStage(fileName);
		
		// return item data
		return data;
	},

	/**
	 * Export the stage as a png.
	 */
	exportStage: function(fileName) {
		// this doc is the export doc
		this.exportdoc = fl.getDocumentDOM();
		
		// save a copy of the doc and save the image
		this.saveStage(fileName);
		
		// open the original doc
		fl.openDocument(this.originDoc.pathURI)
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// SAVE METHODS
	
	/**
	 * Export the stage as a png.
	 */
	saveStage: function(fileName) {
		// save doc temporarily
		var exportPath = this.savePath + "/__DELETE_ME__.fla";
		fl.saveDocument(fl.getDocumentDOM(), exportPath);
		
		// export the profile and read it in
		var profilePath = fl.configURI + 'Publish%20Profiles/__DELETE_ME__.xml';
		this.exportdoc.exportPublishProfile(profilePath);
		xml = FLfile.read(profilePath);
			
		// node replacement
		var nodeReplace = [["flash", "0"], ["png", "1"], ["defaultNames", "0"], ["pngDefaultName", "0"], ["pngFileName", fileName + ".png"], ["MatchMovieDim", "1"], ["html", "0"]];
		for (var i = 0; i < nodeReplace.length; i++){
			var nodeName = nodeReplace[i][0];
			var nodeValue = nodeReplace[i][1];
			from = xml.indexOf("<" + nodeName + ">");
			to = xml.indexOf("</" + nodeName + ">");
			delta = xml.substring(from, to);
			xml = xml.split(delta).join("<" + nodeName + ">" + nodeValue);
		}
		
		// write the modified profile and import it
		FLfile.write(profilePath, xml);
		this.exportdoc.importPublishProfile(profilePath);
		
		// pre export callback
		if (this.onStagePrep){
			this.onStagePrep(this.exportdoc);
		}

		// publish the doc
		fl.trace("PNGExporter.export: " + this.savePath + "/" + fileName + ".png");
		this.exportdoc.publish();

		// delete the publish profile xml and export doc
		FLfile.remove(profilePath);
		this.exportdoc.close(false);
		FLfile.remove(exportPath);
		// BUG temp export doc will not delete if called from exportStage
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// PRIVATE METHODS
	
	/**
	 * Export an element item as a png.
	 */
	prepElement: function(selectedElement) {
		// pre export callback
		if (this.onElementPrep){
			this.onElementPrep(selectedElement);
		}

		// crop stage to item bounds
		this.exportdoc.selectAll();
		this.exportdoc.width = Math.ceil(selectedElement.width);
		this.exportdoc.height = Math.ceil(selectedElement.height);
		this.exportdoc.moveSelectionBy({x:-selectedElement.left, y:-selectedElement.top});
		
		// BUG Uses reported size (width/height) to position items for cropping so unreported size (filters, stroke width) may get clipped.
		/*
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
		
		// get item data
		var data = {};
		data.width = selectedElement.width;
		data.height = selectedElement.height;
		data.registrationX = selectedElement.x;
		data.registrationY = selectedElement.y;
		
		// return item data
		return data;
	}
}