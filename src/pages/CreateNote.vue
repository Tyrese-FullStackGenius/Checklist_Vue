<template>
  <div align="center">
    <div style="max-width: 700px">
      <h2>Create Note</h2>
      <q-form
        @submit="createNote"
        @reset="onReset"
        class="q-gutter-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="true"
      >
        <q-input
          clearable
          filled
          v-model="note.title"
          label="Title"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please enter a title']"
        />
        <q-input
          clearable
          filled
          v-model="note.content"
          type="textarea"
          label="Content"
        />
        <div align="left">
          <q-btn label="Create Note" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
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
  methods: {
    createNote() {
      let uri = "/notes";
      this.$axios
        .post(uri, this.note)
        .then((response) => {
          this.$router.push({
            name: "note",
            params: { id: response.data.createdNote._id },
          });
        })
        .catch(err => {
          if (err.response.status == 403) {
            console.log("Forbidden");
          }
        });
    },
    onReset() {
      this.note = {};
    },
  },
};
</script>
