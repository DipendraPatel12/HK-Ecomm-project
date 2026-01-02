const filterForm = document.getElementById("filterForm");

document.querySelectorAll("#filterForm select").forEach((select) => {
  select.addEventListener("change", () => {
    filterForm.submit();
  });
});
async function addToCart(productId) {
  try {
    const res = await fetch("/cart/addToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    const data = await res.json();
    alert(data.message);
    window.location.reload();
  } catch (error) {
    console.error(`Error While add to cart ${error}`);
  }
}
window.addToCart = addToCart;
