document.addEventListener('DOMContentLoaded', () => {
  const stickyWrapper = document.querySelector('.header__sticky-wrapper');
  const navLinks = document.querySelectorAll('.header__nav-link');
  const categories = document.querySelectorAll('.menu__categories-link');
  const categoryGroups = document.querySelectorAll('.menu__category-group');
  const mainMenuTitle = document.getElementById('main-menu-title');
  const menuSection = document.getElementById('menu-sections');
  const categoriesBar = document.getElementById('menu-categories-bar');
  const cartItemCount = document.getElementById('cart-item-count');

  const isCartPage = document.body.classList.contains('cart-page');
  const cartItemsContainer = document.querySelector('.cart__items-container');

  const summaryValueProducts = document.getElementById('subtotal-value');
  const summaryValueDelivery = document.getElementById('shipping-value');
  const summaryValueTotal = document.getElementById('total-value');
  const deliveryCostDisplayLabel = document.getElementById(
    'delivery-cost-display'
  );

  const deliveryForm = document.querySelector('.cart__form--delivery');
  const deliveryOptions = document.querySelectorAll(
    'input[name="delivery-method"]'
  );
  const placeOrderBtn = document.querySelector('.cart__place-order-btn');

  window.cart = window.cart || {};
  let shouldCategoriesBarBeSticky = false;

  function saveCart() {
    localStorage.setItem('sashiroCart', JSON.stringify(cart));
  }

  function loadCart() {
    const storedCart = localStorage.getItem('sashiroCart');
    cart = storedCart ? JSON.parse(storedCart) : {};
  }

  function updateCartCount() {
    const totalItems = Object.values(cart).reduce(
      (sum, count) => sum + count,
      0
    );
    if (cartItemCount) {
      cartItemCount.textContent = totalItems;
      cartItemCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
  }

  function addToCart(productId) {
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart();
    updateCartCount();

    if (!isCartPage) {
      updateProductControls(productId);
    } else {
      renderCartPage();
      renderAddons();
    }
  }

  function removeFromCart(productId) {
    if (cart[productId] > 0) {
      cart[productId] -= 1;
      if (cart[productId] === 0) delete cart[productId];
      saveCart();
    }
    updateCartCount();

    if (!isCartPage) {
      updateProductControls(productId);
    } else {
      renderCartPage();
      renderAddons();
    }
  }

  function updateProductControls(productId) {
    const itemElement = document.querySelector(
      `.menu__card[data-product-id="${productId}"]`
    );
    if (!itemElement) return;
    const count = cart[productId] || 0;
    const cartControl = itemElement.querySelector('.menu__card-cart');

    if (count > 0) {
      cartControl.classList.add('cart__active-controls');
      cartControl.innerHTML = `
	<div class="cart__controls">
	<button class="cart__controls-btn cart__quantity-btn cart__controls-btn--minus" data-product-id="${productId}">-</button>
	<span class="cart__controls-count cart__quantity-count">${count}</span>
	<button class="cart__controls-btn cart__quantity-btn cart__controls-btn--plus" data-product-id="${productId}">+</button>
	</div>
	`;
    } else {
      cartControl.classList.remove('cart__active-controls');
      cartControl.innerHTML = '🛒';
    }
  }

  const productsData = {
    'set-1': {
      name: 'FRESH SET (22 kawałki)',
      price: 49.99,
      img: 'images/FRESH SET.jpg',
    },
    'set-2': {
      name: "FUTO'S MAKI (28 kawałków)",
      price: 65.0,
      img: 'images/FUTO.jpg',
    },
    'set-3': {
      name: 'CALIFORNIA LOVE (25 kawałków)',
      price: 59.5,
      img: 'images/CALIFORNIA.jpg',
    },
    'set-4': {
      name: 'PREMIUM GOLD (30 kawałków)',
      price: 89.99,
      img: 'images/PREMIUM.jpg',
    },
    'set-5': {
      name: 'VEGE HARU SET (18 kawałków)',
      price: 39.0,
      img: 'images/VEGE HARU.jpg',
    },
    'set-6': {
      name: 'FAMILY PARTY (50 kawałków)',
      price: 149.0,
      img: 'images/shusi FAMILY PARTY.jpg',
    },
    'maki-1': {
      name: 'HOSOMAKI SAKE (6 kawałków)',
      price: 12.0,
      img: 'images/maki HOSOMAKI SAKE.jpg',
    },
    'maki-2': {
      name: 'FUTOMAKI TEMPURA (6 kawałków)',
      price: 28.0,
      img: 'images/maki FUTOMAKI TEMPURA.jpg',
    },
    'maki-3': {
      name: 'SPICY TUNA MAKI (6 kawałków)',
      price: 22.0,
      img: 'images/maki SPICY TUNA.jpg',
    },
    'nigiri-1': {
      name: 'NIGIRI SAKE (2 kawałki)',
      price: 16.0,
      img: 'images/NIGIRI SAKE 2.jpg',
    },
    'nigiri-2': {
      name: 'NIGIRI MAGURO (2 kawałki)',
      price: 18.0,
      img: 'images/NIGIRI MAGURO 2.jpg',
    },
    'gyoza-1': {
      name: 'GYOZA WARZYWNA (5 sztuk)',
      price: 25.0,
      img: 'images/GYOZA WARZYWNA.jpg',
    },
    'gyoza-2': {
      name: 'GYOZA Z KURCZAKIEM I IMBIRREM (5 sztuk)',
      price: 27.0,
      img: 'images/GYOZA Z KURCZAKIEM.jpg',
    },
    'gyoza-3': {
      name: 'GYOZA Z KREWETKAMI I SZPARAGAMI (5 sztuk)',
      price: 30.0,
      img: 'images/GYOZA Z KREWETKAMI.jpg',
    },
    'ramen-1': {
      name: 'RAMEN CLASSIC',
      price: 39.0,
      img: 'images/RAMEN CLASSIC.jpg',
    },
    'ramen-2': {
      name: 'RAMEN SHOYU WEGE',
      price: 36.0,
      img: 'images/RAMEN SHOYU WEGE.jpg',
    },
    'ramen-3': {
      name: 'RAMEN TANTAN Z MIĘSEM',
      price: 39.0,
      img: 'images/RAMEN TANTAN Z MIĘSEM.jpg',
    },
    'addon-1': {
      name: 'Sos Sojowy Premium',
      price: 7.0,
      img: 'images/Sos Sojowy.jpg',
    },
    'addon-2': {
      name: 'Marynowany Imbir (50g)',
      price: 5.0,
      img: 'images/Marynowany Imbir.jpg',
    },
    'addon-3': {
      name: 'Wasabi Extra (15g)',
      price: 8.0,
      img: 'images/Wasabi Extra.jpg',
    },
  };
  function calculateSummary() {
    if (!isCartPage) return;

    let subtotal = 0;
    Object.entries(cart).forEach(([id, count]) => {
      if (productsData[id]) {
        subtotal += productsData[id].price * count;
      }
    });

    const selectedDelivery = document.querySelector(
      'input[name="delivery-method"]:checked'
    );
    const currentDeliveryCost = parseFloat(selectedDelivery?.value) || 0.0;
    const total = subtotal + currentDeliveryCost;

    const formatCurrency = (value) => `${value.toFixed(2)} zł`;

    if (summaryValueProducts)
      summaryValueProducts.textContent = formatCurrency(subtotal);
    if (summaryValueDelivery)
      summaryValueDelivery.textContent = formatCurrency(currentDeliveryCost);
    if (summaryValueTotal)
      summaryValueTotal.textContent = formatCurrency(total);

    if (deliveryCostDisplayLabel) {
      deliveryCostDisplayLabel.textContent =
        formatCurrency(currentDeliveryCost);
    }
  }

  function createCartItemHTML(productId, count) {
    const product = productsData[productId];
    if (!product) return '';

    const unitPrice = product.price;
    const totalPrice = unitPrice * count;

    return `
	<div class="cart__item" data-product-id="${productId}">
	<div class="cart__product">
	<div class="cart__image-wrapper">
	<img src="${product.img}" alt="${product.name}"/>
	</div>
	<div class="cart__product-details">
	<h3 class="cart__product-title">${product.name}</h3>
	<div class="cart__quantity-control">
	<button class="cart__quantity-btn cart__quantity-btn--minus" data-product-id="${productId}">-</button>
	<span class="cart__quantity-value" data-id="count">${count}</span>
	<button class="cart__quantity-btn cart__quantity-btn--plus" data-product-id="${productId}">+</button>
	</div>
	</div>
	</div>
	<div class="cart__price-area">
	<span class="cart__unit-price">${unitPrice.toFixed(2)} zł</span>
	<span class="cart__total-item-price" data-id="total-price">${totalPrice.toFixed(
    2
  )} zł</span>
	</div>
	<button class="cart__remove-btn" data-product-id="${productId}">❌</button>
	</div>
	`;
  }

  function renderCartPage() {
    if (!isCartPage || !cartItemsContainer) return;

    const itemIds = Object.keys(cart);

    const deliveryInfo = cartItemsContainer.querySelector(
      '.cart__delivery-info'
    );

    cartItemsContainer
      .querySelectorAll('.cart__item')
      .forEach((el) => el.remove());

    if (itemIds.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.classList.add('cart__empty-message');
      emptyMessage.innerHTML = `
        <h3>🛒 Twój koszyk jest pusty!</h3>
        <p>Dodaj produkty z <a href="index.html#menu-sections" style="font-weight: bold;">naszego menu</a>, aby kontynuować zamówienie.</p>
      `;
      cartItemsContainer.prepend(emptyMessage);
      const summaryBox = document.querySelector('.cart__summary-box');
      if (summaryBox) summaryBox.style.display = 'none';
      return;
    } else {
      const existingEmptyMsg = cartItemsContainer.querySelector(
        '.cart__empty-message'
      );
      if (existingEmptyMsg) existingEmptyMsg.remove();

      itemIds.forEach((id) => {
        if (!id.startsWith('addon')) {
          const html = createCartItemHTML(id, cart[id]);
          if (deliveryInfo) {
            deliveryInfo.insertAdjacentHTML('beforebegin', html);
          } else {
            cartItemsContainer.insertAdjacentHTML('beforeend', html);
          }
        }
      });

      itemIds.forEach((id) => {
        if (id.startsWith('addon')) {
          const html = createCartItemHTML(id, cart[id]);
          if (deliveryInfo) {
            deliveryInfo.insertAdjacentHTML('beforebegin', html);
          } else {
            cartItemsContainer.insertAdjacentHTML('beforeend', html);
          }
        }
      });

      const summaryBox = document.querySelector('.cart__summary-box');
      if (summaryBox) summaryBox.style.display = 'block';
    }

    calculateSummary();
  }

  function hideAllGroups() {
    if (!menuSection) return;
    categoryGroups.forEach((group) => (group.style.display = 'none'));
    mainMenuTitle.style.display = 'none';
  }

  function filterAndScrollMenu(category) {
    if (!menuSection) return;
    categories.forEach((l) =>
      l.classList.remove('menu__categories-link--active')
    );
    const activeCategoryLink = document.querySelector(
      `.menu__categories-link[data-category="${category}"]`
    );
    if (activeCategoryLink)
      activeCategoryLink.classList.add('menu__categories-link--active');

    hideAllGroups();

    if (category === 'all') {
      mainMenuTitle.style.display = 'block';
      categoryGroups.forEach((group) => (group.style.display = 'block'));
    } else {
      const targetGroup = document.querySelector(
        `.menu__category-group[data-group="${category}"]`
      );
      if (targetGroup) targetGroup.style.display = 'block';
    }
  }

  function checkMenuStickyState() {
    if (!categoriesBar || !menuSection) return;

    const stickyPoint = menuSection.offsetTop - stickyWrapper.offsetHeight;
    const isStickyCurrentlyActive = categoriesBar.classList.contains(
      'menu__categories--is-sticky'
    );

    if (shouldCategoriesBarBeSticky && window.scrollY >= stickyPoint) {
      categoriesBar.style.transition = '';
      categoriesBar.classList.add('menu__categories--is-sticky');
      categoriesBar.style.top = stickyWrapper.offsetHeight + 'px';
    } else if (isStickyCurrentlyActive && window.scrollY < stickyPoint) {
      categoriesBar.style.transition = 'none';
      categoriesBar.classList.remove('menu__categories--is-sticky');
      categoriesBar.style.top = '0';
      setTimeout(() => {
        categoriesBar.style.transition = '';
      }, 50);
    } else if (!shouldCategoriesBarBeSticky && isStickyCurrentlyActive) {
      categoriesBar.style.transition = 'none';
      categoriesBar.classList.remove('menu__categories--is-sticky');
      categoriesBar.style.top = '0';
    }
  }

  function handleScrollToTarget(targetId, isMenuCategoryClick = false) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const headerHeight = stickyWrapper.getBoundingClientRect().height;
    const categoriesHeight =
      categoriesBar && (isMenuCategoryClick || targetId === '#menu-sections')
        ? categoriesBar.getBoundingClientRect().height
        : 0;

    let offset = headerHeight + categoriesHeight;

    shouldCategoriesBarBeSticky =
      targetId === '#menu-sections' || isMenuCategoryClick;

    checkMenuStickyState();

    const targetScrollTop = targetElement.offsetTop - offset + 50;
    window.scrollTo({
      top: targetScrollTop > 0 ? targetScrollTop : 0,
      behavior: 'smooth',
    });

    if (targetId === '#menu-sections' && !isMenuCategoryClick) {
      filterAndScrollMenu('all');
    }
  }

  document.addEventListener('click', (e) => {
    const plusButton = e.target.closest(
      '.cart__controls-btn--plus, .cart__quantity-btn--plus'
    );
    const minusButton = e.target.closest(
      '.cart__controls-btn--minus, .cart__quantity-btn--minus'
    );

    const removeButton = e.target.closest('.cart__remove-btn');

    if (plusButton) {
      e.preventDefault();
      addToCart(plusButton.dataset.productId);
      return;
    }
    if (minusButton) {
      e.preventDefault();
      removeFromCart(minusButton.dataset.productId);
      return;
    }
    if (removeButton) {
      e.preventDefault();
      const productId = removeButton.dataset.productId;
      if (productId && cart[productId]) {
        delete cart[productId];
        saveCart();
        renderCartPage();
        updateCartCount();
        renderAddons();
        updateProductControls(productId);
      }
      return;
    }

    if (!isCartPage) {
      const cartIcon = e.target.closest('.menu__card-cart');
      if (cartIcon && !cartIcon.classList.contains('cart__active-controls')) {
        e.preventDefault();
        const productId = cartIcon.closest('.menu__card').dataset.productId;
        addToCart(productId);
        return;
      }
    } else {
      const addonCartIcon = e.target.closest(
        '#cart-addons .menu__card .menu__card-cart'
      );
      if (addonCartIcon) {
        e.preventDefault();
        const productId =
          addonCartIcon.closest('.menu__card').dataset.productId;
        addToCart(productId);
        return;
      }
    }

    if (!isCartPage) {
      const navLink = e.target.closest('.header__nav-link');
      const scrollBtn = e.target.closest('.js-scroll-btn');
      const categoryLink = e.target.closest('.menu__categories-link');
      const anchorLink = e.target.closest('a[href^="#"]');
      if (navLink) {
        e.preventDefault();
        const targetHref = navLink.getAttribute('href');
        if (targetHref === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          handleScrollToTarget(targetHref);
        }
        return;
      }
      if (scrollBtn) {
        e.preventDefault();
        handleScrollToTarget(scrollBtn.getAttribute('data-target'));
        return;
      }

      if (categoryLink) {
        e.preventDefault();
        const selectedCategory = categoryLink.dataset.category;
        filterAndScrollMenu(selectedCategory);
        handleScrollToTarget('#menu-sections', true);
        return;
      }

      if (anchorLink && anchorLink.getAttribute('href').length > 1) {
        const isHandled = navLink || scrollBtn || categoryLink;
        if (!isHandled) {
          e.preventDefault();
          handleScrollToTarget(anchorLink.getAttribute('href'));
        }
      }
    }
  });

  if (isCartPage) {
    deliveryOptions.forEach((option) => {
      option.addEventListener('change', calculateSummary);
    });

    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (Object.keys(cart).length === 0) {
          alert('Koszyk jest pusty. Nie można złożyć zamówienia.');
          return;
        }
        if (deliveryForm && deliveryForm.checkValidity()) {
          alert(
            `Zamówienie o wartości ${summaryValueTotal.textContent} zostało złożone! Dziękujemy.`
          );
        } else if (deliveryForm) {
          alert('Proszę wypełnić wszystkie wymagane pola dostawy.');
          deliveryForm.reportValidity();
        }
      });
    }
  }

  if (!isCartPage && stickyWrapper) {
    const allObservableSections = document.querySelectorAll('section[id]');
    const mainHeaderOffset = stickyWrapper.offsetHeight;

    const observerOptions = {
      root: null,
      rootMargin: `-${mainHeaderOffset + 15}px 0px -50% 0px`,
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const targetId = entry.target.id;
        const currentLink = document.querySelector(
          `.header__nav-link[href="#${targetId}"]`
        );

        if (currentLink) {
          if (entry.isIntersecting) {
            navLinks.forEach((l) =>
              l.classList.remove('header__nav-link--active')
            );
            currentLink.classList.add('header__nav-link--active');
          }
        }

        if (entry.target.id === 'menu-sections') {
          shouldCategoriesBarBeSticky = entry.isIntersecting;
          checkMenuStickyState();
        }
      });
    }, observerOptions);

    allObservableSections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', checkMenuStickyState);
  }

  const hamburger = document.querySelector('.header__hamburger');
  const nav = document.querySelector('.header__nav'); // <- klasa na <nav>, nie na <ul>

  function toggleMobileMenu() {
    nav.classList.toggle('is-open');
  }

  if (hamburger && nav) {
    hamburger.addEventListener('click', toggleMobileMenu);

    nav.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) toggleMobileMenu();
      })
    );
  }

  function renderAddons() {
    const addonsGrid = document.querySelector('#cart-addons .menu__grid');
    const cartItemsContainer = document.querySelector('.cart__items-container');
    if (!addonsGrid || !cartItemsContainer) return;

    Object.keys(productsData).forEach((productId) => {
      if (!productId.startsWith('addon')) return;

      const card = addonsGrid.querySelector(
        `.menu__card[data-product-id="${productId}"]`
      );
      if (!card) return;

      const count = cart[productId] || 0;
      const cartControl = card.querySelector('.menu__card-cart');

      if (count > 0) {
        cartControl.classList.add('cart__active-controls');
        cartControl.innerHTML = `
	<div class="cart__controls">
	<button class="cart__controls-btn cart__quantity-btn cart__controls-btn--minus" data-product-id="${productId}">-</button>
	<span class="cart__controls-count cart__quantity-count">${count}</span>
	<button class="cart__controls-btn cart__quantity-btn cart__controls-btn--plus" data-product-id="${productId}">+</button>
	</div>
	`;
      } else {
        cartControl.classList.remove('cart__active-controls');
        cartControl.innerHTML = '🛒';
      }

      const existingItem = cartItemsContainer.querySelector(
        `.cart__item[data-product-id="${productId}"]`
      );

      if (count > 0) {
        if (!existingItem) {
          const deliveryInfo = cartItemsContainer.querySelector(
            '.cart__delivery-info'
          );
          const itemHTML = createCartItemHTML(productId, count);
          if (deliveryInfo) {
            deliveryInfo.insertAdjacentHTML('beforebegin', itemHTML);
          } else {
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
          }
        } else {
          existingItem.querySelector('.cart__quantity-value').textContent =
            count;
          existingItem.querySelector('.cart__total-item-price').textContent =
            (productsData[productId].price * count).toFixed(2) + ' zł';
        }
      } else if (existingItem) {
        existingItem.remove();
      }
    });

    calculateSummary();
  }

  loadCart();
  updateCartCount();

  if (!isCartPage) {
    filterAndScrollMenu('all');
    document.querySelectorAll('.menu__card').forEach((card) => {
      const productId = card.dataset.productId;
      if (cart[productId]) updateProductControls(productId);
    });
  } else {
    renderCartPage();
    renderAddons();
  }

  window.renderCartPage = renderCartPage;
  window.renderAddons = renderAddons;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
});