"use strict";

// uses window.helpers from ./utils/helpers.js

class AppState {

    constructor(data = {}) {
        this.meta = new MetaDescription(data.meta || {});
        this.router = new Router(data.router);
        this.customer = new CustomerInfo(data.customer || {});
    }

    toJSON() {
        return {
            meta: this.meta,
            router: this.router,
            customer: this.customer,
        };
    }

    static fromJSON(str) {
        return new AppState(JSON.parse(str));
    }

    static fromV1Data(v1_data) {

        const reqs = v1_data.config.requirements;
        const isRequired = label => r => r.label === label && r.required;
        v1_data.minors = v1_data.minors || [];
        return new AppState({

            meta: {
                company_name: v1_data.settings.company,
                foldername: v1_data.foldername,
                is_appcp: v1_data.meta.is_appcp,
                random: v1_data.random,
                auth: {
                    key: v1_data.key,
                    token: v1_data.token,
                },
                logo: `//${window.appConfig.filesHost}/cp/upload/${v1_data.foldername}/editor/${v1_data.logo}`,
            },

            router: {
                pages: v1_data.meta.is_appcp ? ["start", "enter info", "sign waiver", "done"] : ["enter info", "sign waiver", "done"],
                pointer: 0,
            },

            customer: {
                minors: v1_data.minors.map(m => new MinorInfo({fields: m})),
                standard_fields: {
                    firstname: {
                        label: "first name",
                        required: true,
                    },
                    lastname: {
                        label: "last name",
                        required: true,
                    },
                    dob: {
                        label: "dob",
                        required: true,
                    },
                    phone: {
                        label: "phone",
                        required: reqs.some(isRequired("phone")),
                    },
                    email: {
                        label: "email",
                        required: reqs.some(isRequired("email")),
                    },
                    city: {
                        label: "city",
                        required: reqs.some(isRequired("city")),
                    },
                    state: {
                        label: "state",
                        required: reqs.some(isRequired("state")),
                    },
                },
                custom_fields: Object.values(v1_data.config.customfields).map(window.helpers.initialize_customfield),
                order: v1_data.order || null,
                waiver: {
                    content: v1_data.waiver_content || "",
                },
            },
        });
    }

    async save() {
        let result = null;
        if (this.customer.validate()) {
            await this.customer.save();
            nextPage();
        }
        render();
        return result;
    }

    render() {
        let output = "";
        switch (this.router.route()) {
            case "start":
                output = StartPage.render(this.meta);
                break;
            case "sign waiver":
                output = this.customer.waiver.render(this.meta);
                break;
            case "done":
                output = DonePage.render(this.meta);
                break;
            case "enter info": // intentional fallthrough
            default:
                output = this.customer.render(this.meta);
        }

        if (data.meta.is_appcp) {
            return `<div class="container" style="margin-Top: 3.5em;">${output}</div>`;
        } else {
            return output;
        }
    }
}
