// component for creating line chart
Vue.component('linechart', {
    props: {
        width: { type: Number, default: 400, required: true },
        height: { type: Number, default: 40, required: true },
        values: { type: Array, default: [], required: true },
    },
    data() {
        return { cx: 0, cy: 0 };
    },
    computed: {
        viewBox() {
            return '0 0 ' + this.width + ' ' + this.height;
        },
        chartPoints() {
            let data = this.getPoints();
            let last = data.length ? data[data.length - 1] : { x: 0, y: 0 };
            let list = data.map(d => (d.x - 10) + ',' + d.y);
            this.cx = last.x - 5;
            this.cy = last.y;
            return list.join(' ');
        },
    },
    methods: {
        getPoints() {
            this.width = parseFloat(this.width) || 0;
            this.height = parseFloat(this.height) || 0;
            let min = this.values.reduce((min, val) => val < min ? val : min, this.values[0]);
            let max = this.values.reduce((max, val) => val > max ? val : max, this.values[0]);
            let len = this.values.length;
            let half = this.height / 2;
            let range = (max > min) ? (max - min) : this.height;
            let gap = (len > 1) ? (this.width / (len - 1)) : 1;
            let points = [];

            for (let i = 0; i < len; ++i) {
                let d = this.values[i];
                let val = 2 * ((d - min) / range - 0.5);
                let x = i * gap;
                let y = -val * half * 0.8 + half;
                points.push({ x, y });
            }
            return points;
        }
    },
    template: `
    <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
      <polyline class="color" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" :points="chartPoints" />
      <circle class="color" :cx="cx" :cy="cy" r="4" fill="#fff" stroke="none" />
    </svg>`,
})