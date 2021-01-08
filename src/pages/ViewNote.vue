<template>
  <div>
    <div align="center">
      <h3>{{ note.title }}</h3>
      <markdown-wrap :source="note.content"></markdown-wrap>
    </div>
  </div>
</template>
<script>
import MarkdownWrap from 'src/components/MarkdownWrap.vue';
export default {
  components: { MarkdownWrap },
  data() {
    return {
      note: {},
    };
  },
  created() {
    let uri = `/notes/${this.$route.params.id}`;
    this.$axios.get(uri).then((response) => {
      this.note = response.data;
    });
  },
  methods: {},
};
</script>
