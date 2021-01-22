//Add listener for chrome message
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    getInfo(request.instructorName).then(res => sendResponse(res))
    return true;
  }
);

async function getInfo(instructorName) {
  const queryURL = queryConstructor(instructorName)
  const fuzzyQueryURL = fuzzyQueryConstructor(instructorName)

  console.log(queryURL);

  let json = await fetch(queryURL).then(res => res.json())

  //Possible duplicate entries in database
  if (json.response.numFound != 0) {
    const professorData = json.response.docs[0]
    const link = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorData.pk_id}`
    return {
      isSuccessful: true,
      averageRatingScore: professorData.averageratingscore_rf,
      numRatings: professorData.total_number_of_ratings_i,
      link: link
    }
  } else {
      const professorData = json.response.docs[0]
      const link = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorData.pk_id}`
      return {
        averageRatingScore: professorData.averageratingscore_rf,
        numRatings: professorData.total_number_of_ratings_i,
        link: link
      }
    }
  }

return {
  isSuccessful: false,
  averageRatingScore: null,
  numRatings: null,
  link: null
}


function getAndFormatFirstNameArray(instructorName) {
  const nameArray = instructorName.split(', ')
  const firstNameArray = nameArray[1].split(' ')
  for (i = 0; i < firstNameArray.length; i++) {
    // lastNameArray[i] = lastNameArray[i].toLowerCase().charAt(0).toUpperCase() + lastNameArray[i].slice(1)
    firstNameArray[i] = firstNameArray[i].charAt(0) + firstNameArray[i].toLowerCase().slice(1)
  }
  return firstNameArray
}

function getAndFormatLastNameArray(instructorName) {
  const nameArray = instructorName.split(', ')
  const lastNameArray = nameArray[0].split(' ')
  for (i = 0; i < lastNameArray.length; i++) {
    // lastNameArray[i] = lastNameArray[i].toLowerCase().charAt(0).toUpperCase() + lastNameArray[i].slice(1)
    lastNameArray[i] = lastNameArray[i].charAt(0) + lastNameArray[i].toLowerCase().slice(1)
  }
  return lastNameArray
}

function queryConstructor(instructorName) {
  
  const firstNameArray = getAndFormatFirstNameArray(instructorName)
  const lastNameArray = getAndFormatLastNameArray(instructorName)
  let queryBegin = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?wt=json&q=schoolid_s%3A1413+AND+(`
  const queryEnd = `)&sort=teacherlastname_t+asc&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+rating_class`

  for (i = 0; i < firstNameArray.length; i++) {
    for (j = 0; j < lastNameArray.length; j++) {
      const firstName = firstNameArray[i]
      const lastName = lastNameArray[j]

      const search = `(teacherlastname_t:${lastName}+AND+teacherfirstname_t:${firstName})`
      queryBegin = queryBegin.concat(search)

      if (i != firstNameArray.length - 1) {
        queryBegin = queryBegin.concat('+OR')
      }
    }
  }
  queryBegin = queryBegin.concat(queryEnd)
  return queryBegin
}

function fuzzyQueryConstructor(instructorName) {

  const firstNameArray = getAndFormatFirstNameArray(instructorName)
  const lastNameArray = getAndFormatLastNameArray(instructorName)

  let queryBegin = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?wt=json&q=schoolid_s%3A1413+AND+(`
  const queryEnd = `)&sort=teacherlastname_t+asc&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+rating_class`

  for (i = 0; i < firstNameArray.length; i++) {
    for (j = 0; j < lastNameArray.length; j++) {
      const firstName = firstNameArray[i]
      const lastName = lastNameArray[j]

      const search = `((teacherlastname_t:${lastName}+AND+teacherfirstname_t:${firstName}~)+OR+(teacherlastname_t:${lastName}~+AND+teacherfirstname_t:${firstName}))`
      queryBegin = queryBegin.concat(search)

      if (i != firstNameArray.length - 1) {
        queryBegin = queryBegin.concat('+OR')
      }
    }
  }
  queryBegin = queryBegin.concat(queryEnd)
  return queryBegin
}



