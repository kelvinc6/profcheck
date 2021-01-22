//Add listener for content message
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    getRating(request.instructorName).then(res => sendResponse(res))
    return true;
  }
);

async function getRating(name) {

  const instructorName = await formatInstructorName(name)

  console.log(instructorName)

  const URL = "https://www.ratemyprofessors.com"

  const searchQueryURL = await `/search.jsp?queryBy=teacherName&schoolName=university+of+british+columbia&queryoption=HEADER&query=${instructorName}&facetSearch=true`

  const searchQueryHTML = await fetch(URL + searchQueryURL).then(res => res.text())

  //These are the results obtained from performing a search for the given professor
  //Assumes each professor has a unique name
  const listings = $(searchQueryHTML).find(".listings").children()

  //Return if there are no listings for given professor
  if (!listings.length) {
    return {
      successful: false,
      rating: null,
      link: null
    }
  }

  //Link to the professors RMP page
  const link = await $(listings).find("a").attr("href")

  //Here we fetch the actual page of the professor
  const professorQueryURL = URL + link
  const professorQueryHTML = await fetch(professorQueryURL).then(res => res.text())

  //Get the rating of a professor at this class
  const rating = $(professorQueryHTML).find("div.RatingValue__Numerator-qw8sqy-2.liyUjw").text()

  //Get number of ratings
  const numRatingsString = $(professorQueryHTML).find('a[href="#ratingsList"]').text()

  return {
    successful: true,
    rating: rating,
    numRatingsString: numRatingsString,
    link: professorQueryURL
  }
}

async function formatInstructorName(name) {
  const formattedInstructorName = name.replace("(Coordinator)", "")

  const URL = `http://localhost:3001/api/typos/${formattedInstructorName}`

  const json = await fetch(URL)
  .then(res => res.json())
  .catch(error => {
    console.log('There is no typo stored in the database')
    return name
  })
  return json.searchName ? json.searchName : name
}