<template>
<div>
  <van-dialog :value="value"
  @input="$emit('input',$event)"
  close-on-click-overlay
  :show-confirm-button="false">
     <van-cell-group v-if="!isReportShow">
      <van-cell icon="location-o" title="不感兴趣" @click="handleUnlikeArticle" />
      <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="isReportShow=true"/>
      <van-cell icon="location-o" title="拉黑作者" />
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReportShow=false" />
      <van-cell v-for="(item, index) in reportTypes" :key="index" @click='handleReportArticle(item.value)' :title="item.label" icon="location-o" />
    </van-cell-group>
  </van-dialog>
</div>
</template>

<script>
import { dislikeArticle, reportArticle } from '@/api/article.js'
export default {
  name: 'MoreAction',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    currentArticles: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isReportShow: false,
      reportTypes: [
        { label: '其他问题', value: 0 },
        { label: '标题夸张', value: 1 },
        { label: '低俗色情', value: 2 },
        { label: '错别字多', value: 3 },
        { label: '旧闻重复', value: 4 },
        { label: '广告软文', value: 5 },
        { label: '内容不实', value: 6 },
        { label: '涉嫌违法犯罪', value: 7 },
        { label: '侵权', value: 8 }
      ]
    }
  },
  methods: {
    async handleUnlikeArticle () {
      try {
        await dislikeArticle(this.currentArticles.art_id)
        // 触发父组件事件，更新视图
        this.$emit('handleUnlike')
        this.$emit('input', false)
        this.$toast('操作成功')
      } catch (error) {
        this.$toast('操作失败')
      }
    },
    async handleReportArticle (type) {
      try {
        await reportArticle({
          articleId: this.currentArticles.art_id,
          type
        })
        this.$emit('input', false)
        this.$toast('举报成功')
      } catch (error) {
        if (error.response.status === 409) {
          this.$toast('已被举报过')
          this.$emit('input', false)
        } else {
          this.$toast('举报失败')
          this.$emit('input', false)
        }
      }
    }
  }
}
</script>

<style>
</style>
