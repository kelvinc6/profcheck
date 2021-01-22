//Add listener for content script message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  getInfo(request.instructorName, request.isUBCO).then((res) =>
    sendResponse(res)
  );
  return true;
});

//Get instructor information from RMP
async function getInfo(instructorName, isUBCO) {
  //If exact search doesn't work, try a fuzzy search
  const exactQueryURL = exactQueryConstructor(instructorName, isUBCO);
  const fuzzyQueryURL = fuzzyQueryConstructor(instructorName, isUBCO);

  return sendQueryRequest(exactQueryURL, fuzzyQueryURL);
}

async function sendQueryRequest(exactURL, fuzzyURL) {
  let json = await fetch(exactURL).then((res) => res.json());

  //There is a possibility of RMP having two entries of the same professor; we always take the first result, as
  //results are sorted by number of ratings
  if (json.response.numFound != 0) {
    const professorData = json.response.docs[0];
    const PROF_LINK = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorData.pk_id}`;
    return {
      isSuccessful: true,
      averageRatingScore: professorData.averageratingscore_rf,
      numRatings: professorData.total_number_of_ratings_i,
      link: PROF_LINK,
    };
  } else {
    json = await fetch(fuzzyURL).then((res) => res.json());

    //Result of fuzzy search should be 1, otherwise unsure of correct listign
    if (json.response.numFound == 1) {
      const professorData = json.response.docs[0];
      const PROF_LINK = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorData.pk_id}`;
      return {
        averageRatingScore: professorData.averageratingscore_rf,
        numRatings: professorData.total_number_of_ratings_i,
        link: PROF_LINK,
      };
    }
  }
  return {
    isSuccessful: false,
    averageRatingScore: null,
    numRatings: null,
    link: "https://www.ratemyprofessors.com/AddTeacher.jsp",
  };
}

function createFirstNameArray(instructorName) {
  const nameArray = instructorName.split(", ");
  const firstNameArray = nameArray[1].split(" ");
  for (i = 0; i < firstNameArray.length; i++) {
    firstNameArray[i] =
      firstNameArray[i].charAt(0) + firstNameArray[i].toLowerCase().slice(1);
  }
  return firstNameArray;
}

function createLastNameArray(instructorName) {
  const nameArray = instructorName.split(", ");
  const lastNameArray = nameArray[0].split(" ");
  for (i = 0; i < lastNameArray.length; i++) {
    lastNameArray[i] =
      lastNameArray[i].charAt(0) + lastNameArray[i].toLowerCase().slice(1);
  }
  return lastNameArray;
}

function exactQueryConstructor(instructorName, isUBCO) {
  const firstNameArray = createFirstNameArray(instructorName);
  const lastNameArray = createLastNameArray(instructorName);

  const schoolID = isUBCO ? "5436" : "1413";

  let databaseURL = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?wt=json&sort=total_number_of_ratings_i+desc&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+rating_class&q=schoolid_s:${schoolID}+AND+(`;

  for (i = 0; i < firstNameArray.length; i++) {
    for (j = 0; j < lastNameArray.length; j++) {
      const firstName = firstNameArray[i];
      const lastName = lastNameArray[j];

      const searchQuery = `(teacherlastname_t:${lastName}+AND+teacherfirstname_t:${firstName})`;
      databaseURL = databaseURL.concat(searchQuery);

      //Close statement with closing parentheses or add an OR
      if (i === firstNameArray.length - 1 && j === lastNameArray.length - 1) {
        databaseURL = databaseURL.concat(")");
      } else {
        databaseURL = databaseURL.concat("+OR+");
      }
    }
  }
  return databaseURL;
}

function fuzzyQueryConstructor(instructorName, isUBCO) {
  const firstNameArray = createFirstNameArray(instructorName);
  const lastNameArray = createLastNameArray(instructorName);

  const schoolID = isUBCO ? "5436" : "1413";

  let databaseURL = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?wt=json&sort=total_number_of_ratings_i+desc&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+rating_class&q=schoolid_s:${schoolID}+AND+(`;

  for (i = 0; i < firstNameArray.length; i++) {
    for (j = 0; j < lastNameArray.length; j++) {
      const firstName = firstNameArray[i];
      const lastName = lastNameArray[j];

      //Searches with fuzzy first exact last, or vice versa
      const searchQuery = `((teacherlastname_t:${lastName}+AND+teacherfirstname_t:${firstName}~)+OR+(teacherlastname_t:${lastName}~+AND+teacherfirstname_t:${firstName}))`;
      databaseURL = databaseURL.concat(searchQuery);

      //Close statement with closing parentheses or add an OR
      if (i === firstNameArray.length - 1 && j === lastNameArray.length - 1) {
        databaseURL = databaseURL.concat(")");
      } else {
        databaseURL = databaseURL.concat("+OR+");
      }
    }
    return databaseURL;
  }
}
