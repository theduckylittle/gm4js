import Map from "@planet/maps/Map";
import View from "@planet/maps/View";

import { Layer as MapLayer } from "./Layer";
import { useLayerStore } from "./stores/layers";

const MAP_CONTROLS = [];

export const GeoMooseMap = () => {
  const [backgrounds, layers] = useLayerStore(state => [state.backgrounds, state.layers]);

  return (
    <div style={{flex: 1, position: 'relative'}}>
      <Map style={{width: '100%', height: '100%'}}
        controls={MAP_CONTROLS}
      >
        <View options={{center: [-93, 45], zoom: 8}} />
        {backgrounds.map(layer => (
          <MapLayer
            key={layer.id}
            layer={layer}
          />
        ))}
        {layers.toReversed().map(layer => (
          <MapLayer
            key={layer.id}
            layer={layer}
          />
        ))}
      </Map>
    </div>
  );
}
