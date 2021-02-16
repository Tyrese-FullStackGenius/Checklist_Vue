<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: calc(100vh - 50px)">
      <template v-slot:before>
        <q-item style="height: 50px">
          <q-item-section side>
            <q-btn flat color="primary" label="Back" @click="notebookView = true" />
          </q-item-section>
          <q-item-section>
            {{ notebookView ? "Notebooks" : currentNotebook.name }}</q-item-section>
        </q-item>
        <q-separator />
        <q-list>
          <q-scroll-area style="height: calc(100vh - 101px)">
            <div
              v-if="notebookView"
              v-for="notebook in notebooks"
              v-bind:key="notebook._id"
            >
              <q-item clickable v-ripple @click="selectNotebook(notebook)">
                <q-item-section side top>
                  <q-checkbox v-model="notebook.selected" />
                </q-item-section>
                <q-item-section>{{ notebook.name }}</q-item-section>
              </q-item>
              <q-separator />
            </div>
            <div v-else v-for="note in currentNotes" v-bind:key="note._id">
              <q-item clickable v-ripple @click="currentNote = note">
                <q-item-section side top>
                  <q-checkbox v-model="note.selected" />
                </q-item-section>
                <q-item-section>{{ note.title }}</q-item-section>
                <q-item-section side top>
                  <q-item-label caption>{{
                    "Created " + formatDate(note.created)
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
            </div>
          </q-scroll-area>
        </q-list>
      </template>
      <template v-slot:after>
        <div class="q-pa-sm full-height">
          <div v-if="currentNote == null">
            <p>Select a note to see it here!</p>
          </div>
          <div v-else>
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="left"
              narrow-indicator
            >
              <q-tab name="markdown" label="Markdown" />
              <q-tab name="preview" label="Preview" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab">
              <q-tab-panel name="markdown">
                <q-input
                  class="text-h6"
                  v-model="currentNote.title"
                  item-aligned
                  dense
                  placeholder="Title"
                />
                <q-input v-model="currentNote.content" item-aligned type="textarea" />
              </q-tab-panel>

              <q-tab-panel name="preview">
                <div class="text-h6">{{ currentNote.title }}</div>
                <markdown-wrap :source="currentNote.content"></markdown-wrap>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script>
export default {
  data() {
    return {
      splitterModel: 50,
      tab: "markdown",
      notebookView: true,
      currentNotebook: null,
      currentNote: null,
      notebooks: [
        {
          _id: "wehewkjfeklfw",
          name: "First Notebook",
          selected: false,
        },
      ],
      currentNotes: [
        {
          _id: "fdabjlfdksa",
          title: "note a",
          created: Date.now(),
          selected: false,
          content: "note a content",
        },
        {
          _id: "fdajlabfdsafdksa",
          title: "note b",
          created: Date.now(),
          selected: false,
          content: "note b content",
        },
        {
          _id: "fdasdfajfaslfdksa",
          title: "note c",
          created: Date.now(),
          selected: false,
          content: "note c content",
        },
        {
          _id: "fdajlfdkfadasbfsa",
          title: "note d",
          created: Date.now(),
          selected: false,
          content: "note d content",
        },
      ],
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
    };
  },
  methods: {
    formatDate(date) {
      date = new Date(date);
      return this.months[date.getMonth()] + " " + date.getDate();
    },
    noteSelectionState() {
      var state = this.notes[0].selected;
      for (var index = 1; index < this.notes.length; index++) {
        if (state != this.notes[index].selected) return null;
      }
      return state;
    },
    selectNotebook(notebook) {
      this.currentNotebook = notebook;
      this.notebookView = false;
    },
  },
};
</script>
