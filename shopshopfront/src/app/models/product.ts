import {UserDTO} from "./user-dto";

export class Product{
  title : string | undefined;
  description: string | undefined;
  photo: string | undefined;
  price: number | undefined;
  sold: boolean | undefined = false;
}
