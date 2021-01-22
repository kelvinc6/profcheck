const typos = {
    'BROWN, LINDSAY': 'ROGERS, LINDSAY',
    'O\'NEILL, ANGELA': 'O\'NEILL, ANGIE'
}

//The table with class "table" has instrucors and TA names
const table = $('table[class=\\table] > tbody').children()

//Set up correct HTML elements to fill in
table.each((i, elem) => {
    const ratingElement = `<td style="min-width:10em" id="rating${i}"></td>`
    const numRatingsElement = `<td style="min-width:10em" id="numRatings${i}"></td>`
    const linkElement = `<td style="min-width:10em"><a href="#" id="link${i}" target="_blank"></a></td>`

    $(elem).append(ratingElement + numRatingsElement + linkElement)
})

//Array of searched instructors
let searched = []

//Iterate through all the instructors
table.each((i, elem) => {
    const isTA = $(elem).has('td:contains("TA:")').length ? true : false
    let instructorName = $(elem).find("a").text().replace("(Coordinator)", "")

    //Break out of loop upon reaching a TA, as instructors are listed first
    if (isTA) {
        return false
    }

    //Continue if instructor has been seen before, or if no name present
    if (searched.includes(instructorName) || !instructorName) {
        return
    } else {
        //Keep track of instructors iterated over
        searched.push(instructorName)
    }

    //Loading indicator
    $(`#rating${i}`).text("Loading...")

    //Typo check
    if (typos.hasOwnProperty(instructorName)) {
        instructorName = typos[instructorName]
    }

    chrome.runtime.sendMessage({isUBCO: isUBCO(), instructorName: instructorName }, function (result) {
        const isSuccessful = result.isSuccessful
        const rating = result.averageRatingScore
        const link = result.link
        const numRatings = result.numRatings

        if (isSuccessful) {
            //Hide loading indicator
            $('.loader').hide()

            $(`#rating${i}`).text(rating ? `Rating: ${rating} / 5` : 'N/A')
            $(`#numRatings${i}`).text(`(${numRatings} ratings)`)
            $(`#link${i}`).text(`RMP Page`).attr("href", link)
        } else {
            //Indicate instructor could not be found
            $(`#rating${i}`).text("No RMP Page Found")
            $(`#link${i}`).text('Add Listing').attr('href', 'https://www.ratemyprofessors.com/AddTeacher.jsp')
        }
    })

})

function isUBCO() {
    return $('.ubc7-campus').attr('id') === 'ubc7-okanagan-campus'
}