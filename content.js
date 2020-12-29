//TODO: move logic to background scripts

const formatInstructorName = string => {
    return string.replace(/,/, "").replace(/ /g, "+")
}

const instructorRow = $("table[class=\\table] > tbody > tr > td")
const instructorName = formatInstructorName(instructorRow.eq(1).text())
    
chrome.runtime.sendMessage({greeting: instructorName}, function(res) {
    console.log(res.farewell)
    const rating = res.farewell

    $("table[class=\\table] > tbody > tr").append(`<td>Rating: ${rating}</td>`)
})
