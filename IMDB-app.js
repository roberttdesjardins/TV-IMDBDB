// TODO: Season trend, Show trend
"use strict"
let show
let season
let seasonChosen = 1
const searchShowEl = document.querySelector("#find-show-form")
const seasonsEl = document.querySelector("#seasons-div")
let ctx = document.getElementById("myChart")
let showToFind 

searchShowEl.addEventListener("submit", (e) => {
    e.preventDefault()
    
    showToFind = e.target.elements.searchShow.value

    getShow((error, showData) => {
        if (error) {
            console.log(`Error: ${error}`)
        } else {
            show = showData
            console.log(show)
            renderSeasonsDom()
            removeAllData(myChart)
            generateShowData(show)
        }
    })
})

const renderSeasonsDom = () => {
    seasonsEl.textContent = ""
    for (let i = 0; i < show.totalSeasons; i++) {
        seasonsEl.appendChild(generateSeasonDom(i+1))
    }
}

// Get the DOM elements for each season in a show
const generateSeasonDom = (element) => {
    let seasonEl = document.createElement("div")

    let seasonCheck = document.createElement("input")
    seasonCheck.setAttribute("type", "checkbox")
    seasonCheck.addEventListener("change", (e) => {
        if (e.target.checked) {
            UnSelectAllExcept(element-1)
            seasonChosen = element
            getSeason((error, seasonData) => {
                if (error) {
                    console.log(`Error: ${error}`)
                } else {
                    season = seasonData
                    //console.log(season)
                    removeAllData(myChart)
                    generateChartData(season)
                }
            })
        } else {
            removeAllData(myChart)
            generateShowData(show)
        }
    })

    let seasonText = document.createElement("span")
    seasonText.textContent = `Season ${element}`

    seasonEl.appendChild(seasonCheck)
    seasonEl.appendChild(seasonText)
    return seasonEl
}

function generateShowData(show) {
    let seasonArr = []
    for(let i = 0; i < show.totalSeasons; i++) {
        seasonChosen = i + 1
        getSeason((error, seasonData) => {
            if (error) {
                console.log(`Error: ${error}`)
            } else {
                season = seasonData
                let avgRating = getAverageSeasonRating(season)
                seasonArr.push({
                    seasonNumber: i+1,
                    rating: avgRating
                })
            }
        })
    } 
    let timer = setInterval(generateShowGraph, 100);
    function generateShowGraph() {
        if(seasonArr.length >= show.totalSeasons) {
            clearInterval(timer);
            seasonArr.sort(function(a, b){return a.seasonNumber - b.seasonNumber})
            seasonArr.forEach((season) => {
                addData(myChart, `Season ${season.seasonNumber}`, season.rating)
            })
            return;
        }
    }
}

// Returns the average rating of all episodes in a season
function getAverageSeasonRating(season) {
    let totalRating = 0
    season.Episodes.forEach((episode) => {
        totalRating += parseInt(episode.imdbRating)
    })
    return totalRating / season.Episodes.length
}

function generateChartData(season) {
    season.Episodes.forEach(element => {
        addData(myChart, `${element.Title}`, element.imdbRating)
    })
}

// Unselects all children in seasonsEl except the checkbox which was just checked
function UnSelectAllExcept(int) {
    var items = seasonsEl.children
    for (var i = 0; i < items.length; i++) {
        if (int !== i){
            items[i].children[0].checked = false
        }
    }
}	

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
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    autoSkip:false,
                    beginAtZero:true,
                    max:10
                }
            }],
            xAxes: [{
                ticks: {
                    autoSkip:false
                }  
            }]
        }
    }
})

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function removeAllData(chart) {
    while(chart.data.labels.length) {
        removeData(chart)
    }
}