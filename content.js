// const instructorRow = $("table[class=\\table] > tbody > tr > td")
// let instructorName = formatInstructorNames(instructorRow.eq(1).text())

//The table with class "table" has instrucors and TA names
const table = $('table[class=\\table] > tbody').children()

//Set up correct HTML elements to fill in
table.each((i, elem) => {
    const ratingElement = `<td style="min-width:10em" id="rating${i}"></td>`
    const numRatingsElement = `<td style="min-width:10em" id="numRatings${i}"></td>`
    const linkElement = `<td style="min-width:10em"><a id="link${i}" target="_blank"></a></td>`

    $(elem).append(ratingElement + numRatingsElement + linkElement)
})

//Array of searched instructors
let searched = []

//Iterate through all the instructors
table.each((i, elem) => {
    const isTA = $(elem).has('td:contains("TA")').length ? true : false
    let instructorName = $(elem).find("a").text().replace("(Coordinator)", "")

    //Break out of loop upon reaching a TA, as instructors are listed first
    if (isTA) {
        return false
    }

    //Continue if instructor has been seen before, or if no name present
    if (searched.includes(instructorName) || !instructorName) {
        return
    }

    //Keep track of instructors iterated over
    searched.push(instructorName)

    //Loading indicator
    $(`#rating${i}`).text("Loading...")

    chrome.runtime.sendMessage({ instructorName: instructorName }, function (result) {
        const isSuccessful = result.isSuccessful
        const rating = result.averageRatingScore
        const link = result.link
        const numRatings= result.numRatings

        if (isSuccessful) {
            //Hide loading indicator
            $('.loader').hide()

            $(`#rating${i}`).text(rating ? `Rating: ${rating} / 5` : 'N/A')
            $(`#numRatings${i}`).text(`(${numRatings} ratings)`)
            $(`#link${i}`).attr("href", link).text(`RMP Page`)
        } else {
            //Indicate instructor could not be found
            $(`#rating${i}`).text("No RMP Page")
        }
    })

})

  