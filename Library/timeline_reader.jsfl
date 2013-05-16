/**
 * TimelineReader reads the timelines of elements and can also save out images.
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 * @see https://github.com/oopstoons/shporter
 *
 * NOTES:
 * Will ungroup everything in the timelines it is exporting.
 * Will unlock all layers in the timelines it is exporting.
 * May have to limit to one element per layer to implement depth and timeline correctly.
 * May need to strip all skewing.
 *
 * UNSUPPORTED:
 * Currently does not export any shapes.
 * Currently does not export graphics if play mode is loop or play once.
 * Currently does not export color transformations.
 * Does not support blendmodes.
 *
 * FUTURE:
 * Support graphics with multiple frames in any playback mode.
 * Support color transformations.
 * Support main timeline export.
 */
fl.runScript(fl.configURI + "Shporter/png_exporter.jsfl");
fl.runScript(fl.configURI + "Shporter/debug.jsfl");
fl.runScript(fl.configURI + "Shporter/math.jsfl");
fl.runScript(fl.configURI + "Shporter/trig.jsfl");
fl.runScript(fl.configURI + "Shporter/logger.jsfl");

function TimelineReader() {
	this.constructer();
}

TimelineReader.prototype = {

	//-----------------------------------------------------------------------------------------------------------------------------
	// PROPERTIES
	
	/** The origin document. */
	doc:"",
	
	/** The data for all exported animations. */
	elementData:"",
	
	/** The data for all exported animations. */
	aniData:"",
	
	/** The names of all exported animations. */
	aniNames:"",
	
	/** The data for all exported images. */
	imgData:"",
	
	/** The names of all exported images. */
	imgNames:"",
	
	/** The png exporter. */
	pngExporter:"",
	
	/** For debugging. */
	exportImages:true,

	//-----------------------------------------------------------------------------------------------------------------------------
	// CONSTRUCTER METHOD
	
	constructer:function() {
		Logger.log("TimelineReader: ");
		
		// create data holders
		this.doc = fl.getDocumentDOM();
		this.elementData = [];
		this.aniData = {};
		this.imgData = {};
		this.aniNames = [];
		this.imgNames = [];
		
		Debug.dumpMaxLevels = 2;
	},
	
	//-----------------------------------------------------------------------------------------------------------------------------
	// READING METHODS
	
	readTimelines:function(elements) {
		Logger.log("TimelineReader.readTimelines: total=" + elements.length);
		
		for(var i = 0; i < elements.length; i++){		
			var element = elements[i];
			Logger.log("element: " + i + " " +element);
			if (this.isValidAni(element)){
				this.prepLayers(element);
				this.readAniSymbol(element);
			}
		}
	},

	/**
	 * Reads an animation symbol for data.
	 */
	readAniSymbol: function(aniInstance){
		// get ani core props
		var data = {};
		data.item = aniInstance.libraryItem;
		data.name = this.fixName(aniInstance.name);
		data.time = data.item.timeline.frameCount;
		data.scaleX = aniInstance.scaleX;
		data.scaleY = aniInstance.scaleY;
		data.layerData = [];
		data.layerMeta = [];
		
		// don't read if same named animation exists
		if (!this.isNewAni(data.name)){
			return;
		}
		
		// trace
		Logger.log('=========================================================================================');
		Logger.log('=== READ ANI SYMBOL  name=' + data.name + '  scale=' + data.scaleX + ',' + data.scaleY + '  time=' + data.time + '  symbol="' + data.item.name + '"');
		
		// read all layers in the timeline
		for(var layerNum = 0; layerNum < data.item.timeline.layerCount; layerNum++) {
			
			// add to layer data only if data exists
			var frameData = this.readLayer(aniInstance, layerNum);
			if (frameData.length) {
				data.layerData.unshift(frameData);
				
				// save layer meta
				var layer = aniInstance.libraryItem.timeline.layers[layerNum];
				data.layerMeta.unshift(layer.name);
			}
		}
		
		// ensure unique names for layers
		for(var layerNum = 0; layerNum < data.layerData.length; layerNum++){
			data.layerMeta[layerNum] = this.uniquifyLayerName(data.layerMeta, layerNum, 0);
		}
		
		// save animation
		this.aniData[data.name] = data;
		this.aniNames.push(data.name);
		
		return data;
	},
	
	/**
	 * Read a layer from a timeline.
	 */
	readLayer:function(aniInstance, layerNum){
		// get the layer
		var layer = aniInstance.libraryItem.timeline.layers[layerNum];
		aniInstance.libraryItem.timeline.setSelectedLayers(layerNum);
		
		// continue if valid layer
		var frameData = [];
		if (this.isValidAniLayer(layer)){
			layer.locked = false;
			Logger.log("--- READLAYER " + layer.name);
			
			// read all frames in the layer
			for(var frameNum = 0; frameNum < layer.frameCount; frameNum++){
				var elementData = this.readFrame(aniInstance, layer, frameNum);
				if (elementData){
					frameData.push(elementData);
				}
			}
		}
		
		// return the data
		return frameData;
	},
	
	/**
	 * Read a frame from a layer.
	 */
	readFrame:function(aniInstance, layer, frameNum){
		// get the frame, if it's not a keyframe make it a keyframe temporarily
		var frame = layer.frames[frameNum];
		var tempKeyframe = frame.startFrame == frameNum ? false : true;
		if (tempKeyframe) {
			aniInstance.libraryItem.timeline.convertToKeyframes(frameNum);
			frame = layer.frames[frameNum];
		}
		
		// ungroup any elements in this frame
		this.ungroupFrameElements(frame, frameNum, aniInstance);
		
		// continue if valid frame
		var elementData = null;
		if (this.isValidAniFrame(frame, frameNum)){
			Logger.log("-- frame:" + frameNum+ ", " + frame.startFrame + ", " + tempKeyframe + " " + frame.tweenType + ", " + frame.elements[0].x + " " + frame.elements);
			
			// read the first valid element in the frame
			for(var elementNum = 0; elementNum < frame.elements.length; elementNum++){
				var element = frame.elements[elementNum];
				if (this.isValidAniElement(element) && elementNum == 0){
					
					// add element data to timeline data
					elementData = this.readElement(element, elementNum, frameNum);
				}
			}
		}
		
		// clear a temporary keyframe
		if (tempKeyframe) {
			aniInstance.libraryItem.timeline.clearKeyframes(frameNum);
		}
		
		// return the data
		return elementData;
	},
	
	/**
	 * Read the data for an element in an animation.
	 */
	readElement: function(element, depth, frameNum){
		Logger.log("--- readElement:" + depth + " " + frameNum);
		// TODO save shape data
		var elementData = {};
		//elementData.element = element;
		elementData.frame = frameNum;
		elementData.libraryItem = element.libraryItem;
		// TODO read multiframe movieclips and graphics with loop/playonce blendmodes
		// BUG only reads graphic frames from keyframes and movieclip frame 0
		elementData.elementFrame = element.symbolType == "graphic" ? element.firstFrame : 0;
		elementData.name = this.fixName(element.libraryItem.name) + "_" + this.padLeft(elementData.elementFrame, 4, "0");
		
		// position
		elementData.x = element.x;
		elementData.y = element.y;
		elementData.depth = element.depth;
		elementData.transformX = element.transformX;
		elementData.transformY = element.transformY;
		
		// rotation and scaling
		elementData.rotation = element.rotation;
		elementData.matrix = element.matrix;
		elementData.skewX = element.skewX;
		elementData.skewY = element.skewY;
		elementData.scaleX = element.scaleX;
		elementData.scaleY = element.scaleY;
		
		// color
		elementData.colorRedAmount = element.colorRedAmount;
		elementData.colorRedPercent = element.colorRedPercent;
		elementData.colorGreenAmount = element.colorGreenAmount;
		elementData.colorGreenPercent = element.colorGreenPercent;
		elementData.colorBlueAmount = element.colorBlueAmount;
		elementData.colorBluePercent = element.colorBluePercent;
		elementData.colorAlphaAmount = element.colorAlphaAmount;
		elementData.colorAlphaPercent = element.colorAlphaPercent;
		
		// store data
		this.elementData.push(elementData);
		return elementData;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// SAVE METHODS
	
	/**
	 * Save all the used timeline images.
	 */
	saveTimelineImages: function(folder){
		// setup the png exporter
		this.pngExporter = new PNGExporter(this.doc, null);
		this.pngExporter.outputPath += folder;
		FLfile.createFolder(this.pngExporter.outputPath);
		
		// save all used images
		for(var i = 0; i < this.elementData.length; i++){	
			var elementData = this.elementData[i];
			var imageData = this.saveImage(elementData.libraryItem, elementData.elementFrame, elementData.name);
		}
	},
	
	/**
	 * Save an image and its data.
	 */
	saveImage: function(item, itemFrame, imageName){
		// save if saved already
		if (!this.isNewImage(imageName)){
			return this.imgData[imageName];
		}
		
		// export image
		var itemData;
		if (this.exportImages) {
			itemData = this.pngExporter.exportItem(item, imageName, itemFrame);
		} else {
			itemData = {registrationX:0, registrationY:0, width:0, height:0};
		}
		
		// save data
		var imageData = {};
		imageData.item = item;
		imageData.index = this.imgNames.length;
		imageData.frame = itemFrame;
		imageData.name = imageName;
		imageData.regX = itemData.registrationX;
		imageData.regY = itemData.registrationY;
		imageData.width = itemData.width;
		imageData.height = itemData.height;
		
		// save image data
		Logger.log("--- SAVEIMAGE " + imageName);
		this.imgData[imageName] = imageData;
		this.imgNames.push(imageName);
		return imageData;
	},
	
	//-----------------------------------------------------------------------------------------------------------------------------
	// VALIDATION METHODS

	isValidAni: function(element){
		return (element.elementType == 'instance' && element.instanceType == 'symbol' && element.symbolType == 'movie clip' && element.name != '');
	},

	isValidAniLayer: function(layer){
		return ((layer.animationType == undefined || layer.animationType == 'none') && (layer.layerType == 'normal' || layer.layerType == 'guided' || layer.layerType == 'masked'));
	},

	isValidAniFrame: function(frame, i){
		// TODO if graphic plays/loops frame, then dont ignore non startframes
		//return (frame.startFrame == i && frame.tweenType != "shape");
		return (frame.tweenType != "shape");
	},

	isValidAniElement: function(element){
		return (element.elementType == 'instance' && element.instanceType == 'symbol' && element.symbolType != 'button');
	},

	isNewAni: function(aniName){
		return this.aniData[aniName] == undefined;
	},

	isNewImage: function(imgName){
		return this.imgData[imgName] == undefined;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// DISPLAY UTIL METHODS

	/* Recursively ungroup all elements in a given frame. */
	ungroupFrameElements: function(frame, frameNum, aniItem){
		var hasGroups = false;
		var totalElements = frame.elements.length;
		
		for(var i = 0; i < totalElements; i++){
			var element = frame.elements[i];
			if (element.elementType == "shape" && element.isGroup){
				hasGroups = true;
				fl.getDocumentDOM().library.editItem(aniItem.name);
				aniItem.timeline.setSelectedFrames(frameNum, frameNum);
				fl.getDocumentDOM().unGroup();
			}
		}
		
		// try to ungroup again since you may have ungrouped more groups
		if (hasGroups){
			ungroupFrameElements(frame, frameNum, aniItem);
		}
	},

	/* Unlock exportable layers and lock unexportable layers. */
	prepLayers: function(element){
		var total = element.libraryItem.timeline.layers.length;
		for (var i = 0; i < total; i++) {
			var layer = element.libraryItem.timeline.layers[i];
			if (this.isValidAniLayer(layer)){
				layer.locked = false;
				layer.visible = true;
			} else {
				layer.locked = true;
			}
		}
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// UTIL METHODS
	
	/* Find a unique layer name. */
	uniquifyLayerName:function(layerMeta, currentLayerNum, extra){
		var layerName = layerMeta[currentLayerNum] + (extra ? "_" + extra : "");
		var isUnique = true;
		
		// if name is not unique increment it until it is
		for(var layerNum = 0; layerNum < currentLayerNum; layerNum++){
			if (layerMeta[layerNum] == layerName) {
				isUnique = false;
				layerName = this.uniquifyLayerName(layerMeta, currentLayerNum, extra + 1);
				break;
			}
		}
		return layerName;
	},

	fixName: function(assetName){
		assetName = assetName.replace(/^(.+\/)/igm, "");
		assetName = assetName.replace(/\W+/ig, "_");
		return assetName;
	},

	padLeft: function($input, $length, $character) {
		$character = $character ? $character : " ";
		var input = $input.toString();
		if (!input) return "";
		while (input.length < $length) input = $character + input;
		return input;
	}
}