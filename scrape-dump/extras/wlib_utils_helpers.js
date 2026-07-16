"use strict";

window.helpers = {
    // API HELPERS //
    // TODO - put this in the MinorInfo class.
    // TODO - create a MinorInfo class.
    to_writeable_minor(form, parentid) {
        // TODO - create a MinorInfo class, and implement toJSON modeled after CustomerInfo.
        throw new Error("Make sure MinorInfo class has been created.");
        return Object.assign(helpers.to_writeable_cust(form), {
            parentid
        });
    },

    // TODO - put this in the CustomerInfo class.
    to_writeable_cust(form) {
        throw new Error(
            "this method won't work because custom fields needs to be properly serialized."
        );
        return {
            email: form.email || "",
            phone: form.phone || "",
            birth_date: form.dob || "",
            lastname: form.lastname || "",
            firstname: form.firstname || "",
            billing_city: form.billing_city || "",
            billing_state: form.billing_state || "",
            customfields: form.customfields || {}
        };
    },

    // UTILITIES //

    sep_decode(input = "") {
        return input.split("[_sep_]").map(s => s.split("[_sep2_]"));
    },

    letterHash() {
        return Math.random()
            .toString(36)
            .replace(/\./g, "Z")
            .replace(/0/g, "A")
            .replace(/1/g, "B")
            .replace(/2/g, "C")
            .replace(/3/g, "D")
            .replace(/4/g, "E")
            .replace(/5/g, "F")
            .replace(/6/g, "G")
            .replace(/7/g, "H")
            .replace(/8/g, "I");
    },

    // INITIALIZER HELPERS //

    fromNameAndValue(reqs = [], label = "no label", value = "") {
        return {
            value,
            label,
            visible: true,
            options: [],
            required: reqs.filter(
                r => r.label === label && r.required
            ).length > 0
        };
    },

    initialize_customfield(field) {
        const obj = {
            value: "",
            label: field.label,
            visible: !!field.visible,
            input_type: field.record.options.trim() === "" ? "T_text" : "T_select",
            options: helpers
                .sep_decode(field.record.options)
                .map(opt => opt.shift())
                .filter(Boolean),
            required: field.required
        };
        if (obj.options.length === 0) {
            obj.type = "TextField";
        } else {
            obj.type = "SelectField";
        }
        return obj;
    },

    feedbackIcons(value, isValid, is_appcp) {
        if (value === "" && isValid) {
            return "";
        }
        if (isValid) {
            return helpers.feedbackOk(isValid, is_appcp);
        }
        return helpers.feedbackDirty(!isValid, is_appcp);
    },

    feedbackOk(isOk, is_appcp) {
        if (isOk) {
            return `<span class='glyphicon glyphicon-ok form-control-feedback' style='z-index: auto; ${
        is_appcp ? "" : "height: 45px; line-height: 45px;"
      }' aria-hidden='true'></span>`;
        }
        return "";
    },

    feedbackDirty(isDirty, is_appcp) {
        if (isDirty) {
            return `<span class='glyphicon glyphicon-remove form-control-feedback' style='z-index: auto; ${
        is_appcp ? "" : "height: 45px; line-height: 45px;"
      }' aria-hidden='true'></span>`;
        }
        return "";
    },

    E(name="div", attrs={}, children=[]) {
        const el = document.createElement(name);
        for (const [k, v] of Object.entries(attrs)) {
            //el[k] = v;
            if (k.startsWith("on") && typeof v === "function") {
                el.addEventListener(k.slice(2), v);
            } else if (k === "className") {
                el.className = v;
            } else if (k === "style") {
                el.style.cssText = v;
            } else {
                el.setAttribute(k, v);
            }
        }
        for (const child of children) {
            el.appendChild(child);
        }
        return el;
    }
};
