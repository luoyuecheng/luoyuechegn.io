## 在service中使用HttpClient时报错
```
ERROR Error: Uncaught (in promise): Error: StaticInjectorError(AppModule)[HttpClient]
```

原因：要使用 HttpClient 模块，需要引入 HttpClientModule

解决方法：在 app.module 中引入 HttpClientModule 模块，并添加到 @NgModule.imports 中

import { HttpClientModule } from '@angular/common/http';