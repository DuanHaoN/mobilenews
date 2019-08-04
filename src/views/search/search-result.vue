<template>

  <div>
    <van-nav-bar fixed title="搜索结果" left-text="返回" left-arrow @click-left="$router.back()"></van-nav-bar>
    <van-list class="search-list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in resultdata" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'

export default {
  name: 'SearchResult',
  // created() {
  //   this.loadSearchResult()
  // },
  data() {
    return {
      resultdata: [],
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 10
    }
  },
  computed: {
    q() {
      return this.$route.params.q
    }
  },
  // keep-alive 组件停用时调用-> 缓存刚做完 就触发->此时 ,有缓存
  deactivated() {
    // 清除缓存的组件->干掉组件
    // this->当前Vue构造函数的实例化对象->Vue实例->Vue实例对象->obj.属性|obj.方法()->文档中Vue实例的.方法()

    // 完全销毁一个实例。->干掉组件

    this.$destroy()
  },
  // 当前组件接收了外部传入的路由数据->
  methods: {
    async onLoad() {
      await this.$sleep(800)

      try {
        // page=1 per_page=10
        const data = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.q
        })
        if (data.results.length === 0) {
          this.finished = true
          this.loading = false
        } else {
          this.resultdata.push(...data.results)
          this.page++
          this.loading = false
        }
      } catch (error) {
        console.dir(error)
      }

      // console.log("------");

      // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 500)
    },
    async loadSearchResult() {
      try {
        const data = await getSearchResult({
          q: this.q
        })
        this.resultdata = data.results
      } catch (error) {
        console.dir(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-list {
  margin-top: 92px;
}
.van-nav-bar {
  background-color: #0096fa;

  .van-nav-bar__title,
  .van-nav-bar__text,
  .van-icon {
    color: #fff;
  }
}
</style>



// 分析缓存的过程
// 使用vue的keep-alive->vue自带的组件->组件的钩子函数不会二次触发
