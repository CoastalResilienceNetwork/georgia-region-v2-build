
import { defineStore } from 'pinia';


export const useMapStore = defineStore('mapStore', () => ({
  tab: 'about',
  activeGroup: '',
  panelState: 'open',
  activeTool: 'legend',
  
}
));
