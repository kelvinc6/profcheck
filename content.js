//Used for storing typos
const typos = {
    'ALINIAEIFARD+FARID': "ALINIAIEFARD+FARID",
    'RUED+THOMAS': "RUD+THOMAS"
}

const formatInstructorNames = string => {
    return string.replace(/,/, "").replace(/ /g, "+")
}

const instructorRow = $("table[class=\\table] > tbody > tr > td")
let instructorName = formatInstructorNames(instructorRow.eq(1).text())

//Check if SSC has a typo
if (typos.hasOwnProperty(instructorName)) {
    instructorName = typos[instructorName]
}

$('td:contains("Instructor")').parent().append("<td class='loader'>Loading</td>")

chrome.runtime.sendMessage({ instructorName: instructorName }, function (res) {
    const rating = res.rating
    const link = res.link

    const ratingHTML = `<td>Rating: ${rating} / 5</td>`
    const linkHTML = `<td><a href='${link}'>RMP Page</a></td>`

    //TODO: change logic fetch RMP for all professors
    $('td:contains("Instructor")').parent().append(ratingHTML + linkHTML)

    $('.loader').hide()
})
