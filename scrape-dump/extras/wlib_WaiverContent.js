"use strict";

class WaiverContent {
    constructor(obj = null) {
        if (obj === null) {
            obj = {
                content: "default waiver content",
            };
        }
        this.content = obj.content;
        this.loads = 0;
        this.customer_id = null;
        this.signature_token = '';
    }

    setCustomerID(customer_id=null) {
        this.customer_id = customer_id;
    }

    setSignatureToken(signature_token) {
        this.signature_token = signature_token;
    }

    countFrameLoad() {
        this.loads++;
        if (this.loads > 1) {
            //const el = document.getElementById("waiver_submit_button");
            //if (el) {
            //    el.style.display = "inline-block";
            //}
            setTimeout(() => {
                nextPage();
                render();
            }, 500);
        }
    }

    render(meta = {}) {
        const dsig = ""; // it is unknown what this is for.
        this.loads = 0;
        let waivercontent = `
            <div class="panel panel-default">
                <div class="panel-heading">
                    <p class="panel-title text-center" style="margin-bottom: 0;">Waiver page 2 of 2</p>
                </div>
                <div class="panel-body text-left">
                    ${this.content}
                    <div class="text-center" style="margin-top: 2rem;">
                        <iframe
                            onload="appState.customer.waiver.countFrameLoad();"
                            src='//${window.appConfig.filesHost}/filetools/sign.php?sigid=${this.customer_id}&display=take_signature&folder=${meta.foldername}&dsig=${dsig}&r=${meta.random}&token=${this.signature_token}'
                            width='640'
                            height='250'
                            frameborder='0'>
                        </iframe>
                    </div>
                    <div class="pull-left" style="margin-top: 2rem">
                        <button type="button" class="btn btn-default btn-lg"
                        style="margin: 0;"
                        onclick="prevPage();">
                            <i class="fad fa-chevron-double-left" style="margin-right: .5rem;"></i>
                            Customer Information
                        </button>
                  </div>
                </div>
            </div>
        `;
        let waivercontenttemp1 = waivercontent.replace('<p class="panel-title text-center" style="margin-bottom: 0;">Waiver page 2 of 2</p>', "<br><br>");
        let waivercontenttemp2 = waivercontenttemp1.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/g, "");
        let waivercontenttemp3 = waivercontenttemp2.replace(/<button[^>]*>[\s\S]*?<\/button>/g, "");
        waivercontenthtml = waivercontenttemp3;
        foldernameforprint = meta.foldername;
        customer_id_for_print = this.customer_id;
        customer_sig_token_for_print = this.signature_token;
        random_number_value_for_print = meta.random;
        return waivercontent;
    }
}

