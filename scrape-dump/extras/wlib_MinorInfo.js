"use strict";

class MinorInfo {

    constructor(obj = {}) {
        if (obj === null) {
            obj = {
                fields: {
                    firstname: {
                        type: "TextField",
                        label: "minor first name",
                        required: true,
                    },
                    lastname: {
                        type: "TextField",
                        label: "last name",
                        required: true,
                    },
                    dob: {
                        type: "DateField",
                        label: "dob",
                        required: true,
                    },
                },
                custom_fields: [],
            };
        }

        this.fields = {
            firstname: new NameField(obj.fields.firstname),
            lastname: new NameField(obj.fields.lastname),
            dob: new DateField(obj.fields.dob),
        };

        if (obj.custom_fields) {
            this.custom_fields = (obj.custom_fields || []).map(cfield => {
                switch (cfield.type) {
                    case "TextField":
                        return new TextField(cfield);
                    case "SelectField":
                        return new SelectField(cfield);
                    default:
                        console.warn(`Defaulting "${cfield.label}" to TextField ` +
                            `because its type "${cfield.type}" is ` +
                            `unsupported.`);
                        return new TextField(cfield);
                }
            });
        } else {
            this.custom_fields = [];
        }
    }

    toJSON() {
        return {
            fields: {
                dob: this.fields.dob,
                lastname: this.fields.lastname,
                firstname: this.fields.firstname,
            },
            custom_fields: this.custom_fields,
        };
    }

    commitDomValues() {
        Object.values(this.fields)
            .filter(f => f.visible)
            .map(f => f.commitDomValues());
        this.custom_fields
            .filter(f => f.visible)
            .map(f => f.commitDomValues());
    }

    save() {} // override

    validate() {
        this.commitDomValues();
        const fields_valid = Object.values(this.fields)
            .filter(f => f.visible)
            .map(f => f.validate())
            .every(Boolean);
        const custom_fields_valid = this.custom_fields
            .filter(f => f.visible)
            .map(f => f.validate())
            .every(Boolean);
        return fields_valid && custom_fields_valid;
    }

    // Trashcan should be a button?
    render(is_appcp, index) {
        if (this.custom_fields && this.custom_fields.length) {
            return `
                <div name="minor">
                    <div class="col-sm-3">${this.fields.firstname.render(is_appcp)}</div>
                    <div class="col-sm-3">${this.fields.lastname.render(is_appcp)}</div>
                    <div class="col-sm-2">${this.fields.dob.render(is_appcp)}</div>` +
                    this.custom_fields
                        .filter(f => f.visible)
                        .map(f => `<div class="col-sm-3">`+f.render(is_appcp)+`</div>`)
                        .join("") + `
                    <div class="col-sm-1">
                      <div class="form-group" style="cursor: pointer" onclick="appState.customer.removeMinor(${index});">
                          <div class="form-control" style="display:flex; justify-content: space-around; align-items: center; background-color: #ee6600; color: white; font-weight:bold;">
                            X
                            <!-- <i class="fa fa-trash"></i> -->
                          </div>
                      </div>
                    </div>
                  </div>
            `;
        } else {
            return `
                <div name="minor">
                    <div class="col-sm-4">${this.fields.firstname.render(is_appcp)}</div>
                    <div class="col-sm-4">${this.fields.lastname.render(is_appcp)}</div>
                    <div class="col-sm-3">${this.fields.dob.render(is_appcp)}</div>` +
                    this.custom_fields
                        .filter(f => f.visible)
                        .map(f => `<div class="col-sm-4">`+f.render(is_appcp)+`</div>`)
                        .join("") + `
                    <div class="col-sm-1">
                      <div class="form-group" style="cursor: pointer" onclick="appState.customer.removeMinor(${index});">
                          <div class="form-control" style="display:flex; justify-content: space-around; align-items: center; background-color: #ee6600; color: white; font-weight:bold;">
                            X
                            <!-- <i class="fa fa-trash"></i> -->
                          </div>
                      </div>
                    </div>
                  </div>
            `;
        }
    }
}
