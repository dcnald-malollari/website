"use strict";

class CustomerInfo {

    constructor(obj = null) {
        if (obj === null) {
            obj = {
                standard_fields: {
                    firstname: {
                        label: "Adult / Parent First Name"
                    },
                    lastname: {
                        label: "Adult / Parent Last Name"
                    },
                    dob: {
                        label: "DOB"
                    },
                    email: {
                        label: "email"
                    },
                    phone: {
                        label: "phone"
                    },
                    city: {
                        label: "city"
                    },
                    state: {
                        label: "state"
                    },
                },
                custom_fields: [],
                minors: [],
                id: null,
                order: null,
                waiver: "-- sign below --",
            };
        }

        this.standard_fields = {
            firstname: new NameField(obj.standard_fields.firstname),
            lastname: new NameField(obj.standard_fields.lastname),
            dob: window.waiver_requires_guardian ?
                new GuardianDateField(obj.standard_fields.dob) :
                new DateField(obj.standard_fields.dob),
            email: new EmailField(obj.standard_fields.email),
            phone: new PhoneField(obj.standard_fields.phone),
            city: new NameField(obj.standard_fields.city),
            state: new StateField(obj.standard_fields.state),
        };

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
        this._passed_custom_fields = (obj.custom_fields||[]).filter(c => c.label === "Racer Name");
        this.minors = (obj.minors || []).map(minor => new MinorInfo(Object.assign(minor, {custom_fields: obj.custom_fields||[]})));
        this.order = obj.order ? new OrderInfo(obj.order) : new OrderInfo(0);
        this.waiver = new WaiverContent(obj.waiver);
    }

    toJSON() {
        return {
            standard_fields: {
                firstname: this.standard_fields.firstname,
                lastname: this.standard_fields.lastname,
                dob: this.standard_fields.dob,
                email: this.standard_fields.email,
                phone: this.standard_fields.phone,
                city: this.standard_fields.city,
                state: this.standard_fields.state,
            },
            custom_fields: this.custom_fields,
            minors: this.minors,
            order: this.order,
            waiver: this.waiver,
            id: this.id,
        };
    }

    removeMinor(index = 0) {
        this.commitDomValues();
        this.minors = this.minors.filter((_, i) => i !== index);
        render();
    }

    addMinor() {
        this.commitDomValues();
        this.minors.push(new MinorInfo({
            fields: {
                firstname: {
                    label: "minor first name",
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
            },
            custom_fields: this._passed_custom_fields,
        }));
        render();
    }

    async save() {
        this.commitDomValues();
        const result = await api.save_customer(JSON.stringify(this));
        this.id = result.customer.id || null;
        this.waiver.setCustomerID(this.id);
        this.waiver.setSignatureToken(result.sig_token || '');
        customercontenthtml = `<b>Customer Information</b><br>Name: ${this.standard_fields.firstname.value} ${this.standard_fields.lastname.value}<br>DOB: ${this.standard_fields.dob.value}<br>Email: ${this.standard_fields.email.value}<br>Phone: ${this.standard_fields.phone.value}<br>City: ${this.standard_fields.city.value}<br>State: ${this.standard_fields.state.value}<br>`;
        if (this.custom_fields.length > 0) {
            this.custom_fields.forEach((custom_fields) => {
                customercontenthtml += `${custom_fields.label}: ${custom_fields.value}<br>`;
            })
        }
        if (this.minors.length > 0) {
            customercontenthtml += "<br><b>Minor(s)</b>"
            this.minors.forEach((minor) => {
                customercontenthtml += `<br>Minor Name: ${minor.fields.firstname.value} ${minor.fields.lastname.value}<br>Minor DOB: ${minor.fields.dob.value}<br>`;
            })
        }
        return result;
    }

    commitDomValues() {
        Object.values(this.standard_fields)
            .filter(f => f.visible)
            .map(f => f.commitDomValues());
        Object.values(this.custom_fields)
            .filter(f => f.visible)
            .map(f => f.commitDomValues());
        Object.values(this.minors).map(f => f.commitDomValues());
    }

    validate() {
        const invalid_msgs = [];
        this.commitDomValues();
        const validator = (f, i) => {
            const result = f.validate();
            if (!result) {
                invalid_msgs.push(f.getInvalidReason());
            }
            return result;
        };
        const result = Object.values(this.standard_fields)
            .filter(f => f.visible)
            .map(validator)
            .concat(this.custom_fields.filter(f => f.visible).map(validator))
            .concat(this.minors.map((m, i) => {
                const result = m.validate();
                const name = Object.values(m.fields).map(f => f.value).filter(Boolean).join(" ");
                if (name.trim()) {
                    invalid_msgs.push(`minor "${name}"`);
                } else {
                    invalid_msgs.push(`minor #${i+1}`);
                }
                return result;
            }))
            .every(Boolean);

        if (result === false) {
            const ws_approot = document.getElementById("ws_approot");
            if (ws_approot && ws_approot.scrollIntoView) {
                ws_approot.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest"
                });
            }
            setTimeout(() => {
                alert("The following fields are empty or invalid: " + invalid_msgs.join(", "));
            }, 750);
        }
        return result;
    }

    render({
        is_appcp,
        logo
    }) {
        const sfields = this.standard_fields;
        const cfields = this.custom_fields;
        return `
          <div class="panel panel-default">
            <div class="panel-heading">
              <p class="panel-title text-center" style="margin-bottom: 0;">Waiver page 1 of 2</p>
            </div>
            <div class="panel-body text-left">
            <!-- <h2 class="text-center"> Please fill in your information and hit the GREEN button to add MINORS </h2> -->
            <p class="text-center" style="font-size: 1.5em; margin-bottom: 2.5em;">
                ${!this.order.order_id ? 
                    "<b>PARENTS / ADULTS</b>:  Please fill in YOUR information<br>For <span style='color:green'>Minors / Children</span>, use the green button":
                    //"Please fill out this form to continue." :
                    this.order.render()}
              </p>
              <form>
                <div class="col-sm-4">
                  ${sfields.firstname.render(is_appcp)}
                </div>
                <div class="col-sm-4">
                  ${sfields.lastname.render(is_appcp)}
                </div>
                <div class="col-sm-4">
                  ${sfields.dob.render(is_appcp)}
                </div>
                <div class="col-sm-6">
                  ${sfields.phone.render(is_appcp)}
                </div>
                <div class="col-sm-6">
                  ${sfields.email.render(is_appcp)}
                </div>
                <div class="col-sm-6">
                  ${sfields.city.render(is_appcp)}
                </div>
                <div class="col-sm-6">
                  ${sfields.state.render(is_appcp)}
                </div>

                ${cfields
                  .filter(f => f.visible)
                  .map(f => {
                    return `<div class="col-sm-6">${f.render()}</div>`;
                  })
                  .join("")}

                ${window.waiver_test && `
                    <div class="col-sm-12">
                        ${this.order.render_selector()}
                    </div>
                ` || ""}

                <div class="col-sm-12">
                ${
                  this.minors.length > 0
                    ? `<h3 class="text-center" style="margin-top: 1em;">Minors</h3>
                    <p class="text-center" style="margin-bottom: 1em;">Enter dependents under 18 years of age below.</p>`
                    : ""
                }
                </div>
                ${this.minors
                  .map((m, index) => {
                    return `
                        ${m.render(is_appcp, index)}
                    `;
                  })
                  .join("")}

                <div class="col-sm-12">
                  <button
                    type="button"
                    class="btn btn-default"
                    id="btn_add_minor"
                    onclick="appState.customer.addMinor();"
                    style="margin: 0; color: white; background: green;"
                  >
                    <i class="fa fa-plus" style="margin-right: .5rem;"></i>
                    Add Minor
                  </button>
                </div>

                <div class="col-sm-12">
                  <div class="pull-right" style="margin-top: 2rem;">
                    <button
                    type="button"
                    class="btn btn-default btn-lg"
                    style="margin: 0;"
                    onclick="window.reset()">
                      <i class="fad fa-chevron-double-left" style="margin-right: .5rem;"></i>
                      Start Over
                    </button>
                    <button type="button" class="btn btn-primary btn-lg"
                      id="proceed_to_waiver"
                      style="margin: 0;"
                      onclick="appState.save()"
                    >
                      Sign Waiver
                      <i class="fad fa-chevron-double-right" style="margin-left: .5rem;"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        `;
    }

}
