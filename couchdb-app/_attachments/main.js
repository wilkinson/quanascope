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

    var canvas, ctx, data;

 // Private definitions

    canvas = document.getElementById('holder');

    canvas.onclick = function (evt) {

        var distance, pixel, x, y;

        distance = function (pixel, data) {
            var dr2, dg2, db2, da2, i, j, m, n, pow, sqrt, y;
            m = data.rows;
            n = data.cols;
            pow = Math.pow;
            sqrt = Math.sqrt;
            y = new Array(m);
            for (i = 0; i < m; i += 1) {
                y[i] = new Array(n);
                for (j = 0; j < n; j += 1) {
                    dr2 = pow(data.red[i][j] - pixel.data[0], 2);
                    dg2 = pow(data.green[i][j] - pixel.data[1], 2);
                    db2 = pow(data.blue[i][j] - pixel.data[2], 2);
                    da2 = pow(data.alpha[i][j] - pixel.data[3], 2);
                    y[i][j] = sqrt(dr2 + dg2 + db2 + da2);
                }
            }
            return y;
        };

        if (evt.pageX || evt.pageY) {
            x = evt.pageX;
            y = evt.pageY;
        } else {
            x = e.clientX +
                document.body.scrollLeft +
                document.documentElement.scrollLeft;
            y = e.clientY +
                document.body.scrollTop +
                document.documentElement.scrollTop;
        }

        x = x - canvas.offsetLeft - 1;
        y = y - canvas.offsetTop - 1;
        pixel = ctx.getImageData(x, y, 1, 1);

        (function () {
         // Experiment ...

            var disguise, k, i, j, m, min, n, offset, temp, x;

            x = distance(pixel, data);

            m = x.length;
            n = x[0].length;

            k = 0;
            for (i = 0; i < m; i += 1) {
                for (j = 0; j < n; j += 1) {
                    k = Math.max(k, x[i][j]);
                }
            }

            disguise = ctx.getImageData(0, 0, canvas.width, canvas.height);

            for (i = 0; i < m; i += 1) {
                for (j = 0; j < n; j += 1) {
                    temp = parseInt(255 * x[i][j] / k);
                    offset = (i * n + j) * 4;
                    disguise.data[offset] = temp;
                    disguise.data[offset + 1] = temp;
                    disguise.data[offset + 2] = temp;
                    disguise.data[offset + 3] = temp;
                }
            }

            ctx.putImageData(disguise, 0, 0);

        }());

    };

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
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);
                data = NUKE.snapshot(canvas);
                canvas.style.background = 'url(' + img.src + ')';
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

    NUKE.clear = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    NUKE.demo = function () {

        var avg;

        avg = function (x) {
         // This computes a mean for "sparse arrays" with missing values.
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
            alpha:  new Array(rows),
            rows:   rows,
            cols:   cols
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
