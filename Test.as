/**
 * Version:
 * 01/11/2013 Pedro Chavez
 * Original Version
 */
package extension {

	import com.imageworks.utils.Math2;
	import flash.display.Sprite;

	public class Test extends Sprite {

		public function Test() {
			var xxx:Array = [{x:33, t:41, r:0, w:0}, {x:-13.55, t:0.4, r:6.3, w:44.85}, {x:-71.1, t:-55.6, r:6.3, w:44.85}, {x:-16.15, t:-15.8, r:6.3, w:44.85}];
			var yyy:Array = [{y:98, t:.2, r:0, h:0}, {y:-7.45, t:0.6, r:15.35, h:30.75}, {y:-16.4, t:-16.75, r:15.35, h:30.75}, {y:-39.55, t:-24.05, r:15.35, h:30.75}];
			var rrr:Array = [{r:-65}, {r:29.998565673828125}, {r:0}, {r:89.9947509765625}];
			var out:Array = [{x:50, y:60, pX:0, pY:0, r:0}, {x:-0.522764, y:-0.287171, pX:0.5, pY:0.5, r:330.001}, {x:-55.6, y:16.75, pX:0.486, pY:0.512, r:0}, {x:-16.307659, y:22.497075, pX:0.5, pY:0.5, r:270.005}];
			var magic:Array = [{pX:0, pY:0}, {pX:-2.1750000000000007, pY:8.024999999999999}, {pX:0.0028999999999932413, pY:-0.006000000000000005}, {pX:-15.775000000000002, pY:15.474999999999994}];


			var positionTolerance:Number = 5;
			var pivotTolerance:Number = .01;

			for (var i:int = 0; i < out.length; i++) {
				var dataX:Object = xxx[i];
				var dataY:Object = yyy[i];
				var dataR:Object = rrr[i];
				var dataT:Object = out[i];

				var testR:Number = dataR.r * Math2.DEG_TO_RAD;
				//testR >= Math.PI * 2 ? testR - Math.PI * 2 : testR;

				var testRotX:Number = Math.cos(testR) * (dataY.t);
				var testRotY:Number = Math.sin(testR) * (dataY.t);
				var magicX:Number = testRotX;
				var magicY:Number = testRotY;

				var nSin:Number = Math.sin(testR);
				var nCos:Number = Math.cos(testR);
				var nX:Number = dataX.r - dataX.t //my_mc.x;
				var nY:Number = dataY.r - dataY.t //my_mc.y;
				magicX = nCos * nX - nSin * nY;
				magicY = nSin * nX + nCos * nY;

				var position:Object = rotatePoint(dataX.x, dataY.y, dataX.x + dataX.t, dataY.y + dataY.t, dataR.r);

				//var testX:Number = dataX.t;
				//var testY:Number = -dataY.t;
				var testX:Number = position.x;
				var testY:Number = position.y;
				var testPivotX:Number = (dataX.x - dataX.t - dataX.r + dataX.w + magicX) / dataX.w;
				testPivotX = -testPivotX + 1;
				var testPivotY:Number = (dataY.y - dataY.t - dataY.r + dataY.h + magicY) / dataY.h;

				var detailX:String = "		" + "x=" + dataX.x + " t=" + dataX.x + " r=" + dataX.r + " w=" + dataX.w;
				var detailY:String = "		" + "y=" + dataY.y + " t=" + dataY.y + " r=" + dataY.r + " h=" + dataY.h;
				var detailR:String = "		" + "r=" + Math.round(dataR.r);

				var withinPosition:Boolean = Math.abs(testX - dataT.x) <= positionTolerance && Math.abs(testY - dataT.y) <= positionTolerance;
				var withinPivot:Boolean = Math.abs(testPivotX - dataT.pX) <= pivotTolerance && Math.abs(testPivotY - dataT.pY) <= pivotTolerance;

				//if (!withinPosition || !withinPivot) {
				trace("==============", i);
				trace("r:" + Math2.round(testR, .001) + "	" + dataT.r + detailR);
				trace("mX:" + Math2.round(magicX, .001) + "	" + magic[i].pX + detailX);
				trace("mY:" + Math2.round(magicY, .001) + "	" + magic[i].pY + detailY);
				//trace("pX:" + Math2.round(testPivotX, .001) + "	" + dataT.pX + detailX);
				//trace("pY:" + Math2.round(testPivotY, .001) + "	" + dataT.pY + detailY);
				trace("x:" + Math2.round(testX, .001) + "	" + dataT.x);
				trace("y:" + Math2.round(testY, .001) + "	" + dataT.y);
					//}
			}
		}

		/**
		 * Rotate a point around another point.
		 * @param	$baseX
		 * @param	$baseY
		 * @param	$sourcX
		 * @param	$sourceY
		 * @param	$rotation
		 * @return
		 * @see http://blog.geomusings.com/2007/06/25/rotating-a-point-around-a-base-point/
		 */
		public function rotatePoint($baseX:Number, $baseY:Number, $sourceX:Number, $sourceY:Number, $rotation:Number):Object {
			var rotateX:Number;
			var rotateY:Number;

			// shift x and y relative to 0,0 origin
			var offsetX:Number = ($sourceX + ($baseX * -1));
			var offsetY:Number = ($sourceY + ($baseY * -1));

			// convert to radians. take absolute value (necessary for x coord only).
			offsetX = Math.abs(offsetX * (Math.PI / 180));
			//offsetX = offsetX * (Math.PI / 180);
			offsetY = offsetY * (Math.PI / 180);
			var rotationRadians:Number = $rotation * (Math.PI / 180);

			// get distance from origin to source point
			var distance:Number = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));

			// get current angle of orientation
			var theta:Number = Math.atan(offsetY / offsetX);

			// add rotation value to theta to get new angle of orientation
			var offsetTheta:Number = theta + rotationRadians;

			// calculate new coord
			rotateX = distance * Math.cos(offsetTheta);
			rotateY = distance * Math.sin(offsetTheta);

			// convert new x and y back to decimal degrees
			rotateX = rotateX * (180 / Math.PI);
			rotateY = rotateY * (180 / Math.PI);

			// shift new x and y relative to base point
			rotateX = (rotateX + $baseX);
			rotateY = (rotateY + $baseY);

			// return new point
			return {x:rotateX, y:rotateY};
		}
	}
}