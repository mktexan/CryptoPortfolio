// common number filters
Vue.filter('toFixed', (num, asset) => {
    if (typeof asset === 'number') return Number(num).toFixed(asset);
    return Number(num).toFixed((asset === 'USDT') ? 3 : 8);
})

Vue.filter('toMoney', num => {
    return Number(num).toFixed(0).replace(/./g, (c, i, a) => {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    })
})