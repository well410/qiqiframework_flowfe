<template>
  <div v-html="html"></div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      html: ''
    }
  },
  watch: {
    url(value) {
      this.load(value)
    }
  },
  mounted() {
    this.load(this.url)
  },
  methods: {
    load(url) {
      if(url && url.length > 0) {
        const params = {
          accept: 'text/html, text/plain'
        }
        this.$http.get(url, params).then(res => {
          this.html = res.data
        }).catch(() => {
          this.html = '加载失败'
        })
      }
    }
  }
}
</script>
