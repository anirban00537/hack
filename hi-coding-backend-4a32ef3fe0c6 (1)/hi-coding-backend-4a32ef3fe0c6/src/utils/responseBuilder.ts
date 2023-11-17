export function successResponseBuilder(data: object, meta?: object) {
  return {
    data,
    errors: [],
    meta,
    success: true,
  };
}
