window.kit = (function Action(kit) {

	var logErrors = function(response) {
		var errors = response.getError();
		if(errors) {
			errors.forEach(function(error) {
				console.error("Error with message: ", error.message);
			});
		} else {
			console.error("Unknown Error.");
		}
	};

	var onSuccess = function(action, response) {
		if(action.onSuccess && typeof action.onSuccess === "function") {
			action.onSuccess(response);
		}
	};

	var onError = function(action, response) {
		if(action.onError && typeof action.onError === "function") {
			action.onError(response);
		}
		logErrors(response);
	};

	var evaluateCallback = function(action, response) {
		var state = response.getState();
			if (state === "SUCCESS") {
				onSuccess(action, response);

			} else if (state === "ERROR") {
				onError(action, response);
			}
	};

	var call = function(component, action){
		var a = component.get(action.name);

		if(action.params && typeof action.params === "object") {
			a.setParams(action.params);
		}

		a.setCallback(this, function(response) {
			evaluateCallback(action, response);
		});

		$A.enqueueAction(a);
	};

	kit.action = {
		call: call
	};

	return kit;
})(window.kit || {});
