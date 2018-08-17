const getShow = (showToFind) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()

    request.addEventListener("readystatechange", (e) => {
        if (e.target.readyState === 4 && e.target.status === 200) {
            const data = JSON.parse(e.target.response)
            resolve(data)
        } else if (e.target.readyState === 4) {
            reject("An error has taken place when getting show data")
        }
    })

    request.open("GET", `http://www.omdbapi.com/?apikey=e9aeaf84&t=${showToFind}`) 
    request.send()
})

const getSeason = (showToFind, seasonChosen) => new Promise ((resolve, reject) => {
    const request = new XMLHttpRequest()

    request.addEventListener("readystatechange", (e) => {
        if (e.target.readyState === 4 && e.target.status === 200) {
            const data = JSON.parse(e.target.response)
            resolve(data)
        } else if (e.target.readyState === 4) {
            reject("An error has taken place when getting the season data")
        }
    })

    request.open("GET", `http://www.omdbapi.com/?apikey=e9aeaf84&t=${showToFind}&Season=${seasonChosen}`)
    request.send()  
})