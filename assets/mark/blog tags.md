# 在 Firebase 下关于 Blog tags 的存储设计

@(Firebase)[blog|tags|firebase]

> 代码中出现的 this.db 方法指 constructor 中注册的 db 方法  
> `private db: AngularFirestore`

### 文档数据存储

文件内容是在 `Cloud Firestore` 中创建了一个文章表，每一条数据就是一篇文章。

### 使用标签表维护标签

这是设计博客时的第一想法：创建一个标签表，在标签表中维护标签种类，分别存储标签的 id，标签名，描述(这个字段并没有多大用处，在网页中不会有什么体现，显示的也只是标签名，但是在查看数据库的时候可以有一个比较清晰的认识。)