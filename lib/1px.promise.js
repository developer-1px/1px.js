$module("1px").factory("Promise", [function() {
	"use strict";

	var PENDING = "pending";
	var FULFILLED = "fulfilled";
	var REJECTED = "rejected";

	function thenable(obj) {
		var type = typeof obj;
		if (obj && (type === "object" || type === "function")) {
			var then = obj["then"];
			if (typeof then === "function") {
				return then;
			}
		}
	}

	function once(fn) {
		var done = false;
		return function(value) {
			if (done) return;
			done = true;
			fn(value);
		}
	}

	function chain(fn, resolve, reject) {
		return function(result) {
			if (typeof fn === "function") {
				try {
					return resolve(fn(result));
				}
				catch(e) {
					return reject(e);
				}
			}
			else {
				return resolve(result);
			}
		}
	}

	function Resolve(excutor, resolve, reject) {
		resolve = once(resolve);
		reject = once(reject);

		try {
			excutor(resolve, reject);
		}
		catch(e) {
			reject(e);
		}
	}

	function Promise(executor) {
		var state = PENDING;
		var value;
		var handlers = [];

		function fulfill(result) {
			state = FULFILLED;
			value = result;
			handlers && handlers.forEach(handle);
			handlers = null;
		}

		function reject(error) {
			state = REJECTED;
			value = error;
			handlers && handlers.forEach(handle);
			handlers = null;
		}

		function resolve(x) {
			try {
				var then = thenable(x);
				if (then) {
					return Resolve(then.bind(x), resolve, reject);
				}
				fulfill(x);
			}
			catch(e) {
				reject(e);
			}
		}

		function handle(handler) {
			if (state === PENDING) {
				handlers.push(handler);
				return;
			}

			if (state === FULFILLED && typeof handler.onFulfilled === "function") {
				handler.onFulfilled(value);
				return;
			}

			if (state === REJECTED && typeof handler.onRejected === "function") {
				handler.onRejected(value);
			}
		}

		function done(onFulfilled, onRejected) {
			setTimeout(function() {
				handle({onFulfilled: onFulfilled, onRejected: onRejected});
			}, 0);
		}

		function nextPromiseExcutor(onFulfilled, onRejected) {
			return function(resolve, reject) {
				return done(chain(onFulfilled, resolve, reject), chain(onRejected, resolve, reject));
			};
		}

		this["then"] = function(onFulfilled, onRejected) {
			return new Promise(nextPromiseExcutor(onFulfilled, onRejected));
		};

		Resolve(executor, resolve, reject);
	}
	Promise.prototype = {
		"catch": function(onRejected) {
			return this.then(undefined, onRejected);
		},
		"finally": function(onFulfilled) {
			return this.then(onFulfilled, onFulfilled);
		}
	};


	Promise.resolve = function(x) {
		return new Promise(function(resolve) {
			resolve(x);
		});
	};

	Promise.reject = function(x) {
		return new Promise(function(resolve, reject) {
			reject(x);
		});
	};

	Promise.all = function(array) {
		// @TODO:
	};

	Promise.race = function(array) {
		// @TODO:
	};

	return Promise;
}]);