/**
 * RandomUtil contains random functions (cool).
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 * @see https://github.com/oopstoons/shporter
 */
var RandomUtil = {

	//-----------------------------------------------------------------------------------------------------------------------------
	// RANDOM METHODS

	/**
	 * Inclusive random number between 2 values with a specified increment.
	 * @param $a The start number to randomize
	 * @param $b The end number to randomize
	 * @param $increment The increment to randomize by. To randomize to decimal points, set to a decimal value (.1, .01, .25).
	 * @return A random value.
	 * @example
	 * RandomUtil.random(100)             // random integer between 0, 100 (not 0 - 99)
	 * RandomUtil.random(-100, 100, .1)   // random number between -100, 100 within 1 decimal point precision
	 * RandomUtil.random(2, 5, .05)       // random nickel value between 2, 5
	 * RandomUtil.random(200, 300, 2)     // random even integer between 200, 300
	 * RandomUtil.random(200, 299, 2) + 1 // random odd integer between 200, 300
	 * RandomUtil.random(0, 500, 25)      // random integer between 0, 500 incremented by 25
	 */
	random:function($a, $b, $increment) {
		$increment = !$increment || $increment <= 0 ? 1 : $increment;
		var min = Math.min($a, $b);
		var max = Math.max($a, $b);
		return min + (Math.floor(Math.random() * ((max - min + $increment) / $increment)) / (1 / $increment));
	},

	/**
	 * Random bit.
	 * @param $weight The weighted percentage towards 0
	 * @return A random bit, 0 or 1.
	 * @example
	 * RandomUtil.randomBit()      // 50% 0, 50% 1
	 * RandomUtil.randomBit(.75)   // 75% 0, 25% 1
	 */
	randomBit:function($weight) {
		return Math.random() < $weight ? 0 : 1;
	},

	/**
	 * Random boolean.
	 * @param $weight The weighted percentage towards true
	 * @return A random boolean, true or false.
	 * @example
	 * RandomUtil.randomBoolean()      // 50% true, 50% false
	 * RandomUtil.randomBoolean(.75)   // 75% true, 25% false
	 */
	randomBoolean:function($weight) {
		return Math.random() < $weight;
	},

	/**
	 * Random sign.
	 * @param $weight The weighted percentage towards positive
	 * @return A random sign, 1 or -1.
	 * @example
	 * RandomUtil.randomSign()       // 50% 1, 50% -1
	 * RandomUtil.randomSign(.75)    // 75% 1, 25% -1
	 */
	randomSign:function($weight) {
		return Math.random() < $weight ? 1 : -1;
	}
}