//- JavaScript source code

//- main.js ~~
//                                                      ~~ (c) SRW, 25 Oct 2011

var NUKE;

if (!NUKE) {
    NUKE = {};
}

(function () {
    'use strict';

 // Private declarations

    var canvas, ctx;

 // Private definitions

    canvas = document.getElementById('holder');

    canvas.ondragleave = function () {
        canvas.className = '';
        return false;                   //- prevents default event handling?
    };

    canvas.ondragover = function () {
        canvas.className = 'hover';
        return false;
    };

    canvas.ondragend = function () {
        canvas.className = '';
        return false;
    };

    canvas.ondrop = function (evt) {

        canvas.className = '';
        evt.preventDefault();

        var file, reader;

        file = evt.dataTransfer.files[0];

        reader = new FileReader();

        reader.onload = function (evt) {
            var img = new Image();
            img.onload = function () {
                var k, x, y;
                k = img.width / img.height;
                if (img.width < img.height) {
                    x = 300 / k;
                    y = 300;
                } else {
                    x = 300;
                    y = 300 / k;
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, x, y);
                console.log(canvas.width, canvas.height);
                setTimeout(NUKE.demo, 0);
            };
            img.src = evt.target.result;
        };

     // NOTE: I also plan to try simple MIME detection based on extensions so
     // that readAs{ArrayBuffer,BinaryString,Text} methods could be useful ...

        reader.readAsDataURL(file);

        return false;

    };

    ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '16pt Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('Drag image here :-)', canvas.width / 2, canvas.height / 2);

 // Public definitions (as methods of a global variable)

    NUKE.demo = function () {
        var avg, data;

        avg = function (x) {
         // This actually allows for "sparse" arrays with missing values.
            var i, j, n, total;
            n = 0;
            total = 0;
            for (i = 0; i < x.length; i += 1) {
                for (j = 0; j < x[i].length; j += 1) {
                    total += x[i][j];
                    n += 1;
                }
            }
            return total / n;
        };

        console.log('Reading current image ...');

        data = NUKE.snapshot(canvas);

        console.log('Computing average values for each channel ...');
        console.log('  Red:  ', avg(data.red));
        console.log('  Green:', avg(data.green));
        console.log('  Blue: ', avg(data.blue));
        console.log('  Alpha:', avg(data.alpha));

        console.log('Done.');

    };

    NUKE.snapshot = function (canvas) {

     // This function reads the current content of a given canvas element and
     // returns an object that stores each pixel's value as an integer between
     // 0 and 255, indexed by channel, row, and column.

        if (canvas === undefined) {
            throw new Error('No canvas element was specified.');
        }

        var a, b, cols, g, i, j, offset, r, rows, temp, x;

        cols = canvas.width;
        rows = canvas.height;
        temp = canvas.getContext('2d').getImageData(0, 0, cols, rows).data;

        x = {
            red:    new Array(rows),
            green:  new Array(rows),
            blue:   new Array(rows),
            alpha:  new Array(rows)
        };

        for (i = 0; i < rows; i += 1) {
            r = x.red[i]    = new Array(cols);
            g = x.green[i]  = new Array(cols);
            b = x.blue[i]   = new Array(cols);
            a = x.alpha[i]  = new Array(cols);
            for (j = 0; j < cols; j += 1) {
                offset = (i * cols + j) * 4;
                r[j] = temp[offset];
                g[j] = temp[offset + 1];
                b[j] = temp[offset + 2];
                a[j] = temp[offset + 3];
            }
        }

        return x;

    };

}());

//- vim:set syntax=javascript:
