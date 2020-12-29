const formatInstructorName = string => {
    return string.replace(/,/, "").replace(/ /g, "+")
}

const messageBackground = message => {
    chrome.runtime.sendMessage({greeting: message}, res => {
        return res.farewell
    })
}

const URL = "https://www.ratemyprofessors.com"

const instructorRow = $("table[class=\\table] > tbody > tr > td")
const instructorName = formatInstructorName(instructorRow.eq(1).text())

const resultsQuery = URL + `/search.jsp?queryBy=teacherName&schoolName=university+of+british+columbia&queryoption=HEADER&query=${instructorName}&facetSearch=true`

chrome.runtime.sendMessage({greeting: resultsQuery}, function(response) {
    const html = response.farewell
    const listings = $(html).find(".listings").children()
    const link = $(listings).find("a").attr("href")

    professorQuery = URL + link

    console.log(listings)

    chrome.runtime.sendMessage({greeting: professorQuery}, function(response) {
        const test = response.farewell
        const rating = $(test).find("div.RatingValue__Numerator-qw8sqy-2.liyUjw").text()

        console.log(rating);
    })
  });
