<template>
  <div>

    <!-- 搜索框 -->
    <van-search v-model="searchText" placeholder="请输入搜索关键词" show-action @search="onSearch(searchText)" @cancel="onCancel" />
    <!-- 联想建议
      1. 有关键字
     -->
    <van-cell-group v-if="searchText.length!==0 && suggestionData.length!==0">
      <van-cell v-for="(item,index) in suggestionData" :key="index" icon="search" @click="onSearch(item)">
        <div slot="title" v-html="highlightCell(item,searchText)">
          <!-- <span stlye="color:red"></span> -->
        </div>
      </van-cell>
    </van-cell-group>

    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <van-icon @click="isDeleteData=true" v-show="!isDeleteData" slot="right-icon" name="delete" style="line-height:inherit"></van-icon>
        <div v-show="isDeleteData">
          <span style="margin-right:10px">全部删除</span>
          <span @click="isDeleteData=false">完成</span>
        </div>
      </van-cell>
      <van-cell :title="item" v-for="(item,index) in searchHistories" :key="index">
        <van-icon v-show="isDeleteData" slot="right-icon" name="close" style="line-height:inherit"></van-icon>
      </van-cell>

    </van-cell-group>

  </div>
</template>

<script>
import { getSuggestions } from '@/api/search.js'
import { debounce } from '@/utils/debounce.js'

export default {
  name: 'SearchIndex',
  data() {
    return {
      searchText: '',
      suggestionData: [],
      isDeleteData: false,
      // 保存历史搜索记录的数组=>如果有本地数据->直接使用,反之 给[]
      searchHistories:
        JSON.parse(window.localStorage.getItem('search-histories')) || []
    }
  },
  // 所有this.出来的属性都可以watch监测
  watch: {
    searchText: debounce(async function(newValue, oldValue) {
      if (!this.searchText.trim().length) {
        return
      }
      try {
        const suggestionData = await getSuggestions(this.searchText)
        this.suggestionData = suggestionData.options
      } catch (error) {}
    }, 800)

    // async searchText(newValue, oldValue) {
    //   // console.log(newValue)
    //   try {
    //     const suggestionData = await getSuggestions(this.searchText)
    //     this.suggestionData = suggestionData.options
    //   } catch (error) {}
    // }
  },
  methods: {
    // 处理高亮
    // item->每一行文字 -> "asdasdsadsad"
    highlightCell(item, keywords) {
      return item
        .toLowerCase()
        .split(keywords)
        .join(`<span style="color:red">${keywords}</span>`)
    },
    onCancel() {
      // console.log('onCancel----')
    },
    onSearch(queryText) {
      if (!queryText.trim().length) {
        return
      }

      // es6 ->
      // 1. Set是构造函数
      // 2. Set的实参可以是数组
      // 3. Set是容器->里面保存的都是非重复元素
      // 4. Set的实例化方法->aaa.方法() -> add()
      // 5. 把Set转化为数组
      // 6. 数组有一个类方法可以把容器转换为数组 const arr = Array.from(容器)
      // Array.asdasd()

      const aaa = new Set(this.searchHistories) // [1,2,3,1] ->[1,2,3]

      aaa.add(queryText) // {1,2,3,4}

      this.searchHistories = Array.from(aaa) // [1,2,3,4]

      // 0. 向本地ls添加搜索关键字
      // this.searchHistories.push(queryText)

      window.localStorage.setItem(
        'search-histories',
        JSON.stringify(this.searchHistories)
      )

      // 1. 获取当前搜索的结果->关键字或者词条文字
      // console.log('onSearch----', queryText)

      // 2. 把关键字或者词条文字传递到搜索结果组件
      this.$router.push({
        name: 'search-result',
        // user/100
        // user/200
        //routerlink to="user/300"

        params: {
          q: queryText
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
</style>


// 问题: 短时间内频繁发送请求
// 类比: tab切换时 短时间内容频繁切换
// 类比: 鼠标滚轮滚动->滚动期间获取距离->
. 防抖函数
// ->  短时间内多次触发同一个事件->性能很差->
// 解决方案:
// 1
// 2. 主流的js库->lodash.js
// 3. lodash.js->安全隐患->
// 3.1 换库
// 3.2 自己写
// 3.3 把lodash.js中防抖函数单独拿出来使用




function fn(d){
  return (a){
    return (b){
      return (c){

        return a+b+c+d
      }
    }
  }
}
// fn(1)(2)(3)(4)

const a = fn(1) // 第一次玩
// 100行代码->有了a
const fn2 = a(20)
// 200 行代码

fn2(30)

?????


