const FormatCurrency = (amount) => {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
    }).format(amount) + " VND"
  );
};

export default FormatCurrency;
