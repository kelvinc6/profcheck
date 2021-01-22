//Add listener for content message
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    getRating(request.instructorName).then(res => sendResponse(res))
    return true;
  }
);

async function getRating(instructorName) {

  //Searching with an empty string results in random results of professors
  if (instructorName == "") {
    return {
      successful: false,
      rating: null,
      link: null
    }
  }

  const URL = "https://www.ratemyprofessors.com"

  const searchQueryURL = `/search.jsp?queryBy=teacherName&schoolName=university+of+british+columbia&queryoption=HEADER&query=${instructorName}&facetSearch=true`
  const searchQueryHTML = await fetch(URL + searchQueryURL).then(res => res.text())

  //These are the results obtained from performing a search for the given professor
  //Assumes each professor has a unique name
  const listings = $(searchQueryHTML).find(".listings").children()

  //Link to the professors RMP page
  const link = await $(listings).find("a").attr("href")

  //Here we fetch the actual page of the professor
  const professorQueryURL = URL + link
  const professorQueryHTML = await fetch(professorQueryURL).then(res => res.text())

  //Get the rating of a professor at this class
  const rating = $(professorQueryHTML).find("div.RatingValue__Numerator-qw8sqy-2.liyUjw").text()

  return {
    successful: true,
    rating: rating,
    link: professorQueryURL
  }
}