"use client";

import { useState } from "react";
import { TableItem } from "../types/utils";
import { PaginationReturn } from "../types/utils";

const Pagination = (
  tableContent: TableItem[],
  rowsPerPage = 5
): PaginationReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tableContent.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = tableContent.slice(startIndex, startIndex + rowsPerPage);

  const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return {
    currentData,
    currentPage,
    totalPages,
    goToNext,
    goToPrevious,
    setCurrentPage,
  };
};

export default Pagination;
