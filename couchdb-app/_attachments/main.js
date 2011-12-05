//- JavaScript source code

//- main.js ~~
//                                                      ~~ (c) SRW, 07 Nov 2011

var QSCOPE;

if (!QSCOPE) {
    QSCOPE = {};
}

(function () {
    'use strict';

 // Private declarations

    var canvas, ctx, defineProperty, state;

 // Private definitions

    canvas = document.getElementById('holder');

    ctx = canvas.getContext('2d');

    defineProperty = function (obj, name, params) {
        if (Object.hasOwnProperty('defineProperty')) {
            defineProperty = Object.defineProperty;
        } else {
            defineProperty = function (obj, name, params) {
                /*jslint nomen: true */
                params = (params instanceof Object) ? params : {};
                var key;
                for (key in params) {
                    if (params.hasOwnProperty(key)) {
                        switch (key) {
                        case 'get':
                            obj.__defineGetter__(name, params[key]);
                            break;
                        case 'set':
                            obj.__defineSetter__(name, params[key]);
                            break;
                        case 'value':
                            delete obj[name];
                            obj[name] = params[key];
                            break;
                        default:
                         // (placeholder)
                        }
                    }
                }
                return obj;
            };
        }
        return defineProperty(obj, name, params);
    };

    state = {
        inputs: {
         // (placeholder)
        },
        original:   null,
        pixel:      null
    };

    defineProperty(state, 'current', {
        configurable: false,
        enumerable: true,
        get: function () {
         // This function reads the current content of the canvas element and
         // returns an object that stores each pixel's value as an integer
         // between 0 and 255, indexed by channel, row, and column.
            var a, b, cols, g, i, j, offset, r, rows, temp, x;
            cols = canvas.width;
            rows = canvas.height;
            temp = ctx.getImageData(0, 0, cols, rows).data;
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
        },
        set: function (x) {
            var cols, i, j, offset, rows, temp, y;
            cols = canvas.width;
            rows = canvas.height;
            temp = ctx.getImageData(0, 0, cols, rows);
            y = temp.data;
            for (i = 0; i < rows; i += 1) {
                for (j = 0; j < cols; j += 1) {
                    offset = (i * cols + j) * 4;
                    y[offset    ] = x.red[i][j];
                    y[offset + 1] = x.green[i][j];
                    y[offset + 2] = x.blue[i][j];
                    y[offset + 3] = x.alpha[i][j];
                }
            }
            ctx.putImageData(temp, 0, 0);
            return;
        }
    });

    (function () {
     // This function ties the sliders to "state" and defines their events.

        var recompute, slider_a, slider_b, slider_e, slider_g, slider_r;

        recompute = function () {
            QSCOPE.heatmap();
            return;
        };

        slider_a = document.getElementById('slider_a');
        slider_b = document.getElementById('slider_b');
        slider_e = document.getElementById('slider_e');
        slider_g = document.getElementById('slider_g');
        slider_r = document.getElementById('slider_r');

        slider_a.onchange = recompute;
        slider_b.onchange = recompute;
        slider_e.onchange = recompute;
        slider_g.onchange = recompute;
        slider_r.onchange = recompute;

        defineProperty(state.inputs, 'alpha', {
            configurable: false,
            enumerable: true,
            get: function () {
                return slider_a.value / (slider_a.max - slider_a.min);
            },
            set: function (val) {
                slider_a.value = val * (slider_a.max - slider_a.min);
                return;
            }
        });

        defineProperty(state.inputs, 'blue', {
            configurable: false,
            enumerable: true,
            get: function () {
                return slider_b.value / (slider_b.max - slider_b.min);
            },
            set: function (val) {
                slider_b.value = val * (slider_b.max - slider_b.min);
                return;
            }
        });

        defineProperty(state.inputs, 'epsilon', {
            configurable: false,
            enumerable: true,
            get: function () {
                return slider_e.value / (slider_e.max - slider_e.min);
            },
            set: function (val) {
                slider_e.value = val * (slider_e.max - slider_e.min);
                return;
            }
        });

        defineProperty(state.inputs, 'green', {
            configurable: false,
            enumerable: true,
            get: function () {
                return slider_g.value / (slider_g.max - slider_g.min);
            },
            set: function (val) {
                slider_g.value = val * (slider_g.max - slider_g.min);
                return;
            }
        });

        defineProperty(state.inputs, 'red', {
            configurable: false,
            enumerable: true,
            get: function () {
                return slider_r.value / (slider_r.max - slider_r.min);
            },
            set: function (val) {
                slider_r.value = val * (slider_r.max - slider_r.min);
                return;
            }
        });

     // Exit the scope.

        return;

    }());


    canvas.onclick = function (evt) {
        var x, y;
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
        state.pixel = ctx.getImageData(x, y, 1, 1);
        QSCOPE.heatmap();
        return;
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
                state.pixel = ctx.getImageData(0, 0, 1, 1);
                canvas.style.background = 'url(' + img.src + ')';
                state.original = state.current;
                QSCOPE.heatmap();
                return;
            };
            img.src = evt.target.result;
            return;
        };

     // NOTE: I also plan to try simple MIME detection based on extensions so
     // that readAs{ArrayBuffer,BinaryString,Text} methods could be useful ...

        reader.readAsDataURL(file);

        return false;

    };

 // Public definitions (as methods of a global variable)

    QSCOPE.heatmap = function () {
        var alpha, blue, data, distance, epsilon, green, i, j, m, max_dist, n,
            red, temp, x;

        alpha = state.inputs.alpha;
        blue = state.inputs.blue;
        epsilon = state.inputs.epsilon;
        green = state.inputs.green;
        red = state.inputs.red;

        QSCOPE.clear();
        data = state.current;

        distance = function (pixel, data) {
            var dr2, dg2, db2, da2, i, j, m, max, n, pow, sqrt, val, y;
            m = data.rows;
            n = data.cols;
            max = Math.max;
            pow = Math.pow;
            sqrt = Math.sqrt;
            y = new Array(m);
            for (i = 0; i < m; i += 1) {
                y[i] = new Array(n);
                for (j = 0; j < n; j += 1) {
                    dr2 = red * pow(data.red[i][j] - pixel.data[0], 2);
                    dg2 = green * pow(data.green[i][j] - pixel.data[1], 2);
                    db2 = blue * pow(data.blue[i][j] - pixel.data[2], 2);
                    da2 = alpha * pow(data.alpha[i][j] - pixel.data[3], 2);
                    val = sqrt(dr2 + dg2 + db2 + da2);
                    max_dist = max(max_dist, val);
                    y[i][j] = val;
                }
            }
            return y;
        };

        max_dist = 0;

        x = distance(state.pixel, data);

        m = x.length;
        n = x[0].length;

        for (i = 0; i < m; i += 1) {
            for (j = 0; j < n; j += 1) {
                temp = 1 - (x[i][j] / max_dist);
                if (temp < epsilon) {
                    data.red[i][j] = parseInt(255 * temp);
                    data.blue[i][j] = parseInt(255 * temp);
                    data.green[i][j] = parseInt(255 * temp);
                } else {
                    data.red[i][j] = data.green[i][j] = data.blue[i][j] = 255;
                }
                data.alpha[i][j] = parseInt(255 * alpha);
            }
        }

        state.current = data;
        return;
    };

    QSCOPE.clear = function () {
        if (state.original !== null) {
            state.current = state.original;
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
    };

    QSCOPE.reset = function () {
        state.inputs.alpha = 1;
        state.inputs.blue = 1;
        state.inputs.epsilon = 1;
        state.inputs.green = 1;
        state.inputs.red = 1;
        QSCOPE.heatmap();
        return;
    };

 // Initialization

    ctx = canvas.getContext('2d');
    ctx.fillStyle = "#CCCCCC";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    state.original = state.current;
    state.pixel = ctx.getImageData(0, 0, 1, 1);

    (function () {

        var alpha;

        document.onkeydown = function (evt) {
            var keychar, keynum;
            if (window.event) { // IE
                keynum = evt.keyCode;
            } else if (evt.which) { // Netscape/Firefox/Opera
                keynum = evt.which;
            }
            keychar = String.fromCharCode(keynum);
            if ((state.inputs.alpha !== 0) && (keychar === 'A')) {
                alpha = state.inputs.alpha;
                state.inputs.alpha = 0;
                QSCOPE.heatmap();
            }
            return;
        };

        document.onkeyup = function (evt) {
            var keychar, keynum;
            if (window.event) { // IE
                keynum = evt.keyCode;
            } else if (evt.which) { // Netscape/Firefox/Opera
                keynum = evt.which;
            }
            keychar = String.fromCharCode(keynum);
            if ((state.inputs.alpha === 0) && (keychar === 'A')) {
                state.inputs.alpha = alpha;
                QSCOPE.heatmap();
            }
            return;
        };

    }());

 // That's all, folks!

    return;

}());

//- vim:set syntax=javascript:
