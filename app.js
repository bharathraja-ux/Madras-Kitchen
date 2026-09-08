/**
 * Madras Kitchen — Main Application & Interactive Ordering Logic
 * Brand: Madras Kitchen (மெட்ராஸ் கிச்சன்)
 */

// Global Cart State
let cart = {};
let currentServiceType = 'dine-in';

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileDrawer();
  initMenuFilters();
  initActiveNavLinkObserver();
  initCopyrightYear();
  initOrderingSystem();
});

/**
 * 1. Sticky Navigation Bar Scroll Effect
 */
function initNavbarScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Mobile Drawer Menu
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('drawer-close-btn');
  const backdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
      toggleBtn.focus();
    }
  });
}

/**
 * 3. Menu Category Filtering
 */
function initMenuFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!filterButtons.length || !menuCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const filterValue = button.getAttribute('data-filter');

      menuCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        const match = (filterValue === 'all') || categories.toLowerCase().includes(filterValue.toLowerCase());

        if (match) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 240ms ease, transform 240ms ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * 4. Active Link Observer on Scroll
 */
function initActiveNavLinkObserver() {
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * 5. Dynamic Footer Year
 */
function initCopyrightYear() {
  const yearEl = document.getElementById('year-copy');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * 6. INTERACTIVE CART & ORDER MODAL SYSTEM
 */
function initOrderingSystem() {
  // Modal Elements
  const modal = document.getElementById('order-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const openCartBtn = document.getElementById('open-cart-btn');
  const mobileCartTrigger = document.getElementById('mobile-cart-trigger');
  const drawerCartBtn = document.getElementById('drawer-cart-btn');
  const heroOrderOnlineBtn = document.getElementById('hero-order-online-btn');
  const finalCtaOrder = document.getElementById('final-cta-order');
  const toastViewBtn = document.getElementById('toast-view-btn');

  // Form & View Elements
  const orderCreationView = document.getElementById('order-creation-view');
  const orderReceiptSlip = document.getElementById('order-receipt-slip');
  const orderDetailsForm = document.getElementById('order-details-form');
  const btnClearCart = document.getElementById('btn-clear-cart');
  const btnNewOrder = document.getElementById('btn-new-order');
  const serviceTabs = document.querySelectorAll('.order-tab');

  // Toast
  const toast = document.getElementById('order-toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  // Open Modal
  const openOrderModal = () => {
    if (!modal) return;
    renderCartList();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  // Close Modal
  const closeOrderModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attach Open Triggers
  const openTriggers = [openCartBtn, mobileCartTrigger, drawerCartBtn, heroOrderOnlineBtn, finalCtaOrder, toastViewBtn];
  openTriggers.forEach(el => {
    if (el) el.addEventListener('click', (e) => {
      e.preventDefault();
      // If mobile drawer is open, close drawer first
      const drawer = document.getElementById('mobile-nav-drawer');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
      }
      openOrderModal();
    });
  });

  // Attach Close Triggers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeOrderModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeOrderModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeOrderModal();
    }
  });

  // Service Mode Tabs (Dine-in / Takeaway / Delivery)
  serviceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      serviceTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      currentServiceType = tab.getAttribute('data-type');
      updateServiceFormFields(currentServiceType);
    });
  });

  function updateServiceFormFields(type) {
    const dineFields = document.getElementById('fields-dine-in');
    const takeawayFields = document.getElementById('fields-takeaway');
    const deliveryFields = document.getElementById('fields-delivery');

    const tableInput = document.getElementById('dine-table');
    const takeawayName = document.getElementById('takeaway-name');
    const takeawayPhone = document.getElementById('takeaway-phone');
    const deliveryName = document.getElementById('delivery-name');
    const deliveryPhone = document.getElementById('delivery-phone');
    const deliveryAddress = document.getElementById('delivery-address');

    // Reset visibility and required status
    if (dineFields) dineFields.classList.add('hidden');
    if (takeawayFields) takeawayFields.classList.add('hidden');
    if (deliveryFields) deliveryFields.classList.add('hidden');

    if (tableInput) tableInput.required = false;
    if (takeawayName) takeawayName.required = false;
    if (takeawayPhone) takeawayPhone.required = false;
    if (deliveryName) deliveryName.required = false;
    if (deliveryPhone) deliveryPhone.required = false;
    if (deliveryAddress) deliveryAddress.required = false;

    if (type === 'dine-in') {
      if (dineFields) dineFields.classList.remove('hidden');
      if (tableInput) tableInput.required = true;
    } else if (type === 'takeaway') {
      if (takeawayFields) takeawayFields.classList.remove('hidden');
      if (takeawayName) takeawayName.required = true;
      if (takeawayPhone) takeawayPhone.required = true;
    } else if (type === 'delivery') {
      if (deliveryFields) deliveryFields.classList.remove('hidden');
      if (deliveryName) deliveryName.required = true;
      if (deliveryPhone) deliveryPhone.required = true;
      if (deliveryAddress) deliveryAddress.required = true;
    }
  }

  // Add to Order Buttons on Menu Cards
  const addButtons = document.querySelectorAll('.btn-add-order');
  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dishName = btn.getAttribute('data-dish');
      const dishCat = btn.getAttribute('data-cat') || 'Popular';

      addToCart(dishName, dishCat);

      // Visual feedback on button
      const originalHTML = btn.innerHTML;
      btn.classList.add('added');
      btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Added`;

      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = originalHTML;
      }, 1200);

      // Trigger Toast
      showToast(`Added ${dishName} to order!`);
    });
  });

  function addToCart(name, tag) {
    if (cart[name]) {
      cart[name].qty += 1;
    } else {
      cart[name] = {
        name: name,
        tag: tag,
        qty: 1
      };
    }
    updateCartBadges();
    renderCartList();
  }

  function updateCartBadges() {
    let totalItems = 0;
    Object.values(cart).forEach(item => {
      totalItems += item.qty;
    });

    const navBadge = document.getElementById('nav-cart-count');
    const mobileBadge = document.getElementById('mobile-cart-count');
    const drawerBadge = document.getElementById('drawer-cart-count');
    const modalTotalQty = document.getElementById('modal-items-total-qty');

    if (navBadge) navBadge.textContent = totalItems;
    if (mobileBadge) mobileBadge.textContent = totalItems;
    if (drawerBadge) drawerBadge.textContent = totalItems;
    if (modalTotalQty) modalTotalQty.textContent = totalItems;
  }

  function renderCartList() {
    const listContainer = document.getElementById('order-items-list');
    const emptyState = document.getElementById('empty-cart-state');
    if (!listContainer) return;

    const items = Object.values(cart);

    if (items.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-cart-state" id="empty-cart-state">
          <div class="empty-icon">🍜</div>
          <p class="empty-title">Your order is currently empty</p>
          <span class="empty-desc">Click "+ Add to Order" on any dish in the Popular Menu below to add your favourites.</span>
        </div>
      `;
      return;
    }

    let html = '';
    items.forEach(item => {
      html += `
        <div class="order-item-row" data-dish="${item.name}">
          <div class="item-left">
            <span class="item-name">${item.name}</span>
            <span class="item-tag">${item.tag} • Satisfying portion</span>
          </div>
          <div class="item-stepper">
            <button type="button" class="stepper-btn btn-qty-minus" aria-label="Decrease quantity">−</button>
            <span class="stepper-count">${item.qty}</span>
            <button type="button" class="stepper-btn btn-qty-plus" aria-label="Increase quantity">+</button>
            <button type="button" class="btn-remove-item" aria-label="Remove item">&times;</button>
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;

    // Attach row stepper listeners
    listContainer.querySelectorAll('.order-item-row').forEach(row => {
      const dish = row.getAttribute('data-dish');
      const minusBtn = row.querySelector('.btn-qty-minus');
      const plusBtn = row.querySelector('.btn-qty-plus');
      const removeBtn = row.querySelector('.btn-remove-item');

      if (minusBtn) {
        minusBtn.addEventListener('click', () => {
          if (cart[dish]) {
            cart[dish].qty -= 1;
            if (cart[dish].qty <= 0) {
              delete cart[dish];
            }
            updateCartBadges();
            renderCartList();
          }
        });
      }

      if (plusBtn) {
        plusBtn.addEventListener('click', () => {
          if (cart[dish]) {
            cart[dish].qty += 1;
            updateCartBadges();
            renderCartList();
          }
        });
      }

      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          delete cart[dish];
          updateCartBadges();
          renderCartList();
        });
      }
    });
  }

  // Clear Cart Button
  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      if (Object.keys(cart).length === 0) return;
      if (confirm('Clear all items from your order tray?')) {
        cart = {};
        updateCartBadges();
        renderCartList();
      }
    });
  }

  // Toast Notification
  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Form Submission
  if (orderDetailsForm) {
    orderDetailsForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const items = Object.values(cart);
      if (items.length === 0) {
        alert('Please add at least one dish to your order before submitting!');
        return;
      }

      const formData = new FormData(orderDetailsForm);
      const refCode = '#MK-' + Math.floor(1000 + Math.random() * 9000);

      // Generate Summary Slip
      let summaryHTML = `
        <div style="margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(0,0,0,0.08);">
          <strong>Service Type:</strong> ${currentServiceType.toUpperCase()}
        </div>
      `;

      if (currentServiceType === 'dine-in') {
        summaryHTML += `
          <div class="receipt-item-row"><span>Table:</span><strong>${formData.get('table')}</strong></div>
          <div class="receipt-item-row"><span>Guest:</span><span>${formData.get('name') || 'Guest'}</span></div>
          ${formData.get('notes') ? `<div class="receipt-item-row"><span>Notes:</span><span>${formData.get('notes')}</span></div>` : ''}
        `;
      } else if (currentServiceType === 'takeaway') {
        summaryHTML += `
          <div class="receipt-item-row"><span>Customer:</span><strong>${formData.get('name')}</strong></div>
          <div class="receipt-item-row"><span>Phone:</span><span>${formData.get('phone')}</span></div>
          <div class="receipt-item-row"><span>Pickup:</span><span>${formData.get('pickup_time')}</span></div>
        `;
      } else if (currentServiceType === 'delivery') {
        summaryHTML += `
          <div class="receipt-item-row"><span>Customer:</span><strong>${formData.get('name')}</strong></div>
          <div class="receipt-item-row"><span>Phone:</span><span>${formData.get('phone')}</span></div>
          <div class="receipt-item-row"><span>Address:</span><span>${formData.get('address')}</span></div>
          ${formData.get('landmark') ? `<div class="receipt-item-row"><span>Landmark:</span><span>${formData.get('landmark')}</span></div>` : ''}
        `;
      }

      summaryHTML += `<div style="margin-top: 0.85rem; padding-top: 0.65rem; border-top: 1px solid rgba(0,0,0,0.08);"><strong>Ordered Items:</strong></div>`;
      items.forEach(item => {
        summaryHTML += `
          <div class="receipt-item-row">
            <span>${item.qty}x ${item.name} (${item.tag})</span>
            <span style="color: #666;">Portion ok</span>
          </div>
        `;
      });

      const receiptRefCode = document.getElementById('receipt-ref-code');
      const receiptSummaryContent = document.getElementById('receipt-summary-content');

      if (receiptRefCode) receiptRefCode.textContent = refCode;
      if (receiptSummaryContent) receiptSummaryContent.innerHTML = summaryHTML;

      // Switch to Confirmation Receipt View
      if (orderCreationView) orderCreationView.classList.add('hidden');
      if (orderReceiptSlip) orderReceiptSlip.classList.remove('hidden');

      // Reset cart
      cart = {};
      updateCartBadges();
      orderDetailsForm.reset();
    });
  }

  // Reset View to Place Another Order
  if (btnNewOrder) {
    btnNewOrder.addEventListener('click', () => {
      if (orderReceiptSlip) orderReceiptSlip.classList.add('hidden');
      if (orderCreationView) orderCreationView.classList.remove('hidden');
      renderCartList();
    });
  }
}
