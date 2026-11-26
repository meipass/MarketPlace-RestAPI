import { AppError } from "#app/modules/appError/appError.class";

import type {
  QueryFilter,
  SortBy,
  SortOrder,
} from "#app/interfaces/search/queryFilter.type";

import type { ProductData } from "#app/interfaces/products/productData.type";

import { isObject } from "#app/validators/isObject.validator";
import { isValidInteger } from "#app/validators/isValidNumber.validator";
import { isNonEmptyString } from "#app/validators/isNonEmptyString.validator";
import { parsePositiveInteger } from "#app/utils/parsePositiveInteger.util";
import { parsePrice } from "#app/utils/parsePrice.util";
import { isSortBy } from "#app/validators/isSortBy.validator";
import { isSortOrder } from "#app/validators/isSortOrder.validator";

export function validateFilters(query: unknown): QueryFilter {
  if (!isObject(query)) {
    throw new AppError("INVALID_SEARCH_OPTIONS");
  }

  const page = parsePositiveInteger(query.page, 1);
  const limit = parsePositiveInteger(query.limit, 20, 100);

  const minPrice = parsePrice(query.minPrice);
  const maxPrice = parsePrice(query.maxPrice);

  const search = query.search;

  const sortBy = query.sortBy;
  const order = query.order;

  if (page === null || limit === null) {
    throw new AppError("INVALID_SEARCH_LIMITS");
  }

  if (minPrice === null || maxPrice === null) {
    throw new AppError("INVALID_SEARCH_PRICES");
  }

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw new AppError("SEARCH_MIN_PRICE_EXCEEDS_MAX");
  }

  if (search !== undefined && typeof search !== "string") {
    throw new AppError("SEARCH_MUST_BE_STRING");
  }

  if (typeof search === "string" && search.length > 70) {
    throw new AppError("SEARCH_EXCEEDS_LIMIT");
  }

  if (sortBy !== undefined && !isSortBy(sortBy)) {
    throw new AppError("SEARCH_INVALID_SORT_BY");
  }

  if (order !== undefined && !isSortOrder(order)) {
    throw new AppError("SEARCH_INVALID_SORT_ORDER");
  }

  const validatedSortBy: SortBy = isSortBy(sortBy) ? sortBy : "price";
  const validatedSortOrder: SortOrder = isSortOrder(order) ? order : "asc";
  const validatedSearch: string | undefined =
    typeof search === "string" ? search : undefined;

  const filters: QueryFilter = {
    page: page,
    limit: limit,
    sortBy: validatedSortBy,
    order: validatedSortOrder,
    ...(minPrice !== undefined && { minPrice }),
    ...(maxPrice !== undefined && { maxPrice }),
    ...(validatedSearch !== undefined && { search: validatedSearch }),
  };

  return filters;
}

export function validateProductId(params: unknown) {
  if (!isObject(params)) {
    throw new AppError("INVALID_PARAMS");
  }

  const id = Number(params.id);
  if (!isValidInteger(id)) {
    throw new AppError("INVALID_PARAMS");
  }

  return id;
}

export function validateProductData(body: unknown): ProductData {
  if (!isObject(body)) {
    throw new AppError("INVALID_BODY");
  }

  const { title, description, price, stock } = body;
  if (!isNonEmptyString(title)) {
    throw new AppError("CREATE_PRODUCT_INVALID_TITLE");
  }

  if (!isNonEmptyString(description)) {
    throw new AppError("CREATE_PRODUCT_INVALID_DESCRIPTION");
  }

  if (!isValidInteger(price)) {
    throw new AppError("CREATE_PRODUCT_INVALID_PRICE");
  }

  if (!isValidInteger(stock)) {
    throw new AppError("CREATE_PRODUCT_INVALID_STOCK");
  }

  const productData: ProductData = {
    title,
    description,
    price,
    stock,
  };

  return productData;
}
