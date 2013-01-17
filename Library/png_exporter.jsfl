/**
 * PNGExporter allows you to export a library item, timeline element or the main stage as a PNG.
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 * @see http://abitofcode.com/2011/11/export-flash-library-items-as-pngs-with-jsfl/
 *
 * May have to load in: fl.configURI + 'Javascript/ObjectFindAndSelect.jsfl'.
 */
fl.runScript(fl.configURI + "Spriter/logger.jsfl");

function PNGExporter(doc, outputPath) {
	this.constructer(doc, outputPath);
}

PNGExporter.prototype = {

	//-----------------------------------------------------------------------------------------------------------------------------
	// PROPERTIES
	
	/** The input document. */
	inputDoc:"",
	
	/** The input document path. */
	inputPath:"",
	
	/** The input document file name. */
	inputName:"",
	
	/** The output document. */
	outputDoc:"",
	
	/** The save PNG path. */
	outputPath:"",
	
	/** Callback on element preparation. */
	onElementPrep:null,
	
	/** Callback on temp doc preparation. */
	onStagePrep:null,
	
	/** Logger. */
	//logger:null,

	//-----------------------------------------------------------------------------------------------------------------------------
	// CONSTRUCTER METHOD
	
	constructer:function(doc, outputPath) {
		this.inputDoc = doc ? doc : fl.getDocumentDOM();
		this.inputPath = this.inputDoc.pathURI.replace(/[^.\/]+\.fla/, "");
		this.inputName = this.inputDoc.pathURI.replace(/.+?([^.\/]+)\.fla/, "$1");
		this.outputPath = outputPath ? outputPath : this.inputPath;
		
		//Logger = new Logger();
		Logger.log('PNGExporter: outputPath=' + this.outputPath);
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// EXPORT METHODS
	
	/**
	 * Export a library item by name as a png.
	 */
	exportItemByName: function(itemName, fileName, frameNum) {
		frameNum = frameNum ? frameNum : 0;
		Logger.log('PNGExporter.exportItemByName: itemName="' + itemName + '" fileName=' + fileName + ' frameNum=' + frameNum);
		
		// checks if item exists in library
		var exists = this.inputDoc.library.selectItem(itemName, true);
		if (!exists) {
			var error = 'PNGExporter: Item named "' + itemName + '" not found in the library!';
			alert(error);
			Logger.error(error);
			return null;
		}
		
		// create temp scene to add item to, cut the item and kill the temp scene
		this.inputDoc.exitEditMode();
		this.inputDoc.addNewScene("__DELETE_ME__");
		this.inputDoc.library.addItemToDocument({x:0, y:0}, itemName);
		this.inputDoc.clipCut();
		this.inputDoc.deleteScene();

		// create new output doc
		fl.createDocument();
		this.outputDoc = fl.getDocumentDOM();

		// pastes the clipboard item and choose frame
		this.outputDoc.clipPaste();
		var element = this.outputDoc.selection[0];
		element.symbolType = 'graphic';
		element.firstFrame = frameNum;
		
		// prep the element
		var data = this.prepElement(element);

		// save png
		this.saveStage(fileName);
		
		// return item data
		return data;
	},
	
	/**
	 * Export a library item as a png.
	 */
	exportItem: function(item, fileName, frameNum) {
		frameNum = frameNum ? frameNum : 0;
		Logger.log('PNGExporter.exportItem: item="' + item.name + '":' + item.itemType + ' fileName=' + fileName + ' frameNum=' + frameNum);
		
		// create temp scene to add item to, cut the item and kill the temp scene
		this.inputDoc.library.selectItem(item.name, true);
		this.inputDoc.exitEditMode();
		this.inputDoc.addNewScene("__DELETE_ME__");
		this.inputDoc.library.addItemToDocument({x:0, y:0}, item.name);
		this.inputDoc.clipCut();
		this.inputDoc.deleteScene();

		// create new output doc
		fl.createDocument();
		this.outputDoc = fl.getDocumentDOM();

		// pastes the clipboard item and choose frame
		this.outputDoc.clipPaste();
		var element = this.outputDoc.selection[0];
		element.symbolType = 'graphic';
		element.firstFrame = frameNum;
		
		// prep the element
		var data = this.prepElement(element);

		// save png
		this.saveStage(fileName);
		
		// return item data
		return data;
	},

	/**
	 * Export a timeline element by name as a png. Note, this digs from the main timeline (not the current timeline) until it finds an element with a matching name.
	 */
	exportElementByName: function(elementName, fileName) {
		Logger.log('PNGExporter.outputElementByName: elementName="' + elementName + '" fileName=' + fileName);
		
		// find object
		this.inputDoc.exitEditMode();
		this.inputDoc.selectNone();
		var results = flash.findObjectInDocByName(elementName, this.inputDoc);
		if (results.length > 0)	{
			fl.selectElement(results[0], false);
			this.inputDoc.clipCopy();
		} else {
			var error = 'PNGExporter: Element named "' + elementName + '" not found on timeline!';
			alert(error);
			Logger.error(error);
			return null;
		}

		// create new output doc
		fl.createDocument();
		this.outputDoc = fl.getDocumentDOM();

		// pastes the clipboard item
		this.outputDoc.clipPaste();
		var element = this.outputDoc.selection[0];
		
		// prep the element
		var data = this.prepElement(element);

		// save png
		this.saveStage(fileName);
		
		// return item data
		return data;
	},

	/**
	 * Export a timeline element as a png.
	 */
	exportElement: function(element, fileName) {
		var type = element.elementType == 'instance' ? element.libraryItem.name : element.elementType;
		Logger.log('PNGExporter.outputElement: element="' + element.name + '":' + type + ' fileName=' + fileName);
		
		// select the element and copy it
		this.inputDoc.selectNone();
		this.inputDoc.selection = [element];
		this.inputDoc.clipCopy();
		
		// create new output doc
		fl.createDocument();
		this.outputDoc = fl.getDocumentDOM();

		// pastes the clipboard item
		this.outputDoc.clipPaste();
		var selectedElement = this.outputDoc.selection[0];
		
		// prep the element
		var data = this.prepElement(selectedElement);

		// save png
		this.saveStage(fileName);
		
		// return item data
		return data;
	},

	/**
	 * Export the stage as a png.
	 */
	exportStage: function(fileName) {
		Logger.log('PNGExporter.outputStage: doc=' +  this.inputDoc.pathURI);
		
		// this doc is the output doc
		this.outputDoc = this.inputDoc;
		
		// save a copy of the doc and save the image
		this.saveStage(fileName);
		
		// open the inputal doc
		fl.openDocument(this.inputPath + this.inputName + ".fla")
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// SAVE METHODS
	
	/**
	 * Export the stage as a png.
	 */
	saveStage: function(fileName) {
		// save doc temporarily
		var outputDocPath = this.outputPath + "/__DELETE_ME__.fla";
		fl.saveDocument(fl.getDocumentDOM(), outputDocPath);
		
		// output the profile and read it in
		var profilePath = fl.configURI + 'Publish%20Profiles/__DELETE_ME__.xml';
		this.outputDoc.exportPublishProfile(profilePath);
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
		this.outputDoc.importPublishProfile(profilePath);
		
		// pre output callback
		if (this.onStagePrep){
			this.onStagePrep(this.outputDoc);
		}

		// publish the doc
		Logger.log('PNGExporter.output: ' + this.outputPath + "/" + fileName + ".png");
		this.outputDoc.publish();

		// delete the publish profile xml and output doc
		FLfile.remove(profilePath);
		this.outputDoc.close(false);
		FLfile.remove(outputDocPath);
		// BUG temp output doc will not delete if called from exportStage
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// PRIVATE METHODS
	
	/**
	 * Export an element item as a png.
	 */
	prepElement: function(element) {
		// pre output callback
		if (this.onElementPrep){
			this.onElementPrep(element);
		}
		
		// calculate position and size based on item bounds: good for library items
		// BUG does NOT take into consideration scaling, skewing or rotation
		//var width = Math.ceil(element.objectSpaceBounds.right - element.objectSpaceBounds.left);
		//var height = Math.ceil(element.objectSpaceBounds.bottom - element.objectSpaceBounds.top);
		//var x = Math.floor(-element.objectSpaceBounds.left);
		//var y = Math.floor(-element.objectSpaceBounds.top);
		
		// calculate position and size based on element bounds: good for elements
		// BUG filters, stroke width may get clipped
		var width = Math.ceil(element.width);
		var height = Math.ceil(element.height);
		var x = Math.floor(element.x - element.left);
		var y = Math.floor(element.y - element.top);

		// crop stage to item bounds
		this.outputDoc.selectAll();
		this.outputDoc.width = width;
		this.outputDoc.height = height;
		element.x = x;
		element.y = y;
		
		// get item data
		var data = {};
		data.width = width;
		data.height = height;
		data.registrationX = x;
		data.registrationY = y;
		
		// return item data
		return data;
	}
}