const tableBody: JQuery = $("tbody[role=alert]").children();
const instructorColumnHeader: JQuery = $("span#u202_c3_span").parent();

instructorColumnHeader.after(getRatingColumnHeader(),getLinkColumnHeader());

//Iterate through each row of table
tableBody.each((i: number, row: HTMLElement) => {
  const namesArray: string[] = $(row)
    .find(`span[id^='u263_line']`)
    .html()
    .trim()
    .split("<br>");
  namesArray.pop();

  const instructorColumn: JQuery = $(row).find(`div[id^='u263_line']`).parent();

  instructorColumn.after(getRatingRowSpot(i),getLinkRowSpot(i));

  namesArray.forEach((name, k) => {
    //Closure is used to preserve name index k for use in sendMessage callback
    (function (k) {
      const ratingRowSpot = $(`div#ratings_row${i}`);
      const linkRowSpot = $(`div#links_row${i}`);

      //Add empty rating element and hide it
      ratingRowSpot.append(getRating(i, k, "Loading"));

      //Add empty link element and hide it
      linkRowSpot.append(getLink(i, k));

      const rating: JQuery = $(`span#rating_row${i}_name${k}`);
      const link: JQuery = $(`a#link_row${i}_name${k}`);

      link.hide();

      chrome.runtime.sendMessage(
        { school: "UofT", instructorName: name },
        (res: RMPData) => {
          const isSuccessful = res.success;
          const avgRatingScore = res.avgRatingScore;
          const numFound = res.numFound;
          const linkURL = res.link;

          if (isSuccessful) {
            //Set the rating and link
            rating.text(avgRatingScore ? avgRatingScore : "N/A");
            link.text("Link").attr("href", linkURL);

            //Show a warning tooltip if more than one result was found
            if (numFound > 1) {
              createTooltip(
                `a[id^='link_row${i}_name${k}']`,
                `${res.numFound} matches were found. Link may be incorrect.`
              );
            }

            link.show();
          } else {
            rating.text("N/A");
            link.text("Add").attr("href", res.link);
            link.show();
          }
        }
      );
    })(k);
  });
});
