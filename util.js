


// This function returns an element's position relative to the whole document (page):
export function getOffsetAgainstPage(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}