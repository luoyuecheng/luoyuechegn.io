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

class Queue {
  // 定义一个数组作为一个队列
  queue: Array<any> = [];

  // 插入一个新的元素到队尾
  push(element: any) {
    this.queue.push(element);
  }

  // 若队列不为空，删除队头元素并返回，否则返回 -1
  shift(): any {
    const empty: number = this.empty();
    if (empty === -1) {
      return -1;
    }
    const element = this.queue.shift();
    return element;
  }

  // 打印队列的全部内容
  print() {
    return this.queue;
  }

  // 获取队列的长度，若队列不为数组，则队列不存在，返回 -1，否则返回队列长度
  length(): number {
    if (Array.isArray(this.queue)) {
      return this.queue.length;
    }
    return -1;
  }

  // 若队列不为空，返回队头元素，否则返回 -1
  getHead() {
    const empty: number = this.empty();
    if (empty === -1) {
      return -1;
    }
    return this.queue[0];
  }

  // 清空队列
  clear() {
    this.queue = [];
  }

  // 判断队列是否为空，若不为空，返回 1， 否则返回 -1
  empty(): number {
    const length: number = this.length();
    if (length > 0) {
      return 1;
    }
    return -1;
  }
}

/* interface LinkNode {
  element: string|number,
  next: null|LinkNode
} */

class LinkNode {
  element: string|number;
  next: null|LinkNode;

  constructor(element: string|number) {
    this.element = element;
    this.next = null;
  }
}



// 单链队列
class LinkQueue {
  // 指针，指向队尾
  rear: LinkNode = null;
  head: LinkNode = null;

  constructor() {
    this.head = new LinkNode('__head__');
    this.rear = this.rear;
  }

  // 向队尾添加元素
  push(element: string|number) {
    const newNode: LinkNode = new LinkNode(element);
    // 将指针 next 指向新元素，即将原队尾元素 next 指向新元素
    this.rear.next = newNode;
    // 将指针指向新元素
    this.rear = newNode;
  }

  // 移除队头元素，队列为空，即 this.head.next 为 null 时返回 -1
  shift(): number|string {
    if (this.head.next === null) {
      return -1;
    }

    const current: LinkNode = this.head.next;
    this.head.next = current.next;

    return current.element;
  }

  // 移除队尾元素
  pop(): string|number {
    // previous current
    const current: LinkNode|-1 = this.findPrev(this.rear.element);

    if (current === -1) {
      return -1;
    }

    // this element removed at the end of the queue
    const element = current.next.element;
    current.next = null;
    this.rear = current;
    return element;

  }

  // 查找上一个元素
  findPrev(element): LinkNode|-1 {
    let current = this.head;
    let prev: -1|LinkNode = -1;

    while (current.next !== null) {
      if (current.next.element === element) {
        prev = current.element === this.head.element ? -1 : current;
        break;
      }
      current = current.next;
    }

    return prev;
  }

  // 打印所有元素
  print(): Array<number|string> {
    let current = this.head;
    const elements: Array<number|string> = [];

    while (current.next !== null) {
      current = current.next;
      elements.push(current.element);
    }

    return elements;
  }

  // 获取队头元素
  getHead(): number|string {
    if (this.head.next === null) {
      return -1;
    }

    return this.head.next.element;
  }

  // 获取队列长度
  getLength(): number {
    if (this.getHead() === -1) {
      return -1;
    }

    let count = 0;
    let current = this.head.next;

    while (current !== null) {
      count++;
      current = current.next;
    }

    return count;
  }

  // 清空队列
  clear() {
    let current = this.head.next;
    // 清空 this.head.next
    this.head.next = null;
    // 改变指针，指向队头之前，this.head
    this.rear = this.head;

    while (current !== null) {
      let element = current.next;
      current.next = null;
      current = element;
    }
  }
}


// 利用队列的排序
const queueSort = (arr: Array<string|number>) => {
  // the longest element length in the array
  let maxLength: number = 0;
  // defining an object as a queue
  let queue: { [key: string]: Array<string|number> } = {};
  //
  let index: number = 0;

  /**
   * generate a queue with the current bit character as the key,
   * and add the elements in the array as a queue
   * @param key
   * @param element
   * @return void
   */
  const push = (key: string|number = 0, element: string|number) => {
    if (!queue[key]) {
      queue[key] = [];
    }
    queue[key].push(element);
  }

  /**
   * loops need to sort the array
   * @param array
   * @param index
   */
  const loop = (array): Array<number|string> | boolean => {
    // initialize queue
    queue = {};
    // loops need to sort the array
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i];
      // sort only strings or numbers
      if (typeof item !== 'string' && typeof item !== 'number') {
        console.error(`the ${i} element is not string or number.`);
        return false;
      }
      const itemString = item.toString();
      if (index === 0 && itemString.length > maxLength) {
        maxLength = itemString.length;
      }
      push(itemString[itemString.length - index -1], item);
    }

    let keyArr = Object.keys(queue).sort();
    let newArray = [];

    for (let i = 0, len = keyArr.length; i < len; i++) {
      newArray = newArray.concat(queue[keyArr[i]]);
    }

    index += 1;
    if (maxLength > index) {
      return loop(newArray);
    }

    return newArray;
  }

  return loop(arr);
}

const arr = [345, 319, 'qt', '97fg', 1];
const sortArr = queueSort(arr);
console.log(sortArr);
