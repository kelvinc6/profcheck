function getRatingColumnHeader() {
  return jQuery.parseHTML(`<th scope="col" colspan="1" rowspan="1" class="infoline sorting_disabled" role="columnheader" tabindex="0" style="width: 40px">
    <span class="infoline">
      <label id="ratingHeader" for="">Rating</label>
    </span>
    </th>`);
}

function getLinkColumnHeader() {
  return jQuery.parseHTML(`<th scope="col"colspan="1" rowspan="1" class="infoline sorting_disabled" role="columnheader" tabindex="0" style="width: 40px">
    <span class="infoline">
      <label id="linkHeader" for="">RMP Page</label>
    </span>
    </th>`);
}

function getRatingRowSpot(rowIndex: number) {
  return jQuery.parseHTML(`<td colspan="1" rowspan="1" class="uif-field">
    <div id="ratings_row${rowIndex}" class="uif-field">
    </div>
  </td>`);
}

function getLinkRowSpot(rowIndex: number) {
  return jQuery.parseHTML(
    `<td colspan="1" rowspan="1" class="uif-field">
<div id="links_row${rowIndex}" class="uif-field">
</div>
</td>`
  );
}

function getRating(rowIndex: number, nameIndex: number, text?: string) {
  return jQuery.parseHTML(
    `<span id="rating_row${rowIndex}_name${nameIndex}">${text}</span><br>`
  );
}

function getLink(
  rowIndex: number,
  nameIndex: number,
  text?: string,
  link?: string
) {
  return jQuery.parseHTML(
    `<a id="link_row${rowIndex}_name${nameIndex}" href="${link}" target="_blank">${text}</a><br>`
  );
}

function createTooltip(selector: string, text: string): void {
  //@ts-ignore
  tippy(selector, {
    content: text,
  });
}