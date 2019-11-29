# mongodb node driver

### connect 连接 Mongo 数据库

##### 1. mongo 连接 url/uri 简介

    mongodb://[username:password@]host[:port][/database][?options]

| 组成 | 描述 |
| :----: | :--: |
| mongodb:// | 标明是连接 mongodb 的字符串前缀 |
| username:password@ | 用户名和密码，@ 符是用来连接host的，若没有用户和密码，则串字符不填 |
| host | 数据库所在网关地址或ip |
| port | mongo 服务启用的端口号，若不填，使用默认端口号 27017，: 符用以连接 host |
| database | dbName 需要连接的数据库名 |
| options | 额外的连接参数 [#](#url-options-额外参数) |

如果需要连接多个库，使用逗号连接多条从用户名开始的字符串，如

    mongodb://db1.example.com:27017,db2.exmaple.com:27017

##### 2. url options 参数

[官方文档](https://docs.mongodb.com/manual/reference/connection-string/#connections-connection-options)

| 组成 | 描述 |
| :--: | :--: |
| replicaSet | 副本集 @DOTO |
| tls/ssl | 是否启用 tls/ssl 加密协议，值包括 true/false |
| connectTimeoutMS | 请求建立连接的超时时间 |
| socketTimeoutMS | 服务器响应的超时时间 |
| ... | ... |

##### 3. 连接数据库

    const MongoClient = require('mongodb').MongoClient;

    // 连接到 mongo 数据库服务
    MongoClient.connect(url, [options,] function (err, client) {
        // 连接到指定数据库
        const db = client.db(dbName);
        // 连接到指定 collection，collection 可以理解为指定数据表
        const collection = db.collection(collectionName);
        // 关闭连接
        client.close();
    })

**options** 参数配置同 url options 参数，为非必须参数

注意，操作数据库完成后，中断连接

### 查询数据库

##### 1. listCollections 查询当前连接的数据库下所有数据表

使用 db.listCollections 方法查询当前连接的数据库下的所有数据表，并用 toArray 方法，获取数据表内容。

    const db = client.db(dbName);
    db.listCollections({}).toArray(function (err, results) {
        console.log(results);
    })

##### 2. db.createCollection 新增一个数据表

    const db = client.db(dbName);
    db.createCollection(collectionName, [options, ] function (err, collection) {
        console.log(collection);
        client.close();
    })

options 为非必须参数

##### 3. db.collections 查看所有集合

db.collections 获取当前数据库的所有集合，并在回调中得到一个数据库集合的列表。

    const db = client.db(dbName);
    db.collections([options,] function (err, results) {
        console.log(results);
        client.close();
    })

db.collections 回调结果的第一项，都指向对应的数据表，可以用以操作对应数据表的增删改查。

##### 4. db.dropCollection 删除一个数据表(集合)

db.dropCollection 通过表名从数据库中删除一个数据表，执行之后数据表会被永久删除，之后再次通过该表名访问，将会重新新建一个表。

    const db = client.db(dbName);
    db.dropCollection(collectionName, [options, ]function (err, result) {
        console.log(result);
    })

db.dropCollection 方法回调函数的第二个参数 `result` 返回一个 `boolean` 类型的值，为`true`表示数据表删除成功。

### 数据库的增删改查

对mongodb服务，操作服务中的数据库，需要调用驱动的`admin`方法，通过`admin`方法返回对象对数据库进行增删改查。

    MongoClient.connect(url, function (err, client) {
        const adminDb = client.db().admin();
    })

##### 1. 创建数据库

创建数据库方法与连接数据库方法相同，当通过`client.db(dbName)`连接数据库时，检测mongodb服务中没有这个库，mongo将创建一个指定名称的数据库。

    MongoClient.connect(url, function (err, client) {
        const db = client.db(dbName);
        console.log(db);
        client.close();
    })

此时创建的数据库中没有任何数据表。刚创建的数据库，并未真正创建，使用查询方法查询时，并不能查询得到，需要为数据库添加数据之后才能在结果中返回。

##### 2. 查询当前连接服务所有数据库

adminDb.listDatabases 查询数据库，并在回调参数中返回查询结果。

    adminDb.listDatabases({ nameOnly: false }, function (err, results) {
        console.log(results);
        client.close();
    });

`listDatabases`方法有两个参数，第一个参数 options 为非必选参数，nameOnly 控制返回结果是否只有表名，默认为 false 显示完整信息。输出结果对照：

    // options: { nameOnly: true }
    { databases: [ { name: 'admin' }, { name: 'blog' }, { name: 'local' } ], ok: 1 }
    // options: { nameOnly: false }
    {
        databases: [
            { name: 'admin', sizeOnDisk: 98304, empty: false },
            { name: 'blog', sizeOnDisk: 81920, empty: false },
            { name: 'local', sizeOnDisk: 65536, empty: false }
        ],
        totalSize: 245760,
        ok: 1
    }

##### 3. 检测数据表(集合)

validateCollection 检测数据表是否存在

    MongoClient.connect('mongodb://182.61.138.124:27017', function (err, client) {
        const db = client.db('blog');
        const adminDb = db.admin();
        
        adminDb.validateCollection('article', function (err, result) {
            // result 为一个对象
            console.log(result);
            client.close();
        })
        adminDb.validateCollection('test1', function (err, result) {
            // null
            console.log(result);
            client.close();
        })
    })

validateCollection 回调函数中，第二个参数result为返回结果，如果数据库中有这个表(集合)，result为一个对象，其中包函数据表的基本信息；如果数据库中没有这个表，result为null。

##### 4. 删除数据库

dropDatabase 删除数据。删除数据库与在mongo交互式中删除类似，连接到对应数据库后用此连接删除数据库。

    const db = client.db('test');
    const adminDb = db.admin();

    db.dropDatabase(function (err, result) {
        console.log(result);
        adminDb.listDatabases({ nameOnly: true }, function (err, results) {
            console.log(results);
            client.close();
        })
    })

删除数据库后，回调结果 result 为一个 boolean 值，result 为 true 表示删除数据库成功。