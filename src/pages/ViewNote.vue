<template>
  <div>
    <div align="center">
      <h3>{{ note.title }}</h3>
      <p>{{ note.content }}</p>
    </div>
  </div>
</template>
<script>
export default {
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
