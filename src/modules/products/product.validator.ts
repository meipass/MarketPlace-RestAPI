import type {
  QueryFilter,
  SortBy,
  SortOrder,
} from "#app/interfaces/queryFilter.type";
import { isObject } from "#app/validators/isObject.validator";
import { AppError } from "#app/modules/appError/appError.class";
import { isValidInteger } from "#app/validators/isValidNumber.validator";
import type { ProductData } from "#app/interfaces/productData.type";
import { isNonEmptyString } from "#app/validators/isNonEmptyString.validator";

export function parsePositiveInteger(
  value: unknown,
  defaultValue: number,
  max?: number,
): number | null {
  if (value === undefined) return defaultValue;
  if (typeof value !== "string" || value.trim() === "") return null;

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null;
  if (max !== undefined && parsed > max) return null;

  return parsed;
}

function parsePrice(value: unknown): number | null {
  if (value === undefined) return null;
  if (typeof value !== "string" || value.trim() === "") return null;

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) return null;

  return parsed;
}

function isSortBy(value: unknown): value is SortBy {
  return value === "title" || value === "price";
}

function isSortOrder(value: unknown): value is SortOrder {
  return value === "asc" || value === "desc";
}

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
    // return res.status(400).json({
    //   error:
    //     "Page must be a positive integer and limit must be between 1 and 100",
    // });
  }

  if (minPrice === null || maxPrice === null) {
    throw new AppError("INVALID_SEARCH_PRICES");
    // return res.status(400).json({
    //   error: "Prices must be non-negative numbers",
    // });
  }

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw new AppError("SEARCH_MIN_PRICE_EXCEEDS_MAX");
    // return res.status(400).json({
    //   error: "Minimum price cannot exceed maximum price",
    // });
  }

  if (search !== undefined && typeof search !== "string") {
    throw new AppError("SEARCH_MUST_BE_STRING");
    // return res.status(400).json({
    //   error: "Search must be a string",
    // });
  }

  if (typeof search === "string" && search.length > 70) {
    throw new AppError("SEARCH_EXCEEDS_LIMIT");
    // return res.status(400).json({
    //   error: "Search cannot exceed 70 characters",
    // });
  }

  if (sortBy !== undefined && !isSortBy(sortBy)) {
    throw new AppError("SEARCH_INVALID_SORT_BY");
    // return res.status(400).json({
    //   error: "sortBy must be price or title",
    // });
  }

  if (order !== undefined && !isSortOrder(order)) {
    throw new AppError("SEARCH_INVALID_SORT_ORDER");
    // return res.status(400).json({
    //   error: "sortOrder must be asc or desc",
    // });
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
  // const { title, description, price, stock } = req.body;
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
