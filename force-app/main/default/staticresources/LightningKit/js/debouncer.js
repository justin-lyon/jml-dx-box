window.kit = (function Debouncer(kit) {

	var debounce = function(func, delay) {
		var inDebounce = undefined;

		return function() {
			var context = this;
			var args = arguments;
			clearTimeout(inDebounce);
			inDebounce = setTimeout(function() {
				inDebounce = undefined;
				return func.apply(context, args);
			}, delay);
		};
	};

	kit.debouncer = {
		debounce: debounce
	};

	return kit;
})(window.kit || {});
