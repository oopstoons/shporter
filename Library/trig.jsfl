/**
 * TrigUtil contains trigonometry functions (dope).
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 */
var TrigUtil = {

	//-----------------------------------------------------------------------------------------------------------------------------
	// TRIGONOMETRY PROPERTIES

	/** A mathematical constant of pi / 180 precalculated. */
	DEG_TO_RAD: Math.PI / 180,

	/** A mathematical constant of 180 / pi precalculated. */
	RAD_TO_DEG: 180 / Math.PI,

	//-----------------------------------------------------------------------------------------------------------------------------
	// TRIGONOMETRY METHODS

	/**
	 * Calculates the angle from 2 points.
	 * @param $x1 The first x value
	 * @param $y1 The first y value
	 * @param $x2 The second x value
	 * @param $y2 The second y value
	 * @return The angle from the first set of cordinates to the second
	 * @example TrigUtil.getAngle(0, 0, 50, 50)   // 45
	 */
	getAngle:function($x1, $y1, $x2, $y2) {
		var radians = TrigUtil.getRadian($x1, $y1, $x2, $y2);
		return radians * TrigUtil.RAD_TO_DEG;
	},

	/**
	 * Calculates the radian from 2 points.
	 * @param $x1 The first x value
	 * @param $y1 The first y value
	 * @param $x2 The second x value
	 * @param $y2 The second y value
	 * @return The radian from the first set of cordinates to the second
	 * @example TrigUtil.getRadian(0, 0, 50, 50)   // 0.7853981633974483
	 */
	getRadian:function($x1, $y1, $x2, $y2) {
		return Math.atan2(($y2 - $y1), ($x2 - $x1));
	},

	/**
	 * Calculates the distance between 2 points
	 * @param $x1 The first x value
	 * @param $y1 The first y value
	 * @param $x2 The second x value, default 0
	 * @param $y2 The second y value, default 0
	 * @return The distance from the first set of cordinates to the second. Always returns positive.
	 * @example TrigUtil.getDistance(0, 0, 3, 4)    // 5
	 */
	getDistance:function($x1, $y1, $x2, $y2) {
		return Math.sqrt(($y2 - $y1) * ($y2 - $y1) + ($x2 - $x1) * ($x2 - $x1));
	},

	/**
	 * Rotate a point around another point.
	 * @param	$originX	The x point to rotate around.
	 * @param	$originY	The y point to rotate around.
	 * @param	$pointX		The x point to rotate.
	 * @param	$pointY		The y point to rotate.
	 * @param	$rotation	The angle to rotate.
	 * @return
	 * @see http://stackoverflow.com/questions/2259476/rotating-a-point-about-another-point-2d
	 */
	rotatePoint:function($originX, $originY, $pointX, $pointY, $rotation) {
		var angleRad = $rotation * TrigUtil.DEG_TO_RAD;
		var angleSin = Math.sin(angleRad);
		var angleCos = Math.cos(angleRad);
		
		var displaceX = $pointX - $originX;
		var displaceY = $pointY - $originY;
		var rotateX = displaceX * angleCos + displaceY * angleSin;
		var rotateY = displaceY * angleCos - displaceX * angleSin;
		return {x:rotateX + $originX, y:rotateY + $originY};
	}
}