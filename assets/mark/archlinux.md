# archlinux 初探

逛知乎时见到用户 @SpaceVim 的定制Linux界面实在漂亮(原谅本人是个颜控)，而最近Ubuntu系统崩溃，无法启动，一时间不想查找资料修复，便准备试着上手archlinux，看能否打造出一个令我满意的，桌面漂亮好用的linux桌面版。

### archlinux 简介

##### 特点
1. **更新**
    - 支持滚动更新，使用一个命令就可以将系统和软件升级到最新版本
2. **简洁**
    - 系统只是个系统，不包含常用软件，所有软件需要用户自行安装
    - 不支持图形化界面，需要用户使用命令行或文本编辑器修改配置
    - 配置文件与上游保持一致，不添加任何定制和扩展
3. **实用**
    - 注重实用，避免意识形态之争。仓库不仅提供了开源软件，也提供了闭源软件
4. **高度自定义**
    - 用户可以自定义自己的系统打造出一个属于自己的独一无二的系统

##### 下载

下载链接: [点我跳转](https://www.archlinux.org/download/)

    https://www.archlinux.org/download/

进入网站后，找到`HTTP Direct Downloads`，在下方选择服务器下载。在国内，个人建义查找`China`，在下方选择各大学服务器下载，即域名为`edu.cn`的网站。  
在下载界面有`md5sums.txt`和`sha1sums.txt`文件，内里包含有md5值和sha1值，可用来校验下载文件是否完整。

##### 烧制U盘

**linux**  
linux下推荐使用`dd`命令制作，其中用U盘路径替换`/dev/sdb`

    $ dd bs=4M if=/path/to/archlinux.iso of=/dev/sdb status=progress && sync

**windows**  
windows下推荐使用 Rufus 烧录，打开rufus.exe，选择文件，点击开始，然后静待镜像写入完成即可。


# arch linux 安装

### U盘启动

将U盘接入电脑，并在开机动画时(注意是电脑开机动画，不是系统启动动画)，依据电脑型号按相应按键进入 bios 界面。选择制做的启动U盘做为第一启动项。按 F10 保存设置并重启，此时如果操作正确，电脑会进入 arch 安装启动界面。选择第一项 x86_64，进入 arch live 虚拟控制台。archlinux 的安装就是在这里进行。

> 1. linux 可以打开6个虚拟控制台，进入系统默认打开的是第一个，可以使用 ctrl+alt+[F1-F6]打开相应的控制台。(arch相同，只是官方wiki说的是，以 alt+[F1-F6] 切换)
> 2. 在arch live安装需要保证网络连接正常

### 验证启动模式

使用下面命令，可以验证系统是否是以 efi 模式启动：

    # ls /sys/firmware/efi/efivars

如果输出一堆文件(夹)，证明系统是用UEFI引导启动的，否则，可能是使用BIOS等方式启动。(自从自己重装系统后，一直使用的UEFI模式)

### 连接网络

##### 测试网络状态

    # ping www.baidu.com

如果能ping通，证明网络连接正常，否则需要手动连接网络。

出现了类似`64 bytes from 220.181.38.148 (220.181.38.148): icmp_seq=1 ttl=128 time=36.6 ms`表示ping通了，网络连接正常。

##### 有线网

如果是有线网(插上网线)，执行命令

    # dhcpcd

获取ip，然后测试一下网络。如果获取ip错误，可能是dhcp服务没有开启，使用命令开启服务

    # systemctl dhcpcd.service

##### 无线网络

连接无线网络，最简单的方式是使用命令

    # wifi-menu

然后按方向键选择无线，输入密码，进行连接。

##### 更新系统时间

先检查服务状态，再更新系统时间，确保系统时间是准确的

    # timedatectl status
    # timedatectl set-up true


# 图形界面

### 显示服务

##### 安装 X 和显卡驱动

安装 X 窗口管理系统

    # pacman -S xorg-server xorg-xinit

或者安装整个xorg包

    # pacman -S xorg

安装驱动，参考[wiki](https://wiki.archlinux.org/index.php/Xorg_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)#%E5%AE%89%E8%A3%85)查找驱动。

##### 安装窗口管理器

窗口管理器选用 [i3](https://i3wm.org/docs/)

    # pacman -S i3 i3status i3lock dmenu terminator

##### 配置 X

生成一份xinitrc配置文件，用于配置X

    # cp /etx/X11/xinit/xinitrc ~/.xinitrc

编辑 .xinitrc 文件，找到文件结尾，注释掉下面类似内容

    twm &
    xclock -geometry 50x50-1+1 &
    xterm -geometry 80x50+494+51 &
    xterm -geometry 80x20+494-0 &
    exec xterm -geometry 80x66+0+0 -name login

并添加`i3`启动配置(exec 必须在文件末尾)

    exec i3

保存`.xinitrc`配置文件之后，`reboot`重启电脑。

##### 退出 X

要退出 X，可以使用窗口管理器的退出功能。如果窗口管理器没有提供退出功能，或者窗口管理器配置错误，进入窗口管理器后无法操作，可以运行`pkill`命令杀死 X 实例

    # pkill -15 Xorg

pkill 会杀死所有X实例，如果仅仅希望杀死当前虚拟终端的窗口管理器，运行

    # pkill -15 -t tty"$XDG_VINR" Xorg

### 配置 i3

##### 初始化 i3

登录账户，运行`startx`命令启动X，并且由于在`.xinitrc`中配置了 i3 启动，此时会进入 i3 窗口管理器。第一次运行 i3 时，会先看到 i3 的配置界面，第一个配置界面是，询问是否生成配置文件，此时按Enter回车，选择生成默认配置文件。

然后进入第二个配置页，这里需要选择自己的 Mod 键，也就是`修饰键($mod)`。在 i3 中，一切命令都是以 Mod 键开头。默认上，键盘映射关系是Alt键alt(Mod1)，Win键Super(Mod4)(Super在Mac键盘中是Command键)。这是直接回车，选择Super键做为$mod。如果要选用Alt键，使用方向键选中`<Alt>`行，并回车。

做完上诉配置，会在`~/.config/i3`目录生成一份`config`文件，下次进入系统时，直接读取该配置文件，而不会再次进入配置面板。此时登录到 i3 ，会看到一个黑屏的窗口， 以及屏幕底部的状态栏。这是由于i3是一个极简窗口管理器...

##### i3 基本快捷操作

1. `终端模拟器`：默认情况下，i3使用 $mod+enter 打开终端模拟器，并且i3默认是以水平方向分割屏幕，使用 $mod+v 进行垂直分割；使用 $mod+h 会恢复为水平分割。

2. `容器布局模式`：i3 默认为平铺式水平分割窗口。$mod+e 可以在平铺式水平分割和垂直分割间切换；$mod+w 可以将布局切换为堆叠式；$mod+s 将布局改为tab选项卡式。$mod+Shift+Space 可以在悬浮式和平铺式之间切换。

3. `程序启动器`：在前面，i3 的安装中安装了 dmenu 包。i3 使用 dmenu 作为启动器，用来在i3中启动程序，默认绑定的快捷键为 $mod+d。按 $mod+d 启动 dmenu 会出现一个简单的文字应用菜单。默认情况下，dmenu 会展示出 $PATH 中设置的应用。在 dmenu 中可以键入想要启动的应用，也可以使用方向键选择想要启动的应用。

4. `全屏模式`：i3中窗口以全屏模式展示或退出全屏模式，可以使用 $mod+f 操作。i3还可以用命令进入全局全屏模式 `fullscreen toggle global`。

3. `重启`：i3 可以按 $mod+Shift+r 直接重启。

3. `退出`：如果程序没有提供退出的方法，可以使用 i3 通过快捷键 $mod+Shift+q 来关闭窗口。如果想要关闭会话并退出 i3，可以按 $mod+Shift+e，此时窗口上方会出现确认提示，点击`Yes, exit i3`退出i3，或者点击 `X`取消退出。

##### 容器布局模式

