"use strict";

let appState;
var waivercontenthtml = "";
var customercontenthtml = "";
var foldernameforprint = "";
var customer_id_for_print = "";
var customer_sig_token_for_print = "";
var random_number_value_for_print = "";
var mywindowforprint;

function main() {
    reset();
    //add_refresh_btn();
}

function refresh() {
    window.location = window.location;
}

function prevPage() {
    appState.router.prev();
    render();
}

function nextPage() {
    appState.router.next();
    if (appState.meta.is_appcp && appState.router.isLastPage()) {
        setTimeout(reset, 5000);
    }
}

function reset() {
    appState = AppState.fromV1Data(window.data);
    render();
}

function render() {
    document.getElementById("ws_approot").innerHTML = parse_basic_js_template(appState.render(), []);
}

window.addEventListener("load", main);

function add_refresh_btn() {
    const btn = document.createElement("button");
    btn.setAttribute('class', 'btn btn-default');
    btn.innerHTML = "<i class='fa fa-refresh'></i>";
    btn.style.position = "fixed";
    btn.style.left = 0;
    btn.style.top = 0;
    btn.onclick = refresh;
    document.body.appendChild(btn);
}

function PrintWaiver()
{
    mywindowforprint = window.open('', 'PRINT', 'height=600,width=800');
    mywindowforprint.document.write('<style> .button {background-color: green; border: none;color: white;border-radius: 4px;padding: 0.7em 1.2em;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;} @media print {.button {display: none;}} </style>');
    mywindowforprint.document.write('<button class="button" onclick="Print()">Print</button>');
    mywindowforprint.document.write('<html><head><title>' + document.title  + '</title>');
    mywindowforprint.document.write('</head><body >');
    mywindowforprint.document.write('<br><h3>' + 'Waiver of Liability - ' + document.title + '</h3>');
    mywindowforprint.document.write(customercontenthtml);
    mywindowforprint.document.write(waivercontenthtml);
    mywindowforprint.document.write('</body></html>');
    mywindowforprint.document.write('<script>function Print() {print(); close();}</script>');
    mywindowforprint.document.close(); // necessary for IE >= 10
    mywindowforprint.focus();
    return true;
}