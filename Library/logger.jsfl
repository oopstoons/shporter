/**
 * Logger is used for logging. It's particularly useful when switching between documents as the output panel may get cleared.
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 * @see https://github.com/oopstoons/shporter
 */
var Logger = {

	//-----------------------------------------------------------------------------------------------------------------------------
	// PROPERTIES
	
	/** The line break to use for line breaks. */
	lineBreak:"\r",
	
	/** The log data. */
	data:"",
	
	/** The save path, if saved. */
	filePath:"",
	
	/** The save file, if saved. */
	fileName:"",
	
	/** Traces logs or not. */
	traceLog:true,

	//-----------------------------------------------------------------------------------------------------------------------------
	// CONSTRUCTER METHOD
	
	constructer:function($input) {
		if ($input){
			this.log($input);
		}
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// INPUT METHODS
	
	/**
	 * Logs data into the logger.
	 */
	log: function($input) {
		if (this.traceLog) {
			fl.trace($input);
		}
		var input = $input + Logger.lineBreak;
		this.data += input;
	},
	
	/**
	 * Clears the log.
	 */
	clear: function() {
		if (this.traceLog) {
			fl.outputPanel.clear();
		}
		this.data = "";
	},
	
	/**
	 * Adds a header bar into the logger.
	 */
	h1: function($input) {
		var input = "===" + ($input ? " " + $input + " " : "") + "========================================================";
		this.log(input);
	},
	
	/**
	 * Adds a header bar into the logger.
	 */
	h2: function($input) {
		var input = "---" + ($input ? " " + $input + " " : "") + "--------------------------------------------------------";
		this.log(input);
	},
	
	/**
	 * Adds an error line.
	 */
	error: function($input) {
		var input = "ERROR: " + $input;
		this.log(input);
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// OUTPUT METHODS
	
	/**
	 * Traces the log into the output panel.
	 */
	trace:function($clear) {
		if ($clear != false) {
			fl.outputPanel.clear();
		}
		fl.trace(this.data);
	},
	
	/**
	 * Saves the log into a text file.
	 */
	save:function($fileName, $filePath) {
		if ($filePath){
			this.filePath = $filePath;
		} else if (!this.filePath){
			this.filePath = fl.getDocumentDOM().pathURI.replace(/[^.\/]+\.fla/, "");
		}
		
		if ($fileName){
			this.fileName = $fileName;
		} else if (!this.fileName){
			this.fileName = fl.getDocumentDOM().pathURI.replace(/.+?([^.\/]+)\.fla/, "$1");
		}
		
		this.file = this.filePath + this.fileName + ".txt";
		FLfile.write(this.file, this.data);
	}
}