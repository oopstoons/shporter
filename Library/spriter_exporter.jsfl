/**
 * SpriterExporter allows you to export a timeline animation and images to the Spriter format (with some restrictions).
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 * @see http://www.brashmonkey.com/spriter.htm
 */
fl.runScript(fl.configURI + "Shporter/timeline_reader.jsfl");
fl.runScript(fl.configURI + "Shporter/debug.jsfl");
fl.runScript(fl.configURI + "Shporter/math.jsfl");
fl.runScript(fl.configURI + "Shporter/trig.jsfl");
fl.runScript(fl.configURI + "Shporter/logger.jsfl");

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
	
	/** The output document. */
	outputDoc:"",
	
	/** The output document path. */
	outputDocPath:"",
	
	/** The name of the project. */
	projectName:"",
	
	/** The timeline reader. */
	timeline:"",

	//-----------------------------------------------------------------------------------------------------------------------------
	// CONSTRUCTER METHOD
	
	constructer:function() {
		Logger.log("SpriterExporter: ");
		
		// create data holders
		this.doc = fl.getDocumentDOM();
		this.docPath = this.doc.pathURI.replace(/[^.\/]+\.fla/, "");
		this.docName = this.doc.pathURI.replace(/.+?([^.\/]+)\.fla/, "$1");
		this.projectName = this.docName;
		
		Debug.dumpMaxLevels = 2;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// EXPORTER METHODS
	
	/* Export all elements on the main timeline. */
	exportMainTimeline:function() {
		// go to main timeline and select all
		this.doc.exitEditMode();
		this.doc.selectAll();
		
		// export selected items
		this.exportSelectedElements();
	},
	
	/* Export the selected library items. */
	exportSelectedItems:function() {
		// copy library items to main timeline and give them names
		this.doc.library.addItemToDocument({x:0, y:0});
		var selection = this.doc.selection.slice();
		for(var i = 0; i < selection.length; i++){		
			var element = selection[i];			
			try {
				element.name = this.fixName(element.libraryItem.name);
			} catch(err){}
		}
		
		// export selected items
		this.exportSelectedElements();
	},
	
	/* Export the selected timeline elements. */
	exportSelectedElements:function() {
		// save doc before export
		this.doc.save();
	
		// save doc temporarily
		this.outputDocPath = this.docPath + "__DELETE_THIS__.fla";
		fl.saveDocument(fl.getDocumentDOM(), this.outputDocPath);
		this.outputDoc = fl.getDocumentDOM();
		
		// iterate through all slected items and export valid items
		var selection = this.outputDoc.selection.slice();
		this.timeline = new TimelineReader();
		this.timeline.readTimelines(selection);
		
		// save timeline images
		this.timeline.saveTimelineImages(this.projectName);
		
		// close the output doc
		this.outputDoc.close(false);
		
		// transform element properties
		for(var i = 0; i < this.timeline.elementData.length; i++){	
			var elementData = this.timeline.elementData[i];
			this.transformElementProperties(elementData)
		}
		
		// write and save the scml file
		var out = this.saveData();
		var filePath = this.docPath + this.projectName + ".scml";
		FLfile.write(filePath, out);
		
		// open the original doc
		fl.openDocument(this.docPath + this.docName + ".fla");
		
		// try to delete the output doc
		FLfile.remove(this.outputDocPath);
	},
	
	//-----------------------------------------------------------------------------------------------------------------------------
	// TRANSFORM METHODS

	/**
	 * Calculate advanced position, scaling, angle, and pivot properties.
	 */
	transformElementProperties: function(elementData){
		// TODO global scaling: position, scaling, pivot?
		// get image
		var imageData = this.timeline.imgData[elementData.name];
		
		// calculate scale & angle
		var scaleX = 1;
		var scaleY = 1;
		var angle = 0;
		if (isNaN(elementData.rotation)){
			scaleX = elementData.matrix.a >= 0 ? elementData.scaleX : -elementData.scaleX;
			scaleY = elementData.matrix.d >= 0 ? elementData.scaleY : -elementData.scaleY;
			angle = scaleX < 0 ? elementData.skewX : elementData.skewX + 180;
		} else {
			scaleX = elementData.scaleX;
			scaleY = elementData.scaleY;
			angle = elementData.rotation;
		}
		elementData.angle = angle;
		elementData.scale = {x:scaleX, y:scaleY};
		
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

	//-----------------------------------------------------------------------------------------------------------------------------
	// SAVE METHODS
	
	/**
	 * Save the animation data.
	 */
	saveData: function(){
		Logger.log('=========================================================================================');
		Logger.log('=== SAVE DATA');
		
		var out = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
		out += '<spriter_data scml_version="1.0" generator="Shporter" generator_version="b2">\r\n';
		
		// output the image xml
		out += '	<folder id="0" name="' + this.projectName + '">\r\n';
		for(var i = 0; i < this.timeline.imgNames.length; i++){
			var img = this.timeline.imgData[this.timeline.imgNames[i]];
			var imgNode = '<file id="' + i + '" name="' + this.projectName + '/' + img.name + '.png" width="' + img.width + '" height="' + img.height + '" pivot_x="' + this.getImagePivotX(img) + '" pivot_y="' + this.getImagePivotY(img) + '"/>'
			out += '		' + imgNode + '\r\n';
		}
		out += '	</folder>\r\n';
		
		// output the animation xml
		out += '	<entity id="0" name="test">\r\n';
		for(var a = 0; a < this.timeline.aniNames.length; a++){
			var ani = this.timeline.aniData[this.timeline.aniNames[a]];
			var aniNode = '<animation id="' + a + '" name="' + ani.name + '" length="' + this.getTime(ani.time) + '" looping="false">';
			var frameID = 0;
			Logger.log('=========================================================================================');
			Logger.log(">>> Ani: " + a + " " + ani.name);
			out += '		' + aniNode + '\r\n';
			
			// save the timelines
			var timelineOut = "";
			for(var layerNum = 0; layerNum < ani.layerData.length; layerNum++){
				var layerData = ani.layerData[layerNum];
				var layerMeta = ani.layerMeta[layerNum];
				Logger.log(">> Layer: " + layerNum + " " + layerData);
				if (layerData.length) {
					timelineOut += '			<timeline id="' + layerNum + '" name="' + layerMeta + '">\r\n';
					for(var f = 0; f < layerData.length; f++){
						var frame = layerData[f];
						timelineOut += this.saveTimelineKey(frame, f, layerNum);
					}
					timelineOut += '			</timeline>\r\n';
				}
			}
			
			// save the main timeline
			var mainlineOut = "";
			mainlineOut += '			<mainline>\r\n';
			var keyframeCount = 0;
			for(var t = 0; t < ani.time; t++){
				var foundKeyFrame = false;
				var itemCount = 0;
				
				for(var layerNum = 0; layerNum < ani.layerData.length; layerNum++){
					var layerData = ani.layerData[layerNum];
					for(var f = 0; f < layerData.length; f++){
						var frame = layerData[f];
						if (frame.frame == t){
							
							if (!foundKeyFrame){
								foundKeyFrame = true;
								mainlineOut += '				<key id="' + keyframeCount + '" time="' + this.getTime(t) + '">\r\n';
							}
						
							mainlineOut += this.saveMainlineKey(frame, keyframeCount, itemCount);
							itemCount++;
						}
					}
				}
				
				if (foundKeyFrame){
					mainlineOut += '				</key>\r\n';
					keyframeCount++;
				}
			}
			
			mainlineOut += '			</mainline>\r\n';
			
			out += mainlineOut;
			out += timelineOut;
			out += '		</animation>\r\n';
		}
		out += '	</entity>\r\n';
		out += '</spriter_data>';
		
		return out;
	},

	/**
	 * Save a mainline object.
	 */
	saveMainlineKey: function(sprite, keyframeCount, itemCount){
		var node = '<object_ref id="' + itemCount + '"';
		node += ' timeline="' + sprite.timelineID + '"';
		node += ' key="' + sprite.keyID + '"';
		node += ' z_index="' + itemCount + '"';
		node += '/>';
		return '					' + node + '\r\n';
	},

	/**
	 * Save a timeline key.
	 */
	saveTimelineKey: function(elementData, frameCount, layerCount){
		elementData.timelineID = layerCount;
		elementData.keyID = frameCount;
		
		// create key attributes
		var idData = ' id="' + frameCount + '"';
		var keyTime = this.getTime(elementData.frame);
		var keyData = !keyTime ? "" : ' time="' + keyTime + '"';
		var spinData = ' spin="' + 0 + '"';
		
		// find image data
		var imageData = this.timeline.imgData[elementData.name];
		
		// create object node
		var node = '<object folder="0" file="' + this.getImgId(elementData.name) + '"';
		node += this.saveAttribute(elementData, imageData, "x", this.getX, 0);
		node += this.saveAttribute(elementData, imageData, "y", this.getY, 0);
		node += this.saveAttribute(elementData, imageData, "pivot_x", this.getPivotX, 0);
		node += this.saveAttribute(elementData, imageData, "pivot_y", this.getPivotY, 1);
		node += this.saveAttribute(elementData, imageData, "angle", this.getAngle, 0);
		node += this.saveAttribute(elementData, imageData, "scale_x", this.getScaleX, 1);
		node += this.saveAttribute(elementData, imageData, "scale_y", this.getScaleY, 1);
		node += this.saveAttribute(elementData, imageData, "a", this.getAlpha, 1);
		node += '/>';
		
		return '				<key' + idData + keyData + spinData + '>\r\n					' + node + '\r\n				</key>\r\n';
	},

	/**
	 * Save an attribute.
	 */
	saveAttribute: function(elementData, imageData, attributeName, func, defaultValue){
		var value = func(elementData, imageData);
		return value != defaultValue ? ' ' + attributeName + '="' + value + '"' : "";
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// GETTERS

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
		return MathUtil.round(-elementData.angle, .001);
	},
	
	getAlpha: function(elementData, imageData){
		var value = elementData.colorAlphaPercent / 100 + elementData.colorAlphaAmount / 256;
		return MathUtil.round(value, .001);
	},
	
	getTime: function(totalFrames){
		return Math.round((totalFrames) / this.doc.frameRate * 1000);
	},
	
	getImgId: function(imgName){
		return this.timeline.imgData[imgName].index;
	},

	getImagePivotX: function(imageData){
		var value = MathUtil.getPercent(0, imageData.width, imageData.regX, false);
		return MathUtil.round(value, .001);
	},
	
	getImagePivotY: function(imageData){
		var value = MathUtil.getPercent(imageData.height, 0, imageData.regY, false);
		return MathUtil.round(value, .001);
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// UTIL METHODS

	fixName: function(assetName){
		assetName = assetName.replace(/^(.+\/)/igm, "");
		assetName = assetName.replace(/\W+/ig, "_");
		return assetName;
	}
}