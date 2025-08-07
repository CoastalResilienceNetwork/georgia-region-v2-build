
import { defineStore } from 'pinia';


export const useMapStore = defineStore('mapStore', () => ({
  tab: 'about',
  activeGroup: '',
  panelState: 'open',
  activeTool: 'legend',
  
  
  getCounts(){
    let counts = {avoid: 0, develop: 0, review: 0, minimize: 0}
    let avoid = this.results.filter((item)=>{
    return item.totalArea !== 0 && item.map !== 'opportunities' && item.layerName !== 'Landscape Connectivity'
    })
    counts.avoid = avoid.length
    let review = this.results.filter((item)=>{
      return item.totalArea == 0 && item.map !== 'opportunities'&& item.layerName !== 'Landscape Connectivity'
      })
      counts.review = review.length

    let minimize = this.results.filter((item)=>{
      return item.totalArea !== 0 && item.map !== 'opportunities'&& item.layerName == 'Landscape Connectivity'
      }
    )
    counts.minimize = minimize.length

    let develop = this.oppResults.filter((item)=>{
      return item.count > 0
    })
    counts.develop = develop.length

    let developPoly = this.results.filter((item)=>{
      return item.map == 'opportunities' && item.totalArea > 0
    })
    counts.develop = counts.develop + developPoly.length
    return counts
  
  },
 
  //layers referenced by component
  layers:  [
    { header: 'Avoid / Minimize Development',
    id: 'avoid',
    subheaders: [
      {title: 'Avoid Development', id: 'avoid', visible: true, visibleModel: true, description: 'Avoid developing critical ecological areas', 
        sublayers: [
          { id: 6, elid: 'woopingCraneW', visible: true, visibleModel: true, opacity: 0.9, category: 'wind', filter: true,title: 'Whooping Crane (wind)', description: 'short description', longDescription: 'long description' },
	        { id: 7, elid: 'woopingCraneS', visible: true, visibleModel: true, opacity: 0.9, category: 'solar', filter: true, title: 'Whooping Crane (solar)', description: 'short description', longDescription: 'long description' },
		      { id: 8, elid: 'eagles', visible: true, visibleModel: true, opacity: 0.9, category: 'wind', filter: true, title: 'Eagles (wind)', description: 'short description', longDescription: 'long description' },
          { id: 9, elid: 'grouse', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Prarie Grouse', description: 'short description', longDescription: 'long description' },
	        { id: 12, elid: 'birdareas', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Important Bird Areas', description: 'short description', longDescription: 'long description' },	  
		      { id: 14, elid: 'protectedareas', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Protected Areas', description: 'short description', longDescription: 'long description' },
		      { id: 3, elid: 'tande',visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Threatened & Endangered Species', description: 'short description', longDescription: 'long description' },
          { id: 10, elid: 'biggame', filter: true, visible: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Big Game', description: 'short description for Big Game', longDescription: 'long description'},
		      { id: 13, elid: 'wetlandsS',visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Wetlands (solar)', description: 'short description', longDescription: 'long description' },
          { id: 11, elid: 'wetlandsW', visible: true, filter: true,visibleModel: true, opacity: 0.9, category: 'wind', title: 'Wetlands (wind)', description: 'short description', longDescription: 'long description' },
          { id: 15, elid: 'intacthabitats', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Intact Habitats', description: 'short description', longDescription: 'long description' },
          { id: 16, elid: 'climateResistance', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'both', title: 'Climate Resilience', description: 'short description', longDescription: 'long' }
        ]
      },
      {title: 'Minimize Development', id: 'minimize', visible: true, visibleModel: true, description: 'Minimize development in vital connectivity corridors', 
        sublayers: [
          {id: 29, elid:'corrd', filter: true, visible: true, visibleModel: true, category: 'both', title: 'Landscape Connectivity', description: 'short description ', longDescription: 'long description', opacity: .7}
        ]
      },
    ],
  },
  {
   header: 'Opportunities for Development',
   subheaders:[
      {title: 'Opportunities for Development', id: 'swipeLayers', visible: true, description: 'Focus development in areas with lower ecological impact',
        sublayers: [
          { id:0, elid:'brownfields', visible: false, filter: true,visibleModel: true, opacity: 0.9, category: 'solar', title: 'Brownfields over 50 acres (solar)', description: 'short description',longDescription: 'long description'  },
          { id:2, elid: 'minesout', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Mines not in Suitability (solar)',description: 'short description', longDescription: 'long description' },
          { id:1, elid: 'minesin', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Mines in Suitability (solar)', description: 'short description', longDescription: 'long description' },
          { id:19, elid: 'fsd', visible: true, filter: true, visibleModel: true, opacity: 0.9, category: 'solar', title: 'Low impact water bodies for floating solar development (solar)', description: 'short description', longDescription: 'Waterbodies 2.5 acres or greater within 5 kilometers of the transmission lines, that are suitable for development because they are man-made reservoirs with Slightly Below Average to Far Below Average level of biodiversity and/or resilience.' },
        ]
      },
    ],
  },
  ],

  //map loads sublayers in reverse order from the list in the ui which causes confusion about 
  //which layer is on top.  This function reverses the order
  //and is used by the MapImageLayer to define sublayers.  
  avoidLayersReverse(){
    let newList = this.layers[0].subheaders[0].sublayers
    let reversed = newList.slice().reverse();
    return reversed
  }, 
  //reversed layers for opportunities
  opportunitiesLayersReverse(){

    let newList = this.layers[1].subheaders[0].sublayers
    let reversed = newList.slice().reverse();
   
    return reversed
  },
  //this function updates the layer order in the map when the user drags to reorder layers
  //on the UI
  updateLayerOrder(layer){
  
    let map = document.querySelector("arcgis-map").map;
    if(layer == 'avoid'){
      let mapLayer = map.findLayerById(layer);
      mapLayer.sublayers = this.avoidLayersReverse()
    }
    if(layer == 'opportunities' || layer =='swipeLayers'){
      let mapLayer = map.findLayerById('opportunities');
      mapLayer.sublayers = this.opportunitiesLayersReverse()
      let mapLayer2 = map.findLayerById('swipeLayers');
      mapLayer2.sublayers=  this.opportunitiesLayersReverse()
    }
  },
  //sets overall group layer visibility
  setLayerVisibility(layer) {
    layer.visible = !layer.visible
    let map = document.querySelector("arcgis-map").map;
    let mapLayer = map.findLayerById(layer.id);
    let sublayers = layer.sublayers

    for(var i=0;i<sublayers.length;i++){
      let sublayer = mapLayer.findSublayerById(sublayers[i].id);
      if(sublayers[i].elid == 'brownfields'){
        if(this.compare){
        sublayer = map.findLayerById('brownfields_swipe')
        }else{
          sublayer = map.findLayerById('brownfields_opp')
        }
      }
      sublayer.visible = layer.visible
      sublayers[i].visibleModel = layer.visible
    }
  },
  //sets individual layer visibility
  setSublayerVisibility(elid, id, subId, checked) {
    let map = document.querySelector("arcgis-map").map;
    let layer = map.findLayerById(id);
    let sub = layer.findSublayerById(subId);
    if( elid == 'brownfields'){
      if(this.compare){
        sub = map.findLayerById('brownfields_swipe')
      }
      else{
        sub = map.findLayerById('brownfields_opp')
      }
    }
    sub.visible = checked
  },
  
}
));
