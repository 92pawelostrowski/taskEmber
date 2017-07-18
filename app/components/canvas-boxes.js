import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'canvas',
    attributeBindings: ['draggable'],
    draggable: 'true',
    width: 600,
    height: 800,
    rectWidth: 150,
    rectHeigh: 100,
    dragok: false,
    objectArray: [],
    numberMoved: 0,
    resultText: "",
    attributeBindings: ['width', 'height'],
    didInsertElement: function () {
        // gotta set ctxf here instead of in init because
        // the element might not be in the dom yet in init
        this.objectArray = [{
            x: 100,
            y: 100,
            width: this.rectWidth,
            heigh: this.rectHeigh,
            text: "AA"
        },
        {
            x: 300,
            y: 100,
            width: this.rectWidth,
            heigh: this.rectHeigh,
            text: "BB"
        },
        {
            x: 500,
            y: 100,
            width: this.rectWidth,
            heigh: this.rectHeigh,
            text: "CC"
        }],
            this.set('ctx', this.get('element').getContext('2d'));
        this._empty();
        this.draw();
    },
    draw: function () {
        this._empty();
        var ctx = this.get('ctx');
        this.rect(ctx, 0, 0, this.width, this.height);
        this.objectArray.forEach(element => {
            this.rectText(ctx, element.x - (element.width / 2), element.y - (element.heigh / 2), element.width, element.heigh, element.text);
        });
    },

    _empty: function () {
        var ctx = this.get('ctx');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, this.get('width'), this.get('height'));
    },
    rect(context, x, y, w, h) {
        context.fillStyle = "#FAF7F8";
        context.beginPath();
        context.rect(x, y, w, h);
        context.closePath();
        context.fill();
        context.fillStyle = "#aa80ff";
        context.beginPath();
        context.rect(x, y + 9 * h / 10, w, h / 10);
        context.closePath();
        context.fill();
        context.font = "20px Arial";
        context.fillStyle = "#444444";
        context.fillText(this.resultText, x + w / 2, y + 9.5 * h / 10);
    },
    rectText(context, x, y, w, h, text) {
        context.fillStyle = "#444444";
        context.beginPath();
        context.rect(x, y, w, h);
        context.closePath();
        context.stroke();
        context.font = "20px Arial";
        context.fillText(text, x + w / 4, y + h / 2);
    },

    mouseDown: function (evt) {
        this.numberMoved = 0;
        for (let element of this.objectArray) {
            if (evt.pageX < element.x + (element.width / 2) + this.get('element').offsetLeft && evt.pageX > element.x - (element.width / 2) +
                this.get('element').offsetLeft && evt.pageY < element.y + (element.heigh / 2) + this.get('element').offsetTop &&
                evt.pageY > element.y - (element.heigh / 2) + this.get('element').offsetTop) {
                this.dragok = true;
                break;
            }
            this.numberMoved = this.numberMoved + 1;
        }
    },
    mouseMove: function (evt) {
        if (this.dragok) {
            for (let element of this.objectArray) {
                if (!(element === this.objectArray[this.numberMoved])) {
                    if (Math.abs(element.x - (evt.pageX - this.get('element').offsetLeft)) < 10) {
                        if (Math.abs(Math.abs(element.y - (evt.pageY - this.get('element').offsetTop)) - this.rectHeigh) < 10) {
                            if ((element.y - (evt.pageY - this.get('element').offsetTop)) > 0) {
                                this.objectArray[this.numberMoved].x = element.x;
                                this.objectArray[this.numberMoved].y = element.y - this.rectHeigh;
                            }
                            else {
                                this.objectArray[this.numberMoved].x = element.x;
                                this.objectArray[this.numberMoved].y = element.y + this.rectHeigh;
                            }
                            this.draw();
                            return;
                        }
                    }
                }
            }
            this.objectArray[this.numberMoved].x = evt.pageX - this.get('element').offsetLeft;
            this.objectArray[this.numberMoved].y = evt.pageY - this.get('element').offsetTop;
            this.draw();
        }       
    },
    mouseUp: function (evt) {
        this.dragok = false;
        var sortedArray = this.objectArray.sort((n1, n2) => n1.y - n2.y)
        var beforeElement = null;
        var startText = false;
        for (let element of this.objectArray) {
            if (beforeElement !== null) {
                if (beforeElement.x == element.x) {
                    if (element.y - beforeElement.y == this.rectHeigh) {
                        if (startText) {
                            this.resultText = this.resultText + element.text;
                        }
                        else {
                            this.resultText = beforeElement.text + element.text;
                            startText = true;
                        }
                    }
                }
            }
            beforeElement = element;
        }
        this.draw();
    }

});
