<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
//import { SigninButton } from './components/SigninButton.vue'

//import esri component libs globally so they are available in multiple components
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-legend'
import '@arcgis/map-components/components/arcgis-basemap-gallery'
import '@arcgis/map-components/components/arcgis-layer-list'
import '@arcgis/map-components/components/arcgis-search'

const $q = useQuasar()
const mobile = computed(() => {
  return $q.screen.lt.sm || $q.screen.lt.xs ? true : false
})
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white text-h5 shadow-1">
      <q-toolbar>
          <q-btn flat icon="menu" color="white" padding="none" class="q-mr-md">
      <q-menu>
        <q-list style="min-width: 100px">
          <q-item
            clickable
            v-close-popup
            tag="a"
            target="_blank"
            href="https://www.nature.org/en-us/what-we-do/our-priorities/protect-water-and-land/land-and-water-stories/protecting-our-ocean/?vu=r.v_marine"
          >
            <q-item-section>The Nature Conservancy</q-item-section>
            <q-item-section thumbnail
              ><q-icon class="q-mr-sm" color="grey-4" name="open_in_new"
            /></q-item-section>
          </q-item>
          <q-separator inset />
          <q-item
            clickable
            v-close-popup
            tag="a"
            target="_blank"
            href="https://coastalresilience.org/terms-of-use/"
          >
            <q-item-section>Legal Disclosure</q-item-section>
            <q-item-section thumbnail
              ><q-icon class="q-mr-sm" color="grey-4" name="open_in_new"
            /></q-item-section>
          </q-item>
          <q-separator inset />
          <q-item
            clickable
            v-close-popup
            tag="a"
            target="_blank"
            href="https://maps.coastalresilience.org/"
          >
            <q-item-section>Other Regions</q-item-section>
            <q-item-section thumbnail
              ><q-icon class="q-mr-sm" color="grey-4" name="open_in_new"
            /></q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    
    
      <p class="q-ma-none"> Coastal Resilience </p>
      <q-separator vertical spaced inset color="white"></q-separator>
      <span class="text-white text-h6 text-weight-light"
        >Georgia</span
      >
      </q-toolbar>
    </q-header>

    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
