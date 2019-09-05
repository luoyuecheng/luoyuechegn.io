/*

> 队列，又称为伫列，是先进先出(FIFO, First-In-First-Out)的线性表。在具体应用中通常用链表或者数组来实现。队列只允许在后端(称为*rear*)进行插入操作，在前端(称为*front*)进行删除操作。队列的操作方式和堆栈类似，唯一的区别在于队列只允许新数据在后端进行添加。
> -- 维基百科

队列就类似生活中的排队等候，先来的排前面，后来的排后面，且先来的先被服务。

**循环队列(顺序队列)**: 由于结构数组声明时，需要事先声明结构数组的大小，即数组的长度。这时候队列就有可能有伪溢出的发生。
为了防止伪溢出，将数组想像成一个首尾相接的圆环，操作队列时与之前相同，只是在队尾时，将队尾指向队头，此为循环队列((维基百科 - 循环队列)[https://zh.wikipedia.org/wiki/%E9%98%9F%E5%88%97#%E5%BE%AA%E7%8E%AF%E9%98%9F%E5%88%97])。
**消息队列**: 将队列变得可扩展(不懂原理...)
**单链队列**: 使用链表作为基本数据结构的队列，类似于遍历器，使用 next 指向下一个队列元素((单链队列)[https://zh.wikipedia.org/wiki/%E9%98%9F%E5%88%97#%E5%8D%95%E9%93%BE%E9%98%9F%E5%88%97])。

在 JS 中队列的许多特性与数组类似，而且数组没有长度的限制，使用数组实现队列是一个非常好的选择。


### 实现

定义队列的基本方法，模拟队列操作。

> `queue` - 定义一个数组作为队列
> `push` - 插入一个新的元素到队尾
> `shift` - 若队列不为空，删除队头元素，并返回该元素，否则返回 -1
> `print` - 打印队列的全部内容
> `length` - 获取队列的长度
> `getHead` - 若队列不为空，返回队头元素，否则返回 -1
> `clear` - 清空队列
> `empty` - 判断队列是否为空，若不为空则返回 1，否则返回 -1

*/
var Queue = /** @class */ (function () {
    function Queue() {
        // 定义一个数组作为一个队列
        this.queue = [];
    }
    // 插入一个新的元素到队尾
    Queue.prototype.push = function (element) {
        this.queue.push(element);
    };
    // 若队列不为空，删除队头元素并返回，否则返回 -1
    Queue.prototype.shift = function () {
        var empty = this.empty();
        if (empty === -1) {
            return -1;
        }
        var element = this.queue.shift();
        return element;
    };
    // 打印队列的全部内容
    Queue.prototype.print = function () {
        return this.queue;
    };
    // 获取队列的长度，若队列不为数组，则队列不存在，返回 -1，否则返回队列长度
    Queue.prototype.length = function () {
        if (Array.isArray(this.queue)) {
            return this.queue.length;
        }
        return -1;
    };
    // 若队列不为空，返回队头元素，否则返回 -1
    Queue.prototype.getHead = function () {
        var empty = this.empty();
        if (empty === -1) {
            return -1;
        }
        return this.queue[0];
    };
    // 清空队列
    Queue.prototype.clear = function () {
        this.queue = [];
    };
    // 判断队列是否为空，若不为空，返回 1， 否则返回 -1
    Queue.prototype.empty = function () {
        var length = this.length();
        if (length > 0) {
            return 1;
        }
        return -1;
    };
    return Queue;
}());
/* interface LinkNode {
  element: string|number,
  next: null|LinkNode
} */
var LinkNode = /** @class */ (function () {
    function LinkNode(element) {
        this.element = element;
        this.next = null;
    }
    return LinkNode;
}());
// 单链队列
var LinkQueue = /** @class */ (function () {
    function LinkQueue() {
        // 指针，指向队尾
        this.rear = null;
        this.head = null;
        this.head = new LinkNode('__head__');
        this.rear = this.rear;
    }
    // 向队尾添加元素
    LinkQueue.prototype.push = function (element) {
        var newNode = new LinkNode(element);
        // 将指针 next 指向新元素，即将原队尾元素 next 指向新元素
        this.rear.next = newNode;
        // 将指针指向新元素
        this.rear = newNode;
    };
    // 移除队头元素，队列为空，即 this.head.next 为 null 时返回 -1
    LinkQueue.prototype.shift = function () {
        if (this.head.next === null) {
            return -1;
        }
        var current = this.head.next;
        this.head.next = current.next;
        return current.element;
    };
    // 移除队尾元素
    LinkQueue.prototype.pop = function () {
        // previous current
        var current = this.findPrev(this.rear.element);
        if (current === -1) {
            return -1;
        }
        // this element removed at the end of the queue
        var element = current.next.element;
        current.next = null;
        this.rear = current;
        return element;
    };
    // 查找上一个元素
    LinkQueue.prototype.findPrev = function (element) {
        var current = this.head;
        var prev = -1;
        while (current.next !== null) {
            if (current.next.element === element) {
                prev = current.element === this.head.element ? -1 : current;
                break;
            }
            current = current.next;
        }
        return prev;
    };
    // 打印所有元素
    LinkQueue.prototype.print = function () {
        var current = this.head;
        var elements = [];
        while (current.next !== null) {
            current = current.next;
            elements.push(current.element);
        }
        return elements;
    };
    // 获取队头元素
    LinkQueue.prototype.getHead = function () {
        if (this.head.next === null) {
            return -1;
        }
        return this.head.next.element;
    };
    // 获取队列长度
    LinkQueue.prototype.getLength = function () {
        if (this.getHead() === -1) {
            return -1;
        }
        var count = 0;
        var current = this.head.next;
        while (current !== null) {
            count++;
            current = current.next;
        }
        return count;
    };
    // 清空队列
    LinkQueue.prototype.clear = function () {
        var current = this.head.next;
        // 清空 this.head.next
        this.head.next = null;
        // 改变指针，指向队头之前，this.head
        this.rear = this.head;
        while (current !== null) {
            var element = current.next;
            current.next = null;
            current = element;
        }
    };
    return LinkQueue;
}());
// 利用队列的排序
var queueSort = function (arr) {
    // the longest element length in the array
    var maxLength = 0;
    // defining an object as a queue
    var queue = {};
    //
    var index = 0;
    /**
     * generate a queue with the current bit character as the key,
     * and add the elements in the array as a queue
     * @param key
     * @param element
     * @return void
     */
    var push = function (key, element) {
        if (key === void 0) { key = 0; }
        if (!queue[key]) {
            queue[key] = [];
        }
        queue[key].push(element);
    };
    /**
     * loops need to sort the array
     * @param array
     * @param index
     */
    var loop = function (array) {
        // initialize queue
        queue = {};
        // loops need to sort the array
        for (var i = 0, len = array.length; i < len; i++) {
            var item = array[i];
            // sort only strings or numbers
            if (typeof item !== 'string' && typeof item !== 'number') {
                console.error("the " + i + " element is not string or number.");
                return false;
            }
            var itemString = item.toString();
            if (index === 0 && itemString.length > maxLength) {
                maxLength = itemString.length;
            }
            push(itemString[itemString.length - index - 1], item);
        }
        var keyArr = Object.keys(queue).sort();
        var newArray = [];
        for (var i = 0, len = keyArr.length; i < len; i++) {
            newArray = newArray.concat(queue[keyArr[i]]);
        }
        index += 1;
        if (maxLength > index) {
            return loop(newArray);
        }
        return newArray;
    };
    return loop(arr);
};
var arr = [345, 319, 'qt', '97fg', 1];
var sortArr = queueSort(arr);
console.log(sortArr);
//# sourceMappingURL=queue.js.map