/**
 * Math contains math functions (awesome).
 * @author Pedro Chavez
 * @email pedro@oopstoons.com
 */
var Math2 = {

	round:function($value, $increment) {
		$increment = $increment ? $increment : 1;
		if ($increment <= 0){
			return $value;
		}
		return Math.floor(($value + $increment / 2) / $increment) / (1 / $increment);
	},

	ceil:function($value, $increment) {
		$increment = $increment ? $increment : 1;
		if ($increment <= 0){
			return $value;
		}
		return Math.ceil($value / $increment) / (1 / $increment);
	},

	ceil2:function($value) {
		return Math.ceil(Math.abs($value)) * getSign($value);
	},

	floor:function($value, $increment) {
		$increment = $increment ? $increment : 1;
		if ($increment <= 0){
			return $value;
		}
		return Math.floor($value / $increment) / (1 / $increment);
	},

	floor2:function($value) {
		return Math.floor(Math.abs($value)) * getSign($value);
	},

	random:function($a, $b, $increment) {
		if ($increment <= 0){
			$increment = 1;
		}
		var min = Math.min($a, $b);
		var max = Math.max($a, $b);
		return min + (Math.floor(Math.random() * ((max - min + $increment) / $increment)) / (1 / $increment));
	},

	randomBit:function($weight) {
		return Math.random() < $weight ? 0 : 1;
	},

	randomBoolean:function($weight) {
		return Math.random() < $weight;
	},

	randomSign:function($weight) {
		return Math.random() < $weight ? 1 : -1;
	},

	getPercent:function($a, $b, $value, $clamp) {
		if ($a == $b){
			return 0;
		}
		var value = ($value - $a) / ($b - $a);
		return $clamp ? clamp(value, 0, 1) : value;
	},

	getPercent2:function($a, $b, $value, $clamp) {
		if ($a == $b){
			return 0;
		}
		var value = (($value - $a) / ($b - $a)) * 2 - 1;
		return $clamp ? clamp(value, -1, 1) : value;
	},

	getValue:function($a, $b, $percent, $clamp) {
		var value = ($b - $a)
		if (!$clamp){
			return value;
		} else if ($a > $b){
			return clamp(value, $b, $a);
		} else {
			return clamp(value, $a, $b);
		}
	},

	getValue2:function($a, $b, $percent, $clamp) {
		$percent = $percent / 2 + .5;
		var value = ($b - $a)
		if (!$clamp){
			return value;
		} else if ($a > $b){
			return clamp(value, $b, $a);
		} else {
			return clamp(value, $a, $b);
		}
	},

	isEven:function($value) {
		return $value % 2 == 0 ? true : false;
	},

	isOdd:function($value) {
		return $value % 2 == 0 ? false : true;
	},

	getSign:function($value) {
		return $value >= 0 ? 1 : -1;
	},

	rot:function($a, $b, $y) {
		return (($y * $a) / $b);
	},

	wrap:function($value, $max) {
		return ((($value % $max) + $max) % $max);
	},

	clamp:function($value, $min, $max) {
		return Math.max($min, Math.min($max, $value));
	}
}