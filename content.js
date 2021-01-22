//Used for storing typos
const typos = {
    'ALINIAEIFARD, FARID': "ALINIAIEFARD, FARID",
    'RUED, THOMAS': "RUD, THOMAS",
    'O\'NEILL, ANGELA': "O\'NEILL, ANGIE",
    'OTTO, SARAH': "OTTO,SALLY",
    "EVANS, WILLIAM": "EVANS, WILL"
}

const formatInstructorNames = string => {
    return string.replace("(Coordinator)", "")
}

// const instructorRow = $("table[class=\\table] > tbody > tr > td")
// let instructorName = formatInstructorNames(instructorRow.eq(1).text())

const table = $('table[class=\\table] > tbody').children()

//Set up correct HTML elements
table.each((i, elem) => {
    
    const ratingHTML = `<td style="min-width:10em" id="rating${i}"></td>`
    const numRatingsHTML = `<td style="min-width:10em" id="numRatings${i}"></td>`
    const linkHTML = `<td style="min-width:10em"><a id="link${i}" target="_blank"></a></td>`

    $(elem).append(ratingHTML + numRatingsHTML + linkHTML)
})

//Array of searched instructors
let searched = []

//Iterate through all the instructors
table.each((i, elem) => {

    const isTA = $(elem).has('td:contains("TA")').length ? true : false
    let instructorName = $(elem).find("a").text()

    if (typos.hasOwnProperty(instructorName)) {
        instructorName = typos[instructorName]
    }

    console.log(instructorName);
    //Break out of loop upon reaching a TA
    if (isTA || searched.includes(instructorName) || !instructorName) { return false }

    //Keep track of instructors iterated over
    searched.push(instructorName)

    //Loading indicator
    $(`#rating${i}`).text("Loading...")

    chrome.runtime.sendMessage({ instructorName: instructorName }, function (res) {
        const isSuccessful = res.successful
        const rating = res.rating
        const link = res.link
        const numRatingsString = res.numRatingsString

        console.log(isSuccessful)

        if (isSuccessful) {
            //Hide loading indicator
            $('.loader').hide()

            $(`#rating${i}`).text(`Rating: ${rating} / 5`)
            $(`#numRatings${i}`).text(`(${numRatingsString})`)
            $(`#link${i}`).attr("href", link).text(`RMP Page`)
        } else {
            $(`#numRatings${i}`).hide()
            $(`#link${i}`).hide()
            

            //Indicate instructor could not be found
            $(`#rating${i}`).text("Error")
        }
    })

})