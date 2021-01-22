var $ = require("jquery");
import {
  createTooltip,
  createTooltipHTML,
  createTooltipNoResultsHTML,
} from "./helpers";
import { SchoolId } from "./constants";
import { RMPResponse, RMPTeacherData } from "./d";
import "../css/tooltip_break.css";
import { create } from "domain";

const nameTable: JQuery = $("table[class=\\table] > tbody").children();

nameTable.each((i: number, row: HTMLElement) => {
  const isTA: boolean = $(row).children().first().text().includes("TA:");
  const name: string = $(row)
    .find("td > a")
    .text()
    .replace("(Coordinator)", "");

  if (isTA || !name) {
    return false;
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
        const html = createTooltipHTML(docs);
        //@ts-ignore
        instance.setContent(html);
      } else {
        //@ts-ignore
        instance.setContent(createTooltipNoResultsHTML());
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
