// TODO: 
// Complete functionality of contact form
// Add 3rd project
// Switch to parallax design (Semi done)
// Add self-picture to jumbotron
// Test on phone
"use strict"
let show
let season
//let seasonChosen = 1
const searchShowEl = document.querySelector("#find-show-form")
const seasonsEl = document.querySelector("#seasons-div")
const showRatingEl = document.querySelector("#show-rating-div")
const trendlineEl = document.querySelector("#trendline-checkbox")
let ctx = document.getElementById("myChart")
//let showToFind 

searchShowEl.addEventListener("submit", (e) => {
    e.preventDefault()
    
    let showToFind = e.target.elements.searchShow.value

    // getShow((error, showData) => {
    //     if (error) {
    //         console.log(`Error: ${error}`)
    //     }  else if (showData.Response === "False") {
    //         document.querySelector("#show-name-div").textContent = "TV Show not found"
    //     } else {
    //         show = showData
    //         console.log(show)
    //         document.querySelector("#show-name-div").textContent = show.Title
    //         document.querySelector("#show-years-div").textContent = show.Year
    //         renderSeasonsDom()
    //         showRatingEl.textContent = `Overall Rating: ${show.imdbRating}`
    //         removeAllData(myChart)
    //         generateShowData(show)
    //     }
    // })
    getShow(showToFind).then((showData) => {
        if (showData.response === "False") {
            document.querySelector("#show-name-div").textContent = "TV Show not found"
        } else {
            show = showData
            console.log(show)
            document.querySelector("#show-name-div").textContent = show.Title
            document.querySelector("#show-years-div").textContent = show.Year
            renderSeasonsDom(showToFind)
            showRatingEl.textContent = `Overall Rating: ${show.imdbRating}`
            removeAllData(myChart)
            generateShowData(showToFind, show)
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