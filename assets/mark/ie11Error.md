IE11中，出现错误：
Exception thrown and not caught
File: polyfills.bundle.js, Line: 829, Column: 34

解决方法：
找到 src/polyfills.ts
找到 /** IE9, IE10 and IE11 requires all of the following polyfills. **/ 后注释的引入内容，取消注释。
```
/** IE9, IE10 and IE11 requires all of the following polyfills. **/
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
```
重新启动项目。