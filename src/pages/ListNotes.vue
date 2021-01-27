<template>
  <div>
    <div align="center">
      <h2>ListNotes.vue</h2>
    </div>
    <div
      class="q-pa-md"
      align="center"
      v-for="note in notes"
      v-bind:key="note.id"
    >
      <q-card flat bordered style="max-width: 600px" align="justify">
        <q-card-section>
          <div class="text-h6">{{ note.title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
         <markdown-wrap :source="note.content"></markdown-wrap>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import MarkdownWrap from 'src/components/MarkdownWrap.vue';
export default {
  components: { MarkdownWrap },
  data() {
    return {
      notes: [],
    };
  },
  created() {
    console.log(this.$axios.defaults.headers);
    let uri = `/accounts/getNotes`;
    this.$axios.get(uri).then((response) => {
      let noteIds = response.data;
      console.log(noteIds);
      for (var index = 0; index < noteIds.length; index++) {
        this.$axios.get("/notes/" + noteIds[index]).then((res) => {
          this.notes.push(res.data);
          console.log(res.data);
        });
      }
    });
  }
};
</script>
