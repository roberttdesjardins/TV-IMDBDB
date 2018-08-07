// TODO: change colour of highest rated episode and lowest rated episode, format nicely, add checkbox for trendline
"use strict"
let show
let season
let seasonChosen = 1
const searchShowEl = document.querySelector("#find-show-form")
const seasonsEl = document.querySelector("#seasons-div")
const showRatingEl = document.querySelector("#show-rating-div")
let ctx = document.getElementById("myChart")
let showToFind 

searchShowEl.addEventListener("submit", (e) => {
    e.preventDefault()
    
    showToFind = e.target.elements.searchShow.value

    getShow((error, showData) => {
        if (error) {
            console.log(`Error: ${error}`)
        }  else if (showData.Response === "False") {
            document.querySelector("#show-name-div").textContent = "TV Show not found"
        } else {
            show = showData
            console.log(show)
            document.querySelector("#show-name-div").textContent = show.Title
            document.querySelector("#show-years-div").textContent = show.Year
            renderSeasonsDom()
            showRatingEl.textContent = `Overall Rating: ${show.imdbRating}`
            removeAllData(myChart)
            generateShowData(show)
        }
    })
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
            borderWidth: 2
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