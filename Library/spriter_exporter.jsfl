/**
 * SpriterExporter allows you to export a timeline animation and images to the Spriter format (with some restrictions).
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 * @see http://www.brashmonkey.com/spriter.htm
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
 * Currently does not export color or alpha transformations.
 * Does not support blendmodes.
 *
 * FUTURE:
 * Support graphics with multiple frames in any playback mode.
 * Support color or alpha transformations.
 * Support main timeline export.
 * Support selected library item or timline element export.
 *
 * BUGS:
 * Math for scaling is wrong: need to read matrix, rotation and skewing to determine if flipped.
 * Math for angles is wrong: need to read skewing.
 */
fl.runScript(fl.configURI + "Spriter/png_exporter.jsfl");
fl.runScript(fl.configURI + "Spriter/debug.jsfl");
fl.runScript(fl.configURI + "Spriter/math.jsfl");

function SpriterExporter() {
	this.constructer();
}

SpriterExporter.prototype = {

	//-----------------------------------------------------------------------------------------------------------------------------
	// PROPERTIES
	
	/** The origin document. */
	doc:"",
	
	/** The origin document path. */
	docPath:"",
	
	/** The origin document file name. */
	docName:"",
	
	aniData:"",
	aniNames:"",
	imgData:"",
	imgNames:"",
	exportImages:true,
	pngExporter:"",

	//-----------------------------------------------------------------------------------------------------------------------------
	// CONSTRUCTER METHOD
	
	constructer:function() {
		fl.trace("SpriterExporter: ");
		
		// create data holders
		this.doc = fl.getDocumentDOM();
		this.docPath = this.doc.pathURI.replace(/[^.\/]+\.fla/, "");
		this.docName = this.doc.pathURI.replace(/.+?([^.\/]+)\.fla/, "$1");
		this.aniData = {};
		this.imgData = {};
		this.aniNames = [];
		this.imgNames = [];
		this.pngExporter = new PNGExporter(fl.getDocumentDOM(), null);
		
		Debug.dumpMaxLevels = 2;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// EXPORTER METHODS
	
	exportMainTimeline:function() {
		debugObj = {x:[], y:[], r:[]};
		
		// go to main timeline and select all
		this.doc.exitEditMode();
		this.doc.selectAll();
		var selection = this.doc.selection;
		
		fl.trace("selection: " + selection.length);
		//Debug.dump(selection, "selection");
		
		// iterate through all slected items and export valid items
		for(var i = 0; i < selection.length; i++){
			var element = selection[i];
		fl.trace("element: " + i + " " +element);
			if (this.isValidAniLayer(element.layer) && this.isValidAni(element)){
				this.readAniSymbol(element);
			}
		}
		
		// output the xml
		var out = this.saveData();
		
		// save the file
		var filePath = this.docPath + this.docName + ".scml";
		FLfile.write(filePath, out);
		
		fl.trace("var xxx:Array = [" + debugObj.x.join(",") + "];");
		fl.trace("var yyy:Array = [" + debugObj.y.join(",") + "];");
		fl.trace("var rrr:Array = [" + debugObj.r.join(",") + "];");
	},
	
	debugObj:{},
	
	exportAnimations:function() {
		// TODO export selected animations (current timeline selection or library selection?)
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// READING METHODS

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
		
		// don't read if same named animation exists
		if (!this.isNewAni(data.name)){
			return;
		}
		
		// trace
		fl.trace('=========================================================================================');
		fl.trace('=== READ ANI SYMBOL  name=' + data.name + '  scale=' + data.scaleX + ',' + data.scaleY + '  time=' + data.time + '  symbol="' + data.item.name + '"');
		
		// read all layers in the timeline
		for(var layerNum = 0; layerNum < data.item.timeline.layerCount; layerNum++){
			var layer = data.item.timeline.layers[layerNum];
			if (this.isValidAniLayer(layer)){
				layer.locked = false;
				var frameData = [];
				data.layerData.push(frameData);
				fl.trace("--- READLAYER " + layer.name);
				
				// read all frames in the layer
				for(var frameNum = 0; frameNum < layer.frameCount; frameNum++){
					var frame = layer.frames[frameNum];
					if (this.isValidAniFrame(frame, frameNum)){
						this.ungroupFrameElements(frame, frameNum, data.item);
						fl.trace("-- frame:" + frameNum+ ", " + frame.tweenType + ", " + frame.elements);
						
						// read all elements in the frame
						for(var elementNum = 0; elementNum < frame.elements.length; elementNum++){
							var element = frame.elements[elementNum];
							if (this.isValidAniElement(element) && elementNum == 0){
								
								// add element data to timeline data
								var elementData = this.readElement(element, elementNum, frameNum);
								frameData.push(elementData);
							}
						}
					}
				}
			}
		}
		
		// save animation
		this.aniData[data.name] = data;
		this.aniNames.push(data.name);
	},
	
	/**
	 * Read the data for an element in an animation.
	 */
	readElement: function(element, depth, frameNum){
		// TODO save shape data
		var data = {};
		data.element = element;
		data.frame = frameNum;
		data.name = element.symbolType == "graphic" ? this.fixName(element.libraryItem.name) + this.padLeft(element.firstFrame, 4, "0") : this.fixName(element.libraryItem.name);
		
		// position
		data.x = element.x;
		data.y = element.y;
		data.depth = element.depth;
		data.transformX = Math2.round(element.transformX, .001);
		data.transformY = Math2.round(element.transformY, .001);
		
		// rotation and scaling
		data.rotation = element.rotation;
		data.matrix = element.matrix;
		data.skewX = element.skewX;
		data.skewY = element.skewY;
		data.scaleX = this.getScaleX(element, data);
		data.scaleY = Math2.round(element.scaleY, .001);
		
		// color
		data.colorRedAmount = element.colorRedAmount;
		data.colorRedPercent = element.colorRedPercent;
		data.colorGreenAmount = element.colorGreenAmount;
		data.colorGreenPercent = element.colorGreenPercent;
		data.colorBlueAmount = element.colorBlueAmount;
		data.colorBluePercent = element.colorBluePercent;
		data.colorAlphaAmount = element.colorAlphaAmount;
		data.colorAlphaPercent = element.colorAlphaPercent;
		
		fl.trace("- " + data.frame + "." + data.name + ": position=" + data.x + ":" + data.y + " scale=" + data.scaleX + ":" + data.scaleY + " angle=" + data.angle + " elementNum="+depth);
			
		//Debug.dump(element, "readElement");
		
		
		// save image
		var imageName = "";
		if (element.symbolType == "movie clip"){
			imageName = this.saveImage(element.libraryItem, false, 0);

		} else if (element.symbolType == "graphic"){
			imageName = this.saveImage(element.libraryItem, true, element.firstFrame);
		}
		data.imageName =imageName;
		
		return data;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// SAVE METHODS

	/**
	 * Save the animation data.
	 */
	saveData: function(){
		var out = '<?xml version="1.0" encoding="UTF-8"?>\r';
		out += '<spriter_data scml_version="1.0" generator="BrashMonkey Spriter" generator_version="a4.1">\r';
		
		// output the image xml
		out += '	<folder id="0">\r';
		for(var i = 0; i < this.imgNames.length; i++){
			var img = this.imgData[this.imgNames[i]];
			//var imgNode = '<file type="image" id="' + i + '" name="' + img.name + '.png" pivotx="' + img.regX + '" pivoty="' + img.regY + '"/>';
			var imgNode = '<file id="' + i + '" name="' + img.name + '.png" width="' + img.width + '" height="' + img.height + '"/>';
			out += '		' + imgNode + '\r';
		}
		out += '	</folder>\r';
		
		// output the animation xml
		out += '	<entity id="0" name="test">\r';
		for(var a = 0; a < this.aniNames.length; a++){
			var ani = this.aniData[this.aniNames[a]];
			var aniNode = '<animation id="' + a + '" name="' + ani.name + '" length="' + this.getTime(ani.time) + '" looping="false">';
			var frameID = 0;
			out += '		' + aniNode + '\r';
			
			// save the timelines
			var timelineOut = "";
			for(var l = 0; l < ani.layerData.length; l++){
				var layer = ani.layerData[l];
				if (layer.length) {
					timelineOut += '			<timeline id="' + l + '">\r';
					for(var f = 0; f < layer.length; f++){
						var frame = layer[f];
						timelineOut += this.saveTimelineKey(frame, f, l);
					}
					timelineOut += '			</timeline>\r';
				}
			}
			
			// save the main timeline
			var mainlineOut = "";
			mainlineOut += '			<mainline>\r';
			var keyframeCount = 0;
			for(var t = 0; t < ani.time; t++){
				var foundKeyFrame = false;
				var itemCount = 0;
				
				for(var l = 0; l < ani.layerData.length; l++){
					var layer = ani.layerData[l];
						for(var f = 0; f < layer.length; f++){
							var frame = layer[f];
							if (frame.frame == t){
								
								if (!foundKeyFrame){
									foundKeyFrame = true;
									mainlineOut += '				<key id="' + keyframeCount + '" time="' + this.getTime(t) + '">\r';
								}
							
								mainlineOut += this.saveMainlineKey(frame, keyframeCount, itemCount);
								itemCount++;
							}
						}
				}
				
				if (foundKeyFrame){
					mainlineOut += '				</key>\r';
					keyframeCount++;
				}
			}
			
			mainlineOut += '			</mainline>\r';
			
			out += mainlineOut;
			out += timelineOut;
			out += '		</animation>\r';
		}
		out += '	</entity>\r';
		out += '</spriter_data>';

		fl.trace("\r\r\r");
		fl.trace(out);
		
		return out;
	},
	
	saveMainlineKey: function(sprite, keyframeCount, itemCount){
		var node = '<object_ref id="' + itemCount + '"';
		node += ' timeline="' + sprite.timelineID + '"';
		node += ' key="' + sprite.keyID + '"';
		//node += ' z_index="' + sprite.XXX + '"';
		node += '/>';
		return '					' + node + '\r';
	},
	
	saveTimelineKey: function(elementData, frameCount, layerCount){
		elementData.timelineID = layerCount;
		elementData.keyID = frameCount;
		
		var imageData = this.imgData[elementData.name];
		
		var node = '<object folder="0" file="' + this.getImgId(elementData.name) + '"';
		node += this.saveAttribute(elementData, imageData, "x", this.getX, 0);
		node += this.saveAttribute(elementData, imageData, "y", this.getY, 0);
		node += this.saveAttribute(elementData, imageData, "pivot_x", this.getPivotX, -12345);
		node += this.saveAttribute(elementData, imageData, "pivot_y", this.getPivotY, -12345);
		node += this.saveAttribute(elementData, imageData, "angle", this.getAngle, 0);
		node += this.saveAttribute(elementData, imageData, "x_scale", this.getScaleX, 1);
		node += this.saveAttribute(elementData, imageData, "y_scale", this.getScaleY, 1);
		//node += ' r="' + elementData.r + '"';
		//node += ' g="' + elementData.g + '"';
		//node += ' b="' + elementData.b + '"';
		node += this.saveAttribute(elementData, imageData, "a", this.getAlpha, 1);
		//node += ' z_index="' + elementData.depth + '"';
		node += '/>';
		
		debugObj.x.push('{x:' + elementData.x + ", t:" + elementData.transformX + ", r:" + imageData.regX + ", w:" + imageData.width + "}");
		debugObj.y.push('{y:' + elementData.y + ", t:" + elementData.transformY + ", r:" + imageData.regY + ", h:" + imageData.height + "}");
		debugObj.r.push('{r:' + elementData.rotation + "}");
		
		return '				<key id="' + frameCount + '" spin="0">\r					' + node + '\r				</key>\r';
	},
	
	saveAttribute: function(elementData, imageData, attributeName, func, defaultValue){
		var value = func(elementData, imageData);
		return value != defaultValue ? ' ' + attributeName + '="' + value + '"' : "";
	},

	/**
	 * Save an image and it's data.
	 */
	saveImage: function(item, isGraphic, itemFrame){
		var imageName = isGraphic ? this.fixName(item.name) + this.padLeft(itemFrame, 4, "0") : this.fixName(item.name);
		
		// save if saved already
		if (!this.isNewImage(imageName)){
			return;
		}
		
		// export image
		var itemData;
		if (this.exportImages) {
			itemData = this.pngExporter.exportLibraryItem(item.name, imageName, itemFrame);
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
		fl.trace("--- SAVEIMAGE " + imageName);
		this.imgData[imageName] = imageData;
		this.imgNames.push(imageName);
		return imageName;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// GETTERS
	
	// TODO global scaling: position, scaling, pivot?

	getX: function(elementData, imageData){
		var value = elementData.transformX;
		return Math2.round(value, .001);
	},
	
	getY: function(elementData, imageData){
		var value =  -elementData.transformY;
		return Math2.round(value, .001);
	},

	getPivotX: function(elementData, imageData){
		var value = (elementData.x - elementData.transformX - imageData.regX + imageData.width) / imageData.width;
		value = -value + 1;
		return Math2.round(value, .001);
	},
	
	getPivotY: function(elementData, imageData){
		var value = (elementData.y - elementData.transformY - imageData.regY + imageData.height) / imageData.height;
		return Math2.round(value, .001);
	},

	getScaleX: function(elementData, imageData){
		// TODO remove skewing, spriter does not support
		//fl.trace(data.frame +" "+ data.name+" sX="+ round(element.scaleX, .001)+" sY="+ round(element.scaleY, .001)+" a="+round(element.matrix.a, .001)+" d="+round(element.matrix.d, .001) + " angle=" + data.angle);
		//fl.trace("x scale: " + Math.sqrt(element.matrix.a * element.matrix.a + element.matrix.b * element.matrix.b));
		//fl.trace("y scale: " + Math.sqrt(element.matrix.c * element.matrix.c + element.matrix.d * element.matrix.d));
		//fl.trace(" ");
		return Math2.round(elementData.scaleX, .001);
	},

	getScaleY: function(elementData, imageData){
		// TODO remove skewing, spriter does not support
		//fl.trace(data.frame +" "+ data.name+" sX="+ round(element.scaleX, .001)+" sY="+ round(element.scaleY, .001)+" a="+round(element.matrix.a, .001)+" d="+round(element.matrix.d, .001) + " angle=" + data.angle);
		//fl.trace("x scale: " + Math.sqrt(element.matrix.a * element.matrix.a + element.matrix.b * element.matrix.b));
		//fl.trace("y scale: " + Math.sqrt(element.matrix.c * element.matrix.c + element.matrix.d * element.matrix.d));
		//fl.trace(" ");
		return Math2.round(elementData.scaleY, .001);
	},

	getAngle: function(elementData, imageData){
		var angle = 0;
		
		 //fl.trace(" "+element.matrix.tx +" "+element.matrix.ty);
		if (isNaN(elementData.rotation)){
			//fl.trace(data.frame +" "+ data.name+" angle="+ element.rotation+" skew="+element.skewX+":"+element.skewY);
			//var scale_factor = Math.sqrt((element.matrix.a * element.matrix.d) - (element.matrix.c * element.matrix.b));
			//var angle = Math.acos(element.matrix.a / scale_factor) * 180 / Math.PI;
			//fl.trace(" matrix="+element.matrix.a +" "+element.matrix.b +" "+element.matrix.c +" "+element.matrix.d)
			//fl.trace((element.matrix.a * element.matrix.d) - (element.matrix.c * element.matrix.b));
			//fl.trace("scale_factor="+scale_factor);
			//fl.trace("angle="+angle);
			//fl.trace(" ");
			//return angle;
			angle = elementData.skewX;
		} else {
			//fl.trace(data.frame +" "+ data.name+" angle="+ round(element.rotation, .001));
			angle = elementData.rotation;
		}
		
		return Math2.round(-angle, .001);
	},
	
	getAlpha: function(elementData, imageData){
		var value = elementData.colorAlphaPercent / 100 + elementData.colorAlphaAmount / 256;
		return Math2.round(value, .001);
	},
	
	getTime: function(totalFrames){
		return Math.round((totalFrames) / this.doc.frameRate * 1000);
	},
	
	getImgId: function(imgName){
		return this.imgData[imgName].index;
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
		return (frame.startFrame == i && frame.tweenType != "shape");
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

	/* Recursively unlock exportable layers and lock unexportable layers. */
	unlockLayers: function(){
		// TODO parse layers and lock/unlock
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// UTIL METHODS

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