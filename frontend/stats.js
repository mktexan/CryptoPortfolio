Vue.component('stats', {
    props: {
        positions: Object
    },

    data() {
        return { cx: 0, cy: 0 };
    },

    mounted() {
    },

    watch: {
        positions() {
            console.log(this.positions)
            console.log(this.$refs)

            //     const chart = document.getElementById("breakdown")

            //     // console.log(chart)
            //     // console.log(this.$refs)

            //     var oilData = {
            //         labels: [
            //             "Saudi Arabia",
            //             "Russia",
            //             "Iraq",
            //             "United Arab Emirates",
            //             "Canada"
            //         ],
            //         datasets: [
            //             {
            //                 data: [133.3, 86.2, 52.2, 51.2, 50.2],
            //                 backgroundColor: [
            //                     "#FF6384",
            //                     "#63FF84",
            //                     "#84FF63",
            //                     "#8463FF",
            //                     "#6384FF"
            //                 ]
            //             }]
            //     };

            //     var pieChart = new Chart(chart, {
            //         type: 'pie',
            //         data: oilData
            //     });
        }
    },

    computed: {

    },

    methods: {

    }
})