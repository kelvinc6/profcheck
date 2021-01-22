const tableBody: JQuery = $("tbody[role=alert]").children();
const instructorColumnHeader: JQuery = $("span#u202_c3_span").parent();

instructorColumnHeader.after(getRatingColumnHeader(), getLinkColumnHeader());

//Iterate through each row of table
tableBody.each((i: number, row: HTMLElement) => {
  const namesArray: string[] = $(row)
    .find(`span[id^='u263_line']`)
    .html()
    .trim()
    .split("<br>");
  namesArray.pop();

  const instructorColumn: JQuery = $(row).find(`div[id^='u263_line']`).parent();
  instructorColumn.after(getRatingRowSpot(i), getLinkRowSpot(i));

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
        {
          schoolIds: [
            SchoolId.UofT,
            SchoolId.UofT_MISSISSAUGA,
            SchoolId.UofT_SCARBOROUGH,
            SchoolId.UofT_ST_GEORGE,
          ],
          name,
        },
        (res: RMPResponse) => {
          const success: boolean = res.success;
          const numFound = res.numFound;
          const docs: RMPTeacherData[] = res.docs;
          const firstProf: RMPTeacherData = res.docs[0];

          if (!!firstProf) {
            const firstProfLink: string =
              RMP_TEACHER_BASE_URL + firstProf.pk_id;

            //Set the rating and link
            rating.text(
              firstProf.averageratingscore_rf
                ? firstProf.averageratingscore_rf
                : "N/A"
            );
            link.text("Link").attr("href", firstProfLink);

            //Show a warning tooltip if more than one result was found
            if (numFound > 1) {
              let html = "";
              docs.forEach((teacher) => {
                const firstName = teacher.teacherfirstname_t;
                const lastName = teacher.teacherlastname_t;
                const rating = teacher.averageratingscore_rf;
                const linkHTML = `<a style="color:DodgerBlue;" href="${
                  RMP_TEACHER_BASE_URL + teacher.pk_id
                }" target="_blank">Link</a>`;
                html = html.concat(
                  `${firstName} ${lastName} with ${rating} ${linkHTML}</br>`
                );
              });

              createTooltip(`a[id^='link_row${i}_name${k}']`, html);
            }

            link.show();
          } else {
            rating.text("N/A");
            link.text("Add").attr("href", RMP_ADD_TEACHER_URL);
            link.show();
          }
        }
      );
    })(k);
  });
});
