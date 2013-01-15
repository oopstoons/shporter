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
	 * @example Math2.getAngle(0, 0, 50, 50)   // 45
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
	 * @example Math2.getRadian(0, 0, 50, 50)   // 0.7853981633974483
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
	 * @example Math2.getDistance(0, 0, 3, 4)    // 5
	 */
	getDistance:function($x1, $y1, $x2, $y2) {
		return Math.sqrt(($y2 - $y1) * ($y2 - $y1) + ($x2 - $x1) * ($x2 - $x1));
	},

	/**
	 * Rotate a point around another point.
	 * @param	$baseX		The x point to rotate around.
	 * @param	$baseY		The y point to rotate around.
	 * @param	$sourceX	The x point to rotate.
	 * @param	$sourceY	The y point to rotate.
	 * @param	$rotation	The angle to rotate.
	 * @return
	 * @see http://blog.geomusings.com/2007/06/25/rotating-a-point-around-a-base-point/
	 */
	rotatePoint:function($baseX, $baseY, $sourceX, $sourceY, $rotation) {
		// shift x and y relative to 0,0 origin
		var offsetX = $sourceX + ($baseX * -1);
		var offsetY = $sourceY + ($baseY * -1);

		// convert to radians. take absolute value (necessary for x coord only).
		offsetX = Math.abs(offsetX * TrigUtil.DEG_TO_RAD);
		offsetY = offsetY * TrigUtil.DEG_TO_RAD;
		var rotationRadians = $rotation * TrigUtil.DEG_TO_RAD;

		// get distance from origin to source point
		var distance = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));

		// get current angle of orientation
		var theta = Math.atan(offsetY / offsetX);

		// add rotation value to theta to get new angle of orientation
		var offsetTheta = theta + rotationRadians;

		// calculate new coord
		var rotateX = distance * Math.cos(offsetTheta);
		var rotateY = distance * Math.sin(offsetTheta);

		// convert new x and y back to decimal degrees
		rotateX = rotateX * TrigUtil.RAD_TO_DEG;
		rotateY = rotateY * TrigUtil.RAD_TO_DEG;

		// shift new x and y relative to base point
		rotateX = (rotateX + $baseX);
		rotateY = (rotateY + $baseY);

		// check valid data
		if (isNaN(rotateX) || isNaN(rotateY)){
			return {x:$sourceX, y:$sourceY};
		} else {
			return {x:rotateX, y:rotateY};
		}
	}
}