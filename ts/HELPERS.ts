function createNameSpan(rowIndex: number, nameIndex: number, name: string) {
  return jQuery.parseHTML(
    `<span id="instructor_row${rowIndex}_name${nameIndex}">${name}</span></br>`
  );
}

function createTooltip(selector: string, text: string) {
  //@ts-ignore
  return tippy(selector, {
    content: text,
    allowHTML: true,
    interactive: true,
    placement: "right",
  });
}

function createTooltipEntriesHTML(teachers: RMPTeacherData[]) {
  let html = "";
  teachers.forEach((teacher, j) => {
    const firstName = teacher.teacherfirstname_t;
    const lastName = teacher.teacherlastname_t;
    const department = teacher.teacherdepartment_s;
    const rating = teacher.averageratingscore_rf;
    const numRatings = teacher.total_number_of_ratings_i;
    const linkHTML = `<a style="color:DeepSkyBlue;" href="${
      RMP_TEACHER_BASE_URL + teacher.pk_id
    }" target="_blank">RMP Page</a>`;
    html = html.concat(
      `<div><span>${firstName} ${lastName} </span></br><span>Department: ${department}</span></br><span>Rating: ${
        rating ? `${rating} / 5 (${numRatings} ratings)` : "N/A"
      } </span></br><span>${linkHTML}</span></div>`
    );

    if (j < teachers.length - 1) {
      html = html.concat(`<hr id="tooltipBreak">`);
    }
  });
  return html;
}
