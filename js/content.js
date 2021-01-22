/**
 * Rows of table of instructor/TA names
 * @type {jQuery}
 */
const nameTable = $("table[class=\\table] > tbody").children();

nameTable.each((i, elem) => {
  /**
   * HTML elements given as string of the rating, number of ratings, and link
   * @type {String}
   */
  const ratingElement = `<td style="min-width:10em" id="rating${i}"></td>`;
  const numRatingsElement = `<td style="min-width:10em" id="numRatings${i}"></td>`;
  const linkElement = `<td style="min-width:10em"><a href="#" id="link${i}" target="_blank"></a></td>`;

  $(elem).append(ratingElement + numRatingsElement + linkElement);
});

/**
 * Array to keep track of instructor names iterated over
 * @type {Array<string>}
 */
let searchedNames = [];

nameTable.each((i, elem) => {
  /**
   * Whether the first element of a row indicates a TA
   * @type {boolean}
   */
  const isTA = $(elem).children().first().text().includes("TA:");

  /**
   * Instructor name with the '(Coordinator)' string removed
   * @type {String}
   */
  let instructorName = $(elem)
    .find("td > a")
    .text()
    .replace("(Coordinator)", "");

  //Break out of loop upon reaching a TA, or if no instructor name is present
  if (isTA || !instructorName) {
    return false;
  }
  //Continue if instructor has been seen before, or if no name present
  if (searchedNames.includes(instructorName) || !instructorName) {
    return;
  } else {
    //Keep track of instructors iterated over
    searchedNames.push(instructorName);
  }

  //Loading indicator
  $(`#rating${i}`).text("Loading...");

  chrome.runtime.sendMessage(
    { isUBCO: isUBCO(), instructorName: instructorName },
    (result) => {
      /**
       * Whether the search request was successful
       * @type {boolean}
       */
      const isSuccessful = result.isSuccessful;

      /**
       * Rate My Professor's rating out of 5
       * @type {number}
       */
      const rating = result.averageRatingScore;

      /**
       * Link to the professor's Rate My Professor's page
       * @type {string}
       */
      const link = result.link;

      const numRatings = result.numRatings;

      if (isSuccessful) {
        //Hide loading indicator
        $(".loader").hide();

        $(`#rating${i}`).text(rating ? `Rating: ${rating} / 5` : "N/A");
        $(`#numRatings${i}`).text(`(${numRatings} ratings)`);
        $(`#link${i}`).text(`RMP Page`).attr("href", link);
      } else {
        //Indicate instructor could not be found
        $(`#rating${i}`).text("No RMP Page Found");
        $(`#link${i}`).text("Add Listing").attr("href", link);
      }
    }
  );
});

/**
 * Check's if the current page is on UBC Okanagan's course explorer
 */
function isUBCO() {
  return $(".ubc7-campus").attr("id") === "ubc7-okanagan-campus";
}
