"use strict";

class MetaDescription {
    constructor(obj = {}) {
        this.company_name = obj.company_name || "";
        this.foldername = obj.foldername || "";
        this.is_appcp = Boolean(obj.is_appcp);
        this.random = obj.random || encodeURIComponent(Math.random().toString());
        this.auth = obj.auth;
        this.logo = obj.logo;
    }
}
