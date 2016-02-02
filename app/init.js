if (!String.prototype.includes) {
    String.prototype.includes = function () {
        'use strict';
        if (typeof arguments[1] === "number") {
            if (this.length < arguments[0].length + arguments[1].length) {
                return false;
            } else {
                if (this.substr(arguments[1], arguments[0].length) === arguments[0]) return true;
                else return false;
            }
        } else {
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        }
    };
}