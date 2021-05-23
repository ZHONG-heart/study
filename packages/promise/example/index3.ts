enum PROMISE_STATUS {
    PENDING,
    FULFILLED,
    REJECTED
}

interface ICallback<T> {
    onfulfilled: (value: T) => void;
    onrejected: (value: any) => void
}



class _Promise<T> {
    private status = PROMISE_STATUS.PENDING
    private value: T
    callbacks = []
    constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
        executor(this._resolve, this._reject)
    }

    then(onfulfilled: (value: T) => any, onrejected: (value: any) => any) {
        // 2.2.1
        onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : null;
        onrejected = typeof onrejected === 'function' ? onrejected : null;

        const nextPromise = new _Promise((nextResolve, nextReject) => {
            const handle = () => {
                if (this.status === PROMISE_STATUS.FULFILLED) {
                    const x = (onfulfilled && onfulfilled(this.value))
                    this._resolvePromise(nextPromise, x, nextResolve, nextReject)
                }

                if (this.status === PROMISE_STATUS.REJECTED) {
                    if (onrejected) {
                        const x = onrejected(this.value)
                        this._resolvePromise(nextPromise, x, nextResolve, nextReject)
                    } else {
                        nextReject(this.value)
                    }
                }

            }
            if (this.status === PROMISE_STATUS.PENDING) {
                this.callbacks.push(handle)
            } else {
                handle()
            }

        });
        return nextPromise

    }

    private _resolve = (value) => {
        if (value === this) {
            throw new TypeError('A promise cannot be resolved with itself.');
        }
        if (this.status !== PROMISE_STATUS.PENDING) return;
        this.status = PROMISE_STATUS.FULFILLED;
        this.value = value;
        this.callbacks.forEach(fn => fn())
    }

    private _reject = (value) => {
        if (this.status !== PROMISE_STATUS.PENDING) return;
        this.status = PROMISE_STATUS.REJECTED;
        this.value = value
        this.callbacks.forEach(fn => fn())
    }

    private _resolvePromise = <T>(nextPromise: _Promise<T>, x: any, resolve, reject) => {

        // 2.3.1 
        if (nextPromise === x) {
            return reject(new TypeError('The promise and the return value are the same'));
        }

        // 2.3.2
        if (x instanceof _Promise) {
            x.then(resolve, reject)
        }

        // 2.3.3
        if (typeof x === 'object' || typeof x === 'function') {
            if (x === null) {
                return resolve(x);
            }

            // 2.3.3.1
            let then;
            try {
                then = x.then;
            } catch (error) {
                return reject(error);
            }

            // 2.3.3.3
            if (typeof then === 'function') {
                let called = false;
                try {
                    then.call(x, y => {
                        if (called) return; // 2.3.3.3.4.1
                        called = true;
                        this._resolvePromise(nextPromise, y, resolve, reject)
                    }, r => {
                        if (called) return; // 2.3.3.3.4.1
                        called = true;
                        reject(r)
                    })
                } catch (e) {
                    if (called) return; // 2.3.3.3.4.1
                    // 2.3.3.3.4
                    reject(e)
                }
            } else {
                // 2.3.3.4
                resolve(x)
            }
        } else {
            // 2.3.4
            resolve(x);
        }

    }

}


(_Promise as any).deferred = function () {
    let dfd = {} as any;
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

module.exports = _Promise;


export { }