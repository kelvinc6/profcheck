// content.js
chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            var instructorRow = $("table[class=\\table] > tbody > tr > td")
            //secondColumnText refers to the number
            const instructorName = formatInstructorName(instructorRow.eq(1).text())

            const query = `https://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=university+of+british+columbia&queryoption=HEADER&query=${instructorName}&facetSearch=true`

            let RMPhtml = await fetch(query).then(res => res.text())

            const listings = $(RMPhtml).find(".listings").children()

            listings.each((i, elem) => {
                const currentInstructorName = $(elem).find(".main").text()
                console.log(currentInstructorName);
            })        
        }
    }
);

const formatInstructorName = string => {
    return string.replace(/,/ , "").replace(/ /g, "+")
}