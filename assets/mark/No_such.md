在win7上开发，使用git bash拉取项目时经常遇到 No such的错误。  
常常兴致勃勃打开 git bash(比cmd/power shell好看一万倍)，然而一顿操作后`No such`...

    $ git submodule init
    $ git submodule update
    bash: /dev/tty: No such device or address

**解决方法**很简单，`exit`退出 git bash，打开 cmd 或者 power shell，重新执行命令。或者作用 [cmder](http://cmder.net/)，比 power shell / cmd 好看，比 git bash 流畅，毕竟'老年机'。