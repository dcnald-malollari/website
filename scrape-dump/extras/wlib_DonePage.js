"use strict";

function isIOS() {
  return /iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
}

if(isIOS()) {
    var printButton = document.querySelector('.printbutton');
    printButton.style.display = 'none';
    var printButtonCtn = document.querySelector('.print_btn_ctn');
    printButtonCtn.style.display = 'none';
}

class DonePage {
  static render({ is_appcp, logo, company_name }) {
    window.api.notify_waiver().then(result => {
      console.log("done notifying waiver: ", result);
    });
    waivercontenthtml += `<br><b>Signature</b><br><br><img src="${window.appConfig.filesURL}/cp/upload/${foldernameforprint}/signatures/${customer_id_for_print}.svg?r=${random_number_value_for_print}&token=${customer_sig_token_for_print}">`;
    return `
        <div class="panel panel-default">
            <div class="panel-body">
                <h2 class="text-center">
                    Thank you!
                </h2>
                <p class="text-center" style="margin-bottom: 2em;">
                    Your information has been submitted.
                </p>
                <div class="text-center button_container">
                <span class="print_btn_ctn">
                    <button
                        type="button"
                        class="btn btn-primary btn-lg printbutton"
                        onclick="PrintWaiver();">
                        Print Waiver
                        <i class="fad fa-print" style="margin-right: .5rem;"></i>
                    </button>
                </span>
                <span class="new_guest_btn_ctn">
                    <button
                        type="button"
                        class="btn btn-primary btn-lg"
                        onclick="window.reset();">
                        New Guest
                        <i class="fad fa-chevron-double-right" style="margin-right: .5rem;"></i>
                    </button>
                </span>
                </div>
            </div>
        </div>
        `;
  }
}
