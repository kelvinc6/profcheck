import { createTippyInstance, tooltipHandleResponse } from "./helpers";
import { SchoolId } from "./constants";
import { RMPResponse } from "./types";
import "../css/styles.css";
import $ from "jquery";

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

  /**
   * Add id to each name for Tippy attachment
   */
  $(row).find("a").attr("id", `name${i}`);
  const instance = createTippyInstance(`a#name${i}`, "Loading...")[0];

  chrome.runtime.sendMessage(
    { schoolIds: [getSchoolId()], name },
    (res: RMPResponse) => {
      tooltipHandleResponse(res, instance);
    }
  );
});

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
