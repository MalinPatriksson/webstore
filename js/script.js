document.addEventListener("DOMContentLoaded", function () {
  // Hämta produkter från Fake Store API och rendera dem på sidan
  fetch("https://fakestoreapi.com/products")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const productList = document.getElementById("product-list");
      data.forEach((product) => {
        // Skapa produktkort
        const productCard = document.createElement("div");
        productCard.classList.add(
          "col-lg-3",
          "col-md-4",
          "col-sm-6",
          "mb-4",
          "product-container"
        );
        productCard.setAttribute("data-product", `${product.title}`);
        productCard.setAttribute("data-price", `${product.price}`);
        productCard.setAttribute("data-description", `${product.description}`);
        productCard.innerHTML = `
                <div class="card h-100">
                  <div data-bs-toggle="offcanvas" data-bs-target="#offcanvas-product" aria-controls="offcanvas-product">
                    <img class="card-img-top" src="${product.image}" alt="${product.title}">  
                    <div class="card-body">
                        <h5 class="card-title text-truncate">${product.title}</h5>
                    </div>
                  </div>
                  <div class="d-flex flex-column card-body product-button">
                    <p class="card-text">$${product.price}</p>
                    <button class="btn btn-primary btn-order" data-image=${product.image}">Beställ</button>
                  </div>
                </div>
            `;
        productList.appendChild(productCard);
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });

  // Hämta varukorgens storlek från localStorage och uppdatera varukorgsantal
  const storedCartCount = localStorage.getItem("cart-count");
  if (storedCartCount) {
    cartCount = parseInt(storedCartCount);
    updateCartCount();
  }
});

// Global variabel för att hålla koll på antalet produkter i varukorgen
let cartCount = 0;

// Funktion för att lägga till produkter i varukorgen
function addToCart(productName, productPrice, productDescription, productImage) {
  // Skapa ett objekt med produktinformationen
  const product = {
    name: productName,
    price: productPrice,
    description: productDescription,
    image: productImage,
    quantity: 1
  };

  // Hämta den befintliga varukorgen från localStorage eller skapa en ny array om ingen varukorg finns
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const exsistingProductIndex = cart.findIndex(Item => Item.name === productName);

  if(exsistingProductIndex !== -1) {
    cart[exsistingProductIndex].quantity += 1;
  } else {
    product.quantity = 1; 
    cart.push(product);
  }
  // Spara den uppdaterade varukorgen i localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Uppdatera varukorgsantal
  cartCount++;
  updateCartCount();
  updateAmount(); // Uppdatera antalet produkter bredvid varukorgen
  localStorage.setItem("cart-count", cartCount);
  
}

// Funktion för att uppdatera och visa antalet produkter i varukorgen
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  // Hämta produkterna från localStorage
  const cart = JSON.parse(localStorage.getItem('cart'));
  // Beräkna totala antalet produkter i varukorgen
  let cartCount = 0;
  if (cart && cart.length > 0) {
    cart.forEach((product) => {
      cartCount += product.quantity; // Lägg till antalet av varje produkt i varukorgen
    });
  }
  // Uppdatera gränssnittet med det totala antalet produkter
  cartCountElement.innerText = cartCount;
}


// Hantera klickhändelser
document.addEventListener("click", function (event) {
  // Hämta produktinformation
  const productName = event.target
    .closest("[data-product]")
    .getAttribute("data-product");
  const productPrice = parseFloat(
    event.target.closest("[data-price]").getAttribute("data-price"));
  const productDescription = event.target
    .closest("[data-description]")
    .getAttribute("data-description");
  const productImage = event.target
    .closest(".btn-order")
    .getAttribute("data-image");

  if (event.target.classList.contains("btn-order")) {
    event.preventDefault();
    addToCart(productName, productPrice, productDescription, productImage);

    // Sätter produktinfo i offcanvas
  } else {
    document.getElementById("offcanvas-product-title").innerHTML =
      productName;
    document.getElementById("offcanvas-product-description").innerHTML =
      productDescription;
  }
});

//dynamiskt år i footer
document.getElementById("cRyear").innerHTML = new Date().getFullYear();
