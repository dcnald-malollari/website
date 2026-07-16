"use strict";

const net = window.net; // ../../../../js/net_utils.js

window.api = {
    save_customer: async function(customerJson) {
        const body = {
            action: "create_customer",
            customer_data: String(customerJson),
        };
        const rsp = await net.fetchAQ("waiver_station_io_2", body);
        return rsp;
    },

    notify_waiver: async function() {

		const customer = {
			email:		appState.customer.standard_fields.email.value,
			id:			appState.customer.id,
			phone:		appState.customer.standard_fields.phone.value,
			firstname:	appState.customer.standard_fields.firstname.value,
			lastname:	appState.customer.standard_fields.lastname.value,
		};

        const body = {
            action: "waiver_complete",
            customer_data: JSON.stringify(customer),
        };
        const rsp = await net.fetchAQ("waiver_station_io_2", body);
        console.log("notify result: ", rsp);
        return rsp;
    },

    get_upcoming_events: function() {
        return net.fetchAQ("get_upcoming_events", {});
    },
};