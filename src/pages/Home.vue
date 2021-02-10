<template>
  <div>
    <q-list bordered separator style="max-width: 300px">
      <q-item-label header>Notes</q-item-label>
      <q-rating
      v-model="model"
      max="1"
      size="3.5em"
      color="yellow"
      icon="star_border"
      icon-selected="star"
      no-dimming
    />

      <!--<q-item-section side top>
        <q-checkbox v-model="this.noteSelectionState()" />
      </q-item-section>-->
      <q-scroll-area class="full-height">
        <q-item v-for="note in this.notes" v-bind:key="note._id" clickable v-ripple>
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
      </q-scroll-area>
    </q-list>
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
