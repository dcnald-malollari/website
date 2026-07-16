"use strict";

window.mock_data = {

    "meta": {
        "company_name": "Sir Jimbo's Bouncy Kingdom",
        "foldername": "default_dev",
        "is_appcp": false,
        "random": Math.random().toString(36).split(".").pop(),
        "auth": {
            "key": "test-not-used",
            "token": "test-not-used"
        },
        "logo": `//${window.appConfig.filesHost}/cp/upload/default_dev/editor/cupcake.jpg`
    },

    "router": {
        "pages": [
            "enter info",
            "sign waiver",
            "done"
        ],
        "pointer": 0
    },

    "customer": {
        "standard_fields": {
            "firstname": {
                "type": "NameField",
                "label": "first name",
                "value": "Martin",
                "visible": true,
                "required": true,
                "options": []
            },
            "lastname": {
                "type": "NameField",
                "label": "last name",
                "value": "Spieler",
                "visible": true,
                "required": true,
                "options": []
            },
            "dob": {
                "type": "DateField",
                "label": "dob",
                "value": "1998-03-02",
                "visible": true,
                "required": true,
                "options": []
            },
            "email": {
                "type": "EmailField",
                "label": "email",
                "value": "martin.ez@gmail.com",
                "visible": true,
                "required": false,
                "options": []
            },
            "phone": {
                "type": "PhoneField",
                "label": "phone",
                "value": "505-234-3456",
                "visible": true,
                "required": false,
                "options": []
            },
            "city": {
                "type": "NameField",
                "label": "city",
                "value": "Albuquerque",
                "visible": true,
                "required": false,
                "options": []
            },
            "state": {
                "type": "StateField",
                "label": "state",
                "value": "NM",
                "visible": true,
                "required": false,
                "options": []
            }
        },
        "custom_fields": [
            {
                "type": "TextField",
                "label": "Test Input",
                "value": "test me",
                "visible": true,
                "required": false,
                "options": []
            },
            {
                "type": "SelectField",
                "label": "Test File",
                "value": "file",
                "visible": true,
                "required": false,
                "options": [
                    "file"
                ]
            },
            {
                "type": "SelectField",
                "label": "Test Select",
                "value": "Test 1",
                "visible": true,
                "required": false,
                "options": [
                    "Test 1",
                    "Test 2"
                ]
            }
        ],
        "minors": [
            {
                "fields": {
                    "dob": {
                        "type": "DateField",
                        "label": "",
                        "value": "2019-10-07",
                        "visible": true,
                        "required": true,
                        "options": []
                    },
                    "lastname": {
                        "type": "NameField",
                        "label": "",
                        "value": "",
                        "visible": true,
                        "required": true,
                        "options": []
                    },
                    "firstname": {
                        "type": "NameField",
                        "label": "",
                        "value": "Timmy",
                        "visible": true,
                        "required": true,
                        "options": []
                    }
                }
            }
        ],
        "waiver": {
            "content": "please sign below:"
        }

    },

};
