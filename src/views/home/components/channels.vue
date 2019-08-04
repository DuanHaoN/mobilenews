<template>
  <van-popup :value="value" @input="$emit('input',$event)" position="bottom" :style="{ height: '95%' }">

    <!-- 我的频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button type="danger" plain size="mini" @click="isEdit=!isEdit">{{!isEdit?'编辑':'完成'}}</van-button>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="(item,index) in channels" :key="item.id" text="文字" @click="handleClickChannel(item,index)">
          <span class="text" :class="{active:activeIndex===index&&!isEdit}">{{item.name}}</span>
          <van-icon v-show="isEdit===true && index!==0" class="close-icon" name="close" />
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 推荐频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="(item,index) in restChannels" :key="item.id" text="文字" @click="handleAddClick(item,index)">
          <div class="info">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
import {
  getAllChannels,
  resetUserChannels,
  deleUserChannel
} from '@/api/channel.js'
import { mapState } from 'vuex'
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: 'false'
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
  data() {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    ...mapState(['user']),
    restChannels() {
      // 目的: 把allChannels的数据中的channels数据筛选出来
      // allChannels[{id},2,3,4,5,6,7]
      // channels[{id:},{id},{id}]
      // for---if----

      // 取出channels所有id
      // 1. 返回一个数组
      // 2. return id

      // map
      // 1. 能遍历
      // 2. 传cb
      // 3. cb形参是元素
      // 4. return ?
      // 5. 把所有的?放在新数组返回
      // const a = [1,2,3].map((item)=>{
      //   return item+1
      // })

      const ids = this.channels.map(item => {
        return item.id
      })

      // filter
      // 1. 能遍历
      // 2. 传cb
      // 3. cb形参是元素
      // 4. return 条件
      // 5. 把符合条件的元素放在数组里
      // 6. 返回新数组
      // 要的是 [4,5,6,7]

      return this.allChannels.filter(item => {
        // item.id ->2
        // ids-> [1,2,3,4,5]
        // [1, 2, 3].includes(2)     // true
        // const a = ids.includes(item.id)  // !a

        return !ids.includes(item.id)
      })
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    // 点击频道
    handleClickChannel(item, index) {
      if (!this.isEdit) {
        this.channelChannel(item, index)
      } else {
        if (index !== 0) {
          this.deleChannel(item, index)
        } else {
          return
        }
      }
    },
    // 进入频道

    channelChannel(item, index) {
      console.log('channelChannel-------')
      // 关闭模态框
      this.$emit('input', false)
      // 修改当前激活频道->子传父
      this.$emit('update:active-index', index) // 传递索引
    },
    // 删除频道

    async deleChannel(item, index) {
      this.channels.splice(index, 1)
      // 登录了
      if (this.user) {
        try {
          // 请求
          await deleUserChannel(item.id)
        } catch (error) {
          console.dir(error)
        }
      } else {
        // 本地删除
        // [1,2,3,4]
        // [1,2,3]

        window.localStorage.setItem('channels', JSON.stringify(this.channels))
      }
    },

    // 添加频道
    async handleAddClick(item, index) {
      this.channels.push(item) //

      if (this.user) {
        const channels = this.channels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2
          }
        })

        // 发送请求
        const data = await resetUserChannels(channels)
        // console.log(data)
      } else {
        // 向本地添加
        window.localStorage.setItem('channels', JSON.stringify(this.channels))
      }
    },
    async loadAllChannels() {
      const data = await getAllChannels()
      // console.log(data)
      // 如果想不到再次设计数据结构,直接跳过
      data.channels.forEach(item => {
        item.downPullLoading = false // 当前频道下拉状态
        item.upPullLoading = false // 当前频道上拉加载更多
        item.upPullFinished = false // 当前频道加载完毕
        item.timestamp = Date.now() // 为每个频道添加默认时间戳属性
        item.articles = [] // 为了控制个频道自己的文章列表数据
      })
      this.allChannels = data.channels
    }
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

