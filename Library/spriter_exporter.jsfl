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
fl.runScript(fl.configURI + "Spriter/trig.jsfl");
fl.runScript(fl.configURI + "Spriter/logger.jsfl");

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
	
	/** Logger. */
	//logger:null,

	//-----------------------------------------------------------------------------------------------------------------------------
	// CONSTRUCTER METHOD
	
	constructer:function() {
		Logger.log("SpriterExporter: ");
		
		// create data holders
		this.doc = fl.getDocumentDOM();
		this.docPath = this.doc.pathURI.replace(/[^.\/]+\.fla/, "");
		this.docName = this.doc.pathURI.replace(/.+?([^.\/]+)\.fla/, "$1");
		this.aniData = {};
		this.imgData = {};
		this.aniNames = [];
		this.imgNames = [];
		
		//this.logger = new Logger();
		this.pngExporter = new PNGExporter(fl.getDocumentDOM(), null);
		//this.pngExporter.logger = this.logger;
		
		Debug.dumpMaxLevels = 2;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// EXPORTER METHODS
	
	exportMainTimeline:function() {
		debugObj = {output:[]};
		
		// go to main timeline and select all
		this.doc.exitEditMode();
		this.doc.selectAll();
		var selection = this.doc.selection;
		
		Logger.log("selection: " + selection.length);
		//Debug.dump(selection, "selection");
		
		// iterate through all slected items and export valid items
		for(var i = 0; i < selection.length; i++){
			var element = selection[i];
		Logger.log("element: " + i + " " +element);
			if (this.isValidAniLayer(element.layer) && this.isValidAni(element)){
				this.prepLayers(element);
				this.readAniSymbol(element);
			}
		}
		
		// output the xml
		var out = this.saveData();
		
		// save the file
		var filePath = this.docPath + this.docName + ".scml";
		FLfile.write(filePath, out);
		
		Logger.log("var input:Array = [" + debugObj.output.join(", ") + "];");
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
		Logger.log('=========================================================================================');
		Logger.log('=== READ ANI SYMBOL  name=' + data.name + '  scale=' + data.scaleX + ',' + data.scaleY + '  time=' + data.time + '  symbol="' + data.item.name + '"');
		
		// read all layers in the timeline
		for(var layerNum = 0; layerNum < data.item.timeline.layerCount; layerNum++) {
			var layer = data.item.timeline.layers[layerNum];
			
			if (this.isValidAniLayer(layer)){
				layer.locked = false;
				var frameData = [];
				Logger.log("--- READLAYER " + layer.name);
				
				// read all frames in the layer
				for(var frameNum = 0; frameNum < layer.frameCount; frameNum++){
					var frame = layer.frames[frameNum];
					if (this.isValidAniFrame(frame, frameNum)){
						this.ungroupFrameElements(frame, frameNum, data.item);
						Logger.log("-- frame:" + frameNum+ ", " + frame.tweenType + ", " + frame.elements);
						
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
				
				// add to layer data only if data exists
				Logger.log("--- LAYER " + frameData);
				if (frameData.length) {
					data.layerData.unshift(frameData);
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
		// TODO read multiframe movieclips and graphics with loop/playonce blendmodes
		// BUG only reads graphic frames from keyframes and movieclip frame 0
		data.elementFrame = element.symbolType == "graphic" ? element.firstFrame : 0;
		data.name = this.fixName(element.libraryItem.name) + this.padLeft(data.elementFrame, 4, "0");
		
		// position
		data.x = element.x;
		data.y = element.y;
		data.depth = element.depth;
		data.transformX = element.transformX;
		data.transformY = element.transformY;
		
		// rotation and scaling
		data.rotation = element.rotation;
		data.matrix = element.matrix;
		data.skewX = element.skewX;
		data.skewY = element.skewY;
		data.scaleX = element.scaleX;
		data.scaleY = element.scaleY;
		
		// color
		data.colorRedAmount = element.colorRedAmount;
		data.colorRedPercent = element.colorRedPercent;
		data.colorGreenAmount = element.colorGreenAmount;
		data.colorGreenPercent = element.colorGreenPercent;
		data.colorBlueAmount = element.colorBlueAmount;
		data.colorBluePercent = element.colorBluePercent;
		data.colorAlphaAmount = element.colorAlphaAmount;
		data.colorAlphaPercent = element.colorAlphaPercent;
		
		// save image
		this.saveImage(element.libraryItem, data.elementFrame, data.name);
		
		return data;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// SAVE METHODS

	/**
	 * Save the animation data.
	 */
	saveData: function(){
		Logger.log('=========================================================================================');
		Logger.log('=== SAVE DATA');
		
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
			Logger.log('=========================================================================================');
			Logger.log(">>> Ani: " + a + " " + ani.name);
			out += '		' + aniNode + '\r';
			
			// save the timelines
			var timelineOut = "";
			for(var l = 0; l < ani.layerData.length; l++){
				var layer = ani.layerData[l];
				Logger.log(">> Layer: " + l + " " + layer);
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

		Logger.log("\r\r\r");
		Logger.log(out);
		
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
		
		this.getPosition(elementData, imageData);
		
		var node = '<object folder="0" file="' + this.getImgId(elementData.name) + '"';
		node += this.saveAttribute(elementData, imageData, "x", this.getX, 0);
		node += this.saveAttribute(elementData, imageData, "y", this.getY, 0);
		node += this.saveAttribute(elementData, imageData, "pivot_x", this.getPivotX, 0);
		node += this.saveAttribute(elementData, imageData, "pivot_y", this.getPivotY, 1);
		node += this.saveAttribute(elementData, imageData, "angle", this.getAngle, 0);
		node += this.saveAttribute(elementData, imageData, "scale_x", this.getScaleX, 1);
		node += this.saveAttribute(elementData, imageData, "scale_y", this.getScaleY, 1);
		//node += ' r="' + elementData.r + '"';
		//node += ' g="' + elementData.g + '"';
		//node += ' b="' + elementData.b + '"';
		node += this.saveAttribute(elementData, imageData, "a", this.getAlpha, 1);
		//node += ' z_index="' + elementData.depth + '"';
		node += '/>';
		
		// debug output
		var out = 'n:"' + layerCount + '_' + frameCount + '"';
		out += ' ,x:' + elementData.x + ' ,tX;' + elementData.transformX + ' ,rX;' + imageData.regX + ' ,w;' + imageData.width;
		out += ' ,y:' + elementData.y + ' ,tY;' + elementData.transformY + ' ,rY;' + imageData.regY + ' ,h;' + imageData.height;
		out += ' ,r:' + elementData.rotation;
		out += ' ,sX:' + elementData.scaleX + ' ,kX;' + elementData.skewX;
		out += ' ,sY:' + elementData.scaleY + ' ,kY;' + elementData.skewY;
		out += ' ,ma:' + elementData.matrix.a + ' ,mb:' + elementData.matrix.b + ' ,mc:' + elementData.matrix.c + ' ,md:' + elementData.matrix.d;
		debugObj.output.push("{" + out + "}");
		
		
		return '				<key id="' + frameCount + '" spin="0">\r					' + node + '\r				</key>\r';
	},
	
	saveAttribute: function(elementData, imageData, attributeName, func, defaultValue){
		var value = func(elementData, imageData);
		return value != defaultValue ? ' ' + attributeName + '="' + value + '"' : "";
	},

	/**
	 * Save an image and its data.
	 */
	saveImage: function(item, itemFrame, imageName){
		// save if saved already
		if (!this.isNewImage(imageName)){
			return;
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
		return imageName;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// GETTERS
	
	// TODO global scaling: position, scaling, pivot?
	getPosition: function(elementData, imageData){
		
		// calculate scale
		Logger.log(elementData.frame +" "+ elementData.name+" sX="+ MathUtil.round(elementData.scaleX, .001)+" sY="+ MathUtil.round(elementData.scaleY, .001)+" a="+MathUtil.round(elementData.matrix.a, .001)+" d="+MathUtil.round(elementData.matrix.d, .001));
		Logger.log("x scale: " + Math.sqrt(elementData.matrix.a * elementData.matrix.a + elementData.matrix.b * elementData.matrix.b));
		Logger.log("y scale: " + Math.sqrt(elementData.matrix.c * elementData.matrix.c + elementData.matrix.d * elementData.matrix.d));
		var scaleX = elementData.matrix.a >= 0 ? elementData.scaleX : -elementData.scaleX;
		var scaleY = elementData.matrix.d >= 0 ? elementData.scaleY : -elementData.scaleY;
		elementData.scale = {x:scaleX, y:scaleY};
		
		// calculate angle
			//Logger.log(data.frame +" "+ data.name+" angle="+ element.rotation+" skew="+element.skewX+":"+element.skewY);
			//var scale_factor = Math.sqrt((element.matrix.a * element.matrix.d) - (element.matrix.c * element.matrix.b));
			//var angle = Math.acos(element.matrix.a / scale_factor) * 180 / Math.PI;
			//Logger.log(" matrix="+element.matrix.a +" "+element.matrix.b +" "+element.matrix.c +" "+element.matrix.d)
			//Logger.log((element.matrix.a * element.matrix.d) - (element.matrix.c * element.matrix.b));
			//Logger.log("scale_factor="+scale_factor);
			//Logger.log("angle="+angle);
			//Logger.log(" ");
		var angle = 0;
		if (isNaN(elementData.rotation)){
			angle = elementData.skewX;
		} else {
			angle = elementData.rotation;
		}
		if (scaleX < 0 || scaleY < 0){
			Logger.log("             >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			angle = angle - 180;
		} else if (scaleX < 0 && scaleY < 0){
			Logger.log("             <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		}
		elementData.angle = angle;
		Logger.log("scale: x=" + MathUtil.round(scaleX, .001) + " y=" + MathUtil.round(scaleY, .001));
		Logger.log("angle: r=" + Math.round(elementData.rotation) + " kX=" + Math.round(elementData.skewX) + " kY=" + Math.round(elementData.skewY) + " a=" + Math.round(angle));
		Logger.log(" ");
		
		// globalize topleft
		var topLeft = TrigUtil.rotatePoint(0, 0, imageData.regX * scaleX, imageData.regY * scaleY, -angle);
		topLeft.x = elementData.x - topLeft.x;
		topLeft.y = elementData.y - topLeft.y;
		elementData.topLeft = topLeft;
		
		// calculate the pivot offsets
		var pivotOffset = TrigUtil.rotatePoint(topLeft.x, topLeft.y, elementData.transformX, elementData.transformY, angle);
		pivotOffset.x = pivotOffset.x - topLeft.x;
		pivotOffset.y = pivotOffset.y - topLeft.y;
		elementData.pivotOffset = pivotOffset;
	},

	getX: function(elementData, imageData){
		var value = elementData.transformX;
		return MathUtil.round(value, .001);
	},
	
	getY: function(elementData, imageData){
		var value = -elementData.transformY;
		return MathUtil.round(value, .001);
	},

	getPivotX: function(elementData, imageData){
		var value = MathUtil.getPercent(0, imageData.width * elementData.scale.x, elementData.pivotOffset.x, false);
		return MathUtil.round(value, .001);
	},
	
	getPivotY: function(elementData, imageData){
		var value = MathUtil.getPercent(imageData.height * elementData.scale.y, 0, elementData.pivotOffset.y, false);
		return MathUtil.round(value, .001);
	},

	getScaleX: function(elementData, imageData){
		return MathUtil.round(elementData.scale.x, .001);
	},

	getScaleY: function(elementData, imageData){
		return MathUtil.round(elementData.scale.y, .001);
	},

	getAngle: function(elementData, imageData){
		var angle = 0;
		if (isNaN(elementData.rotation)){
			angle = elementData.skewX;
		} else {
			angle = elementData.rotation;
		}
		return MathUtil.round(-angle, .001);
		//return MathUtil.round(-elementData.rotation, .001);
	},
	
	getAlpha: function(elementData, imageData){
		var value = elementData.colorAlphaPercent / 100 + elementData.colorAlphaAmount / 256;
		return MathUtil.round(value, .001);
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
				//layer.visible = false;
			}
		}
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