import L from 'leaflet';
import {polygon} from './render.js';
import {VectorTileFeature} from '@mapbox/vector-tile';

const tileKey = (z, x, y) => [z, x, y].join(':');

export default L.GridLayer.extend({
    initialize: function(options) {
        this.options = L.setOptions(this, options);
    },    
    createTile: function(coords, done){        
        let tile = L.DomUtil.create('canvas', 'leaflet-tile');        
        const size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;

        const {z, x, y} = coords;
        const key = tileKey(z, x, y);
        const {layerId} = this.options;
        const request = new Worker('tile.js');        
        request.onmessage = e => {
            request.terminate();
            const {status} = e.data;
            if (status === 'ready') {
                const {features} = e.data;                    
                let ctx = tile.getContext('2d');
                for (const f of features) {
                    const style = typeof this.options.style === 'function' && this.options.style(f)
                    || typeof this.options.style === 'object' && this.options.style;
                    const {type, coordinates} = f;
                    switch(VectorTileFeature.types[type]) {
                        case 'Polygon':
                            polygon(ctx, coordinates, style);
                            break;
                        default:
                            break;
                    }                        
                }                
                done(null, tile);                                     
            }                
            else if (status === 'error') {
                const {message, stack} = e.data;
                const error = new Error(message);
                error.stack = stack;
                done(error, tile);
            }
        };
        request.onerror = e => {
            request.terminate();
            done(e, tile);
        };
        request.onmessageerror = e => {
            request.terminate();
            done(e, tile);
        }
        request.postMessage({layerId, z, x, y, key});
        return tile;
    },   
});