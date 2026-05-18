<script setup>
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import Map from '@arcgis/core/Map'
import PopupTemplate from '@arcgis/core/PopupTemplate.js'
import { onMounted } from 'vue'
import GroupLayer from '@arcgis/core/layers/GroupLayer.js'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import ImageryLayer from '@arcgis/core/layers/ImageryLayer.js'
import TileLayer from '@arcgis/core/layers/TileLayer.js'
/**GET STORE */
import { useMapStore } from '../stores/map'

const mapStore = useMapStore()

function openPanel(active) {
  mapStore.panelState = 'open'
  mapStore.activeTool = active
}

onMounted(() => {
  console.log('Map is ready')
  const arcgisMap = document.querySelector('arcgis-map')

  const popupTemplate = new PopupTemplate({
    fieldInfos: [
      {
        fieldName: 'faOSP',
        visible: true,
        format: {
          places: 1, // No decimal places for integers
          digitSeparator: true, // Or true if you want digit separators
        },
      },
      {
        fieldName: 'fcOSP',
        visible: true,
        format: {
          places: 0, // No decimal places for integers
          digitSeparator: true, // Or true if you want digit separators
        },
      },
      {
        fieldName: 'TAX_VALUE',
        visible: true,
        format: {
          places: 0, // No decimal places for integers
          digitSeparator: true, // Or true if you want digit separators
        },
      },
    ],
    content:
      '<div class="row q-mb-xs"><div class="col-6"><p>Parcel Number</p></div><div class="col-6 q-pa-xs" style="border: 1px solid grey"><p>{OSP_ID}</p></div></div>' +
      '<div class="row q-mb-xs"><div class="col-6"><p>Future OSP Acreage</p></div><div class="col-6 q-pa-xs" style="border: 1px solid grey"><p>{faOSP}</p></div></div>' +
      '<div class="row q-mb-xs"><div class="col-6"><p>Future OSP Credits</p></div><div class="col-6 q-pa-xs" style="border: 1px solid grey"><p>{fcOSP}</p></div></div>' +
      '<div class="row q-mb-xs"><div class="col-6"><p>Tax Value</p></div><div class="col-6 q-pa-xs" style="border: 1px solid grey"><p>${TAX_VALUE}</p></div></div>' +
      '<div class="row q-mb-xs"><div class="col-6"><p>Owner</p></div><div class="col-6 q-pa-xs" style="border: 1px solid grey"><p>{OWNER_NAME}</p></div></div>' +
      '<div class="row q-mb-xs"><div class="col-6"><p>Owner Type</p></div><div class="col-6 q-pa-xs" style="border: 1px solid grey"><p>{OWNER_TYPE}</p></div></div>' +
      '<div class="row q-mb-xs"><div class="col-6"><p>Current Land Use</p></div><div class="col-6 q-pa-xs"  style="border: 1px solid grey"><p>{LAND_USE}</p></div></div>',
  })

  let crsSublayers = [
    {
      id: 0,
      title: 'State Bounds',
      visible: false,
    },
    {
      id: 1,
      title: 'Community Bounds',
      visible: false,
    },
    {
      id: 2,
      title: 'USFW Critical Habitat',
      visible: false,
    },
    {
      id: 3,
      title: 'Future OSP Eligible',
      visible: false,
      popupTemplate: popupTemplate,
    },
    {
      id: 4,
      title: 'OSP Eligible',
      visible: false,
    },

    {
      id: 5,
      title: 'Excluded Areas',
      visible: false,
    },
    {
      id: 6,
      title: 'aSFHA',
      visible: false,
    },

    { id: 7, title: 'Wetland Potential', visible: false },
  ]
  let crs = new MapImageLayer({
    url: 'https://services2.coastalresilience.org/arcgis/rest/services/Georgia/CRS_Explorer/MapServer',
    title: 'CRS Explorer',
    id: 'crs',
    sublayers: crsSublayers.reverse(),
  })

  // Create group layers for layerlist
  let crsGroup = new GroupLayer({
    title: 'CRS Explorer',
    id: 'crsGroup',
    layers: [
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_CRS_Explorer/FeatureServer/0',
        title: 'State Bounds',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_CRS_Explorer/FeatureServer/1',
        title: 'Community Bounds',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_CRS_Explorer/FeatureServer/2',
        title: 'USFW Critical Habitat',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_CRS_Explorer/FeatureServer/3',
        title: 'Future OSP Eligible',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_CRS_Explorer/FeatureServer/4',
        title: 'OSP Eligible',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_CRS_Explorer/FeatureServer/5',
        title: 'Excluded Areas',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_CRS_Explorer/FeatureServer/6',
        title: 'aSFHA',
        visible: false,
      }),
      new MapImageLayer({
        url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
        title: 'Wetland Potential',
        visible: false,
        sublayers: [
          {
            title: 'Wetland Potential',
            id: 88,
            visible: true,
          },
        ],
      }),
    ],
  })
  crsGroup.layers.reverse()

  let slrGroup = new GroupLayer({
    title: 'Flood and Sea Level Rise',
    id: 'slr',
    layers: [
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/33',
        title: 'Limit of Moderate Wave Action (LiMWA)',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/34',
        title: 'Shoreline Change Rate (EPR)',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/35',
        title: 'NOAA Shallow Coastal Flooding Area',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_FloodSLR/FeatureServer/1',
        title: 'Storm Surge Category 5',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_FloodSLR/FeatureServer/2',
        title: 'Storm Surge Category 4',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_FloodSLR/FeatureServer/3',
        title: 'Storm Surge Category 3',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_FloodSLR/FeatureServer/4',
        title: 'Storm Surge Category 2',
        visible: false,
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_FloodSLR/FeatureServer/5',
        title: 'Storm Surge Category 1',
        visible: false,
      }),
      new MapImageLayer({
        url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
        title: 'Water depth (relative to Mean Higher High Water) with 0 ft Sea Level Rise',
        visible: false,
        sublayers: [
          {
            title: 'Water depth (relative to Mean Higher High Water) with 0 ft Sea Level Rise',
            id: 99,
            visible: true,
          },
        ],
      }),
      new MapImageLayer({
        url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
        title: 'Water depth (relative to Mean Higher High Water) with 1 ft Sea Level Rise',
        visible: false,
        sublayers: [
          {
            title: 'Water depth (relative to Mean Higher High Water) with 1 ft Sea Level Rise',
            id: 100,
            visible: true,
          },
        ],
      }),
      new MapImageLayer({
        url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
        title: 'Water depth (relative to Mean Higher High Water) with 2 ft Sea Level Rise',
        visible: false,
        sublayers: [
          {
            title: 'Water depth (relative to Mean Higher High Water) with 2 ft Sea Level Rise',
            id: 101,
            visible: true,
          },
        ],
      }),
      new MapImageLayer({
        url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
        title: 'Water depth (relative to Mean Higher High Water) with 3 ft Sea Level Rise',
        visible: false,
        sublayers: [
          {
            title: 'Water depth (relative to Mean Higher High Water) with 3 ft Sea Level Rise',
            id: 102,
            visible: true,
          },
        ],
      }),
      new MapImageLayer({
        url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
        title: 'Water depth (relative to Mean Higher High Water) with 4 ft Sea Level Rise',
        visible: false,
        sublayers: [
          {
            title: 'Water depth (relative to Mean Higher High Water) with 4 ft Sea Level Rise',
            id: 103,
            visible: true,
          },
        ],
      }),
      new MapImageLayer({
        url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
        title: 'Water depth (relative to Mean Higher High Water) with 5 ft Sea Level Rise',
        visible: false,
        sublayers: [
          {
            title: 'Water depth (relative to Mean Higher High Water) with 5 ft Sea Level Rise',
            id: 104,
            visible: true,
          },
        ],
      }),
      new MapImageLayer({
        url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
        title: 'Water depth (relative to Mean Higher High Water) with 6 ft Sea Level Rise',
        visible: false,
        sublayers: [
          {
            title: 'Water depth (relative to Mean Higher High Water) with 6 ft Sea Level Rise',
            id: 105,
            visible: true,
          },
        ],
      }),
      new MapImageLayer({
        url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
        title: 'Water depth (relative to Mean Higher High Water) with 8 ft Sea Level Rise',
        visible: false,
        sublayers: [
          {
            title: 'Water depth (relative to Mean Higher High Water) with 8 ft Sea Level Rise',
            id: 106,
            visible: true,
          },
        ],
      }),
    ],
  })
  slrGroup.layers.reverse()

  let commGroup = new GroupLayer({
    title: 'Community Planning',
    id: 'comm',
    layers: [
      new GroupLayer({
        title: 'Critical Infrastructure',
        id: '',
        visible: false,
        layers: [
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/1',
            title: 'Hurricane Evac Routes',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/2',
            title: 'Water Facilities',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/3',
            title: 'Wastewater Treatment Plants',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/4',
            title: 'Culverts (2011)',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/5',
            title: 'Schools',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/6',
            title: 'Police Stations',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/7',
            title: 'Hospitals',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/8',
            title: 'Fire Stations',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/9',
            title: 'EOC',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/10',
            title: 'Community Water',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/11',
            title: 'Road Centerline',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/12',
            title: 'Sewer',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/13',
            title: 'Municipal Water',
            visible: false,
          }),
        ],
      }),
      new GroupLayer({
        title: 'FEMA Flood',
        id: '',
        visible: false,
        layers: [
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/15',
            title: 'FloodZone_VE',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/16',
            title: 'FloodZone_AE',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/17',
            title: 'FloodZone_A',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/18',
            title: 'FloodZone_X',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/19',
            title: 'Flood Zone by BFE (ft)',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/20',
            title: 'Base Flood Elevation Feet',
            visible: false,
          }),
        ],
      }),
      new GroupLayer({
        title: 'Future LandUse',
        id: '',
        visible: false,
        layers: [
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/22',
            title: 'St Marys Future Land Use 2017',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/23',
            title: 'Woobine Future Land Use 2017',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/24',
            title: 'Kingsland Future Land Use 2017',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/25',
            title: 'Camden Future Land Use 2017',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/26',
            title: 'OLD Future Land Use 2008',
            visible: false,
          }),
        ],
      }),
      new FeatureLayer({
        url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/27',
        title: '2021 Parcels (zoom to view)',
        visible: false,
      }),
      new GroupLayer({
        title: 'Zoning',
        id: '',
        visible: false,
        layers: [
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/29',
            title: 'Kingsland',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/30',
            title: 'St Marys',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/31',
            title: 'Camden County',
            visible: false,
          }),
        ],
      }),
      new GroupLayer({
        title: 'Flood and SLR Layers',
        id: '',
        visible: false,
        layers: [
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/33',
            title: 'Limit of Moderate Wave Action (LiMWA)',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/34',
            title: 'Shoreline Change Rate (EPR)',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/35',
            title: 'NOAA_ShallowCoastalFloodingArea',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/36',
            title: 'StormSurge_Cat5',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/37',
            title: 'StormSurge_Cat4',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/38',
            title: 'StormSurge_Cat3',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/39',
            title: 'StormSurge_Cat2',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/40',
            title: 'StormSurge_Cat1',
            visible: false,
          }),
          new MapImageLayer({
            url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
            title: 'Water depth (relative to Mean Higher High Water) with 0 ft Sea Level Rise',
            visible: false,
            sublayers: [
              {
                title: 'Water depth (relative to Mean Higher High Water) with 0 ft Sea Level Rise',
                id: 99,
                visible: true,
              },
            ],
          }),
          new MapImageLayer({
            url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
            title: 'Water depth (relative to Mean Higher High Water) with 1 ft Sea Level Rise',
            visible: false,
            sublayers: [
              {
                title: 'Water depth (relative to Mean Higher High Water) with 1 ft Sea Level Rise',
                id: 100,
                visible: true,
              },
            ],
          }),
          new MapImageLayer({
            url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
            title: 'Water depth (relative to Mean Higher High Water) with 2 ft Sea Level Rise',
            visible: false,
            sublayers: [
              {
                title: 'Water depth (relative to Mean Higher High Water) with 2 ft Sea Level Rise',
                id: 101,
                visible: true,
              },
            ],
          }),
          new MapImageLayer({
            url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
            title: 'Water depth (relative to Mean Higher High Water) with 3 ft Sea Level Rise',
            visible: false,
            sublayers: [
              {
                title: 'Water depth (relative to Mean Higher High Water) with 3 ft Sea Level Rise',
                id: 102,
                visible: true,
              },
            ],
          }),
          new MapImageLayer({
            url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
            title: 'Water depth (relative to Mean Higher High Water) with 4 ft Sea Level Rise',
            visible: false,
            sublayers: [
              {
                title: 'Water depth (relative to Mean Higher High Water) with 4 ft Sea Level Rise',
                id: 103,
                visible: true,
              },
            ],
          }),
          new MapImageLayer({
            url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
            title: 'Water depth (relative to Mean Higher High Water) with 5 ft Sea Level Rise',
            visible: false,
            sublayers: [
              {
                title: 'Water depth (relative to Mean Higher High Water) with 5 ft Sea Level Rise',
                id: 104,
                visible: true,
              },
            ],
          }),
          new MapImageLayer({
            url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
            title: 'Water depth (relative to Mean Higher High Water) with 6 ft Sea Level Rise',
            visible: false,
            sublayers: [
              {
                title: 'Water depth (relative to Mean Higher High Water) with 6 ft Sea Level Rise',
                id: 105,
                visible: true,
              },
            ],
          }),
          new MapImageLayer({
            url: 'https://cumulus-ags.tnc.org/arcgis/rest/services/nascience/CCS_Rasters_1/MapServer/',
            title: 'Water depth (relative to Mean Higher High Water) with 8 ft Sea Level Rise',
            visible: false,
            sublayers: [
              {
                title: 'Water depth (relative to Mean Higher High Water) with 8 ft Sea Level Rise',
                id: 106,
                visible: true,
              },
            ],
          }),
        ],
      }),
      new GroupLayer({
        title: 'Ecological',
        id: '',
        visible: false,
        layers: [
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/42',
            title: 'Groundwater Recharge Areas',
            visible: false,
          }),
          new GroupLayer({
            title: 'Marsh Migration',
            visible: false,
            layers: [
              new GroupLayer({
                title: 'Sea Level Rise 1.5 ft',
                visible: false,
                layers: [
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/45',
                    title: 'Marsh Migration Space',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/46',
                    title: 'Percent Estimated Future Development (2100)',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/47',
                    title: 'Percent Secured From Development',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/48',
                    title: 'Size of Migration Space (Acres)',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/49',
                    title: 'Condition Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/50',
                    title: 'Physical Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/51',
                    title: 'Resilience Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/52',
                    title: 'Resilience Score with Trend',
                    visible: false,
                  }),
                ],
              }),
              new GroupLayer({
                title: 'Sea Level Rise 3.0 ft',
                visible: false,
                layers: [
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/54',
                    title: 'Marsh Migration Space',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/55',
                    title: 'Percent Estimated Future Development (2100)',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/56',
                    title: 'Percent Secured From Development',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/57',
                    title: 'Size of Migration Space (Acres)',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/58',
                    title: 'Condition Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/59',
                    title: 'Physical Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/60',
                    title: 'Resilience Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/61',
                    title: 'Resilience Score with Trend',
                    visible: false,
                  }),
                ],
              }),
              new GroupLayer({
                title: 'Sea Level Rise 4.0 ft',
                visible: false,
                layers: [
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/63',
                    title: 'Marsh Migration Space',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/64',
                    title: 'Percent Estimated Future Development (2100)',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/65',
                    title: 'Percent Secured From Development',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/66',
                    title: 'Size of Migration Space (Acres)',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/67',
                    title: 'Condition Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/68',
                    title: 'Physical Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/69',
                    title: 'Resilience Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/70',
                    title: 'Resilience Score with Trend',
                    visible: false,
                  }),
                ],
              }),
              new GroupLayer({
                title: 'Sea Level Rise 6.5 ft',
                visible: false,
                layers: [
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/72',
                    title: 'Marsh Migration Space',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/73',
                    title: 'Percent Estimated Future Development (2100)',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/74',
                    title: 'Percent Secured From Development',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/75',
                    title: 'Size of Migration Space (Acres)',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/76',
                    title: 'Condition Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/77',
                    title: 'Physical Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/78',
                    title: 'Resilience Score',
                    visible: false,
                  }),
                  new FeatureLayer({
                    url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/79',
                    title: 'Resilience Score with Trend',
                    visible: false,
                  }),
                ],
              }),
            ],
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/80',
            title: 'National Wetland Inventory 2015',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/81',
            title: 'Protected Areas',
            visible: false,
          }),
          new FeatureLayer({
            url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/NST_GA_Georgia/FeatureServer/82',
            title: 'Soils',
            visible: false,
          }),
        ],
      }),
    ],
  })
  commGroup.layers.reverse()

  let slrSublayers = [
    {
      id: 33,
      title: 'Limit of Moderate Wave Action (LiMWA)',
      visible: false,
    },
    {
      id: 34,
      title: 'Shoreline Change Rate (EPR)',
      visible: false,
    },
    {
      id: 35,
      title: 'NOAA Shallow Coastal Flooding Area',
      visible: false,
    },
    {
      id: 36,
      title: 'Storm Surge Category 5',
      visible: false,
    },
    {
      id: 37,
      title: 'Storm Surge Category 4',
      visible: false,
    },
    {
      id: 38,
      title: 'Storm Surge Category 3',
      visible: false,
    },
    {
      id: 39,
      title: 'Storm Surge Category 2',
      visible: false,
    },
    {
      id: 40,
      title: 'Storm Surge Category 1',
      visible: false,
    },
    {
      id: 41,
      title: 'Water depth (relative to Mean Higher High Water) with 0 ft Sea Level Rise',
      visible: false,
    },
    {
      id: 42,
      title: 'Water depth (relative to Mean Higher High Water) with 1 ft Sea Level Rise',
      visible: false,
    },
    {
      id: 43,
      title: 'Water depth (relative to Mean Higher High Water) with 2 ft Sea Level Rise',
      visible: false,
    },
    {
      id: 44,
      title: 'Water depth (relative to Mean Higher High Water) with 3 ft Sea Level Rise',
      visible: false,
    },
    {
      id: 45,
      title: 'Water depth (relative to Mean Higher High Water) with 4 ft Sea Level Rise',
      visible: false,
    },
    {
      id: 46,
      title: 'Water depth (relative to Mean Higher High Water) with 5 ft Sea Level Rise',
      visible: false,
    },
    {
      id: 47,
      title: 'Water depth (relative to Mean Higher High Water) with 6 ft Sea Level Rise',
      visible: false,
    },
    {
      id: 48,
      title: 'Water depth (relative to Mean Higher High Water) with 8 ft Sea Level Rise',
      visible: false,
    },
  ]
  let slr = new MapImageLayer({
    url: 'https://services2.coastalresilience.org/arcgis/rest/services/Georgia/Georgia/MapServer',
    title: 'Flood and Sea Level Rise',
    id: 'slr',
    sublayers: slrSublayers.reverse(),
  })

  let comm = new MapImageLayer({
    url: 'https://services2.coastalresilience.org/arcgis/rest/services/Georgia/Georgia/MapServer',
    title: 'Community Planning',
    id: 'comm',
  })
  arcgisMap.map = new Map({
    basemap: 'topo',
    layers: [commGroup, slrGroup, crsGroup],
  })
})
</script>

<template>
  <arcgis-map
    id="my-map"
    :style="$q.screen.sm || $q.screen.xs ? 'min-height:50vh' : 'calc(100vh - 120px)'"
    center="-81.7, 30.9"
    zoom="10"
  >
    <!-- for mobile devices a menu tool-->
    <q-btn
      icon="menu"
      flat
      style="position: absolute; left: 0px; z-index: 9999"
      size="lg"
      color="white"
      v-if="$q.screen.sm || $q.screen.xs"
    >
      <q-menu style="width: 500px">
        <div class="row">
          <div class="col" style="width: 40px">
            <div class="bg-blue-grey-1 text-dark" style="height: 100%">
              <div id="" class="text-center">
                <q-btn
                  square
                  padding="xs"
                  size="md"
                  flat
                  :class="
                    mapStore.activeTool == 'legend'
                      ? 'q-mt-md bg-blue-grey-9 text-white'
                      : 'q-mt-md'
                  "
                  @click.stop="openPanel('legend')"
                >
                  <q-tooltip>Legend</q-tooltip>
                  <calcite-icon icon="legend" scale="m"></calcite-icon> </q-btn
                ><br />
                <q-btn
                  square
                  padding="xs"
                  flat
                  size="md"
                  :class="
                    mapStore.activeTool == 'opacity'
                      ? 'q-mt-md bg-blue-grey-9 text-white'
                      : 'q-mt-md'
                  "
                  @click.stop="openPanel('opacity')"
                >
                  <q-tooltip>Opacity</q-tooltip>
                  <calcite-icon icon="transparency" scale="m"></calcite-icon> </q-btn
                ><br />
                <q-btn
                  square
                  padding="xs"
                  size="md"
                  flat
                  :class="
                    mapStore.activeTool == 'basemaps'
                      ? 'q-mt-md bg-blue-grey-9 text-white'
                      : 'q-mt-md'
                  "
                  @click.stop="openPanel('basemaps')"
                >
                  <q-tooltip>Basemaps</q-tooltip>
                  <calcite-icon icon="basemap" scale="m"></calcite-icon> </q-btn
                ><br />
                <q-btn
                  square
                  padding="xs"
                  size="md"
                  flat
                  :class="
                    mapStore.activeTool == 'supporting layers'
                      ? 'q-mt-md bg-blue-grey-9 text-white'
                      : 'q-mt-md'
                  "
                  @click.stop="openPanel('supporting layers')"
                >
                  <q-tooltip>Supporting Layers</q-tooltip>
                  <calcite-icon icon="layers" scale="m"></calcite-icon> </q-btn
                ><br />

                <q-btn
                  square
                  padding="xs"
                  flat
                  size="md"
                  :class="
                    mapStore.activeTool == 'help' ? 'q-mt-md bg-blue-grey-9 text-white' : 'q-mt-md'
                  "
                  @click.stop="openPanel('help')"
                >
                  <q-tooltip>Help</q-tooltip>
                  <calcite-icon icon="question" scale="m"></calcite-icon>
                </q-btn>
              </div>
            </div>
          </div>
          <div class="col-11">
            <q-scroll-area style="height: calc(100vh - 300px)">
              <div class="sub q-pa-sm q-ml-sm">
                <p class="text-caption q-mb-none text-weight-medium">
                  {{ mapStore.activeTool.toUpperCase() }}
                </p>
              </div>

              <div v-show="mapStore.activeTool == 'legend'" id="legend">
                <q-scroll-area style="height: calc(100vh - 90px)">
                  <!--arcgis-legend reference-element="my-map"></arcgis-legend-->
                  <TheLegend></TheLegend>
                </q-scroll-area>
              </div>
              <div v-show="mapStore.activeTool == 'basemaps'" id="basemaps" class="basemaps">
                <q-scroll-area style="height: calc(100vh - 90px)">
                  <arcgis-basemap-gallery reference-element="my-map"></arcgis-basemap-gallery>
                </q-scroll-area>
              </div>
              <div v-if="mapStore.activeTool == 'opacity'" class="text-center">
                <q-knob
                  show-value
                  font-size="20px"
                  class="text-secondary q-mt-md"
                  v-model="mapStore.opacity"
                  size="80px"
                  :thickness="0.3"
                  color="secondary"
                  track-color="grey-3"
                  @update:model-value="mapStore.changeOpacity()"
                >
                  <q-icon name="opacity" class="">
                    <q-tooltip>opacity: {{ mapStore.opacity }}%</q-tooltip>
                  </q-icon>
                </q-knob>
                <p class="text-h6 q-mt-md">{{ mapStore.opacity }}%</p>
              </div>

              <div v-if="mapStore.activeTool == 'help'">
                <TheHelp></TheHelp>
              </div>
            </q-scroll-area>
          </div>
        </div>
      </q-menu>
    </q-btn>
  </arcgis-map>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import 'https://js.arcgis.com/4.32/esri/themes/light/main.css';

#my-map {
  flex: 1;
  height: 100%;
  width: 100%;
  position: relative;
}

.esri-view .esri-view-surface--touch-none:focus::after {
  outline: none !important;
}

.esri-popup .sizer {
  width: 500px !important;
}

.esri-legend__service {
  border-bottom: none !important;
}

.esri-legend__symbol {
  height: 10px !important;
  width: 10px !important;
}

h3.esri-widget__heading {
  line-height: 1.2rem !important;
}
</style>
