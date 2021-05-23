var PROMISE_STATUS;
(function (PROMISE_STATUS) {
    PROMISE_STATUS[PROMISE_STATUS["PENDING"] = 0] = "PENDING";
    PROMISE_STATUS[PROMISE_STATUS["FULFILLED"] = 1] = "FULFILLED";
    PROMISE_STATUS[PROMISE_STATUS["REJECTED"] = 2] = "REJECTED";
})(PROMISE_STATUS || (PROMISE_STATUS = {}));
var _Promise = /** @class */ (function () {
    function _Promise(executor) {
        var _this = this;
        this.status = PROMISE_STATUS.PENDING;
        this.callbacks = [];
        this._resolve = function (value) {
            if (value === _this) {
                throw new TypeError('A promise cannot be resolved with itself.');
            }
            if (_this.status !== PROMISE_STATUS.PENDING)
                return;
            _this.status = PROMISE_STATUS.FULFILLED;
            _this.value = value;
            _this.callbacks.forEach(function (fn) { return fn(); });
        };
        this._reject = function (value) {
            if (_this.status !== PROMISE_STATUS.PENDING)
                return;
            _this.status = PROMISE_STATUS.REJECTED;
            _this.value = value;
            _this.callbacks.forEach(function (fn) { return fn(); });
        };
        this._resolvePromise = function (nextPromise, x, resolve, reject) {
            // 2.3.1 
            if (nextPromise === x) {
                return reject(new TypeError('The promise and the return value are the same'));
            }
            // 2.3.2
            if (x instanceof _Promise) {
                x.then(resolve, reject);
            }
            // 2.3.3
            if (typeof x === 'object' || typeof x === 'function') {
                if (x === null) {
                    return resolve(x);
                }
                // 2.3.3.1
                var then = void 0;
                try {
                    then = x.then;
                }
                catch (error) {
                    return reject(error);
                }
                // 2.3.3.3
                if (typeof then === 'function') {
                    var called_1 = false;
                    try {
                        then.call(x, function (y) {
                            if (called_1)
                                return; // 2.3.3.3.4.1
                            called_1 = true;
                            _this._resolvePromise(nextPromise, y, resolve, reject);
                        }, function (r) {
                            if (called_1)
                                return; // 2.3.3.3.4.1
                            called_1 = true;
                            reject(r);
                        });
                    }
                    catch (e) {
                        if (called_1)
                            return; // 2.3.3.3.4.1
                        // 2.3.3.3.4
                        reject(e);
                    }
                }
                else {
                    // 2.3.3.4
                    resolve(x);
                }
            }
            else {
                // 2.3.4
                resolve(x);
            }
        };
        executor(this._resolve, this._reject);
    }
    _Promise.prototype.then = function (onfulfilled, onrejected) {
        var _this = this;
        // 2.2.1
        onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : null;
        onrejected = typeof onrejected === 'function' ? onrejected : null;
        var nextPromise = new _Promise(function (nextResolve, nextReject) {
            var _handle = function () {
                if (_this.status === PROMISE_STATUS.FULFILLED) {
                    var x = (onfulfilled && onfulfilled(_this.value));
                    _this._resolvePromise(nextPromise, x, nextResolve, nextReject);
                }
                if (_this.status === PROMISE_STATUS.REJECTED) {
                    if (onrejected) {
                        var x = onrejected(_this.value);
                        _this._resolvePromise(nextPromise, x, nextResolve, nextReject);
                    }
                    else {
                        nextReject(_this.value);
                    }
                }
            };
            var handle = function () {
                queueMicrotask(_handle);
            };
            if (_this.status === PROMISE_STATUS.PENDING) {
                _this.callbacks.push(handle);
            }
            else {
                handle();
            }
        });
        return nextPromise;
    };
    _Promise.prototype.catch = function (onrejected) {
        return this.then(null, onrejected);
    };
    _Promise.prototype.finally = function (cb) {
        return this.then(function (value) { return _Promise.resolve(cb()).then(function () { return value; }); }, function (reason) { return _Promise.resolve(cb()).then(function () { throw reason; }); });
    };
    _Promise.prototype.abort = function () {
        this.callbacks = [];
    };
    _Promise.resolve = function (value) {
        if (value instanceof _Promise) {
            return value;
        }
        return new _Promise(function (resolve) {
            resolve(value);
        });
    };
    _Promise.reject = function (reason) {
        return new _Promise(function (resolve, reject) {
            reject(reason);
        });
    };
    _Promise.race = function (arr) {
        return new _Promise(function (resolve, reject) {
            if (!Array.isArray(arr)) {
                return reject(new TypeError('Promise.race accepts an array'));
            }
            for (var i = 0, len = arr.length; i < len; i++) {
                _Promise.resolve(arr[i]).then(resolve, reject);
            }
        });
    };
    _Promise.all = function (promises) {
        var arr = [];
        var i = 0;
        return new _Promise(function (resolve, reject) {
            var processData = function (index, data) {
                arr[index] = data;
                i++;
                if (i == promises.length) {
                    resolve(arr);
                }
                ;
            };
            var _loop_1 = function (i_1) {
                promises[i_1].then(function (data) {
                    processData(i_1, data);
                }, reject);
            };
            for (var i_1 = 0; i_1 < promises.length; i_1++) {
                _loop_1(i_1);
            }
            ;
        });
    };
    return _Promise;
}());
_Promise.deferred = function () {
    var dfd = {};
    dfd.promise = new Promise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};
module.exports = _Promise;
export {};
//# sourceMappingURL=index.js.map