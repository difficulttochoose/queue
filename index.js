'use strict';

class QueueIterator {
    constructor(queue) {
        this._queue = queue;
        this._current = 0;
    }

    next() {
        if (this._current >= this._queue.size) {
            return {
                value: undefined,
                done: true,
            };
        }
        return {
            value: this._queue[this._current],
            done: this._current++ >= this._queue.size,
        };
    }
}

class Queue {
    constructor(maxSize = 10000) {
        if (typeof maxSize !== 'number') {
            throw new TypeError();
        }
        if (isNaN(maxSize) || maxSize < 0 || !Number.isInteger(maxSize)) {
            throw new RangeError();
        }
        this._size = 0;
        this._maxSize = maxSize;
    }

    get isEmpty() {
        return this._size === 0;
    }

    get size() {
        return this._size;
    }

    enqueue(value) {
        if (this._size >= this._maxSize) {
            throw new RangeError('Stack overflow');
        }
        this[this._size++] = value;
        return this._size;
    }

    dequeue() {
        if (this.isEmpty) {
            return;
        }
        const firstItem = this[0];
        delete this[0];
        for (let i = 0; i < this._size; ++i) {
            this[i] = this[i + 1];
        }
        delete this[--this._size];
        return firstItem;
    }

    front() {
        if (this.isEmpty) {
            return;
        }
        return this[0];
    }

    [Symbol.iterator]() {
        return new QueueIterator(this);
    }
}

class PriorityQueueItem {
    constructor(value, priority) {
        if (typeof priority !== 'number' || !Number.isInteger(priority) || isNaN(priority)) {
            throw new TypeError('Priority must be an integer');
        }
        if (priority <= 0) {
            throw new RangeError('Priority must be greater then 0');
        }
        this._value = value;
        this._priority = priority;
    }

    getValue() {
        return this._value;
    }

    getPriority() {
        return this._priority;
    }
}

class PriorityQueue extends Queue {
    constructor(maxSize = 10000) {
        super(maxSize);
    }

    /**
     *
     * @param {PriorityQueueItem|*} value
     * @param {number} [priority]
     * @returns {number}
     */
    enqueue(value, priority = 1) {
        if (!value instanceof PriorityQueueItem) {
            if (typeof priority !== 'number' || !Number.isInteger(priority) || isNaN(priority)) {
                throw new TypeError('Priority must be an integer');
            }
            if (priority <= 0) {
                throw new RangeError('Priority must be greater then 0');
            }
        }

        this[this._size++] = value instanceof PriorityQueueItem ? value : {
            _value: value,
            _priority: priority,
        }
        let temp;
        for (let i = 1; i < this._size; i++) {
            if (this[i - 1]._priority < this[i]._priority) {
                temp = this[i - 1];
                this[i - 1] = this[i];
                this[i] = temp;
                i = 0;
            }
        }
        return this._size;
    }
}

