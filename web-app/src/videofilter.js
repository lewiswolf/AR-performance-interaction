myFunction = () => {
    let rx=0;
    let ry=0;
    let rwidth=320;
    let rheight=240;

    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    let cw = 320;
    let ch = 240;
    canvas.width = cw;
    canvas.height = ch;

    video.addEventListener('play', function(){
        draw(this, ctx, cw, ch);
    },false);

    function draw(video,context,w,h) {
        if(video.paused || video.ended)
            return false;
        context.drawImage(video, 0, 0, w, h);

        makeBlackTransparent(context);
        setTimeout(draw,150, video, context, w, h);
    }

    function makeBlackTransparent(context){
        let imgData = context.getImageData(rx, ry, rwidth, rheight);
        let data = imgData.data;
        let threshold = 50;

        for(let i = 0; i < data.length; i += 4){
            // if the pixel color is nearly black--change it to red
            if(data[i] < threshold && data[i + 1] < threshold && data[i + 2] < threshold){
                data[i] = 0;
                data[i+1] = 0;
                data[i+2] = 0;
                data[i+3] = 0; // Transparent
            }

        }
        // put the modified pixels back into the canvas
        // Now the pupil is colored pure red!
        context.putImageData(imgData, rx, ry);
    }
}