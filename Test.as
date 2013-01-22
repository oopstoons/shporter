/**
 * Version:
 * 01/11/2013 Pedro Chavez
 * Original Version
 */
package {

	import flash.display.Sprite;

	public class Test extends Sprite {

		public function Test() {
			var input:Array = [{n:"0_0", x:-388.1, tX:-388.1, rX:7, w:49, y:236.2, tY:236.2, rY:16, h:33, r:NaN, sX:0.9578704833984375, kX:135.42259216308594, sY:0.9578704833984375, kY:-44.57740783691406, ma:0.6822967529296875, mb:-0.67230224609375, mc:-0.67230224609375, md:-0.6822967529296875}, {n:"1_0", x:-100.5, tX:-100.5, rX:7, w:49, y:164.35, tY:164.35, rY:16, h:33, r:NaN, sX:0.9999847412109375, kX:-165.99996948242188, sY:0.9999847412109375, kY:14.000030517578125, ma:0.9702911376953125, mb:0.2419281005859375, mc:0.2419281005859375, md:-0.9702911376953125}, {n:"2_0", x:-172.55, tX:-172.55, rX:7, w:49, y:164.35, tY:164.35, rY:16, h:33, r:NaN, sX:1, kX:161.00067138671875, sY:1, kY:-18.99932861328125, ma:0.945526123046875, mb:-0.3255615234375, mc:-0.3255615234375, md:-0.945526123046875}, {n:"3_0", x:-214.8, tX:-214.8, rX:7, w:49, y:161.25, tY:161.25, rY:16, h:33, r:NaN, sX:1, kX:-18.99932861328125, sY:1, kY:161.00067138671875, ma:-0.945526123046875, mb:0.3255615234375, mc:0.3255615234375, md:0.945526123046875}, {n:"4_0", x:-286.85, tX:-286.85, rX:7, w:49, y:161.25, tY:161.25, rY:16, h:33, r:NaN, sX:0.9999847412109375, kX:14.000030517578125, sY:0.9999847412109375, kY:-165.99996948242188, ma:-0.9702911376953125, mb:-0.2419281005859375, mc:-0.2419281005859375, md:0.9702911376953125}, {n:"5_0", x:-359.5, tX:-359.5, rX:7, w:49, y:161.25, tY:161.25, rY:16, h:33, r:NaN, sX:1, kX:0, sY:1, kY:180, ma:-1, mb:0, mc:0, md:1}, {n:"6_0", x:-387.05, tX:-387.05, rX:7, w:49, y:109.75, tY:109.75, rY:16, h:33, r:NaN, sX:0.9653472900390625, kX:129.8532257080078, sY:0.9653472900390625, kY:-50.14677429199219, ma:0.618621826171875, mb:-0.7410888671875, mc:-0.7410888671875, md:-0.618621826171875}, {n:"7_0", x:-393.55, tX:-393.55, rX:7, w:49, y:32.95, tY:32.95, rY:16, h:33, r:NaN, sX:1, kX:180, sY:1, kY:0, ma:1, mb:0, mc:0, md:-1}, {n:"8_0", x:-370.85, tX:-370.85, rX:7, w:49, y:-14.55, tY:-14.55, rY:16, h:33, r:-112.04112243652344, sX:0.8932037353515625, kX:-112.04112243652344, sY:0.8932037353515625, kY:-112.04112243652344, ma:-0.3351898193359375, mb:-0.8279266357421875, mc:0.8279266357421875, md:-0.3351898193359375}, {n:"9_0", x:-368, tX:-368, rX:7, w:49, y:-116.4, tY:-116.4, rY:16, h:33, r:120.81466674804688, sX:0.969085693359375, kX:120.81466674804688, sY:0.969085693359375, kY:120.81466674804688, ma:-0.496429443359375, mb:0.832275390625, mc:-0.832275390625, md:-0.496429443359375}, {n:"10_0", x:-391.75, tX:-391.75, rX:7, w:49, y:-182.25, tY:-182.25, rY:16, h:33, r:25.045257568359375, sX:0.9908294677734375, kX:25.045257568359375, sY:0.9908294677734375, kY:25.045257568359375, ma:0.8976593017578125, mb:0.4194488525390625, mc:-0.4194488525390625, md:0.8976593017578125}, {n:"11_0", x:-393.55, tX:-393.55, rX:7, w:49, y:-235.95, tY:-235.95, rY:16, h:33, r:0, sX:1, kX:0, sY:1, kY:0, ma:1, mb:0, mc:0, md:1}];
			var out:Array = [{x:-43, y:73, pX:0.447, pY:0.734, r:0, sX:1, sY:1}, {x:337.931034, y:72.413793, pX:0.024349, pY:0.986673, r:0, sX:1.5, sY:2}, {x:260.689655, y:21.37931, pX:0.074555, pY:0.223479, r:0, sX:1.5, sY:2}, {x:220.689655, y:22.758621, pX:0.669339, pY:0.244801, r:0, sX:1.5, sY:2}, {x:134.482759, y:55.172414, pX:0.625728, pY:0.736071, r:0, sX:1.5, sY:2}, {x:10.344828, y:58.62069, pX:0.066287, pY:0.788287, r:0, sX:1.5, sY:2}, {x:-93.103448, y:-11.034483, pX:-0.230973, pY:-0.267215, r:0, sX:1.5, sY:2}, {x:-73.103448, y:-11.724138, pX:1.179608, pY:-0.277513, r:0, sX:1.5, sY:2}, {x:-155.172414, y:95.172414, pX:1.192071, pY:1.34192, r:0, sX:1.5, sY:2}, {x:-343.05, y:92.413793, pX:-0.22112, pY:1.321475, r:0, sX:1.5, sY:2}, {x:-397.931034, y:39.310345, pX:0.16298, pY:0.486318, r:0, sX:1.5, sY:2}];
			input.reverse();

			var positionTolerance:Number = 5;
			var pivotTolerance:Number = .1;

			trace("input:" + input.length, "out:" + out.length);

			for (var i:int = 0; i < input.length; i++) {
				var dataI:Object = input[i];
				//var dataO:Object = out[i];

				// calculate angle and scale
				var angle:Number;
				var scaleX:Number = dataI.sX;
				var scaleY:Number = dataI.sY;
				if (isNaN(dataI.r)) {
					scaleX = dataI.ma >= 0 ? dataI.sX : -dataI.sX;
					scaleY = dataI.md >= 0 ? dataI.sY : -dataI.sY;
					angle = dataI.kX < 0 ? dataI.sX : dataI.sX + 180;
					
				} else {
					scaleX = dataI.sX;
					scaleY = dataI.sY;
					angle = dataI.r;
				}

				// globalize topleft
				var topLeft:Object = rotatePoint(0, 0, dataI.rX * scaleX, dataI.rY * scaleY, -angle);
				topLeft.x = dataI.x - topLeft.x;
				topLeft.y = dataI.y - topLeft.y;

				// localize the pivot point
				var localPivot:Object = rotatePoint(topLeft.x, topLeft.y, dataI.tX, dataI.tY, angle);
				localPivot.x = localPivot.x - topLeft.x;
				localPivot.y = localPivot.y - topLeft.y;

				var testX:Number = dataI.tX;
				var testY:Number = -dataI.tY;
				var testPivotX:Number = getPercent(0, dataI.w * scaleX, localPivot.x);
				var testPivotY:Number = getPercent(dataI.h * scaleY, 0, localPivot.y);

				//var detailX:String = "		" + "x=" + dataI.x + " t=" + dataI.x + " r=" + dataI.rX + " w=" + dataI.w + " lP=" + localPivot.x + " rG=" + globalTopLeft.x;
				//var detailY:String = "		" + "y=" + dataI.y + " t=" + dataI.y + " r=" + dataI.rY + " h=" + dataI.h + " lP=" + localPivot.y + " rG=" + globalTopLeft.y;
				var detailR:String = "	" + "r=" + Math.round(dataI.r) + " kX=" + Math.round(dataI.kX) + " kY=" + Math.round(dataI.kY)
				//var detailS:String = "	" + "sX=" + Math.round(dataI.sX) + " sY=" + Math.round(dataI.sY);
				var detailM:String = "		" + "a=" + Math.round(dataI.ma) + " b=" + Math.round(dataI.mb) + " c=" + Math.round(dataI.mc) + " d=" + Math.round(dataI.md);
				
				//var withinPosition:Boolean = Math.abs(testX - dataO.x) <= positionTolerance && Math.abs(testY - dataO.y) <= positionTolerance;
				//var withinPivot:Boolean = Math.abs(testPivotX - dataO.pX) <= pivotTolerance && Math.abs(testPivotY - dataO.pY) <= pivotTolerance;

				//if (isNaN(dataI.r)) {
					//if (!withinPosition || !withinPivot) {
					//trace("==============", i, withinPosition, withinPivot, dataI.n);
					trace("==============", i, dataI.n);
					trace("r:" + round(angle) + "	" + detailR);
					trace("m:" + detailM);
					//trace("pX:" + round(testPivotX, .001) + "	" + detailX);
					//trace("pY:" + round(testPivotY, .001) + "	" + detailY);
					//trace("pX:" + round(testPivotX, .001) + "	" + dataO.pX + detailX);
					//trace("pY:" + round(testPivotY, .001) + "	" + dataO.pY + detailY);
					//trace(dataO.pX * dataI.w * scaleX);
					//trace("x:" + round(testX, .001) + "	" + dataO.x);
					//trace("y:" + round(testY, .001) + "	" + dataO.y);
					//} else {
					//trace("==============", i, "MATCH!");
				//}
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

		static public function round($value:Number, $increment:Number=1):Number {
			return Math.floor(($value + $increment / 2) / $increment) / (1 / $increment);
		};

		static public function getPercent($a:Number, $b:Number, $value:Number):Number {
			if ($a == $b) {
				return 0;
			}
			var value:Number = ($value - $a) / ($b - $a);
			return value;
		}
	}
}