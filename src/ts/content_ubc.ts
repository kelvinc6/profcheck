import {
  createTooltip,
  createTooltipHTML,
  createTooltipNoResultsHTML,
  createTooltipErrorHTML,
  createTippySingleton,
} from "./helpers";
import { SchoolId } from "./constants";
import { RMPResponse, RMPTeacherData } from "./d";
import { Instance } from "tippy.js";
import "../css/styles.css";
import $ from "jquery";

const nameTable: JQuery = $("table[class=\\table] > tbody").children();

let tippyInstances: Instance[] = [];

nameTable.each((i: number, row: HTMLElement) => {
  const isTA: boolean = $(row).children().first().text().includes("TA:");
  const name: string = $(row)
    .find("td > a")
    .text()
    .replace("(Coordinator)", "");

  if (isTA || !name) {
    return false;
  }

  /**
   * Add id to each name for Tippy attachment
   */
  $(row).find("a").attr("id", `name${i}`);
  const instance = createTooltip(`a#name${i}`, "Loading...")[0];

  tippyInstances.push(instance);

  chrome.runtime.sendMessage(
    { schoolIds: [getSchoolId()], name },
    (res: RMPResponse) => {
      const numFound = res.numFound;
      const docs: RMPTeacherData[] = res.docs;
      const error: Error | undefined = res.error;

      if (numFound != 0) {
        const html = createTooltipHTML(docs);
        instance.setContent(html);
      } else if (error) {
        instance.setContent(createTooltipErrorHTML());
      } else {
        instance.setContent(createTooltipNoResultsHTML());
      }
    }
  );
});

// createTippySingleton(tippyInstances);

/**
 * Get schoolid for Vancouver or Okanagan campus
 */
function getSchoolId(): SchoolId {
  if ($(".ubc7-campus").attr("id") === "ubc7-okanagan-campus") {
    return SchoolId.UBC_OKANAGAN;
  } else {
    return SchoolId.UBC;
  }
}
