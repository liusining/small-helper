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
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                msg: "query_page"
            }, function (resp) {
                if (resp) {
                    resolve([resp.labels, resp.data]);
                } else {
                    reject('require_reload');
                }
            });
        } else {
            reject('no_bigone_account');
        }

    });
});

dataPromise.then(function ([labels, data]) { // resolve results go here

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
}, function (reason) { // reject result jump to here
    let body = document.querySelector('body'),
        div = document.createElement('div'),
        header = document.createElement('h3'),
        note = document.createElement('div'),
        ctx = document.getElementById('canvas');
    div.setAttribute("style", "width: 300px; height: 200px;");
    body.insertBefore(div, ctx);
    body.removeChild(ctx);
    div.insertBefore(header, null);
    div.insertBefore(note, null);

    if (reason === 'no_bigone_account') {
        header.innerHTML = `Open a BigONE account<br><small class="chinese">请打开币一账户</small>`;
        note.innerHTML = `<p>BigONE account page not found. Please open one.</p>
          <p class="chinese">没有找到币一账户的网页，请打开一个。</p>`;
    } else if (reason === 'require_reload') {
        header.innerHTML = `Refresh BigONE account<br><small class="chinese">请刷新币一账户</small>`;
        note.innerHTML = `<p>This extension lost connection to BigONE account. Please refresh the BigONE.</p>
          <p class="chinese">插件无法连接到币一网页了，请刷新。</p>`;
    } else {
        header.innerHTML = `Error<br><small class="chinese">有错误</small>`;
        note.innerHTML = `<p>${reason}</p>
          <p class="report">You can report this error
          <a href="https://github.com/liusining/small-helper/issues" id="github">on github</a>.</p>`;
        document.getElementById('github').onclick = function (e) {
            window.open(this.href);
            e.preventDefault();
        };
    }
});
