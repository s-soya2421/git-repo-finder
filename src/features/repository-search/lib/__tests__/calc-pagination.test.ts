import { describe, it, expect } from "vitest";
import { calcPagination } from "../calc-pagination";

describe("calcPagination", () => {
  it("基本: totalCount=100, page=3, perPage=10 → 5ページ表示", () => {
    const result = calcPagination(100, 3, 10);
    expect(result).toEqual({
      currentPage: 3,
      totalPages: 10,
      visiblePages: [1, 2, 3, 4, 5],
      hasPrev: true,
      hasNext: true,
    });
  });

  it("先頭ページ: hasPrev=false", () => {
    const result = calcPagination(100, 1, 10);
    expect(result.currentPage).toBe(1);
    expect(result.hasPrev).toBe(false);
    expect(result.hasNext).toBe(true);
    expect(result.visiblePages).toEqual([1, 2, 3]);
  });

  it("末尾ページ: hasNext=false", () => {
    const result = calcPagination(100, 10, 10);
    expect(result.currentPage).toBe(10);
    expect(result.hasPrev).toBe(true);
    expect(result.hasNext).toBe(false);
    expect(result.visiblePages).toEqual([8, 9, 10]);
  });

  it("API上限ガード: totalCount=50000, perPage=50 → maxPage=20", () => {
    const result = calcPagination(50000, 1, 50);
    expect(result.totalPages).toBe(20);
    expect(result.hasNext).toBe(true);
  });

  it("API上限ガード: totalCount=50000, perPage=10 → maxPage=100", () => {
    const result = calcPagination(50000, 1, 10);
    expect(result.totalPages).toBe(100);
  });

  it("API上限ガード: totalCount=50000, perPage=30 → maxPage=33", () => {
    const result = calcPagination(50000, 1, 30);
    expect(result.totalPages).toBe(33);
  });

  it("totalCount=0 → 空", () => {
    const result = calcPagination(0, 1, 10);
    expect(result).toEqual({
      currentPage: 1,
      totalPages: 0,
      visiblePages: [],
      hasPrev: false,
      hasNext: false,
    });
  });

  it("page がmaxPage超過 → currentPage をクランプ", () => {
    const result = calcPagination(50, 10, 10);
    expect(result.currentPage).toBe(5);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });

  it("1ページのみ → visiblePages=[1], 前後なし", () => {
    const result = calcPagination(5, 1, 10);
    expect(result).toEqual({
      currentPage: 1,
      totalPages: 1,
      visiblePages: [1],
      hasPrev: false,
      hasNext: false,
    });
  });

  it("中間ページ: 前後2ページずつ表示", () => {
    const result = calcPagination(200, 5, 10);
    expect(result.visiblePages).toEqual([3, 4, 5, 6, 7]);
  });
});
