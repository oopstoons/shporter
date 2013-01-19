/**
 * Version:
 * 01/11/2013 Pedro Chavez
 * Original Version
 */
package extension {
	
	import flash.display.Sprite;

	public class Test extends Sprite {

		public function Test() {
			var input:Array = [{n:"0_0",x:-418,tX:-43,rX:0,w:838,y:-107,tY:-73,rY:0,h:128,r:0,sX:1,kX:0,sY:1,kY:0,ma:1,mb:0,mc:0,md:1}, {n:"1_0",x:347.95,tX:337,rX:7,w:49,y:-40.05,tY:-72.75,rY:16,h:33,r:0,sX:1.5,kX:0,sY:2,kY:0,ma:1.5,mb:0,mc:0,md:2}, {n:"2_0",x:264.95,tX:260.1,rX:7,w:49,y:-40.05,tY:-22.55,rY:16,h:33,r:0,sX:1.5,kX:0,sY:2,kY:0,ma:1.5,mb:0,mc:0,md:2}, {n:"3_0",x:181.95,tX:219.85,rX:7,w:49,y:-40.05,tY:-23.05,rY:16,h:33,r:0,sX:1.5,kX:0,sY:2,kY:0,ma:1.5,mb:0,mc:0,md:2}, {n:"4_0",x:98.95,tX:133.1,rX:7,w:49,y:-40.05,tY:-55.05,rY:16,h:33,r:0,sX:1.5,kX:0,sY:2,kY:0,ma:1.5,mb:0,mc:0,md:2}, {n:"5_0",x:15.95,tX:9.95,rX:7,w:49,y:-40.05,tY:-58.55,rY:16,h:33,r:0,sX:1.5,kX:0,sY:2,kY:0,ma:1.5,mb:0,mc:0,md:2}, {n:"6_0",x:-67.05,tX:-94.05,rX:7,w:49,y:-40.05,tY:9.95,rY:16,h:33,r:0,sX:1.5,kX:0,sY:2,kY:0,ma:1.5,mb:0,mc:0,md:2}, {n:"7_0",x:-150.05,tX:-73.55,rX:7,w:49,y:-40.05,tY:10.95,rY:16,h:33,r:0,sX:1.5,kX:0,sY:2,kY:0,ma:1.5,mb:0,mc:0,md:2}, {n:"8_0",x:-233.05,tX:-155.8,rX:7,w:49,y:-40.05,tY:-96.05,rY:16,h:33,r:0,sX:1.5,kX:0,sY:2,kY:0,ma:1.5,mb:0,mc:0,md:2}, {n:"9_0",x:-316.05,tX:-343.05,rX:7,w:49,y:-40.05,tY:-93.05,rY:16,h:33,r:0,sX:1.5,kX:0,sY:2,kY:0,ma:1.5,mb:0,mc:0,md:2}, {n:"10_0",x:-399.05,tX:-399.05,rX:7,w:49,y:-40,tY:-40,rY:16,h:33,r:0,sX:1.5,kX:0,sY:2,kY:0,ma:1.5,mb:0,mc:0,md:2}];
			var out:Array = [{x:-43, y:73, pX:0.447, pY:0.734, r:0, sX:1, sY:1}, {x:337.931034, y:72.413793, pX:0.024349, pY:0.986673, r:0, sX:1.5, sY:2}, {x:260.689655, y:21.37931, pX:0.074555, pY:0.223479, r:0, sX:1.5, sY:2}, {x:220.689655, y:22.758621, pX:0.669339, pY:0.244801, r:0, sX:1.5, sY:2}, {x:134.482759, y:55.172414, pX:0.625728, pY:0.736071, r:0, sX:1.5, sY:2}, {x:10.344828, y:58.62069, pX:0.066287, pY:0.788287, r:0, sX:1.5, sY:2}, {x:-93.103448, y:-11.034483, pX:-0.230973, pY:-0.267215, r:0, sX:1.5, sY:2}, {x:-73.103448, y:-11.724138, pX:1.179608, pY:-0.277513, r:0, sX:1.5, sY:2}, {x:-155.172414, y:95.172414, pX:1.192071, pY:1.34192, r:0, sX:1.5, sY:2}, {x:-343.05, y:92.413793, pX:-0.22112, pY:1.321475, r:0, sX:1.5, sY:2}, {x:-397.931034, y:39.310345, pX:0.16298, pY:0.486318, r:0, sX:1.5, sY:2}];
			//input.reverse();

			var positionTolerance:Number = 5;
			var pivotTolerance:Number = .1;
			
			trace("input:" + input.length, "out:" + out.length);

			for (var i:int = 0; i < input.length; i++) {
				var dataI:Object = input[i];
				var dataO:Object = out[i];
				
				// calculate scale
				var scaleX:Number = dataI.sX;
				var scaleY:Number = dataI.sY;
				

				// globalize topleft
				var topLeft:Object = rotatePoint(0, 0, dataI.rX * scaleX, dataI.rY * scaleY, -dataI.r);
				topLeft.x = dataI.x - topLeft.x;
				topLeft.y = dataI.y - topLeft.y;
		
				// localize the pivot point
				var localPivot:Object = rotatePoint(topLeft.x, topLeft.y, dataI.tX, dataI.tY, dataI.r);
				localPivot.x = localPivot.x - topLeft.x;
				localPivot.y = localPivot.y - topLeft.y;

				var testX:Number = dataI.tX;
				var testY:Number = -dataI.tY;
				var testPivotX:Number = getPercent(0, dataI.w * scaleX, localPivot.x);
				var testPivotY:Number = getPercent(dataI.h * scaleY, 0, localPivot.y);

				//var detailX:String = "		" + "x=" + dataI.x + " t=" + dataI.x + " r=" + dataI.rX + " w=" + dataI.w + " lP=" + localPivot.x + " rG=" + globalTopLeft.x;
				//var detailY:String = "		" + "y=" + dataI.y + " t=" + dataI.y + " r=" + dataI.rY + " h=" + dataI.h + " lP=" + localPivot.y + " rG=" + globalTopLeft.y;
				var detailX:String = "		" + " w=" + dataI.w + " lP=" + localPivot.x;
				var detailY:String = "		" + " h=" + dataI.h + " lP=" + localPivot.y;
				var detailR:String = "		" + "r=" + Math.round(dataI.r);

				var withinPosition:Boolean = Math.abs(testX - dataO.x) <= positionTolerance && Math.abs(testY - dataO.y) <= positionTolerance;
				var withinPivot:Boolean = Math.abs(testPivotX - dataO.pX) <= pivotTolerance && Math.abs(testPivotY - dataO.pY) <= pivotTolerance;

				if (!withinPosition || !withinPivot) {
					trace("==============", i, withinPosition, withinPivot, dataI.n);
					trace("r:" + round(dataI.r));
					trace("pX:" + round(testPivotX, .001) + "	" + dataO.pX + detailX);
					trace("pY:" + round(testPivotY, .001) + "	" + dataO.pY + detailY);
					trace(dataO.pX * dataI.w * scaleX);
					//trace("x:" + round(testX, .001) + "	" + dataO.x);
					//trace("y:" + round(testY, .001) + "	" + dataO.y);
				} else {
					trace("==============", i, "MATCH!");
				}
			}
		}

		/**
		 * @see http://blog.geomusings.com/2007/06/25/rotating-a-point-around-a-base-point/
		 */
		static public function rotatePoint($originX:Number, $originY:Number, $pointX:Number, $pointY:Number, $rotation:Number):Object {
			var angleRad:Number = $rotation * Math.PI / 180;
			var angleSin:Number = Math.sin(angleRad);
			var angleCos:Number = Math.cos(angleRad);
			
			var displaceX:Number = $pointX - $originX;
			var displaceY:Number = $pointY - $originY;
			var rotateX:Number = displaceX * angleCos + displaceY * angleSin;
			var rotateY:Number = displaceY * angleCos - displaceX * angleSin;
			return {x:rotateX + $originX, y:rotateY + $originY};
		}
		
		static public function round($value:Number, $increment:Number = 1):Number {
			return Math.floor(($value + $increment / 2) / $increment) / (1 / $increment);
		};
		
		static public function getPercent($a:Number, $b:Number, $value:Number):Number {
			if ($a == $b){
				return 0;
			}
			var value:Number = ($value - $a) / ($b - $a);
			return value;
		}
	}
}