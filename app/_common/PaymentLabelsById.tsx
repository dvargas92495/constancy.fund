import { Id } from "../enums/paymentPreferences";

const paymentLabelsById: Record<Id, string | number | React.ReactElement> = {
  paypal: <img src={"/images/payment-options/PayPalLabel.png"} />,
  bank: "Bank Transfer",
  ethereum: "Ethereum",
  bitcoin: "Bitcoin",
  near: "NEAR",
};

export default paymentLabelsById;
