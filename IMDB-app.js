// TODO: Season trend, Show trend, change colour of highest rated episode and lowest rated episode
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
        } else {
            show = showData
            console.log(show)
            document.querySelector("#show-name-div").textContent = show.Title
            renderSeasonsDom()
            showRatingEl.textContent = `Overall Rating: ${show.imdbRating}`
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
                    removeAllData(myChart)
                    generateChartData(season)
                    generateSeasonTrendLine(season) // TODO: Move to season trendline checkbox event listener
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

// Displays the chart for overall season ratings for each season
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
    let timer = setInterval(generateShowGraph, 100)
    function generateShowGraph() {
        if(seasonArr.length >= show.totalSeasons) {
            clearInterval(timer)
            seasonArr.sort(function(a, b){return a.seasonNumber - b.seasonNumber})
            seasonArr.forEach((season) => {
                addData(myChart, `Season ${season.seasonNumber}`, season.rating, 0)
            })
            generateShowTrendLine(seasonArr)
            return
        }
    }
}

function generateShowTrendLine(listOfSeasons) {
    let trendLineData = getTrendLineDataPoints(listOfSeasons)
    for (let i = 0; i < trendLineData.numberOfPoints; i++) {
        let y = trendLineData.offset + (trendLineData.slope * (i + 1))
        addData(myChart, "", y, 1)
    }
}

// creates the trendline data based on list of objects' ratings
function getTrendLineDataPoints(dataArr) {
    let sumXY = 0
    let sumX = 0
    let sumXsqr = 0
    let sumY = 0
    for (let i = 0; i < dataArr.length; i++) {
        if (isNaN(dataArr[i].rating)) {
            dataArr.splice(i, 1)
        } else {
            sumXY += (dataArr[i].rating * (i + 1))
            sumX += (i + 1)
            sumY += dataArr[i].rating
            sumXsqr += ((i + 1) * (i + 1))
        }
    }
    let slope = (dataArr.length * sumXY - sumX * sumY) / (dataArr.length * sumXsqr - sumX * sumX)
    let offset = (sumY - slope * sumX) / dataArr.length
    console.log(`slope: ${slope}`)
    console.log(`offset: ${offset}`)
    return {
        numberOfPoints: dataArr.length,
        slope: slope,
        offset: offset
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

// Adds individual episode data to the chart
function generateChartData(season) {
    season.Episodes.forEach(element => {
        addData(myChart, `${element.Title}`, element.imdbRating, 0)
    })
}

function generateSeasonTrendLine(season) {
    let episodeArr = []
    season.Episodes.forEach((episode) => {
        episodeArr.push({
            rating: parseInt(episode.imdbRating)
        })
    })
    let trendLineData = getTrendLineDataPoints(episodeArr)
    for (let i = 0; i < trendLineData.numberOfPoints; i++) {
        let y = trendLineData.offset + (trendLineData.slope * (i + 1))
        addData(myChart, "", y, 1)
    }
}

// Unselects all children in seasonsEl except the checkbox which was just checked
function UnSelectAllExcept(int) {
    let items = seasonsEl.children
    for (let i = 0; i < items.length; i++) {
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
        }, {
            label: 'Trendline',
            data: [],
            fill: false,
            borderColor: "red",
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
        },
        animation: {
            easing: "linear",
            duration: 0
        }
    }
})

function addData(chart, label, data, dataset) {
    if (label !== ""){
        chart.data.labels.push(label);
    }
    chart.data.datasets[dataset].data.push(data)
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