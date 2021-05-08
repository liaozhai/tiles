import {VectorTile} from '@mapbox/vector-tile';
import Protobuf from 'pbf';

export default function (layerId, z, x, y) {        
    return fetch(`tile/${layerId}/${z}/${x}/${y}`)
        .then(response => response.ok && response || Promise.reject(response))
        .then(response => response.blob())
        .then(blob => blob.arrayBuffer())
        .then(buf => {            
            const pbf = new Protobuf(buf);
            const {layers} = new VectorTile(pbf);    
            let result = {};      
            for (const [id, vt] of Object.entries(layers)) {
                result[id] = [];
                for (let i = 0; i < vt.length; ++i) {
                    const f = vt.feature(i);
                    const {type, properties: {feature_serial}} = f;                        
                    const coordinates = f.loadGeometry();
                    result[id].push({type, coordinates, feature_id: feature_serial});
                }
            }
            return result;            
        });
};