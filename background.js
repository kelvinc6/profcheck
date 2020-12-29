chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    getRating(request.greeting).then(res => sendResponse({farewell: res}))
    return true;
  }
);

async function getRating(instructorName) {
  const URL = "https://www.ratemyprofessors.com"
  const searchQueryURL = `/search.jsp?queryBy=teacherName&schoolName=university+of+british+columbia&queryoption=HEADER&query=${instructorName}&facetSearch=true`

  const searchQueryHTML = await fetch(URL + searchQueryURL).then(res => res.text())

  const listings = $(searchQueryHTML).find(".listings").children()
  const link = await $(listings).find("a").attr("href")

  const professorQueryURL = URL + link

  const professorQueryHTML = await fetch(professorQueryURL).then(res => res.text())

  const rating = $(professorQueryHTML).find("div.RatingValue__Numerator-qw8sqy-2.liyUjw").text()

  return rating

}