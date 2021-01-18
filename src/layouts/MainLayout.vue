<template>
  <div>
    <!-- Icon list at: https://material.io/resources/icons/?style=baseline -->
    <div class="q-pa-none-sm">
      <q-tabs
        inline-label
        style="height: 60px"
        no-caps
        align="right"
        shrink
        class="bg-primary text-white shadow-2 q-pa-sm"
      >


        <q-input clearable standout class="bg-primary q-field--dark q-ma-sm">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        

        <q-route-tab name="home" label="Home" to="/" exact style="font-size: 3em" />
        <q-route-tab name="list" icon="list" label="List Notes" to="/list" exact />
        <q-route-tab
          name="create"
          icon="add_box"
          label="Create Note"
          to="/create"
          exact
        />
        <q-route-tab
          name="note"
          icon="sticky_note_2"
          label="View Note"
          to="/note"
          exact
        />
        <!--<q-route-tab name="search" icon="search" label="Search" to="/search" exact />-->
        <!--<q-route-tab name="create" icon="add_box" to="/create" exact />-->
        <!--<q-route-tab name="account" icon="account_box" label="Account" to="/account" exact />-->
        <q-btn-dropdown unelevated color="primary" label="Account">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Photos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Videos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Articles</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-tabs>
    </div>
    <q-layout style="min-height: 400px">
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>
