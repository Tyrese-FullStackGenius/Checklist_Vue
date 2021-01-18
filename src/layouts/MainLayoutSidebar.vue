<template>
  <div class="q-pa-none">
    <q-layout view="hHh Lpr lff" style="height: 400px" class="">
      <q-header elevated class="bg-primary">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Checklist</q-toolbar-title>
          <q-input dark clearable standout class="q-pa-sm">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="500"
        bordered
        content-class="bg-grey-3"
      >
        <q-scroll-area class="fit">
          <q-list>
            <template v-for="(menuItem, index) in menuList">
              <q-item :key="index" clickable v-ripple :to="menuItem.to" exact>
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>
<script>
const menuList = [
  {
    icon: "home",
    label: "Home",
    to: "/",
    separator: true,
  },
  {
    icon: "list",
    label: "List Notes",
    to: "/list",
    separator: false,
  },
  {
    icon: "add_box",
    label: "Create Note",
    to: "/create",
    separator: false,
  },
  {
    icon: "sticky_note_2",
    label: "View Note",
    to: "/note",
    separator: true,
  },
  {
    icon: "settings",
    label: "Settings",
    separator: false,
  },
  {
    icon: "feedback",
    label: "Send Feedback",
    separator: false,
  },
  {
    icon: "help",
    iconColor: "primary",
    label: "Help",
    separator: false,
  },
];

export default {
  data() {
    return {
      drawer: false,
      menuList,
    };
  },
};
</script>
