export interface IPagination<D>{
  total_items:number,
  total_page:number,
  prev:string,
  next:string,
  items:D[]
}
