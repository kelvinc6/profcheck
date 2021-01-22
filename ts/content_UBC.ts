const nameTable: JQuery = $("table[class=\\table] > tbody").children();

nameTable.each((i: number, elem: HTMLElement) => {
  const ratingElement: string = `<td style="min-width:10em" id="rating${i}"></td>`;
  const numRatingsElement: string = `<td style="min-width:10em" id="numRatings${i}"></td>`;
  const linkElement: string = `<td style="min-width:10em"><a href="#" id="link${i}" target="_blank"></a></td>`;

  $(elem).append(ratingElement + numRatingsElement + linkElement);
});

let searchedNames: string[] = [];

nameTable.each((i: number, row: HTMLElement) => {
  const isTA: boolean = $(row).children().first().text().includes("TA:");
  const instructorName: string = $(row)
    .find("td > a")
    .text()
    .replace("(Coordinator)", "");

  if (isTA || !instructorName) {
    return false;
  }
  if (searchedNames.includes(instructorName) || !instructorName) {
    return;
  } else {
    searchedNames.push(instructorName);
  }

  $(`#rating${i}`).text("Loading...");

  chrome.runtime.sendMessage(
    { school: "UBC", isUBCO: isUBCO(), instructorName: instructorName },
    (result) => {
      const isSuccessful: boolean = result.isSuccessful;
      const rating: string = result.avgRatingScore;
      const link: string = result.link;
      const numRatings: string = result.numRatings;

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


function isUBCO(): boolean {
  return $(".ubc7-campus").attr("id") === "ubc7-okanagan-campus";
}
