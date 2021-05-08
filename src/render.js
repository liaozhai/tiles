export function polygon (ctx, coordinates, style) {
    if (style) {
        {
            const vertices = coordinates[0];
            const {x,y} = vertices[0];
            ctx.beginPath();        
            ctx.moveTo(x, y);
            for(let i = 1; i < vertices.length; ++i) {                                    
                const {x,y} = vertices[i];
                ctx.lineTo(x, y);
            }        
            ctx.closePath();        
        }    
        for (let i = 1; i < coordinates.length; ++i) {
            const vertices = coordinates[i].reverse();
            const {x,y} = vertices[0];                
            ctx.moveTo(x, y);
            for(let i = 1; i < vertices.length; ++i) {                                    
                const {x,y} = vertices[i];
                ctx.lineTo(x, y);
            }        
            ctx.closePath();        
        }
        const {fillStyle, strokeStyle, lineWidth} = style;
        if (fillStyle) ctx.fillStyle = fillStyle;
        if (strokeStyle) ctx.strokeStyle = strokeStyle;
        if (lineWidth) ctx.lineWidth = lineWidth;
        if (fillStyle) ctx.fill();
        if (strokeStyle) ctx.stroke();
    }
};