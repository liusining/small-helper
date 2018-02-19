const DEFAULT_COLORS = ["#c1416a", "#cece12", "#65d897", "#9658e8", "#f995f4",
    "#9f8ff7", "#f49f90", "#fff1b7", "#d7e827", "#c18bf9", "#f93ec7", "#d648be",
    "#ce0624", "#ddc040", "#7cd65e", "#dab8f2", "#ed027f", "#ff604f", "#ff8c77",
    "#d8b217", "#4ad662", "#3b1399", "#e9a6f4", "#5f7c08", "#ea7594", "#f4da7c",
    "#9cfcaf", "#8538c9", "#fc14f4", "#ed601a"
];

let dataPromise = new Promise(function (resolve, reject) {
    chrome.tabs.query({
        url: 'https://big.one/accounts'
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            msg: "query_page"
        }, function (resp) {
            if (resp) {
                resolve([resp.labels, resp.data]);
            } else {
                reject('BigONE Account Page Not Found');
            }
        });
    });
});

dataPromise.then(function ([labels, data]) {

    let sum = data.reduce((accum, current) => accum + current);

    for (let i = 0; i < labels.length; i++) {
      labels[i] += ` ${(data[i] / sum * 100).toFixed(1)}%`
    }

    let colors = [];

    for (let colorsLeft = data.length; colorsLeft > 0; colorsLeft -= DEFAULT_COLORS.length) {
        colors = colors.concat(DEFAULT_COLORS.slice(0, colorsLeft));
    }

    let ctx = document.getElementById('canvas').getContext("2d");
    let myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Assets',
                data: data,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}, function (reason) {});
