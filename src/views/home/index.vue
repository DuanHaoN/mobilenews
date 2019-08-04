<template>
  <div>
    <!-- 导航 -->
    <van-nav-bar title="首页|搜索" fixed/>
    <!-- 内容
    1. tabs切换
    2. list列表: 加载更多+下拉刷新
     -->
    <van-tabs v-model="activeChannelIndex" class="channel-tabs">

      <!-- 自定义按钮 -->
      <div slot='nav-right' class="wap-nav" @click="showChannel">
        <van-icon name="wap-nav"></van-icon>
      </div>

      <van-tab :title="item.name" v-for="item in channels" :key="item.id">

        <van-pull-refresh :success-text="refreshSuccessText" v-model="item.downPullLoading" @refresh="onRefresh">
          <!-- 列表  van-list -->
          <van-list v-model="item.upPullLoading" :finished="item.upPullFinished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="item in item.articles" :key="item.art_id.toString()" :title="item.title">
              <template slot="label">
                <van-grid v-show="item.cover.type!==0" :border="false" :column-num="3">
                  <van-grid-item v-for="(src,index) in item.cover.images" :key="src+index">
                    <van-image :src="src" lazy-load />
                  </van-grid-item>
                </van-grid>
                <p>
                  <span>作者:{{item.aut_name}}</span>
                  &nbsp;
                  <span>评论 :{{item.comm_count}}</span>
                  &nbsp;
                  <span>时间:{{item.pubdate | relTime}}</span>
                  &nbsp; &nbsp;
                  <van-icon class="close" name="cross" @click="showMoreActionDia(item)"></van-icon>
                </p>
              </template>
            </van-cell>
          </van-list>

        </van-pull-refresh>

      </van-tab>

    </van-tabs>

    <!-- 更多操作 -->
    <more-action @dislike-success="handleDislikeSuccess" v-model="isShowDiaMore" :currentArticle="currentArticle"></more-action>

    <!-- 频道管理 -->
    <channels :activeIndex="activeChannelIndex" :channels="channels" v-model="isShowPopChannel" @update:active-index="activeChannelIndex=$event"></channels>

    <!--
        fn($event){
          this.activeChannelIndex=$event
        }

     -->
  </div>
</template>

<script>
import { getChannelsUserOrDefault } from '@/api/channel.js'
import { getArticles } from '@/api/article.js'
import { mapState } from 'vuex'
import MoreAction from './components/more-action.vue'
import Channels from './components/channels.vue'

export default {
  name: 'HomeIndex',
  components: {
    MoreAction,
    Channels
  },
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      isLoading: false,
      channels: [],
      isShowDiaMore: false,
      isShowPopChannel: false,
      currentArticle: null,
      refreshSuccessText: ''
    }
  },
  created () {
    this.loadChannels()
  },
  // 监测store.state.user
  watch: {
    // 'list'(newValue, oldValue) {

    // },
    // list:(newV,oldV)=>{

    // }
    // 'list':()=>{}
    // 凡是可以使用this.出来的数据,都可以使用watch监测
    // this.$store.state.user
    // '$store.state.user'(){

    // }
    user (newV, oldV) {
      // 更新频道列表
      this.loadChannels()
      // 更新加载的动画
      this.activeChannel.upPullLoading = true
      // 更新文章列表
      // this.loadArticles()
      this.onLoad()
    }
  },
  computed: {
    ...mapState(['user']),
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  methods: {
    showChannel () {
      this.isShowPopChannel = true
    },
    handleDislikeSuccess () {
      // 应该发送delete删除文章的请求->res->修改数据
      // 假删除->

      // findIndex
      // 1. 这是数组的实例方法
      // 2. 能遍历
      // 3. 传cb
      // 4. cb的形参代表每个元素
      // 5. return 条件
      // 6. findIndex会把符合return条件的元素的索引

      const index = this.activeChannel.articles.findIndex(item => {
        return item === this.currentArticle
      })

      this.activeChannel.articles.splice(index, 1)
    },
    // 点击-> 打开对话框
    showMoreActionDia (currentArticle) {
      this.currentArticle = currentArticle
      this.isShowDiaMore = true
    },
    async loadChannels () {
      // 取出本地数据
      const lsChannels = JSON.parse(window.localStorage.getItem('channels')) // [{ios}]

      try {
        // 如果登录 或者 (没登录 并且没有本地)
        if (this.user || (!this.user && !lsChannels)) {
          const data = await getChannelsUserOrDefault()

          data.channels.forEach(item => {
            // id和name
            item.downPullLoading = false // 当前频道下拉状态
            item.upPullLoading = false // 当前频道上拉加载更多
            item.upPullFinished = false // 当前频道加载完毕
            item.timestamp = Date.now() // 为每个频道添加默认时间戳属性
            item.articles = [] // 为了控制每个频道自己的文章列表数据
          })
          this.channels = data.channels
        }

        // 如果没登录 并且 有本地
        if (!this.user && lsChannels) {
          this.channels = lsChannels // [{ios}]
        }
      } catch (error) {
        console.dir(error)
      }
    },
    // 下拉刷新的方法
    async onRefresh () {
      await this.$sleep(800)
      // 更新为最新时间戳
      this.activeChannel.timestamp = Date.now()
      // 获取最新数据
      const data = await this.loadArticles()
      // 有最新数据
      if (data.results.length) {
        // 重置数据
        this.activeChannel.articles = data.results // data.results=>10条
        // 重置时间戳
        this.activeChannel.timestamp = data.pre_timestamp
        // 手动调用加载调用onLoad方法->保证数据是满屏的
        this.onLoad()
        // 提示-> 更新完毕
        this.refreshSuccessText = '更新完毕'
      }
      // 无最新数据
      this.refreshSuccessText = '无最新数据'

      // 停止动画
      this.activeChannel.downPullLoading = false

      // setTimeout(() => {
      //   this.$toast('刷新成功')
      //   this.isLoading = false
      // }, 500)
    },

    // 获取文章列表数据
    async loadArticles () {
      const { id: channel_id, timestamp } = this.activeChannel

      const data = await getArticles({
        // 当前激活的频道的id<-当前激活的频道<-activeChannel
        channel_id,
        // timestamp: Date.now(),
        // timestamp,
        timestamp,
        with_top: 1
      })
      return data
    },
    // 加载更多的方法
    async onLoad () {
      // 延迟执行是独立作用的函数->多次使用
      // 1. 函数
      // 2. 模块.js
      // 3. 挂载Vue的实例上  ->  this.$sleep()

      await this.$sleep(800)

      let data = []
      // 第一次发送请求
      data = await this.loadArticles()
      // 有历史时间戳
      if (data.pre_timestamp && data.results.length === 0) {
        // 更新timestamp时间戳
        this.activeChannel.timestamp = data.pre_timestamp
        // 根据当前的有效时间戳发送新请求
        data = await this.loadArticles()
      }

      // 所有数据加载完毕
      if (!data.pre_timestamp) {
        this.activeChannel.upPullLoading = false
        this.activeChannel.upPullFinished = true

        return
      }

      // 更新最新的时间戳
      this.activeChannel.timestamp = data.pre_timestamp
      // 时间戳 ->   频道数据channels  和  当前文章列表数据data.results
      this.activeChannel.articles.push(...data.results)
      // 停止加载中的动画
      this.activeChannel.upPullLoading = false
    }
  }
}
</script>

<style lang='less' scoped>
.van-nav-bar {
  background-color: #1989fa;
  .van-nav-bar__title {
    color: #ffffff;
  }
}

// 调整tabs样式
// 解决方案: 如果在scoped的前提下->也能选择当前类名van-tabs__wrap->vue文档scoped的具体用法
// 1. scoped作用当前作用域
// 2. 深度选择   ->   /deep/
// 补充: /deep/的另一种写法 >>> -> 和css预处理器不兼容
// .channel-tabs >>> .van-tabs__wrap {}

// 调整tabs整体底部的距离->为了能看到'没更多数据'
.channel-tabs {
  margin-bottom: 100px;

}
// 调整tab栏的位置
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px; // 46 *2 -> 92
  z-index: 9999999;
}
// 调整tabs的内容的位置
.channel-tabs /deep/ .van-tabs__content {
  margin-top: 92px;

}
// 调整tabs右按钮的位置
.channel-tabs /deep/ .wap-nav {
  position: fixed;
  right: 0px;
}
</style>

// 需求 :  "adsasdasdMMasdMMsadsadMMasdasdsad"希望这里的MM红色显示
// 思路?
"adasdsad".split()

// "adsasdasdMMasdMMsadsadMMasdasdsad".split("MM").join("<span>MM</span>")
