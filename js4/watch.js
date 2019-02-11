(function() {

	const ARRAY_METHODS = ["reverse", "splice", "push", "pop", "unshift", "shift", "sort"];
	const DATE_METHODS = ["setDate", "setFullYear", "setHours", "setMilliseconds", "setMonth", "setSeconds", "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes", "setUTCSeconds", "setYear"];

	let numm = 0;

	function mutationObservableFromClass$(object, cls, methods) {
		let key = methods[0];

		if (object[key].observable$) {
			return object[key].observable$;
		}

		let observable$ = new Observable(observer => {
			// numm++;
			// console.log("mutation watch$ ob: " + numm);

			let prototype = Object.getPrototypeOf(object);
			let o = Object.create(prototype);
			Object.setPrototypeOf(object, o);

			for (let method of methods) {
				o[method] = function() {
					let result = cls[method].apply(this, arguments);
					observer.next(this);
					observer.complete();
					return result;
				}
			}

			o[key].observable$ = observable$;

			return function() {

				// numm--;
				// console.log("--mutation watch$ ob: " + numm);

				delete o[key].observable$;
				Object.setPrototypeOf(object, prototype);
			}

		}).share();

		return observable$;
	}

	function mutationObservable$(object) {
		if (Array.isArray(object)) return mutationObservableFromClass$(object, Array.prototype, ARRAY_METHODS);
		if (object instanceof Date) return mutationObservableFromClass$(object, Date.prototype, DATE_METHODS);
		return Observable.NEVER;
	}


	let num = 0;

	function watch$(object, prop) {

		if (Object(object) !== object) {
			return Observable.NEVER;
		}

		if (Array.isArray(object) && +prop === prop) {
			return Observable.NEVER;
		}

		let desc = Object.getOwnPropertyDescriptor(object, prop);
		if (desc) {
			if (desc.set && desc.set.observable$) {
				return desc.set.observable$;
			}

			if (desc.configurable === false || desc.writable === false) {
				return mutationObservable$(object[prop]);
			}
		}

		let observable$ = new Observable(function(observer) {
			// num++;
			// console.log("watch$ ob: " + num, object, prop);

			let value = object[prop];
			let subscription = mutationObservable$(value).subscribe(observer);

			function set(newValue) {
				if (Object.is(value, newValue)) {
					return;
				}
				value = newValue;
				observer.next(value);
				observer.complete();
			}

			set.observable$ = observable$;

			Object.defineProperty(object, prop, {
				enumerable: true,
				configurable: true,
				get: function() {
					return value;
				},
				set: set
			});

			/// cleanup!
			return function() {

				// num--;
				// console.log("-watch$ ob: " + num, object, prop);

				subscription.unsubscribe();
				delete set.observable$;
				delete object[prop];
				object[prop] = value;
			}

		}).share();

		return observable$;
	}

	window.watch$ = watch$;
})();


