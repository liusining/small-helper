chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let labels = [],
        data = [];

    if (request.msg === "query_page") {
        let assetEls = document.querySelectorAll("section div.row.ng-star-inserted " +
            "div.col.value span.amount.ng-star-inserted");

        for (let el of assetEls) {
            if (el.className.includes('zero')) {
                break;
            }
            data.push(parseFloat(el.innerText));
            let label = el.parentElement.parentElement.parentElement.
            previousElementSibling.lastElementChild.firstChild.textContent.trim();
            labels.push(label);
        }
    }

    sendResponse({
        labels: labels,
        data: data
    });
})
