<template>
<div>
  <van-dialog :value="value"
  @input="$emit('input',$event)"
  close-on-click-overlay
  :show-confirm-button="false">
  更多内容
  </van-dialog>
</div>
</template>

<script>
export default {
  name: 'MoreAction',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
