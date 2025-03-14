// import { createTest } from "../simapp";

import "../suanfa";
import "../web";

// createTest()

export default {
    template: '#home-tpl',
    data() {
        return {
            obj: {}
        };
    },
    mounted() {
        const {reactive, ref } = Vue;


        window.defComAndReloadCurPage('home-form',
            {
                template: /*html*/`
                
                <div @click="goToFolder">fanvas</div>  
                  
                <div class="grid-sm">
                  <div class="tab-sidebar">
                    <div @click="handleClick(key)"
                         :class="{'current-link': key == activeName }"
                         :label="key" :name="key"  v-for="links,key in items">
                      <a >{{key}}</a>
                    </div>

                    <div class="grid" style="max-height: 300px; overflow: auto">
                      <div v-for="item,item_key in curlinks" :class="{'current-link': item == state.item }">
                        {{item}} {{item_key}}
                        <button @click="loadFolder(item)">加载</button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <template v-if="state.hasFolder">
                      <image-slideshow interval="3000000">
                        <template v-for="(item, index) in state.data" >
                          <img
                              v-if="index < 3"
                              :src="getImgHref(index + 1)"
                          >

                          <img
                              v-else
                              :srcres="getImgHref(index + 1)"
                          >
                        </template>
                      </image-slideshow>
                    </template>
                  </div>
                </div>
                
 
                `,

                mounted() {
                    // console.log(this.items.default)
                    this.handleRemote(this)
                },
                setup() {
                    const wlanip = __ips__[0]

                    window.appendStyle(`
                        .current-link {
                            color: var(--el-color-primary);    
                        }
                    `)

                    let docs = {
                        '2055875': {
                            '1': `噢

保护这个银河系

一个可以被称为女王的人

在敌人面前

不要跪下

<...！ ！`,
                            '2':
                                `这个美丽的银河系

什么威胁...

我永远都不会原谅你的...！`,
'3': `哈啊啊啊！ ！`,
'4': '这是…',
'5': `这个储存了我力量的地方

《圣杖》

不怀好意的人

我把你绑起来……！ ！`,
'6': `很快就给你

没有获胜的机会

小心吃`,
'9': `法律…

这是太棒了

是密度能...`,
'10': `屁…？

这是正确的...`,
'11': `就算你动了

就算你拿不到...

能量流

操纵等

没有一点人为的成分...

不碰

如果我打败你

我已经告诉过你了。`,
'12': `胡富夫

那么，让我们回到正轨

我们可以走了吗

什么！ ？

这是！`,
'13': `！？

耶...

身体是，

没有经过允许...！ ！`,
'15': `啊啊啊……津

只是在开玩笑

不…！ ！

呃，那是谎言。

这我...

像这样...

单方面...`,
'16': `德人

尝一下！`,
'19': `…胡夫夫

是的，结束了`,
'21': `是啊，嗯……

嗯，我想我毁掉了它。

我想...

正如预期的那样

能量核心是

好像很难...`,
'24': `我们宝贵的地球

落入邪恶之手

片刻...

哈…津

豆沙…`,
'25':`是，你...
阿斯，特雷亚
逃跑吧...`,
'26': `啊啊啊啊啊啊！！
哎呀
还能说话的精力
暖和了吗？`,
'30': `正如报告所说
好踢啊
你也非常
看起来很好吃
啊......？
溜过去了...！`,
'31': `什么！？
啊，身体......！？
这是
皇后的......！？`,
'32': `就这样近距离地
观察的话
那个美丽的能量
看得很清楚啊...`,
'33': `悠闲的也是
趁现在...！！
这种程度的
束缚，马上
道恩`,
'37': `呃......！
胡胡
刚才是问候哦
那么简单地结束的话
因为很无聊啊`,
'38': `上火书
二人女奴仁：絕对
不会输的！
《守护圣神阿斯特雷亚》
前所未有的强敌的出现，
阿斯特雷亚不屈不挠
挑战战斗！！`,


                        },
                        '3491310': {
                            'content': `在位于银河边缘的一颗小行星上，两位女神之间的战斗正在展开。 ”、“”、“呼！！”、“史黛菈女王锋利的拳头刺穿了怪物的腹部。觉醒兽是一种突然从星系外飞来的未知生物。 ”,“水蛭觉醒兽入侵后发现目标是地球。 「、」、「啊啊啊啊啊！！」 阿斯特莉亚的双腿发出蓝色的光芒，仿佛划破了风一般，将敌人吹飞。 ”，“这些觉醒兽的基地之一就是这颗小行星，在这里可以将他们的目标，美丽的蓝色地球尽收眼底。 “，”“，”“看来我们已经击败了这个星球上的所有敌人，女王。”，“”，阿斯特里亚一边问道，一边眺望着一望无际的灰色岩石的贫瘠景观。 “，”女王用清亮的声音回答道，即使经过了激烈的战斗，她也没有喘过一口气。 ”,””,”“看来是这样的，上次的战斗，我们处于下风，被逼入了一场出乎意料的艰难战斗，这一次，我们要主动出击，主动出击。”,“”, 「是啊，你千里迢迢赶来消灭我……」、「」、「」、「但随之而来的却不是阿斯特莉亚或女王的声音。当他们认出这一点的时候，两位女神的后背都打了个寒颤。 ”,“即便是刚刚在战斗中的两人高度磨练的感应器，也无法察觉到这个存在的任何迹象。 ” “那远处悬崖上悠闲坐着的人，一跃就落在了两人面前。 “，”“，”，“你们好，斯特拉女王，阿斯特丽亚。我是来自这个宇宙之外的高等物种。”，“”，“我一边听着，一边称呼自己。介绍这个生物后，阿斯特莉亚感到一种奇怪的感觉。 ”,“我确信他就在我面前，但尽管我离得这么近，我还是感觉不到他的存在。阿斯特莉亚感觉到一种莫名的诡异感，仿佛面对着鬼魂，但她还是自信地宣称了这一点。 ”、“”、““高等物种？真是个可笑的笑话。如果你要向这些星星露出獠牙，我不会手下留情的……”、“”、“……咕咕呜呜！？ “”、“”、”台词到最后我都说不出来。申哈的拳头深深的扎进了阿莎蕊雅的腹部，速度之快，连阿莎蕊雅的眼睛都无法比拟。 ”、“”、““嗯……！？呼、呼……”“、”“、”然而，让阿斯特莉亚没想到的是，除了速度之外，还有压倒性的体力。 ”，“即使在我迄今为止战斗过的敌人中，它也是体型最小的之一。那细长的手臂和幼稚的拳头，一股难以想象的力量刺穿了阿斯特莉亚的腹肌。 ”，“她的身体漂浮了片刻，但她却崩溃了，连与地球相比微乎其微的重力都无法承受。 “、”、““啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊…！！ “，”女王对着一击就让蓝武士公主受了如此痛苦的申哈怒吼道。 ”、“”、“我会对付你的对手！！加油！”“、”即使对于身经百战的女王来说，这也是第一次面对实力不明的敌人。 ”，“他浑身充满了能量，做好了战斗的准备。 ”,“如果敌人的武器是速度和力量，很难相信我们自己维持了这个星系数百年和平的能力会落后。女王的绝对自信，没有任何震惊就被击碎了。 ”,“他一刻也没有失去目光或注意力。然而，敌人却在女王面前拉近了距离，连残影都没有。就好像他们在不同的时间线上行动。 ”、“从申哈指尖发出的电击，就连女王的思维都被烧毁了。 “啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊！！”前所未有的强烈电击传来。女王继续发出尖锐的尖叫声，火花猛烈爆发，仿佛在喷出母乳。 ”、“”、“哼，原来是这样。”、“攻击一停止，女王也如同断线一般跪倒在地。 “，”沉哈低头看着两位扭动得银光闪闪的屁股突出的女神，平静地说道。 ”、“”、“我不是告诉过你了吗？我们和你是不同的物种，如果你乖一点，把这个星系交给我，我会让你轻易死掉。”、“”、“最后，我又可以呼吸了。阿莎蕊雅用拳头攥在地上，仿佛要挖土。 ","",""如果你认为我们会在这个级别放弃，那你就犯了一个大错误。",""看来我们需要更强的惩罚......!!"","", ” 两位女神站了起来，双手各出现一件武器。经历过多次殊死战斗的两人，意志却没有丝毫减弱。 “、”、“嗯……嗯”、“”、“沉哈清了清嗓子，对这个与她对抗、炫耀力量的存在很感兴趣。然后，他召唤出了一只长度轻易超过自己身高的猎物。 ”、“”、“对于那些不明白的女神，我会教她们等级的区别。”、“”、“争夺银河系命运的战斗即将开始。阿斯特丽亚和斯特拉女王能否击败有史以来最强大的敌人？ ”`
                        },
                        '3582841': {
                            'content': `「这实在是片面践踏，根本称不上是一场战斗……」、「什么……啊！？」、「」、「超越，将阿斯特莉亚的纯粹能量结晶化为刀刃。・」剑比地球上存在的任何矿石都更坚硬、更锋利。 ”,“但是，这样的属性如果无法触及敌人就没有任何意义。 ”，“阿斯特莉亚训练有素的剑术，被神哈的动作轻松躲开，就像是在空中翩翩起舞一样。 ”，“不仅如此，那柄大约是申哈两倍大小的长枪，在阿斯特莉亚挥剑的同时，精准地切入了她毫无防御能力的身体。 「、」、「……啊啊啊啊啊啊啊！！」、「」、「」、「阿斯特莉亚!!」、「」、「阿斯特莉亚」的名字伴随着华丽的火花飞溅而出，女王本人也跳了起来。向着申哈。 ” “女王试图用圣杖支撑阿莎蕊雅，圣杖具有束缚不怀好意之人的力量，但无论她用多大的力量，都无法阻止申哈的动作。对于身为女王，击退过众多敌人的女王来说，还是第一次经历这样的事情。 ”，“那种不耐烦让他的感知稍微迟钝了一些。在与阿斯特莉亚交剑的同时，申哈向女王释放出能量波。 “、”、““妈的……啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊！？申哈没有错过敌人视线被切断的那一刻。 “，”他从被砍倒的阿斯特莉亚身边跳开，将枪尖笔直刺出。毫不犹豫，那致命的刀锋就刺穿了女王胸口那闪烁着蓝色光芒的核心光芒。 “、”、“”、“啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊！？对于女神来说，有着用来补充能量的核心，被攻击就等同于被掏出要害。 ”、“”、“啊哈……！啊啊……！”、“”、“虽然被痛得喘不过气来，火花四溅，但女王的核心还是成功了。为了挡住申哈的矛，我试图接受它。 “，”沉哈盯着冒着烟的刀尖，略带感动地说道。 ”、“”、““嗯。这里真的很艰难，不是吗？”、“”、“当然……！啊，你的攻击连我都抓不到……啊啊！？” ”,“女王的虚张声势不被允许持续到最后。申哈的小手用尽全力挤压着女王的呼吸道。 「、」、「啊……啊、啊……！不……！不……！」 「、」、「啊……啊啊……！」 「、」、「啊……」 沉哈抱着女王的脖子缓缓上升。两只穿着红色靴子的脚被拉离地面，扑通扑通，好像在寻求帮助。 「、」」、「啊……！ 不……」 「、」」、」 身体只比自己小两倍的敌人。在这样的存在面前，让女王也意识到了实力的差距是多么的无可救药。 ”,“与他迄今为止所面对的任何肌肉怪物相比，从这些纤细的手指中传递出来的力量是压倒性的。 ”、“”、“（啊，这不可能，是这样的……）”、“放开女王……！”、“”、“阿斯特丽亚全身被砍伤，不知为何倒下了。 ，他振作起来，面对眼前展开的女王危机。 ”，“然而，神哈看都没看她一眼，而是将长枪释放的能量波动击中。 “、”、“啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa啊……！！”沉哈百无聊赖地吐出一口口水，粗暴地把拼命想要扯断自己手臂的女王抛到了一边。 ”、“阿莎蕊雅冲向虚弱倒地的女王。 ”、“”、“给你最后一次机会。全力以赴。”神哈在高处说道，巨大的能量聚集在他的枪尖上。举行。冰冷的震动让两人都感到疼痛，只要靠近，身体就仿佛被撕裂。 ”、““别玩弄我！我一定会让你后悔的！！”“、”“我们输不起……！！”“、”“、”阿斯特莉亚和女王集合耗尽她仅存的能量，全力出击。超越大炮和圣炮。女神们的特殊技术，将地球从许多危机中拯救出来。 ”，“就在这时，申哈的无名一击朝着他射来，轻易就被吞噬了。 ”、“”、“啊……”、“”、“绝望的声音从阿斯特莉亚的口中泄露出来。 ”，“只用了不到几秒的时间，但慢动作中，阿莎蕊雅却看到了站在自己面前，仿佛以身体为盾牌的女王。 ”，“还没等他们听到对方的声音，神哈释放的能量波就爆炸了，让周围变成了一个只有热气和声音的世界。 ”、“”、“随着黑烟的颜色渐渐褪去，这场战斗的结果已经明朗起来。 ”，“那里，有失去所有‘光芒’，无助地躺着的女王，还有拼尽最后一口气试图追随她的阿斯特莉亚。 ”、“”、“是的……女王……”、“”、“多次保护我免受危险的绝对女王就是这个名字。”也没有任何反应。 ”、““哈哈，你真是个白痴女王，为了保护一个小鱼儿，自己先被杀了。”、“”、“沉哈落在了躺在地上的两人身边，高声嘲笑道。 “，”阿莎蕊雅感到自己的身体因为愤怒而发热。然而，即便有那样的热情，他也已经站不起来了。 “，”阿斯特莉亚拼命地用双臂支撑着自己的上半身，尽管她感觉稍微一松手就会失去知觉。 “，”，“我不会原谅你……你永远不会……啊！？我跳过了。”阿莎蕊雅在地上打滚，仰面躺着，眼中浮现出神哈手持女王武器圣杖的影像。 ”、“”、“看，这是女王送来的礼物。”“、”“、“哦，停下来……桑哈！？话音刚落，圣杖的把手就已经刺入了阿莎蕊雅的私处。 ”、“”、“啊……！啊、啊、啊……啊……”、“”、“那冰冷的触感，那丝丝阿斯特莉亚的意志，吞噬了一切。 ”、“一声沉闷的闷响，阿斯特莉亚的头和手臂掉到了地上。光正在从那个核心、那些眼睛中消失。 「、」、「是的，就是这样♪」、、「、」当慎哈戳到阿斯特莉亚生殖器上长出的圣棒时，阿斯特莉亚的身体仿佛随之抽搐起来。 ”，“就这样，两位女神在突然出现的上位者神哈的无情力量面前彻底失败了。 “，”“`
                        }

                    }


                    let defshots =  [
                        '118820919',
                        '120643542',
                        '121104225',
                        '116826766',
                        '120867545',
                        '118309975',
                        '121175718',
                        '121161242',
                        '120673202',
                        '121808271',
                        '121841160',
                        '122226362',
                        '122344378',
                        '122792374',
                        '123001460',
                        '123070132',
                        '123185432',
                        '123322753',
                        '123397254',
                        '123466002',
                        '124337625',
                        '124067679',
                        '124680882',
                        '126181032',
                        '126301620',
                        '126489458'
                    ].map(v => 'a_' + v);

                    let items = ref({
                        'default': defshots,
                        'fanbox_1': [
                            '1775862',
                            '1829683',
                            '1900294',
                            '1900405',
                            '1953140',
                            '1953154',
                            '2008686',
                            '2055288',
                            '2055875',
                            '2115249',
                            '2115300',
                            '2164298',
                            '2164342',
                            '2230312',
                            '2230317',
                            '2288950',
                            '2288964',
                            '2288965',
                            '3415174',
                            '3491310',
                            '3582841',
                        ].map(v => 'a_' + v),
                        'fanbox_2': [
                            '3310639',
                            '3310927',
                            '3384037',
                            '3384234',
                            '3454040',
                            '3454044',
                            '3552709',
                            '3552710',
                            '3613115',
                            '3652415',
                            '3684031',
                            '3715554',
                            '3750982',
                            '3827698',
                            '3871574',
                            '3903538',
                            '4041231',
                            '4104308',
                            '4141450',
                            '4195971',
                            '4258543',
                            '4305922',
                            '4359326',
                            '4595565',
                            '4635474',
                            '4687284',
                            '4737625',
                            '4793363',
                            '4850933',
                            '4890928',
                            '4974630',
                            '5023400',
                            '5075481',
                            '5200139',
                            '5249848',
                            '5299147',
                            '5445727',
                            '5505765',
                            '5561669',
                            '5754349',
                            '5962766',
                            '6324000',
                            '7621552',
                            '7646428',
                            '7693718',
                            '7750462',
                            '7783709',
                            '7817239',
                            '7850446',
                            '7879728',
                            '7903979'
                        ].map(v => 'a_' + v),
                        'fanbox_3': [
                            '5847871',
                            '5910051',
                            '6005291',
                            '6048674',
                            '6107278',
                            '6152496',
                            '6200864',
                            '6244232',
                            '6343434',
                            '6362075',
                            '6431397',
                            '6482932',
                            '6548165',
                            '6590948',
                            '6633259',
                            '6671889',
                            '6706606'
                        ].map(v => 'a_' + v),
                        'fanbox_4': [
                            '6843938',
                            '6876645',
                            '6876813',
                            '6943445',
                            '6991838',
                            '7023082',
                            '7063288',
                            '7101506',
                            '7142081',
                            '7179251',
                            '7312061',
                            '7347443',
                            '7381731',
                            '7423729',
                            '7456535',
                            '7493344'
                        ].map(v => 'a_' + v),
                        'fanbox_5': [
                            '8097235',
                            '8149637',
                            '8216382',
                            '8270796',
                            '8316916',
                            '8403387',
                            '8433624',
                            '8480489',
                            '8519711',
                            '8556189',
                            '8568922',
                            '8568927',
                            '8726044',
                            '8761186',
                            '8803066',
                            '8844327',
                            '8878490'
                        ].map(v => 'a_' + v),
                        '22500825/series/89560': [
                            'a_91758958',
                            'a_91758988',
                            'a_91759021',
                        ],
                        '2647482/series/170919': [
                            "a_104730048",
                            "a_103918062",
                            "a_101349847",
                            "a_101165530",
                            "a_100833715",
                            "a_100286596",
                            "a_99772831",
                            "a_99460272",
                            "a_99013818",
                            "a_98830485",
                            "a_98666678",
                            "a_98507952",
                            "a_98214424",
                            "a_97832463",
                            "a_97541164",
                            "a_97192242"
                        ].reverse(),

                        '2647482/series/131454': [
                            "a_119460692",
                            "a_116142799",
                            "a_110154536",
                            "a_110154456",
                            "a_103122663",
                            "a_103122540",
                            "a_103122347",
                            "a_103122197",
                            "a_96375779",
                            "a_95364257",
                            "a_94833870",
                            "a_94833707",
                            "a_92984200",
                            "a_90961693",
                            "a_89574985"
                        ].reverse()
                    });

                    let activeName = ref(Object.keys(items.value)[0])

                    function handleRemote(context) {
                        
                      if (!state.remote) {
                        fetch(`http://${wlanip}:3000/get_screen_shots`).then(v => {
                            return v.json()
                        }).then(v => {
                            console.log(v)
                            if (v && v.list) {
                                v.list.forEach(item => {
                                    context.items.default.push(
                                        item
                                    );
                                    console.log(item)
                                });
                        
                                state.change = false;
                                setTimeout(() => {
                                    context.$forceUpdate();
                                    state.change = true;
                                    state.remote = true;
                                }, 300)
                            }
                        })
                      }
                    }

                    function handleClick(key) {
                        activeName.value = key
                        state.change = false;
                        curlinks.value = getLinks();

                        setTimeout(() => {
                            this.$forceUpdate();
                            state.change = true;
                        }, 300)
                    }


                    let state = reactive({
                        hasFolder: false,
                        index: 1,
                        item: null,
                        num: 1,
                        change: true,
                        remote: false,
                        data: {},
                    })

                    function getDoc() {
                        let name = state.item.replace('a_', '')
                        if (docs[name]) {
                       
                            if (docs[name].content) {
                       
                                return docs[name].content
                            }
                            return docs[name][state.index + '']
                        }
                    }

                    async function loadFolder(item) {
                        console.log(this)
                        state.hasFolder = false;
                        try {
                            let res = await fetch(`http://${wlanip}:3000/data/${item}/config.json`)
                            console.log(res)
                            if (res.status === 200) {
                                let json = await res.json();
                                state.hasFolder = true;
                                state.index = 1;
                                state.item = item;
                                state.data = json;

                                this.$forceUpdate()
                            } else {
                                gl.showToast( `${item.replace('a_', '')} 没收集`,)
                            }
                        } catch (e) {
                            state.hasFolder = false
                            console.log(e)


                        }
                    }

                    function getImgHref(index) {
                        return `http://${wlanip}:3000/data/${state.item}/p${index}.png`
                    }

                    // function getImgHref(index) {
                    //     return `http://${wlanip}:3000/data/${state.item}/p${state.index}.png`
                    // }
                    function getLinks() {
                        // console.log(activeName)
                        let ret = Object.entries(items.value).find(([key, v]) => key === activeName.value);
                        if (ret) {
                            return ret[1]
                        }
                        return []
                    }

                    let curlinks = ref([])

                    curlinks.value = getLinks()

                    // const router = globalThis.VueRouter.useRouter()
                    function goToFolder() {
                        globalThis.gl.navigateTo({
                            path: '/fanvas'
                        })
                    }

                    return {
                        items,
                        getDoc,
                        loadFolder,
                        getImgHref,
                        activeName,
                        handleClick,
                        goToFolder,
                        handleRemote,
                        curlinks,
                        state,
                    }
                }

            }
        );
    },
}
