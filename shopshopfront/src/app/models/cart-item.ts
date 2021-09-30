import {Product} from "./product";
import {UserDTO} from "./user-dto";

export interface CartItem {
  product: Product;
  client: UserDTO;
}
