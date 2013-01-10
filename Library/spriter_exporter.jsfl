/**
 * SpriterExporter allows you to export a timeline animation and images to the Spriter format (with some restrictions).
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 * @see http://www.brashmonkey.com/spriter.htm
 */
fl.runScript(fl.configURI + "Spriter/png_exporter.jsfl");

function SpriterExporter() {
	this.constructer();
}

SpriterExporter.prototype = {

	//-----------------------------------------------------------------------------------------------------------------------------
	// PROPERTIES
	
	doc:"",
	aniData:"",
	aniNames:"",
	imgData:"",
	imgNames:"",
	exportImages:true,
	pngExporter:"",
	onElementPrep:"",

	//-----------------------------------------------------------------------------------------------------------------------------
	// CONSTRUCTER METHOD
	
	constructer:function() {
		fl.outputPanel.clear();
		fl.trace("SpriterExporter: ");
		
		// create data holders
		this.doc = fl.getDocumentDOM();
		this.aniData = {};
		this.imgData = {};
		this.aniNames = [];
		this.imgNames = [];
		this.pngExporter = new PNGExporter(fl.getDocumentDOM(), null);
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// EXPORTER METHODS
	
	exportMainTimeline:function() {
		// go to main timeline and select all
		this.doc.exitEditMode();
		this.doc.selectAll();
		var selection = this.doc.selection;
		
		// iterate through all slected items and export valid items
		for(var i = 0; i < selection.length; i++){
			var element = selection[i];
			if (this.isValidAniLayer(element.layer) && this.isValidAni(element)){
				this.readAniSymbol(element);
			}
		}
		
		// output the xml
		this.saveData();
	},
	
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
		data.frameData = {};
		
		// don't read if same named animation exists
		if (!this.isNewAni(data.name)){
			return;
		}
		
		// trace
		fl.trace('=========================================================================================');
		fl.trace('=== READ ANI SYMBOL  name=' + data.name + '  scale=' + data.scaleX + ',' + data.scaleY + '  time=' + data.time + '  symbol="' + data.item.name + '"');
		
		// iterate through all layers
		for(var layerNum = 0; layerNum < data.item.timeline.layerCount; layerNum++){
			var layer = data.item.timeline.layers[layerNum];
			if (this.isValidAniLayer(layer)){
				layer.locked = false;
				fl.trace("--- READLAYER " + layer.name);
				
				// read the layer
				for(var frameNum = 0; frameNum < layer.frameCount; frameNum++){
					var frame = layer.frames[frameNum];
					if (this.isValidAniFrame(frame, frameNum)){
						this.ungroupFrameElements(frame, frameNum, data.item);
						//fl.trace("-- frame:" + frameNum+ ", " + frame.tweenType + ", " + frame.elements);
						
						// read the frame
						for(var elementNum = 0; elementNum < frame.elements.length; elementNum++){
							var element = frame.elements[elementNum];
							if (this.isValidAniElement(element)){
								
								// add element data to frame data
								var elementData = this.readElement(element, elementNum, frameNum);
								if (!data.frameData["key" + frameNum]){
									data.frameData["key" + frameNum] = [];
								}
								data.frameData["key" + frameNum].push(elementData);
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
		//data.name = this.fixName(element.libraryItem.name);
		data.name = element.symbolType == "graphic" ? this.fixName(element.libraryItem.name) + this.padLeft(element.firstFrame, 4, "0") : this.fixName(element.libraryItem.name);
		data.x = this.round(element.x, .001);
		data.y = this.round(element.y, .001);
		data.angle = this.getAngle(element, data);
		data.scaleX = this.getScaleX(element, data);
		data.scaleY = this.round(element.scaleY, .001);
		data.depth = depth;
		// TODO alpha, RGB?
		// TODO global scaling?
		
		fl.trace("- " + data.frame + "." + data.name + ": position=" + data.x + ":" + data.y + " scale=" + data.scaleX + ":" + data.scaleY + " angle=" + data.angle + " elementNum="+depth);
			
		if (element.symbolType == "movie clip"){
			this.saveImage(element.libraryItem, false, 0);

		} else if (element.symbolType == "graphic"){
			this.saveImage(element.libraryItem, true, element.firstFrame);
		}
		//var imageName =
		
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
			var imgNode = '<file id="' + i + '" name="baby/' + img.name + '.png" width="' + img.width + '" height="' + img.height + '"/>';
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
			out += '			<mainline>\r';
			
			for(var f = 0; f < ani.time; f++){
				var frame = ani.frameData["key" + f];
				if (frame) {
					var frameNode = '<key id="' + frameID + '" time="' + this.getTime(f) + '">';
					frameID++;
					out += '				' + frameNode + '\r';
										
					for(var e = 0; e < frame.length; e++){
						var spriteNode = this.saveSpriteNode(frame[e]);
						out += '					' + spriteNode + '\r';
					}
					out += '				</key>\r';
				}
			}
			out += '			</mainline>\r';
			out += '		</animation>\r';
		}
		out += '	</entity>\r';
		out += '</spriter_data>';

		fl.trace("\r\r\r");
		fl.trace(out);
	},
	
	saveSpriteNode: function(sprite){
		var spriteNode = '<sprite folder="0" file="' + this.getImgId(sprite.name) + '"';
		spriteNode += ' x="' + sprite.x + '" y="' + sprite.y + '" angle="' + sprite.angle + '"';
		spriteNode += ' x_scale="' + sprite.scaleX + '" y_scale="' + sprite.scaleY + '"';
		//spriteNode += ' z_index="' + sprite.depth + '"';
		//spriteNode += ' r="' + sprite.XXX + '" g="' + sprite.XXX + '" b="' + sprite.XXX + '" a="' + sprite.XXX + '"';
		spriteNode += '/>';
		return spriteNode;
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
		var data = {};
		data.item = item;
		data.index = this.imgNames.length;
		data.frame = itemFrame;
		data.name = imageName;
		data.regX = itemData.registrationX;
		data.regY = itemData.registrationY;
		data.width = itemData.width;
		data.height = itemData.height;
		
		// save image data
		fl.trace("--- SAVEIMAGE " + imageName);
		this.imgData[imageName] = data;
		this.imgNames.push(imageName);
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// GETTERS

	getScaleX: function(element, data){
		// TODO remove skewing, spriter does not support
		//fl.trace(data.frame +" "+ data.name+" sX="+ round(element.scaleX, .001)+" sY="+ round(element.scaleY, .001)+" a="+round(element.matrix.a, .001)+" d="+round(element.matrix.d, .001) + " angle=" + data.angle);
		//fl.trace("x scale: " + Math.sqrt(element.matrix.a * element.matrix.a + element.matrix.b * element.matrix.b));
		//fl.trace("y scale: " + Math.sqrt(element.matrix.c * element.matrix.c + element.matrix.d * element.matrix.d));
		//fl.trace(" ");
		return this.round(element.scaleX, .001);
	},

	getAngle: function(element, data){
		 //fl.trace(" "+element.matrix.tx +" "+element.matrix.ty);
		if (isNaN(element.rotation)){
			//fl.trace(data.frame +" "+ data.name+" angle="+ element.rotation+" skew="+element.skewX+":"+element.skewY);
			//var scale_factor = Math.sqrt((element.matrix.a * element.matrix.d) - (element.matrix.c * element.matrix.b));
			//var angle = Math.acos(element.matrix.a / scale_factor) * 180 / Math.PI;
			//fl.trace(" matrix="+element.matrix.a +" "+element.matrix.b +" "+element.matrix.c +" "+element.matrix.d)
			//fl.trace((element.matrix.a * element.matrix.d) - (element.matrix.c * element.matrix.b));
			//fl.trace("scale_factor="+scale_factor);
			//fl.trace("angle="+angle);
			//fl.trace(" ");
			//return angle;
			return this.round(element.skewX, .001);
		} else {
			//fl.trace(data.frame +" "+ data.name+" angle="+ round(element.rotation, .001));
			return this.round(element.rotation, .001);
		}
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
		return (layer.animationType == 'none' && (layer.layerType == 'normal' || layer.layerType == 'guided' || layer.layerType == 'masked'));
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
	},

	round: function($value, $increment) {
		if ($increment <= 0){
			return $value;
		}
		return Math.floor(($value + $increment / 2) / $increment) / (1 / $increment);
	}
}
