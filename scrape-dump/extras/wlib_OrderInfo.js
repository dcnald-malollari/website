"use strict";

class OrderInfo {

    constructor(data) {
        this.order_id = data.order_id;
        this.start_datetime = data.start_datetime;
        this.end_datetime = data.end_datetime;
        this.created_by = data.created_by;
        this.upcoming_events = [];

    }

    toJSON() {
        if (this.order_id) {
            return {
                order_id: this.order_id,
                start_datetime: this.start_datetime,
                end_datetime: this.end_datetime,
                created_by: this.created_by,
            };
        } else {
            return null;
        }
    }

    render_selector() {
        if (this.order_id) {
            return `<div id="order_selector"></div>`;
        } else {
            window.api.get_upcoming_events().then((rsp) => {
                const events = rsp.result;
                this.upcoming_events = events;
                window.select_order = (event) => {
                    this.order_id = event.currentTarget.value;
                    console.log("order selected: ", this.order_id);
                };
                const os = document.getElementById("order_selector");
                os.innerHTML = `
                    <select onchange="select_order(event)">
                        <option value="0">new event</option>
                        ${events.map(o => `
                            <option value="${o.order_id}">${o.order_id}: ${o.dependent_item} (${o.start_time})</option>
                        `).join("")}
                    </select>`;
            });
            return `
                <div id="order_selector">
                    loading...
                    ${this.upcoming_events.map(o => JSON.stringify(o))}
                </div>
            `;
        }
    }

    render() {
        if (this.order_id === null) {
            const event_datetime = moment(
                this.start_datetime,
                "YYYY-MM-DD HH:mm:ss").format("dddd, MMMM D, YYYY [at] hh:mm a");
            if (this.created_by.trim() !== "") {
                return `For ${this.created_by}'s event <br />on ${event_datetime}`;
            } else {
                return `For this event on ${event_datetime}`;
            }
        } else {
            return "";
        }
    }

    save() {} // not used probably

}
