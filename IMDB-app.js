// TODO: 
// Complete functionality of contact form
// Add 3rd project
// Switch to parallax design (Semi done)
// Add self-picture to jumbotron
// Test on phone
"use strict"
const searchShowEl = document.querySelector("#find-show-form")
const seasonsEl = document.querySelector("#seasons-div")
const showRatingEl = document.querySelector("#show-rating-div")
const trendlineEl = document.querySelector("#trendline-checkbox")
let ctx = document.getElementById("myChart")

searchShowEl.addEventListener("submit", (e) => {
    e.preventDefault()
    
    let showToFind = e.target.elements.searchShow.value
    getShow(showToFind).then((showData) => {
        if (showData.response === "False") {
            document.querySelector("#show-name-div").textContent = "TV Show not found"
        } else {
            console.log(showData)
            document.querySelector("#show-name-div").textContent = showData.Title
            document.querySelector("#show-years-div").textContent = showData.Year
            renderSeasonsDom(showToFind, showData)
            showRatingEl.textContent = `Overall Rating: ${showData.imdbRating}`
            removeAllData(myChart)
            generateShowData(showToFind, showData)
        }
    }).catch((error) => {
        csonole.log(`Error: ${error}`)
    })
})

trendlineEl.addEventListener("change", (e) => {
    myChart.data.datasets[1].hidden = !myChart.data.datasets[1].hidden
    myChart.options.legend.display = !myChart.options.legend.display
    myChart.update()
})


let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'IMDB Rating',
            data: [],
            fill: false,
            borderColor: "#3e95cd",
            borderWidth: 2
        }, {
            label: 'Trendline',
            pointRadius: 0,
            pointHoverRadius: 0,
            data: [],
            fill: false,
            borderColor: "red",
            borderWidth: 2,
            hidden: true
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    autoSkip:false,
                    beginAtZero:false,
                    max:10,
                    suggestedMin: 7
                }
            }],
            xAxes: [{
                ticks: {
                    autoSkip:false
                }  
            }]
        },
        animation: {
            easing: "linear",
            duration: 0
        },
        legend: {
            display: false
        }
    }
})

$(document).ready(function () {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});