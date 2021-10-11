window.odometerOptions = {
    auto: false, // Don't automatically initialize everything with class 'odometer'
}


// vue instance
new Vue({
    // mount point
    el: '#app',

    // app data
    data: {
        endpoint: 'wss://stream.binance.com:9443/ws/!ticker@arr',
        iconbase: 'https://raw.githubusercontent.com/rainner/binance-watch/master/public/images/icons/',
        cache: {},             // coins data cache
        coins: [],             // live coin list from api
        asset: 'USDT',          // filter by base asset pair
        search: '',             // filter by search string
        sort: 'assetVolume',  // sort by param
        order: 'desc',         // sort order ( asc, desc )
        limit: 50,             // limit list
        status: 0,              // socket status ( 0: closed, 1: open, 2: active, -1: error )
        sock: null,           // socket inst
        cx: 0,
        cy: 0,
        positions: [],
        showAddPosition: false,
        newSymbol: '',
        newPosition: 0,
        newAvgCost: 0,
        portfolioValue: 0,
        showSignUpSignIn: false,
        hasPositions: false,
        target1: 5,
        target2: 10,
        target3: 30
    },

    // computed methods
    computed: {

        // process coins list
        coinsList() {
            let list = this.coins.slice()
            let search = this.search.replace(/[^\s\w\-\.]+/g, '').replace(/[\r\s\t\n]+/g, ' ').trim()

            if (this.asset) {
                list = list.filter(i => i.asset === this.asset)
            }
            if (search && search.length > 1) {
                let reg = new RegExp('^(' + search + ')', 'i')
                list = list.filter(i => reg.test(i.token))
            }
            if (this.sort) {
                list = this.sortList(list, this.sort, this.order)
            }
            if (this.limit) {
                list = list.slice(0, this.limit)
            }

            return list
        },

        // show socket connection loader
        loaderVisible() {
            return (this.status === 2) ? false : true;
        },

        // sort-by label for buttons, etc
        sortLabel() {
            switch (this.sort) {
                case 'token': return 'Token';
                case 'percent': return 'Percent';
                case 'close': return 'Price';
                case 'change': return 'Change';
                case 'assetVolume': return 'Volume';
                case 'tokenVolume': return 'Volume';
                case 'trades': return 'Trades';
                default: return 'Default';
            }
        },
    },

    // custom methods
    methods: {

        // apply sorting and toggle order
        sortBy(key, order) {
            if (this.sort !== key) { this.order = order || 'asc'; }
            else { this.order = (this.order === 'asc') ? 'desc' : 'asc'; }
            this.sort = key;
        },

        // filter by asset
        filterAsset(asset) {
            this.asset = String(asset || 'BTC');
        },

        // set list limit
        setLimit(limit) {
            this.limit = parseInt(limit) || 0;
        },

        // on socket connected
        onSockOpen(e) {
            this.status = 1; // open
            console.info('WebSocketInfo:', 'Connection open (' + this.endpoint + ').');
        },

        // on socket closed
        onSockClose(e) {
            this.status = 0; // closed
            console.info('WebSocketInfo:', 'Connection closed (' + this.endpoint + ').');
            setTimeout(this.sockInit, 10000); // try again
        },

        // on socket error
        onSockError(err) {
            this.status = -1; // error
            console.error('WebSocketError:', err.message || err);
            setTimeout(this.sockInit, 10000); // try again
        },

        // process data from socket
        onSockData(e) {
            let list = JSON.parse(e.data) || []

            const data = _.map(this.positions, data => {
                const symbol = `${data.ticker.toUpperCase()}USDT`
                let item = _.find(list, d => d.s === symbol)

                item ? item.name = data.ticker.toUpperCase() : ''

                return item
            })


            for (let item of data) {
                // cleanup data for each coin
                let c = this.getCoinData(item)
                // keep to up 100 previous close prices in history for each coin
                c.history = this.cache.hasOwnProperty(c.symbol) ? this.cache[c.symbol].history : this.fakeHistory(c.close)

                if (c.history.length > 100) c.history = c.history.slice(c.history.length - 100)
                c.history.push(c.close)

                // add coin data to cache
                this.cache[c.symbol] = c
            }
            // convert cache object to final prices list for each symbol
            this.coins = Object.keys(this.cache).map(s => this.cache[s])
            this.status = 2 // active

            let counter = 0

            _.forEach(this.coins.slice(), x => {
                const total = x.count * x.close
                counter += total
            })

            // this.portfolioValue = this.formatMoney(counter.toFixed(2))
            $('.odometer').html(counter.toFixed(0))
        },

        // start socket connection
        sockInit() {
            if (this.status > 0) return;
            try {
                this.status = 0; // closed
                this.sock = new WebSocket(this.endpoint)
                this.sock.addEventListener('open', this.onSockOpen)
                this.sock.addEventListener('close', this.onSockClose)
                this.sock.addEventListener('error', this.onSockError)
                this.sock.addEventListener('message', this.onSockData)
            }
            catch (err) {
                console.error('WebSocketError:', err.message || err)
                this.status = -1 // error
                this.sock = null
            }
        },

        // start socket connection
        sockClose() {
            if (this.sock) {
                this.sock.close();
            }
        },

        // come up with some fake history prices to fill in the initial line chart
        fakeHistory(close) {
            let num = close * 0.0001; // faction of current price
            let min = -Math.abs(num);
            let max = Math.abs(num);
            let out = [];

            for (let i = 0; i < 50; ++i) {
                let rand = Math.random() * (max - min) + min;
                out.push(close + rand);
            }
            return out;
        },

        // finalize data for each coin from socket
        getCoinData(item) {
            const reg = /^([A-Z]+)(BTC|ETH|BNB|USDT|TUSD)$/;
            const symbol = String(item.s).replace(/[^\w\-]+/g, '').toUpperCase();
            const token = symbol.replace(reg, '$1');
            const asset = symbol.replace(reg, '$2');
            const name = token;
            const pair = token + '/' + asset;
            let icon = this.iconbase + token.toLowerCase() + '_.png';
            const open = parseFloat(item.o);
            const high = parseFloat(item.h);
            const low = parseFloat(item.l);
            const close = parseFloat(item.c);
            const change = parseFloat(item.p);
            const percent = parseFloat(item.P);
            const trades = parseInt(item.n);
            const tokenVolume = Math.round(item.v);
            const assetVolume = Math.round(item.q);
            const sign = (percent >= 0) ? '+' : '';
            const arrow = (percent >= 0) ? '▲' : '▼';
            const info = [pair, close.toFixed(8), '(', arrow, sign + percent.toFixed(2) + '%', '|', sign + change.toFixed(8), ')'].join(' ');
            let style = '';

            if (token.toLowerCase() === 'hbar') icon = './hbar.png'

            const avgCost = _.find(this.positions, x => x.ticker.toLowerCase() === item.name.toLowerCase()) ? _.find(this.positions, x => x.ticker.toLowerCase() === item.name.toLowerCase()).averageCost : 0
            const count = _.find(this.positions, x => x.ticker.toLowerCase() === item.name.toLowerCase()) ? _.find(this.positions, x => x.ticker.toLowerCase() === item.name.toLowerCase()).count : 0
            const targets = _.find(this.positions, x => x.ticker.toLowerCase() === item.name.toLowerCase()) ? _.find(this.positions, x => x.ticker.toLowerCase() === item.name.toLowerCase()).targets.sort((a, b) => a - b) : []

            if (percent > 0) style = 'gain'
            if (percent < 0) style = 'loss'

            return { symbol, token, asset, name, pair, icon, open, high, low, close, change, percent, trades, tokenVolume, assetVolume, sign, arrow, style, info, avgCost, count, targets };
        },

        // sort an array by key and order
        sortList(list, key, order) {
            return list.sort((a, b) => {
                let _a = a[key];
                let _b = b[key];

                if (_a && _b) {
                    _a = (typeof _a === 'string') ? _a.toUpperCase() : _a;
                    _b = (typeof _b === 'string') ? _b.toUpperCase() : _b;

                    if (order === 'asc') {
                        if (_a < _b) return -1;
                        if (_a > _b) return 1;
                    }
                    if (order === 'desc') {
                        if (_a > _b) return -1;
                        if (_a < _b) return 1;
                    }
                }
                return 0;
            });
        },

        getPositions() {
            fetch('/account/getPositions')
                .then(response => response.json())
                .then(data => this.handlePositions(data))
                .catch(err => this.handleNotfound(err))
        },

        handleNotfound(err) {
            this.status = 2
        },

        handlePositions(data) {
            this.status = 0

            if (data.positions === null) {
                this.showAddPosition = true
                this.status = 2

                return
            }

            if (data.length === 0) {
                this.status = 2
                return this.showAddPosition = true
            }
            else this.showAddPosition = false

            this.positions = data

            this.hasPositions = true

            this.sockInit()
        },

        addPosition() {
            fetch('/account/addPosition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    count: this.newPosition,
                    ticker: this.newSymbol,
                    avgCost: this.newAvgCost
                }),
            })
                .then((res) => {
                    if (res.status !== 200) return

                    this.refresh()
                })
        },

        authCheck() {
            fetch('/user/authCheck', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', credentials: 'include' }
            })
                .then((res) => {
                    if (res.status === 401) {
                        this.showSignUpSignIn = true
                        this.status = 2
                    }

                    else this.getPositions()
                })
        },

        deletePosition(ticker) {
            Swal.fire({
                title: 'Delete Position?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch('/account/deletePosition', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json', credentials: 'include' },
                        body: JSON.stringify({
                            ticker: ticker.toLowerCase(),
                        }),
                    })
                        .then((res) => {
                            if (res.status === 401) {
                                this.showSignUpSignIn = true
                                this.status = 2
                            }

                            else {
                                location.href = '/'
                            }
                        })
                }
            })
        },

        login() {
            return location.href = '/auth/google'
        },

        signOut() {
            location.href = '/auth/signout'
        },

        removePosition() {

        },

        formatMoney(n) {
            return "$" + (Math.round(n * 100) / 100).toLocaleString()
        },

        formatNumber(n) {
            return (Math.round(n * 100) / 100).toLocaleString()
        },

        convertToSum(count, close) {
            return `${(count * close).toFixed(4)}`
        },

        gainLossTotal(count, avgCost, close) {
            if (avgCost === 0) return 0
            const currentPrice = count * close
            const cost = count * avgCost

            return currentPrice - cost
        },

        targetPrice(count, target) {
            return count * target
        },

        isGain(count, avgCost, close) {
            if (avgCost === 0) return true
            const currentPrice = count * close
            const cost = count * avgCost

            return Math.sign(currentPrice - cost) === 1 ? true : false
        },

        setSignUpButtons() {
            const signUpButton = document.getElementById('signUp')
            const signInButton = document.getElementById('signIn')
            const container = document.getElementById('container')

            signUpButton.addEventListener('click', () => {
                container.classList.add("right-panel-active")
            })

            signInButton.addEventListener('click', () => {
                container.classList.remove("right-panel-active")
            })
        },

        closeAddPosition() {
            this.showAddPosition = false
        },

        addTarget(ticker) {
            Swal.fire({
                title: 'Set target',
                input: 'number',
                showCancelButton: true,
                confirmButtonText: 'Set Target',
                showLoaderOnConfirm: true,
                preConfirm: (target) => {
                    return fetch('/account/setPriceTarget', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', credentials: 'include' },
                        body: JSON.stringify({
                            ticker: ticker.toLowerCase(),
                            target: target
                        }),
                    })
                        .then(response => {
                            if (!response.ok) throw new Error(response.statusText)
                            return
                        })
                        .catch(error => {
                            Swal.showValidationMessage(`Request failed: ${error}`)
                        })
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Target set!'
                    })

                    this.refresh()
                }
            })
        },

        removeTarget(ticker, target) {
            console.log(ticker, target)
            Swal.fire({
                title: 'Remove Target?',
                text: `The $${target} target will be removed.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, remove it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch('/account/removePriceTarget', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json', credentials: 'include' },
                        body: JSON.stringify({
                            ticker: ticker.toLowerCase(),
                            target: target
                        }),
                    })
                        .then((res) => {
                            if (res.status === 404) return

                            this.refresh()
                        })
                }
            })
        },

        refresh() {
            fetch('/account/getPositions')
                .then(response => response.json())
                .then(data => this.positions = data)
                .catch(err => this.handleNotfound(err))
        }
    },

    // app mounted
    mounted() {
        this.setSignUpButtons()
        this.authCheck()
    },

    // app destroyed
    destroyed() {
        this.sockClose()
    }
});