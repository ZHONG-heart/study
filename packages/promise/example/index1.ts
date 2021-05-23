// 使用枚举定义Promise的状态
enum PROMISE_STATUS {
    PENDING,
    FULFILLED,
    REJECTED
}

class _Promise<T> {
    // 保存当前状态
    private status = PROMISE_STATUS.PENDING
    // 保存resolve的值，或者reject的原因
    private value: T
    constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
        executor(this._resolve, this._reject)
    }

    // 根据规范完成简易功能的then方法
    then(onfulfilled: (value: T) => any, onrejected: (value: any) => any) {
        // 2.2.1
        onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : null;
        onrejected = typeof onrejected === 'function' ? onrejected : null;

        if (this.status === PROMISE_STATUS.FULFILLED) {
            // 状态为fulfilled时调用成功的回调函数
            onfulfilled(this.value)
        }

        if (this.status === PROMISE_STATUS.REJECTED) {
            // 状态为rejected时调用失败的回调函数
            onrejected(this.value)
        }

    }

    // 传入executor方法的第一个参数，调用此方法就是成功
    private _resolve = (value) => {
        if (value === this) {
            throw new TypeError('A promise cannot be resolved with itself.');
        }
        // 只有是pending状态才可以更新状态，防止二次调用
        if (this.status !== PROMISE_STATUS.PENDING) return;
        this.status = PROMISE_STATUS.FULFILLED;
        this.value = value;
    }

    // 传入executor方法的第二个参数，调用此方法就是失败
    private _reject = (value) => {
        // 只有是pending状态才可以更新状态，防止二次调用
        if (this.status !== PROMISE_STATUS.PENDING) return;
        this.status = PROMISE_STATUS.REJECTED;
        this.value = value
    }

}

export { _Promise }