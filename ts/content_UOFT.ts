const tableBody: JQuery = $("tbody[role=alert]").children();

//Iterate through each row of table
tableBody.each((i: number, row: HTMLElement) => {
  const namesArray: string[] = $(row)
    .find(`span[id^='u263_line']`)
    .html()
    .trim()
    .split("<br>");
  namesArray.pop();

  const instructors: JQuery = $(row).find(`div[id^='u263_line']`);
  instructors.empty();

  namesArray.forEach((name, k) => {
    //Closure is used to preserve name index k for use in sendMessage callback
    (function (k) {
      instructors.append(createNameSpan(i,k,name));
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

          if (numFound != 0) {
            const html = createTooltipEntriesHTML(docs)
            createTooltip(`span#instructor_row${i}_name${k}`, html);
          } else {
            createTooltip(
              `span#instructor_row${i}_name${k}`,
              `No Rate My Professor's Pages Found :(`
            );
          }
        }
      );
    })(k);
  });
});
