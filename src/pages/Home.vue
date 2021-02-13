<template>
  <div class="row">
    <div class="col q-list--bordered">
      <q-item-label header>Notes</q-item-label>
      <q-separator />
      <q-list>
        <q-scroll-area style="height: 200px">
          <div v-for="note in this.notes" v-bind:key="note._id">
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
    </div>
    <div class="col q-pa-sm q-list--bordered">
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
            <q-input class="text-h6" v-model="currentNote.title" item-aligned dense placeholder="Title" />
            <q-input
              v-model="currentNote.content"
              item-aligned
              type="textarea"
            />
          </q-tab-panel>

          <q-tab-panel name="preview">
            <div class="text-h6">{{ currentNote.title }}</div>
            <markdown-wrap :source="currentNote.content"></markdown-wrap>

          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: "markdown",
      currentNote: null,
      notes: [
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
  },
};
</script>
