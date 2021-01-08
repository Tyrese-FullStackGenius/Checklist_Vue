<template>
  <VueMarkdown v-bind="$props" @rendered="update" />
</template>

<script>
import VueMarkdown from '@adapttive/vue-markdown';
import Prism from "prismjs";
import "prismjs/themes/prism.css";

export default {
  components: {
    VueMarkdown,
  },
  props: {
    ...VueMarkdown.props,
    emoji: {
      default: true,
      type: Boolean,
    },
    html: {
      default: false,
      type: Boolean,
    },
    linkify: {
      default: true,
      type: Boolean,
    },
    typographer: {
      default: true,
      type: Boolean,
    },
  },
  methods: {
    update: function () {
      this.$nextTick(() => {
        Prism.highlightAll();
      });
    },
  },
};
</script>
