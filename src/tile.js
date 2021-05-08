import get from './request.js';

onmessage = function(e) {    
    const {layerId, z, x, y} = e.data;    
    get(layerId, z, x, y)
    .then(result => {    
        const layers = result && Object.entries(result);
        if (layers.length > 0) {
            const [_, features] = layers[0];            
            postMessage({status: 'ready', features});    
        }
        else {
            postMessage({status: 'ready', features: []});
        }
    })
    .catch(e => {
        const {message, stack} = e;
        postMessage({status: 'error', message, stack});
    });
};