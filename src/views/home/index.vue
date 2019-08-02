<template>
  <div class="app">
    <van-nav-bar title="首页|搜索" fixed />
    <van-tabs v-model="activeChannelIndex" class="channel-tabs">
      <div slot="nav-right" class="wap-nav">
        <van-icon name="wap-nav" @click="showChannel"></van-icon>
      </div>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <van-pull-refresh
          v-model="item.downPullLoading"
          :downPullSuccessText="downPullSuccessText"
          @refresh="onRefresh"
        >
          <!-- 列表  van-list -->
          <van-list
            v-model="item.upPullLoading"
            :finished="item.upPullFinished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <!-- <van-cell v-for="item in activeChannel.articles" :key="item.aut_id" :title="item.title" /> -->
            <van-cell
              v-for="item in activeChannel.articles"
              :key="item.art_id.toString()"
              :title="item.title"
            >
              <div slot="label">
                <template v-show="item.cover.type">
                  <van-grid :border="false" :column-num="3">
                    <van-grid-item v-for="(item,index) in item.cover.images" :key="index">
                      <van-image :src="item" lazy-load />
                    </van-grid-item>
                  </van-grid>
                </template>

                <p>
                  <span>作者:{{item.aut_name}}</span>
                  &nbsp;
                  <span>评论 :{{item.comm_count}}</span>
                  &nbsp;
                  <span>时间:{{item.pubdate | relTime }}</span>
                  &nbsp;
                  <van-icon class="close" name="cross" @click="showMoreActionDia(item)"></van-icon>

                  <!-- 更多操作 -->
                  <more-action
                    v-model="isMoreActionShow"
                    :currentArticles="currentArticles"
                    @handleUnlike="handleUnlikeArticle"
                  ></more-action>

                  <channel v-model="isChannelShow"
                  :channels='channels'
                  :active-index='activeChannelIndex'
                  ></channel>
                </p>
              </div>
            </van-cell>
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
import MoreAction from './more-action'
import Channel from './channel'
export default {
  name: 'home',
  components: {
    MoreAction,
    Channel
  },
  data () {
    return {
      activeChannelIndex: 0,
      loading: false,
      finished: false,
      list: [],
      isLoading: false,
      channels: [],
      isMoreActionShow: false,
      currentArticles: null,
      downPullSuccessText: '',
      isChannelShow: false
      // activeChannel: null
    }
  },
  methods: {
    async onLoad () {
      // const data = this.loadArticles()
      // console.log(data)
      this.$sleep(800)
      // 异步更新数据
      let data = []
      data = await this.loadArticles()
      if (!data.pre_timestamp && !data.results.length) {
        this.activeChannel.upPullLoading = false
        this.activeChannel.upPullFinished = true
        return
      }
      // console.log(data)
      if (data.pre_timestamp && data.results.length === 0) {
        this.activeChannel.timestamp = data.pre_timestamp
        // console.log('改变时间戳，重新获取频道文章')
        data = await this.loadArticles()
        // console.log(data)
      }
      // if (!data.pre_timestamp) {
      //   this.activeChannel.upPullLoading = false
      //   this.activeChannel.upPullFinished = true
      //   return
      // }
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
    showChannel () {
      this.isChannelShow = true
    },
    handleUnlikeArticle () {
      // 找到当前文章的索引，从数据中移除
      // console.log(this.activeChannel)
      const cuIndex = this.activeChannel.articles.findIndex(item => {
        return item === this.currentArticles
      })
      // console.log(cuIndex)
      this.activeChannel.articles.splice(cuIndex, 1)
    },
    showMoreActionDia (item) {
      this.isMoreActionShow = true
      // console.log(item)
      this.currentArticles = item
    },
    async onRefresh () {
      // setTimeout(() => {
      //   this.$toast('刷新成功')
      //   this.isLoading = false
      // }, 500)
      // 备份上次时间戳
      const timestamp = this.activeChannel.timestamp
      this.activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()
      // console.log(data)
      if (data.results.length) {
        this.activeChannel.articles = data.results
        this.activeChannel.timestamp = timestamp
        this.activeChannel.downPullSuccessText = '更新成功'
        this.onLoad()
      } else {
        this.activeChannel.downPullSuccessText = '已是最新数据'
      }
      this.activeChannel.downPullLoading = false
    },
    // 获取频道列表
    async loadArticles () {
      // 判断是否有token值
      // const {user} = state.
      // console.log('this.activeChannel', this.activeChannel)
      const { id: channel_id, timestamp } = this.activeChannel
      const data = await getArticles({
        channel_id,
        timestamp,
        // timestamp,
        with_top: 1
      })
      // console.log(data)
      return data
    },
    // 判断用户是否登录--------登录了，直接获取用户的频道列表-----------没有登录，判断是否有本地缓存数据-----------没有就重新获取

    async loadChannels () {
      // 获取本地频道数据
      const localChannels = JSON.parse(window.localStorage.getItem('channels'))
      try {
        if (!this.user && localChannels) this.channels = localChannels
        if (this.user || (!this.user && !localChannels)) {
          const data = await getChannelsUserOrDefaults()
          data.channels.forEach(item => {
            item.articles = []
            item.downPullLoading = false
            item.upPullLoading = false
            item.upPullFinished = false
            item.timestamp = Date.now()
          })
          this.channels = data.channels
        }
        // let channels = []
        // if (this.user) {
        //   // 如果登陆了

        //   const data = await getChannelsUserOrDefaults()
        //   data.channels.forEach(item => {
        //     item.downPullLoading = false
        //     item.upPullLoading = false
        //     item.upPullFinished = false
        //     item.articles = []
        //   })
        //   this.channels = data.channels
        //   console.log('登陆了的频道', this.channels)
        // } else {
        //   // 如果没登录
        //   if (localChannels) {
        //     // 本地有数据
        //     console.log('使用本地数据')
        //     this.channels = localChannels
        //   } else {
        //     // 本地没数据
        //     const data = await getChannelsUserOrDefaults()
        //     data.channels.forEach(item => {
        //       item.downPullLoading = false
        //       item.upPullLoading = false
        //       item.upPullFinished = false
        //       item.timestamp = Date.now()
        //       item.articles = []
        //     })
        //     this.channels = data.channels
        //     console.log('没有登录的频道', this.channels)
        //   }
        // }
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
      // console.log(
      //   '当前激活的文章频道为：' + this.channels[this.activeChannelIndex]
      // )
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
.channel-tabs /deep/ .close {
  float: right;
  font-size: 30px;
}
.channel-tabs /deep/ .wap-nav {
  position: fixed;
  right: 0px;
}
</style>
