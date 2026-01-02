const incrementBtn = document.getElementById("increment");
const decrementBtn = document.getElementById("decrement");
const quantityInput = document.getElementById("quantity");

incrementBtn.addEventListener("click", () => {
  quantityInput.value = parseInt(quantityInput.value || 1) + 1;
});

decrementBtn.addEventListener("click", () => {
  quantityInput.value = Math.max(1, parseInt(quantityInput.value || 1) - 1);
});

async function addToCart(productId) {
  const res = await fetch("/cart/addToCart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity: quantityInput.value }),
  });

  const data = await res.json();
  alert(data.message);
  window.location.reload();
}
window.addToCart = addToCart;
