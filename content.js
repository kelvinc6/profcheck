//Used for storing typos
const typos = {
    'ALINIAEIFARD+FARID': "ALINIAIEFARD+FARID",
    'RUED+THOMAS': "RUD+THOMAS",
    'O\'NEILL+ANGELA': "O\'NEILL+ANGIE",
    'OTTO+SARAH': "OTTO+SALLY"

}

const formatInstructorNames = string => {
    return string.replace("(Coordinator)", "")
}

// const instructorRow = $("table[class=\\table] > tbody > tr > td")
// let instructorName = formatInstructorNames(instructorRow.eq(1).text())

const table = $('table[class=\\table] > tbody').children()

let searched = []

//Iterate through all the instructors
table.each((i, elem) => {

    const isTA = $(elem).has('td:contains("TA")').length ? true : false
    const instructorName = $(elem).find("a").text()

    if (typos.hasOwnProperty(instructorName)) {
        instructorName = typos[instructorName]
    }

    //Break out of loop upon reaching a TA
    if (isTA || searched.includes(instructorName)) { return false }

    searched.push(instructorName)

    $(elem).append("<td class='loader'>Loading</td>")

    chrome.runtime.sendMessage({ instructorName: instructorName }, function (res) {
        const isSuccessful = res.successful
        const rating = res.rating
        const link = res.link
        const numRatingsString = res.numRatingsString

        console.log(isSuccessful)

        if (isSuccessful) {
            const ratingHTML = `<td>Rating: ${rating} / 5</td>`
            const numRatingsHTML = `<td>(${numRatingsString})</td>`
            const linkHTML = `<td><a href='${link}' target="_blank">RMP Page</a></td>`

            //TODO: change logic fetch RMP for all professors
            $(elem).append(ratingHTML + numRatingsHTML + linkHTML)

            $('.loader').hide()
        } else {
            console.log("didn' work");
            $('.loader').hide()

            $(elem).append("<td>Could not work</td>")
        }
    })

})

// $('td:contains("Instructor")').parent().append("<td class='loader'>Loading</td>")

// chrome.runtime.sendMessage({ instructorName: instructorName }, function (res) {
//     const rating = res.rating
//     const link = res.link
//     const numRatingsString = res.numRatingsString

//     const ratingHTML = `<td>Rating: ${rating} / 5</td>`
//     const numRatingsHTML = `<td>(${numRatingsString})</td>`
//     const linkHTML = `<td><a href='${link}' target="_blank">RMP Page</a></td>`

//     //TODO: change logic fetch RMP for all professors
//     $('td:contains("Instructor")').parent().append(ratingHTML + numRatingsHTML + linkHTML)

//     $('.loader').hide()
// })
