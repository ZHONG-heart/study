enum PROMISE_STATUS {
    PENDING,
    FULFILLED,
    REJECTED
}

class _Promise<T> {
    private status = PROMISE_STATUS.PENDING
    private value: T
    // 保存then方法传入的回调函数
    private callbacks = []
    constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
        executor(this._resolve, this._reject)
    }

    then(onfulfilled: (value: T) => any, onrejected: (value: any) => any) {
        // 2.2.1
        onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : null;
        onrejected = typeof onrejected === 'function' ? onrejected : null;

        // 把then方法传入的回调函数整合一下
        const handle = () => {
            if (this.status === PROMISE_STATUS.FULFILLED) {
                onfulfilled && onfulfilled(this.value)
            }

            if (this.status === PROMISE_STATUS.REJECTED) {
                onrejected && onrejected(this.value)
            }
        }

        if (this.status === PROMISE_STATUS.PENDING) {
            // 当状态是pending时，把回调函数保存进callback里面
            this.callbacks.push(handle)
        }

        handle()
    }

    private _resolve = (value) => {
        if (value === this) {
            throw new TypeError('A promise cannot be resolved with itself.');
        }
        if (this.status !== PROMISE_STATUS.PENDING) return;
        this.status = PROMISE_STATUS.FULFILLED;
        this.value = value;
        // 遍历执行回调
        this.callbacks.forEach(fn => fn())
    }

    private _reject = (value) => {
        if (this.status !== PROMISE_STATUS.PENDING) return;
        this.status = PROMISE_STATUS.REJECTED;
        this.value = value
        // 遍历执行回调
        this.callbacks.forEach(fn => fn())
    }


}


export { _Promise }