// TODO: Season trend, Show trend, show line
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
        }
    })

    let seasonText = document.createElement("span")
    seasonText.textContent = `Season ${element}`

    seasonEl.appendChild(seasonCheck)
    seasonEl.appendChild(seasonText)
    return seasonEl
}

function generateChartData(season) {
    season.Episodes.forEach(element => {
        //console.log(element)
        addData(myChart, `${element.Title}`, element.imdbRating)
    })
}


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
    console.log(chart.data)
    while(chart.data.labels.length) {
        removeData(chart)
    }
}