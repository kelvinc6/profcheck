const nameTable: JQuery = $("table[class=\\table] > tbody").children();

let searchedNames: string[] = [];

nameTable.each((i: number, row: HTMLElement) => {
  const isTA: boolean = $(row).children().first().text().includes("TA:");
  const name: string = $(row)
    .find("td > a")
    .text()
    .replace("(Coordinator)", "");

  if (isTA || !name) {
    return false;
  }
  if (searchedNames.includes(name) || !name) {
    return;
  } else {
    searchedNames.push(name);
  }

  $(row).find("a").attr("id", `name${i}`);
  const instance = createTooltip(`a#name${i}`, "Loading...")[0];

  chrome.runtime.sendMessage(
    { schoolIds: [getSchoolId()], name },
    (res: RMPResponse) => {
      const success = res.success;
      const numFound = res.numFound;
      const docs: RMPTeacherData[] = res.docs;

      if (numFound != 0) {
        const html = createTooltipEntriesHTML(docs);
        //@ts-ignore
        instance.setContent(html);
      } else {
        //@ts-ignore
        instance.setContent(`No Rate My Professor's Pages Found :(`);
      }
    }
  );
});

function getSchoolId(): SchoolId {
  if ($(".ubc7-campus").attr("id") === "ubc7-okanagan-campus") {
    return SchoolId.UBC_OKANAGAN;
  } else {
    return SchoolId.UBC;
  }
}
