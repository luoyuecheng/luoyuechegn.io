# git submodules -- git 的子模块，子仓库

> 使用 git 做代码仓库管理代码版本时，经常需要使用 git 子仓库，管理项目公有模块，这时候就需要用到 git submodule
> 使用 git submodule 至少需要两个 git 仓库，一个作为主仓库，一个作为子仓库

例：
主仓库：https://github.com/luoyuecheng/weixin.git
子仓库：https://github.com/luoyuecheng/wxbook.git

### 1. 使用子模块(创建子模块)

    $ cd weixin/
    $ git submodule add https://github.com/luoyuecheng/wxbook.git static/wxbook

1. 通过`git submodule add [url] [path]`命令可以为仓库创建一个子模块，且 path 路径相对于当前执行命令的位置，即当前命令行在项目根目录，则子模块目录为`/static/wxbook`，当前目录为`src`目录，子模块目录为`/src/static/wxboox`。若未设置`path`路径参数，则子仓库为命令行当前位置
2. `url`参数为子仓库地址，如果本地和远程仓库配置了 ssh 公钥，`url`参数可以设置为 git@git...git 形式的 ssh 地址，避免拉取代码时重复输入帐号密码

执行上诉命令后，项目中会增加`.gitmodules`文件和`static/wxbook`文件夹

    $ git status
    Changes to be committed:
      (use "git reset HEAD <file>..." to unstage)
    
            new file:   .gitmodules
            new file:   static/wxbook

### 2. 浏览项目子仓库更改信息

    $ git diff --cached static/wxbook
    diff --git a/static/wxbook b/static/wxbook
    new file mode 160000
    index 0000000..1724f29
    --- /dev/null
    +++ b/static/wxbook
    @@ -0,0 +1 @@

浏览子仓库信息，可以进入到子仓库目录，使用`git status`查看，也可以在主仓库使用`git diff --cached static/wxbook`查看，或者使用`git diff --cached --submodule`差异化输出

    $ git diff --cached --submodule
    diff --git a/.gitmodules b/.gitmodules
    new file mode 100644
    index 0000000..81a56c7
    --- /dev/null
    +++ b/.gitmodules
    @@ -0,0 +1,3 @@
    +[submodule "static/wxbook"]
    +       path = static/wxbook
    +       url = https://github.com/luoyuecheng/wxbook.git
    Submodule static/wxbook 0000000...1724f29 (new submodule)

### 3. 拉取有子模块的项目
我们将创建的包含子模块的`weixin`项目上传至 git 仓库，重新拉取

    $ git clone https://github.com/luoyuecheng/weixin.git

    $ cd weixin/
    # 初始化子仓库，初始化后，在.git/config 文件中可以看到子模块信息
    $ git submodule init

    $ cat .git/config
    [core]
            repositoryformatversion = 0
            filemode = false
            bare = false
            logallrefupdates = true
            symlinks = false
            ignorecase = true
    [remote "origin"]
            url = https://github.com/luoyuecheng/weixin.git
            fetch = +refs/heads/*:refs/remotes/origin/*
    [branch "master"]
            remote = origin
            merge = refs/heads/master
    [submodule "static/wxbook"]
            url = https://github.com/luoyuecheng/wxbook.git
            active = true

    # 拉取子模块代码
    $ git submodule update

### 4. 删除子模块

git submodule 子模块没有`remove`方法直接删除，而是需要在`.gitmodules`中删除该模块的记录，若只有一个子仓库，可直接删除`.gitmodules`文件，再删除`.git/config`中相关记录，模块信息`.git/modules`，模块文件夹和缓存`/static/wxbook`

    $ vim .gitmodules
    # 删除记录
    [submodule "static/wxbook"]
      url = https://github.com/luoyuecheng/wxbook.git
      active = true

    $ vim .git/config
    # 删除记录
    [submodule "static/wxbook"]
        url = https://github.com/luoyuecheng/wxbook.git
        active = true

    $ rm -rf .git/modules

    $ git rm --cached static/wxbook

此时操作任意`git submodule`命令，git 会抛出异常

    $ git submodule init
    fatal: No url found for submodule path 'static/wxbook' in .gitmodules

通过提交`.gitmodules`解决异常

    $ git add .gitmodules
    $ git commit -m "remove submodule static/wxbook"

如果删除之后，还有子模块，再重新 init

    $ git submodule init
    $ git submodule update
    # 或者一句命令建立联系
    $ git submodule update --init

注：在删除子模块时，`git rm --cached`清除缓存可以在`git commit -am` 提交之后，并不影响，解决异常时的提交只是`.gitmodules`文件。