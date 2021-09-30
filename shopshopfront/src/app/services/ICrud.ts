export interface ICrud<T, ID>{
  save(t: T): void;
  update(id: ID, t: T): void;
  deleteById(id: ID): void;
  findAll(): void;
  findById(id: ID): void;
}
