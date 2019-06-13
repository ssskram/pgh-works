export function returnCurrentItems(projects, currentPage) {
  const indexOfLastItem = currentPage * 30;
  const indexOfFirstItem = indexOfLastItem - 30;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
  return currentItems;
}

export function returnPageNumber(projects) {
  const pageNumbers: any[] = [];
  for (let i = 1; i <= Math.ceil(projects.length / 30); i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
}
