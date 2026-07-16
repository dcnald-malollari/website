"use strict";

class StartPage {
  static render({ company_name, logo }) {
    return `
            <div class="panel panel-default">
                <div class="panel-body">
                    <img
                        src="${logo}"
                        class="img-responsive"
                        style="max-height: 150px;"
                    >
                    <h2 class="text-center">
                        Welcome to ${company_name}!
                    </h2>
                    <p class="text-center" style="margin-bottom: 2em;">
                        Press start to continue.
                    </p>
                    <div class="text-center">
                        <button
                            type="button"
                            class="btn btn-primary btn-lg"
                            onclick="nextPage(); render()"
                        >
                            Start
                            <i class="fad fa-chevron-double-right" style="margin-left: .5rem;"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
  }
}
