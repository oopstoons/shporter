/**
 * Version:
 * 01/11/2013 Pedro Chavez
 * Original Version
 */
package extension {
	
	import flash.display.Sprite;

	public class Test extends Sprite {

		public function Test() {
			var xxx:Array = [{x:-180,t:15,r:0,w:390,p:195,rG:-180}, {x:-150.75,t:-156.15,r:6.3,w:44.85,p:0.9,rG:-157.05}, {x:-142.6,t:-133.15,r:6.3,w:44.85,p:-0.945,rG:-132.4241553465689}, {x:-126.6,t:-111.75,r:6.3,w:44.85,p:-0.901,rG:-110.1510871325502}, {x:-118.5,t:-113.1,r:6.3,w:44.85,p:-0.9,rG:-112.2}, {x:-126.65,t:-136.1,r:6.3,w:44.85,p:0.945,rG:-136.8258446534311}, {x:-142.65,t:-157.5,r:6.3,w:44.85,p:0.901,rG:-159.0989128674498}, {x:-80.95,t:-80.95,r:6.3,w:44.85,p:6.3,rG:-87.25}, {x:-72.8,t:-72.8,r:6.3,w:44.85,p:-6.3,rG:-62.62415534656893}, {x:-56.8,t:-56.8,r:6.3,w:44.85,p:-6.3,rG:-40.351087132550205}, {x:-48.7,t:-48.7,r:6.3,w:44.85,p:-6.3,rG:-42.4}, {x:-56.85,t:-56.85,r:6.3,w:44.85,p:6.3,rG:-67.02584465343108}, {x:-72.85,t:-72.85,r:6.3,w:44.85,p:6.3,rG:-89.29891286744979}, {x:-11.15,t:4.9,r:6.3,w:44.85,p:22.35,rG:-17.450000000000003}, {x:-3,t:5.05,r:6.3,w:44.85,p:-22.363,rG:7.1758446534310725}, {x:13,t:5.05,r:6.3,w:44.85,p:-22.313,rG:29.448912867449796}, {x:21.1,t:5.05,r:6.3,w:44.85,p:-22.35,rG:27.400000000000006}, {x:12.95,t:4.9,r:6.3,w:44.85,p:22.363,rG:2.774155346568925}, {x:-3.05,t:4.9,r:6.3,w:44.85,p:22.313,rG:-19.498912867449796}, {x:58.7,t:94.8,r:6.3,w:44.85,p:42.4,rG:52.400000000000006}, {x:66.85,t:75.35,r:6.3,w:44.85,p:-42.317,rG:77.02584465343107}, {x:82.85,t:55.45,r:6.3,w:44.85,p:-42.36,rG:99.29891286744979}, {x:90.95,t:54.85,r:6.3,w:44.85,p:-42.4,rG:97.25}, {x:82.8,t:74.3,r:6.3,w:44.85,p:42.317,rG:72.62415534656893}, {x:66.8,t:94.2,r:6.3,w:44.85,p:42.36,rG:50.351087132550205}, {x:128.5,t:174.35,r:6.3,w:44.85,p:52.15,rG:122.2}, {x:136.65,t:139.05,r:6.3,w:44.85,p:-52.072,rG:146.8258446534311}, {x:152.65,t:109.45,r:6.3,w:44.85,p:-52.091,rG:169.0989128674498}, {x:160.75,t:114.9,r:6.3,w:44.85,p:-52.15,rG:167.05}, {x:152.6,t:150.2,r:6.3,w:44.85,p:52.072,rG:142.4241553465689}, {x:136.6,t:179.8,r:6.3,w:44.85,p:52.091,rG:120.1510871325502}];
			var yyy:Array = [{y:-173,t:2,r:0,h:350,p:175,rG:-173}, {y:-132.9,t:-146.9,r:15.35,h:30.75,p:1.35,rG:-148.25}, {y:-94.5,t:-106.1,r:15.35,h:30.75,p:-1.379,rG:-107.6059027002812}, {y:-42.15,t:-39.85,r:15.35,h:30.75,p:-1.326,rG:-39.97152221056892}, {y:24.25,t:38.25,r:15.35,h:30.75,p:-1.35,rG:39.599999999999994}, {y:90.55,t:102.15,r:15.35,h:30.75,p:1.379,rG:103.6559027002812}, {y:143.05,t:140.75,r:15.35,h:30.75,p:1.326,rG:140.87152221056894}, {y:-132.9,t:-132.9,r:15.35,h:30.75,p:15.35,rG:-148.25}, {y:-94.45,t:-94.45,r:15.35,h:30.75,p:-15.35,rG:-107.55590270028121}, {y:-42.05,t:-42.05,r:15.35,h:30.75,p:-15.35,rG:-39.87152221056892}, {y:24.4,t:24.4,r:15.35,h:30.75,p:-15.35,rG:39.74999999999999}, {y:90.75,t:90.75,r:15.35,h:30.75,p:15.35,rG:103.8559027002812}, {y:143.1,t:143.1,r:15.35,h:30.75,p:15.35,rG:140.92152221056892}, {y:-132.95,t:-133,r:15.35,h:30.75,p:15.3,rG:-148.29999999999998}, {y:-94.5,t:-80.6,r:15.35,h:30.75,p:-15.289,rG:-107.6059027002812}, {y:-42.1,t:-28.2,r:15.35,h:30.75,p:-15.324,rG:-39.921522210568924}, {y:24.35,t:24.4,r:15.35,h:30.75,p:-15.3,rG:39.699999999999996}, {y:90.7,t:76.8,r:15.35,h:30.75,p:15.289,rG:103.80590270028121}, {y:143.1,t:129.2,r:15.35,h:30.75,p:15.324,rG:140.92152221056892}, {y:-132.9,t:-122,r:15.35,h:30.75,p:26.25,rG:-148.25}, {y:-94.5,t:-57.85,r:15.35,h:30.75,p:-26.225,rG:-107.6059027002812}, {y:-42.15,t:-16.3,r:15.35,h:30.75,p:-26.243,rG:-39.97152221056892}, {y:24.25,t:13.35,r:15.35,h:30.75,p:-26.25,rG:39.599999999999994}, {y:90.55,t:53.9,r:15.35,h:30.75,p:26.225,rG:103.6559027002812}, {y:143.05,t:117.2,r:15.35,h:30.75,p:26.243,rG:140.87152221056894}, {y:-132.9,t:-109.35,r:15.35,h:30.75,p:38.9,rG:-148.25}, {y:-94.5,t:-43.1,r:15.35,h:30.75,p:-38.859,rG:-107.6059027002812}, {y:-42.15,t:-14.15,r:15.35,h:30.75,p:-38.875,rG:-39.97152221056892}, {y:24.25,t:0.7,r:15.35,h:30.75,p:-38.9,rG:39.599999999999994}, {y:90.55,t:39.15,r:15.35,h:30.75,p:38.859,rG:103.6559027002812}, {y:143.05,t:115.05,r:15.35,h:30.75,p:38.875,rG:140.87152221056894}];
			var rrr:Array = [{r:0}, {r:0}, {r:60.14131164550781}, {r:119.85868835449219}, {r:180}, {r:-119.85868835449219}, {r:-60.14131164550781}, {r:0}, {r:60.14131164550781}, {r:119.85868835449219}, {r:180}, {r:-119.85868835449219}, {r:-60.14131164550781}, {r:0}, {r:60.14131164550781}, {r:119.85868835449219}, {r:180}, {r:-119.85868835449219}, {r:-60.14131164550781}, {r:0}, {r:60.14131164550781}, {r:119.85868835449219}, {r:180}, {r:-119.85868835449219}, {r:-60.14131164550781}, {r:0}, {r:60.14131164550781}, {r:119.85868835449219}, {r:180}, {r:-119.85868835449219}, {r:-60.14131164550781}];
			var out:Array = [{x:15, y:-2, pX:0.5, pY:0.5, r:0}, {x:-156, y:147, pX:0.02, pY:0.956, r:0}, {x:-132.105263, y:106.842105, pX:0.004415, pY:0.959218, r:299.859}, {x:-111.052632, y:41.052632, pX:0.024743, pY:0.998064, r:240.141}, {x:-112.631579, y:-37.894737, pX:0.030292, pY:0.955715, r:180}, {x:-136, y:-102, pX:0.021, pY:0.955, r:119.859}, {x:-157, y:-141, pX:0.02, pY:0.957, r:60.141}, {x:-81, y:133, pX:0.14, pY:0.501, r:0}, {x:-72.105263, y:95.263158, pX:0.135767, pY:0.538985, r:299.859}, {x:-56.842105, y:42.105263, pX:0.163717, pY:0.485487, r:240.141}, {x:-48.947368, y:-24.210526, pX:0.151228, pY:0.521071, r:180}, {x:-57, y:-91, pX:0.14, pY:0.501, r:119.859}, {x:-73, y:-143, pX:0.14, pY:0.501, r:60.141}, {x:5, y:133, pX:0.498, pY:0.502, r:0}, {x:5.789474, y:81.052632, pX:0.505395, pY:0.493603, r:299.859}, {x:5.263158, y:28.421053, pX:0.499106, pY:0.518079, r:240.141}, {x:5.263158, y:-23.684211, pX:0.490304, pY:0.503093, r:180}, {x:5, y:-77, pX:0.499, pY:0.503, r:119.859}, {x:5, y:-129, pX:0.498, pY:0.502, r:60.141}, {x:95, y:122, pX:0.945, pY:0.146, r:0}, {x:76.315789, y:58.947368, pX:0.932945, pY:0.181209, r:299.859}, {x:56.842105, y:17.894737, pX:0.93084, pY:0.195004, r:240.141}, {x:55.789474, y:-12.631579, pX:0.932193, pY:0.178278, r:180}, {x:74, y:-54, pX:0.944, pY:0.147, r:119.859}, {x:94, y:-117, pX:0.944, pY:0.147, r:60.141}, {x:174, y:109, pX:1.163, pY:-0.265, r:0}, {x:140, y:44.210526, pX:1.135653, pY:-0.239134, r:299.859}, {x:109.473684, y:15.263158, pX:1.141249, pY:-0.263321, r:240.141}, {x:115.789474, y:-0.526316, pX:1.135246, pY:-0.246036, r:180}, {x:150, y:-39, pX:1.161, pY:-0.264, r:119.859}, {x:180, y:-115, pX:1.161, pY:-0.264, r:60.141}];

			var positionTolerance:Number = 5;
			var pivotTolerance:Number = .05;

			for (var i:int = 0; i < out.length; i++) {
				var dataX:Object = xxx[i];
				var dataY:Object = yyy[i];
				var dataR:Object = rrr[i];
				var dataT:Object = out[i];

				// globalize topleft
				var topLeft:Object = rotatePoint(0, 0, dataX.r, dataY.r, -dataR.r);
				topLeft.x = dataX.x - topLeft.x;
				topLeft.y = dataY.y - topLeft.y;
		
				// localize the pivot point
				var localPivot:Object = rotatePoint(topLeft.x, topLeft.y, dataX.t, dataY.t, dataR.r);
				localPivot.x = localPivot.x - topLeft.x;
				localPivot.y = localPivot.y - topLeft.y;

				var testX:Number = dataX.t;
				var testY:Number = -dataY.t;
				var testPivotX:Number = getPercent(0, dataX.w, localPivot.x);
				var testPivotY:Number = getPercent(dataY.h, 0, localPivot.y);

				//var detailX:String = "		" + "x=" + dataX.x + " t=" + dataX.x + " r=" + dataX.r + " w=" + dataX.w + " lP=" + localPivot.x + " rG=" + globalTopLeft.x;
				//var detailY:String = "		" + "y=" + dataY.y + " t=" + dataY.y + " r=" + dataY.r + " h=" + dataY.h + " lP=" + localPivot.y + " rG=" + globalTopLeft.y;
				var detailX:String = "		" + " w=" + dataX.w + " lP=" + localPivot.x;
				var detailY:String = "		" + " h=" + dataY.h + " lP=" + localPivot.y;
				var detailR:String = "		" + "r=" + Math.round(dataR.r);

				var withinPosition:Boolean = Math.abs(testX - dataT.x) <= positionTolerance && Math.abs(testY - dataT.y) <= positionTolerance;
				var withinPivot:Boolean = Math.abs(testPivotX - dataT.pX) <= pivotTolerance && Math.abs(testPivotY - dataT.pY) <= pivotTolerance;

				if (!withinPosition || !withinPivot) {
					trace("==============", i, withinPivot);
					trace("r:" + round(dataR.r));
					trace("pX:" + round(testPivotX, .001) + "	" + dataT.pX + detailX);
					trace("pY:" + round(testPivotY, .001) + "	" + dataT.pY + detailY);
					//trace("x:" + round(testX, .001) + "	" + dataT.x);
					//trace("y:" + round(testY, .001) + "	" + dataT.y);
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