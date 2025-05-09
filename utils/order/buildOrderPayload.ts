import { Address } from "@/types/member/address";
import { CartItem } from "@/types/cart/cart";
import { OrderPayload } from "@/types/utils/order/build-order-payload";

export function BuildOrderPayload(
  address: Address,
  cartItems: CartItem[]
): OrderPayload {
  return {
    items: cartItems.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
    })),
    paymentMethod: "COD",
    shippingFullName: address.full_name,
    shippingAddressLine1: address.address_line,
    shippingCity: address.city,
    shippingZip: address.zip_code,
    shippingCountry: "ไทย",
    shippingPhone: address.phone_number,
    shippingState: address.state,
  };
}
