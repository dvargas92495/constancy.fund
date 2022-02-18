const formatAmount = (n: number | string) => {
  const [predecimal, postdecimal] = n.toString().split(".");
  const order = predecimal.length - 1;
  return `${predecimal
    .split("")
    .reverse()
    .map((d, i) => (i % 3 === 2 && i !== order ? `${d},` : d))
    .join("")
    .split("")
    .reverse()
    .join("")}${postdecimal ? `.${postdecimal.slice(0, 2)}` : ""}`;
};

export default formatAmount;
