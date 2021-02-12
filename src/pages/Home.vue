<template>
  <div class="row">
    <div class="col q-list--bordered">
      <q-item-label header>Notes</q-item-label>
      <q-separator />
      <q-list>
        <q-scroll-area style="height: 200px">
          <div v-for="note in this.notes" v-bind:key="note._id">
            <q-item clickable v-ripple>
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
            <q-separator/>
          </div>
        </q-scroll-area>
      </q-list>
    </div>
    <div class="col q-pa-sm q-list--bordered">
      <p>I am a note editor!</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notes: [
        {
          _id: "fdabjlfdksa",
          title: "note a",
          created: Date.now(),
          selected: false,
        },
        {
          _id: "fdajlabfdsafdksa",
          title: "note b",
          created: Date.now(),
          selected: false,
        },
        {
          _id: "fdasdfajfaslfdksa",
          title: "note c",
          created: Date.now(),
          selected: false,
        },
        {
          _id: "fdajlfdkfadasbfsa",
          title: "note d",
          created: Date.now(),
          selected: false,
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
