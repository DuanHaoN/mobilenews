<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    position="bottom"
    :style="{ height: '85%' }"
  >
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button type="danger" plain size="mini">编辑</van-button>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
         <van-grid-item v-for="(item, index) in channels" :key="item.id">

            <span slot="text" class="text" :class="{active: index === activeIndex}"> {{item.name}} </span>

        </van-grid-item>
      </van-grid>
    </div>

    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="(item, index) in restChannels" :key="item.id">

            <span @click="handleAddChannel(item)" slot="text" class="text"> {{item.name}} </span>

        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>
<script>
import { getAllChannels, resetUserChannels } from '@/api/channel.js'
import { mapState } from 'vuex'

export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: []
    }
  },
  methods: {
    async loadAllChannels () {
      const data = await getAllChannels()
      data.channels.forEach(item => {
        item.articles = [] // 当前频道的文章列表数据
        item.downPullLoading = false // 当前频道下拉状态
        item.upPullLoading = false // 当前频道上拉加载更多
        item.upPullFinished = false // 当前频道加载完毕
        item.timestamp = Date.now() // 下一组数据的时间戳
      })
      this.allChannels = data.channels
    },
    async handleAddChannel (item) {
      this.channels.push(item)
      if (this.user) {
        const data = this.channels.slice(1).map((item, i) => {
          return {
            id: item.id,
            seq: i + 2
          }
        })
        await resetUserChannels(data)
      } else {
        window.localStorage.setItem('channels', JSON.stringify(this.channels))
      }
    }
  },
  created () {
    this.loadAllChannels()
  },
  computed: {
    restChannels () {
      const userChannelIds = this.channels.map((item, i) => {
        return item.id
      })
      const restChannels = this.allChannels.filter((item, i) => {
        return !userChannelIds.includes(item.id)
      })
      return restChannels
    },
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
    .action {
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
