window.kit = (function Promisify(kit) {

	var promisify = function(auraAction) {
		return new Promise(function(resolve, reject) {
			auraAction.setCallback(this, function(res) {
				var state = res.getState();
				if(state === "SUCCESS") {
					resolve(res);
				} else {
					reject(res);
				}
			});

			$A.enqueueAction(auraAction);
		});
	};

	kit.promisify = promisify;

	return kit;
})(window.kit || {});
