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

### 建立硬盘分区

在安装系统到磁盘，至少需要有两个分区，一个是引导分区，一个是根分区。例如以UEFI模式启动，则至少需要EFI系统分区，根分区(挂载根目录)。当然，也可以有多个分区，例如SWAP交换空间分区，home分区或者其他目录分区。

##### 查看分区

如果磁盘被系统识别到，会被系统分配为一个块设备。如果有对磁盘进行过分区操作，也会相应被系统识别。查看当前设备下有多少磁盘，和磁盘下的分区情况，可以使用fdisk命令可看，fdisk是linux下的磁盘操作命令，查看磁盘命令为

    # fdisk -l

对块设备，会被分配一个类似`/dev/sda`或`/dev/nvme0n1`的设备名，其下的分区会被分配类似`/dev/sda1`的设备名。不过对于结果中以`rom`，`loop`，`airoot`结束的，可以忽略。

##### 系统分区

对系统进行分区操作也是使用`fdisk`命令

    # fdisk /dev/sda

相应的将`/dev/sda`换为需要分区的磁盘设备名，也可以是分区名。执行上诉命令，会进入分区提示。在分区提示下，输入m可以获取帮助。

建立分区

1. Command(m for help): 输入n，建立新分区
2. Partition type: Select (default p): 输入p或直接按enter，设置新分区为primary类型
3. Partition number (1-4, default 1):按下Enter，选择分区序号，设为默认
4. First sector (...-..., default ...):　按enter, 设置分区开始柱面，设为默认
5. Last sectot,...: 设置分区结束柱面，可以输入分区大小，程序自动计算，如设置10G，输入 +10G，设置400M，输入 +400M。
6. Command (m for help): 输入p，预览分区表
7. Command (m for help): 输入w，写入磁盘改动，即保存，注意写入前确保磁盘改动正确，否则易丢失磁盘数据。保存后，会退出命令提示
8. Command (m for help): 输入q，退出命令提示，且不保存更改。如果操作错误，或分区失误，可用此命令取消前面操作，退出重来。

注意：1. 引导分区必须是磁盘第一个分区；2. 引导分区大小建议设置400M

如果第一个分区，不是EFI分区(启动引导是UEFI引导)，可以使用fdisk更改分区类型,如果大小不合适，修改大小同上

    # fdisk /dev/sda1

1. Command (m for help): 输入t, 更改分区类型
2. Hex code: 输入L，列出所有类型及代码
3. Hex code: 输入ef，选择EFI类型
4. Command：输入w，保存

##### 格式化分区

建立分区之后，需要对分区格式化

    # mkfs.ext4 /dev/sdxn # 格式化主分区或系统文件分区
    # mkfs.vfat /dev/sdxn # 格式化EFI分区
    # # 格式化交换分区需要两步
    # mkswap /dev/sdxm
    # swapon /dev/sdxm

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



##### config background image 配置桌面背景

安装`feh`包

    # pacman -S feh

使用 feh
命令设置桌面背景图片(需要先启动桌面环境，在桌面环境下的终端模拟器下使用)

    # feh --bg-scale /path/to/image.file

使用命令设置的桌面，只在当前窗口环境起作用，如果要在下次进入桌面环境时加载图片，需要将上诉命令添加进 .xinitrc 文件中，并加至文件末尾，exec 命令前。

##### 安装中文字体

修改文件 `~/.xinitrc`，在开头注释后加上下诉配置(必须加在 exec 命令之前)，启用中文 locale

    export LANG=zh_CN.UTF-8
    export LANGUAGE=zh_CN:en_US
    export LC_CTYPE=en_US.UTF-8

安装中文字体，推荐安装archlinux wiki推荐字体`noto-fonts-cjk`

    # pacman -S noto-fonts-cjk

完成后，更新字体缓存

    # fc-cache -fv

查看设置是否成功，如果执行下列命令后，出现类似`NotoSansCJK-Regular.ttc "Noto Sans CJK SC" "Regular"`，证明字体加载成功

    # fc-match -s | grep 'Noto Sans CJK'

##### 安装 ibus 输入法

ibus 只是一个输入法框架，安装完框架还需要输入引擎，选用
ibus-rime(中州韵输入法)。若需要使用Qt程序，则还需安装 ibus-qt 包

    # pacman -S ibus ibus-rime

启用输入法前，需要对输入法设置，首先编辑~/.xinitrc文件，在文件头部注释后加入

    export XMODIFIERS=@im=ibus

在文件末尾，exec命令前加入

    ibus-daemon -x -d &

然后，运行ibus设置命令

    # ibus-setup

将 General中切换输入法快捷键由`<Super>space`更改为`<Control>space`(i3 的Mod键映射为$mod4(Super))。

在Input Method 中添加中文输入rime。

启用中文输入法

    # ibus-daemon -x -d

如果此时无法使用，请重启。

添加五笔输入方案(wubi_pinyin)，从[github
rime-wubi](https://github.com/rime/rime-wubi)下载五笔输入依赖文件: wubi86.dict.yaml，wubi86_schema.yaml，wubi_pinyin.schema.yaml。并将文件复制到 ~/.config/ibus/rime 目录下。
创建自定义配置文件 default.custim.yaml，内容参考

    patch:
      schema_list: # 启用五笔拼音和明月拼音
        - {schema: wubi_pinyin}
        - {schema: luna_pinyin_simp}

如果需要对五笔拼音作各人配置，新建配置文件wubi_pinyin.custom.yaml，对其配置，如果配置其他输入方案，将wubi_pinyin 改为需配置的方案名。

重启 ibus，或手动重启

    # killall ibus-daemon
    # ibus-daemon -x -d

##### 启用声卡

Arch 内核已经默认提供了 ALSA，只是所有声道默认被设置为静音。此时只需要安装ALSA工具包，解除静音

    # pacman -S alsa-utils

使用命令在ncurses界面下操作

    # alsamixer

在alsamixer中，下方标注有`MM`的声道为被静音声道，标注有`00`的声道为启用声道。

使用左右方向键选择声道，使用 m 键解除静音，使用上下方向键改变音量。选中`Master`和`PCM`声道，解除静音。

解除静音后，音量大小固定，若要改变音量需要从命令行中通过命令`amixer`配置，或通过命令`alsamixer`在界面中修改。为了方便可在i3配置文件中作键盘映射，设置快捷键。其中，XF86AudioRaiseVolume，XF86AudioLowerVolume 和 XF86AudioMuto 分别指向键盘音量键的加，减，静音键。

    bindsym XF86AudioRaiseVolume exec --no-startup-id amixer set Master 5%+
    bindsym XF86AudioLowerVolume exec --no-startup-id amixer set Master 5%-
    bindsym XF86AudioMuto exec --no-startup-id amixer set Master toggle

