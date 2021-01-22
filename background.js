//Add listener for chrome message
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    const firstName = getAndFormatFirstName(request.instructorName)
    const lastName = getAndFormatLastName(request.instructorName);

    getInfo(firstName, lastName).then(res => sendResponse(res))
    return true;
  }
);

async function getInfo(firstName, lastName) {
  const queryURL = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?wt=json&q=schoolid_s%3A1413+AND
+(teacherlastname_t:${lastName}+AND+teacherfirstname_t:${firstName})&sort=teacherlastname_t+asc&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+rating_class`

  const backupQueryURL = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?wt=json&q=schoolid_s%3A1413+AND
  +((teacherlastname_t:${lastName}+AND+teacherfirstname_t:${firstName}~)+OR+(teacherlastname_t:${lastName}~+AND+teacherfirstname_t:${firstName}))&sort=teacherlastname_t+asc&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+rating_class`

  let json = await fetch(queryURL).then(res => res.json())

  if (json.response.numFound == 1) {
    const professorData = json.response.docs[0]
    const link = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorData.pk_id}`
    return {
      isSuccessful: true,
      averageRatingScore: professorData.averageratingscore_rf,
      numRatings: professorData.total_number_of_ratings_i,
      link: link
    }
  } else {
    json = await fetch(backupQueryURL).then(res => res.json())

    console.log(json)

    if (json.response.numFound == 1) {
      const professorData = json.response.docs[0]
      const link = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorData.pk_id}`
      return {
        isSuccessful: true,
        averageRatingScore: professorData.averageratingscore_rf,
        numRatings: professorData.total_number_of_ratings_i,
        link: link
      }
    } else {
      return {
        isSuccessful: false,
        averageRatingScore: null,
        numRatings: null,
        link: null
      }
    }
  }
}

function getAndFormatFirstName(instructorName) {
  const nameArray = instructorName.split(', ')
  const firstNameLowerCase = nameArray[1].split(' ')[0].toLowerCase()
  return firstNameLowerCase.charAt(0).toUpperCase() + firstNameLowerCase.slice(1)
}

function getAndFormatLastName(instructorName) {
  const nameArray = instructorName.split(', ')
  const lastNameLowerCase = nameArray[0].split(' ')[1] ? nameArray[0].split(' ')[1].toLowerCase() : nameArray[0].split(' ')[0].toLowerCase()
  return lastNameLowerCase.charAt(0).toUpperCase() + lastNameLowerCase.slice(1)
}



