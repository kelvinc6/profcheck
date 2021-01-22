//Add listener for content script message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const instructorName = request.instructorName;
  const isUBCO = request.isUBCO;

  getInfo(instructorName, isUBCO).then((res) => sendResponse(res));
  return true;
});

//Get instructor information from RMP
async function getInfo(instructorName, isUBCO) {
  //Check for typos
  instructorName = await typoCheck(instructorName);

  //If exact search doesn't work, try a fuzzy search
  const exactURL = queryConstructor(instructorName, isUBCO, false);
  const fuzzyURL = queryConstructor(instructorName, isUBCO, true);

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
        isSuccessful: true,
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

//Creates an array of possible first/last names (0 for last name, 1 for first name)
//e.g. createNameArray('ALLEN YANG, JERRY', 0) = ['ALLEN', 'YANG']
function createNameArray(instructorName, i) {
  const nameArray = instructorName.split(", ");
  const splitNameArray = nameArray[i].split(" ");
  for (i = 0; i < splitNameArray.length; i++) {
    splitNameArray[i] =
      splitNameArray[i].charAt(0) + splitNameArray[i].toLowerCase().slice(1);
  }
  return splitNameArray;
}

//Constructos a query to search for an instructor
function queryConstructor(instructorName, isUBCO, isFuzzy = false) {
  const firstNameArray = createNameArray(instructorName, 1);
  const lastNameArray = createNameArray(instructorName, 0);

  const schoolID = isUBCO ? "5436" : "1413";

  //Includes a isFuzzy param for reference purposes
  let databaseURL = `https://solr-aws-elb-production.ratemyprofessors.com/solr/rmp/select/?isFuzzy=${isFuzzy}&wt=json&sort=total_number_of_ratings_i+desc&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+rating_class&q=schoolid_s:${schoolID}+AND+(`;

  for (i = 0; i < firstNameArray.length; i++) {
    for (j = 0; j < lastNameArray.length; j++) {
      const firstName = firstNameArray[i];
      const lastName = lastNameArray[j];

      const searchQuery = isFuzzy
        ? `((teacherlastname_t:${lastName}+AND+teacherfirstname_t:${firstName}~)+OR+(teacherlastname_t:${lastName}~+AND+teacherfirstname_t:${firstName}))`
        : `(teacherlastname_t:${lastName}+AND+teacherfirstname_t:${firstName})`;

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

async function typoCheck(instructorName) {
  const typos = await fetch(
    "https://insidiousdata.github.io/data/typos.json"
  )
    .then((res) => res.json())
    .catch((err) => {});
  const hasTypo = typos.hasOwnProperty(instructorName);
  return hasTypo ? typos[instructorName] : instructorName;
}
