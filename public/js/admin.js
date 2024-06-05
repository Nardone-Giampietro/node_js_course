const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector("[name=productId]").value;
    const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;
    const productElement = btn.closest("article");
    fetch(`/admin/delete-product/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "csrf-token": csrfToken
        }
    })
        .then(response => response.json())
        .then(body => {
            productElement.parentNode.removeChild(productElement);
        })
        .catch(err => console.log(err));
}