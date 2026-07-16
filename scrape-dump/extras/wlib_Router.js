"use strict";

class Router {

    constructor(obj=null) {
        this.pages = obj.pages || [];
        this.pointer = obj.pointer || 0;
    }

    toJSON() {
        return {
            pages: this.pages,
            pointer: this.pointer,
        };
    }

    isLastPage() {
        return this.pointer === this.pages.length - 1;
    }

    isFirstPage() {
        return this.pointer = 0;
    }

    next() {
        this.pointer = (this.pointer + 1) % this.pages.length;
    }

    prev() {
        this.pointer = Math.max(this.pointer - 1, 0);
    }

    route() {
        return this.pages[this.pointer];
    }

}
