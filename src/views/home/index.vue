<template>
  <div class="app">
    <van-nav-bar title="首页|搜索" fixed />
    <van-tabs v-model="activeChannelIndex" class="channel-tabs">
      <van-tab :title="item.name"
      v-for='item in channels'
      :key='item.id'
      >
        <van-pull-refresh v-model="item.downPullLoading" @refresh="onRefresh">
          <!-- 列表  van-list -->
          <van-list v-model="item.upPullLoading" :finished="item.upPullFinished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="item in item.articles" :key="item.aut_id" :title="item.title" />
          </van-list>
        </van-pull-refresh>
      </van-tab>

    </van-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getChannelsUserOrDefaults } from '@/api/channel.js'
import { getArticles } from '@/api/article.js'
export default {
  name: 'home',
  data () {
    return {
      activeChannelIndex: 0,
      loading: false,
      finished: false,
      list: [],
      isLoading: false,
      channels: []
      // activeChannel: null
    }
  },
  methods: {
    async onLoad () {
      this.$sleep(800)
      // 异步更新数据
      let data = []
      data = await this.loadArticles()
      console.log(data)
      if (data.pre_timestamp && data.results.length === 0) {
        this.activeChannel.timestamp = data.pre_timestamp
        data = await this.loadArticles
      }
      if (!data.pre_timestamp) {
        this.activeChannel.upPullLoading = false
        this.activeChannel.upPullFinished = true
        return
      }
      this.activeChannel.timestamp = data.pre_timestamp
      // data.results = [{}]
      // const temp = [...data.results]
      this.activeChannel.articles.push(...data.results)
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      // this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
      this.activeChannel.upPullLoading = false
    },
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    // 获取频道列表
    async loadArticles () {
      // 判断是否有token值
      // const {user} = state.
      console.log('this.activeChannel', this.activeChannel)
      const { id: channel_id, timestamp } = this.activeChannel
      const data = await getArticles({
        channel_id,
        timestamp: Date.now(),
        // timestamp,
        with_top: 1
      })
      console.log(data)
      return data
    },
    // 判断用户是否登录--------登录了，直接获取用户的频道列表-----------没有登录，判断是否有本地缓存数据-----------没有就重新获取

    async loadChannels () {
      const lsChannels = JSON.parse(window.localStorage.getItem('channels'))
      try {
      // let channels = []
        if (this.user) {
          // 如果登陆了

          const data = await getChannelsUserOrDefaults()
          data.channels.forEach(item => {
            item.downPullLoading = false
            item.upPullLoading = false
            item.upPullFinished = false
            item.articles = []
          })
          this.channels = data.channels
          console.log('登陆了的频道', this.channels)
        } else {
          // 如果没登录
          if (lsChannels) {
            // 本地有数据
            console.log('使用本地数据')
            this.channels = lsChannels
          } else {
            // 本地没数据
            const data = await getChannelsUserOrDefaults()
            data.channels.forEach(item => {
              item.downPullLoading = false
              item.upPullLoading = false
              item.upPullFinished = false
              item.timestamp = Date.now()
              item.articles = []
            })
            this.channels = data.channels
            console.log('没有登录的频道', this.channels)
          }
        }
        // console.log(this.channels)
      } catch (error) {
        console.dir(error)
      }
    }
  },
  created () {
    this.loadChannels()
  },
  computed: {
    ...mapState(['user']),
    // 获取当前激活频道的对象
    activeChannel () {
      // 在频道列表中，根据当前激活的索引不同，获取channel
      return this.channels[this.activeChannelIndex]
    }
  },
  watch: {
    // '$store.state.user' () {

    // }
    user (newV, oldV) {
      this.loadChannels()
      this.activeChannel.upPullLoading = true
      this.loadArticles()
    }
  }
}
</script>

<style scoped lang='less'>
.van-nav-bar {
  background-color: #1989fa;
}
.van-nav-bar__title {
  color: #fff;
}
.channel-tabs {
  margin-bottom: 100px;
}
// 调整tab栏的位置
.channel-tabs /deep/ .van-tabs__wrap {
  z-index: 999999999999999999;
  position: fixed;
  top: 92px; // 46 *2 -> 92
}
// 调整tabs的内容的位置
.channel-tabs /deep/ .van-tabs__content {
  margin-top: 200px;
}
</style>
