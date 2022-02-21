const TYPES = [
  {
    id: "isa",
    name: "Income Sharing Agreement (ISA)",
    description:
      "Raise a monthly stipend or a one-time sum and pay it back with your future revenues once you hit a certain revenue threshold. ",
    help: "Ideal if you are just getting started and don't have revenues yet.",
    enabled: true,
  },
  {
    id: "loan",
    name: "Classic Loan",
    description:
      "Raise a one-time sum and pay back a fixed amount on a monthly basis",
    help: "Ideal if you have already have stable revenue",
    enabled: false,
  },
  {
    id: "custom",
    name: "Upload your own contract",
    description:
      "Design and upload your own contract. Speak to support to arrange a custom integration",
    help: "Ideal if you have a lot of special terms deviating from standard agreements",
    enabled: false,
  },
  // {
  //   id: "safe",
  //   name: "Simple Agreement for Future Equity (SAFE)",
  //   description:
  //     "Raise a one-time sum and give investors the right to convert to equity in the future",
  //   help: "Ideal if you are getting started and don’t want to raise debt financing",
  //   enabled: false,
  // },
  // {
  //   id: "saft",
  //   name: "Simple Agreement for Future Tokens (SAFT)",
  //   description:
  //     "Raise a one-time sum and give investors the right to convert to equity in the future",
  //   help: "Ideal if you are getting started and plan to sell a token later",
  //   enabled: false,
  // },
] as const;

export const dbIdByTypeId = Object.fromEntries(TYPES.map(({ id }, i) => [id, i]));

export default TYPES;
