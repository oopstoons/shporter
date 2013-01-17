/**
 * Math contains math functions (awesome).
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 */
var Math2 = {

	//-----------------------------------------------------------------------------------------------------------------------------
	// ROUNDING METHODS

	/**
	 * Rounds a number to a specified increment.
	 * @param $value The value to round
	 * @param $increment The increment to round to. To round to decimal points, set to a decimal value (.1, .01, .25).
	 * @return The rounded value
	 * @example <listing>
	 * Math2.round(239.173)       // 239
	 * Math2.round(239.173, .01)  // 239.17
	 * Math2.round(239.173, .1)   // 239.2
	 * Math2.round(239.173, 5)    // 240
	 * Math2.round(239.173, 50)   // 250
	 * Math2.round(239.173, 100)  // 200</listing>
	 */
	round:function($value, $increment) {
		$increment = !$increment || $increment <= 0 ? 1 : $increment;
		// this first method returns inprecise decimal $values, ie:3.00000000000001
		//return Math.floor(($value + $increment / 2) / $increment) * $increment;
		return Math.floor(($value + $increment / 2) / $increment) / (1 / $increment);
	},

	/**
	 * Ceilings a number to a specified increment.
	 * @param $value The value to ceiling
	 * @param $increment The increment to ceiling to. To ceiling to decimal points, set to a decimal value (.1, .01, .25).
	 * @return The ceilinged value
	 * @example <listing>
	 * Math2.ceil(239.173)       // 240
	 * Math2.ceil(239.173, .01)  // 239.18
	 * Math2.ceil(239.173, .1)   // 239.2
	 * Math2.ceil(239.173, 5)    // 240
	 * Math2.ceil(239.173, 50)   // 250
	 * Math2.ceil(239.173, 100)  // 200</listing>
	 */
	ceil:function($value, $increment) {
		$increment = !$increment || $increment <= 0 ? 1 : $increment;
		return Math.ceil($value / $increment) / (1 / $increment);
	},

	/**
	 * Floors a number to a specified increment.
	 * @param $value The value to floor
	 * @param $increment The increment to floor to. To floor to decimal points, set to a decimal value (.1, .01, .25).
	 * @return The floored value
	 * @example <listing>
	 * Math2.floor(239.173)      // 239
	 * Math2.floor(239.173, .01) // 239.17
	 * Math2.floor(239.173, .1)  // 239.1
	 * Math2.floor(239.173, 5)   // 235
	 * Math2.floor(239.173, 50)  // 200
	 * Math2.floor(239.173, 100) // 200</listing>
	 */
	floor:function($value, $increment) {
		$increment = !$increment || $increment <= 0 ? 1 : $increment;
		return Math.floor($value / $increment) / (1 / $increment);
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// PERCENT-VALUE CONVERSIONS

	/**
	 * Get the percent of value x between two numbers (0 - 1).
	 * @param $a The first number to compare.
	 * @param $b The second number to compare.
	 * @param $value A number to compare against the two above.
	 * @return The percent of value x between a and b
	 * @example <listing>
	 * Math2.getPercent(0, 100, 75)     // .75 (75%) = 75 between 0 and 100
	 * Math2.getPercent(100, 200, 150)  // .5 (50%) = 150 between 100 and 200</listing>
	 */
	getPercent:function($a, $b, $value, $clamp) {
		if ($a == $b){
			return 0;
		}
		var value = ($value - $a) / ($b - $a);
		return $clamp ? clamp(value, 0, 1) : value;
	},

	/**
	 * Get the percent of value x between two numbers (-1 - 1).
	 * @param $a The first number to compare.
	 * @param $b The second number to compare.
	 * @param $value A number to compare against the two above.
	 * @return The percent of value x between a and b
	 * @example <listing>
	 * Math2.getPercent(0, 100, 75)      // .5 (50%) = 75 between 0 and 100
	 * Math2.getPercent(0, 100, 25)      // -.5 (50%) = 25 between 0 and 100
	 * Math2.getPercent(100, 200, 150)   // 0 (0%) = 150 between 100 and 200</listing>
	 */
	getPercent2:function($a, $b, $value, $clamp) {
		if ($a == $b){
			return 0;
		}
		var value = (($value - $a) / ($b - $a)) * 2 - 1;
		return $clamp ? clamp(value, -1, 1) : value;
	},

	/**
	 * Get the value of x% between two numbers.
	 * @param $a The first number to compare.
	 * @param $b The second number to compare.
	 * @param $x A percent between the first and second numbers. 100% = 1
	 * @return The percent value between a and b
	 * @example <listing>
	 * Math2.getValue(0, 100, .75)     // 75 = 75% between 0 and 100
	 * Math2.getValue(50, 75, .25)     // 56.25 = 25% between 50 and 75</listing>
	 */
	getValue:function($a, $b, $percent, $clamp) {
		var value = ($b - $a) * $percent + $a;
		if (!$clamp){
			return value;
		} else if ($a > $b){
			return clamp(value, $b, $a);
		} else {
			return clamp(value, $a, $b);
		}
	},

	/**
	 * Get the value of x% between two numbers when % is a number between -1 and 1.
	 * @param $a The first number to compare.
	 * @param $b The second number to compare.
	 * @param $x A percent between the first and second numbers. 100% = 1
	 * @return The percent value between a and b
	 * @example <listing>
	 * Math2.getValue(0, 100, .75)     // 75 = 75% between 0 and 100
	 * Math2.getValue(50, 75, .25)     // 56.25 = 25% between 50 and 75</listing>
	 */
	getValue2:function($a, $b, $percent, $clamp) {
		$percent = $percent / 2 + .5;
		var value = ($b - $a) * $percent + $a;
		if (!$clamp){
			return value;
		} else if ($a > $b){
			return clamp(value, $b, $a);
		} else {
			return clamp(value, $a, $b);
		}
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// IS METHODS

	/**
	 * Checks if the value is even.
	 * @param	$value	The value to check if it's an even number.
	 * @return			True if even, false if odd.
	 */
	isEven:function($value) {
		return $value % 2 == 0 ? true : false;
	},

	/**
	 * Checks if the value is odd.
	 * @param	$value	The value to check if it's an odd number.
	 * @return			True if odd, false if even.
	 */
	isOdd:function($value) {
		return $value % 2 == 0 ? false : true;
	},

	//-----------------------------------------------------------------------------------------------------------------------------
	// METHODS

	/**
	 * Get the sign of a value.
	 * @param $value The value to get the sign from
	 * @return 1 for positive numbers, -1 for negative numbers
	 */
	getSign:function($value) {
		return $value >= 0 ? 1 : -1;
	},

	/**
	 * Rule of Three. Mathematical method to solve proportions. Given a proportion such as: a/b = x/y. Use this method to solve for x.
	 * @param $a A Number
	 * @param $b A Number
	 * @param $y A Number
	 * @return The proportion to y that a is to b
	 * @example <listing>
	 * 1 / 3 = x / 6
	 * x = Math2.rot(1, 3, 6)    // 2</listing>
	 */
	rot:function($a, $b, $y) {
		return (($y * $a) / $b);
	},

	/**
	 * Wraps a number by the specified maximum. Works with negative values.
	 * @param $value The number to wrap
	 * @param $max A maximum number to wrap to
	 * @return The value wrapped
	 * @example <listing>Math2.wrap(150, 100)   // 50</listing>
	 */
	wrap:function($value, $max) {
		return ((($value % $max) + $max) % $max);
	},

	/**
	 * Clamps a number within a minimum and maximum values.
	 * @param	$value	The number to clamp.
	 * @param	$min	The minimum value.
	 * @param	$max	The maximum value.
	 * @return			The clamped value.
	 * @example <listing>
	 * Math2.clamp(105, 100, 120)   // 105
	 * Math2.clamp(150, 100, 120)   // 120
	 * Math2.clamp(75, 100, 120)    // 100
	 * </listing>
	 */
	clamp:function($value, $min, $max) {
		return Math.max($min, Math.min($max, $value));
	}
}
