/* =========================================================
   Tahawa homepage clone — main.js
   Render nội dung từ data.js và gắn các hành vi tương tác.
   ========================================================= */
(function () {
  'use strict';

  var D = window.TAHAWA_DATA;
  var M = window.TAHAWA_MENU;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  var link = function (href) { return href ? esc(href) : '#'; };

  /* ---------------- Menu ---------------- */
  function renderMenus() {
    // Menu ngang desktop
    $('[data-main-menu]').innerHTML = M.menu.map(function (m, i) {
      var sub = m.sub.length
        ? '<ul class="sub-menu">' + m.sub.map(function (s) {
            return '<li><a href="' + link(s.href) + '">' + esc(s.t) + '</a></li>';
          }).join('') + '</ul>'
        : '';
      return '<li class="' + (i === 0 ? 'active' : '') + (m.sub.length ? ' dropdown' : '') + '">' +
        '<a href="' + link(m.href) + '"> ' + esc(m.t) + (m.sub.length ? ' <i class="fas fa-angle-down"></i>' : ' ') + '</a>' + sub + '</li>';
    }).join('');

    // Danh mục dọc desktop
    var catItems = M.cats.map(function (c) {
      var cls = [c.sub.length ? 'has-sub' : '', c.hidden ? 'is-hidden' : ''].join(' ').trim();
      var popup = c.sub.length
        ? '<div class="wrap-popup"><div class="popup"><ul>' + c.sub.map(function (s) {
            return '<li><a href="' + link(s.href) + '"> ' + esc(s.t) + ' </a></li>';
          }).join('') + '</ul></div></div>'
        : '';
      return '<li' + (cls ? ' class="' + cls + '"' : '') + '><a href="' + link(c.href) + '"> ' + esc(c.t) + ' </a>' + popup + '</li>';
    }).join('');
    $('[data-cat-menu]').innerHTML = '<ul>' + catItems + '<li class="more"><a class="more-toggle"> Xem thêm ...</a></li></ul>';

    // Mobile
    var mItem = function (t, href, sub) {
      var subHtml = sub && sub.length
        ? '<span class="m-toggle"><i class="fa fa-plus"></i></span><ul class="m-sub">' + sub.map(function (s) {
            return '<li><a href="' + link(s.href) + '">' + esc(s.t) + '</a></li>';
          }).join('') + '</ul>'
        : '';
      return '<li><a href="' + link(href) + '"> ' + esc(t) + ' </a>' + subHtml + '</li>';
    };
    $('[data-mobile-menu]').innerHTML = M.menu.map(function (m) { return mItem(m.t, m.href, m.sub); }).join('');
    $('[data-mobile-cat]').innerHTML = M.cats.map(function (c) { return mItem(c.t, c.href, c.sub); }).join('');
  }

  /* ---------------- Templates ---------------- */
  var picture = function (lg, sm, alt) {
    return '<picture>' +
      (lg ? '<source media="(min-width: 650px)" srcset="' + esc(lg) + '">' : '') +
      (sm ? '<source media="(min-width: 350px)" srcset="' + esc(sm) + '">' : '') +
      '<img src="' + esc(lg || sm) + '" alt="' + esc(alt || 'Tahawa') + '" draggable="false"></picture>';
  };
  var stars = '<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>';

  function productCard(p) {
    var buttons;
    if (p.btn === 'contact') {
      buttons = '<a href="' + link(p.bhref) + '" class="btn-item btn-contact"><i class="fa fa-phone-alt"></i> <span>Liên hệ</span></a>';
    } else if (p.btn === 'link') {
      buttons = '<a href="' + link(p.bhref) + '" class="btn-item" rel="nofollow"><i class="fa fa-shopping-cart"></i> <span>MUA NGAY</span></a>';
    } else {
      buttons = '<div class="product-buttons-group">' +
        '<button type="button" class="btn-item buy_now"><i class="fa fa-shopping-basket"></i> <span>Mua ngay</span></button>' +
        '<button type="button" class="btn-item add_to_cart"><i class="fa fa-shopping-cart"></i> <span>Thêm vào giỏ hàng</span></button>' +
        '</div>';
    }
    return '<div class="product-item">' +
      '<figure class="photoframe">' +
        '<div class="img-product"><a href="' + link(p.href) + '"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" draggable="false"></a></div>' +
        '<figcaption class="infor-product">' +
          '<h3 class="product-title"><a href="' + link(p.href) + '" class="two-lines">' + esc(p.name) + '</a></h3>' +
          '<div class="review">' + stars + '</div>' +
          '<p class="price"><strong class="new">' + esc(p.price) + '</strong>' +
            (p.old ? ' <span class="old">' + esc(p.old) + '</span>' : '') +
            (p.disc ? ' <span class="label-discount">' + esc(p.disc) + '</span>' : '') + ' </p>' +
          '<div class="btn-purchased">' + buttons + '</div>' +
        '</figcaption>' +
      '</figure>' +
    '</div>';
  }

  function postCard(p) {
    return '<div class="post-item">' +
      '<figure class="photoframe">' +
        '<div class="img-post"><a href="' + link(p.href) + '"><img src="' + esc(p.img) + '" alt="' + esc(p.title) + '" loading="lazy" draggable="false"></a></div>' +
        '<figcaption class="info-post">' +
          '<div class="post-title"><a href="' + link(p.href) + '" class="two-lines">' + esc(p.title) + '</a></div>' +
          '<p class="post-view-date"><span class="post-date"><i class="fas fa-calendar-alt"></i> ' + esc(p.date) + ' <span> | </span></span>' +
          '<span class="post-item-view"><i class="fas fa-eye"></i> ' + esc(p.views) + '</span></p>' +
          '<div class="description">' + p.desc + '</div>' +
        '</figcaption>' +
      '</figure>' +
    '</div>';
  }

  function liteYT(id, thumb) {
    return '<div class="lite-yt" data-id="' + esc(id) + '" style="background-image:url(assets/img/youtube/vi/' + esc(id) + '/' + thumb + '.jpg)">' +
      '<button type="button" class="lty-playbtn" aria-label="Play"></button></div>';
  }

  /* ---------------- Render sections ---------------- */
  function renderSections() {
    $('[data-hero]').innerHTML = D.hero.map(function (h) {
      var pic = picture(h.lg, h.sm, 'Tahawa - Thiết Bị Công Nghiệp Nhật Bản Chính Hãng');
      return '<div class="hero-item">' + (h.href ? '<a href="' + link(h.href) + '">' + pic + '</a>' : pic) + '</div>';
    }).join('');

    $('[data-cats]').innerHTML = D.cats.map(function (c) {
      return '<div class="cat-item"><a href="' + link(c.href) + '">' + picture(c.lg, c.sm) + '</a></div>';
    }).join('');

    $$('[data-banners]').forEach(function (box) {
      var list = D.banners[box.dataset.banners] || [];
      box.innerHTML = list.map(function (b) {
        var img = '<img src="' + esc(b.img) + '" alt="Tahawa - Thiết Bị Công Nghiệp Nhật Bản Chính Hãng" loading="lazy">';
        var inner = b.href ? '<a href="' + link(b.href) + '"' + (b.target ? ' target="_blank" rel="noopener"' : '') + '>' + img + '</a>' : img;
        return box.classList.contains('banner-single') ? inner : '<div>' + inner + '</div>';
      }).join('');
    });

    $$('[data-heading]').forEach(function (h) { h.textContent = D.products[h.dataset.heading].heading; });

    $$('[data-product-carousel]').forEach(function (box) {
      box.innerHTML = D.products[box.dataset.productCarousel].items.map(productCard).join('');
    });

    $$('[data-product-grid]').forEach(function (box) {
      var cols = box.dataset.cols;
      box.innerHTML = D.products[box.dataset.productGrid].items.map(function (p) {
        return '<div class="' + cols + '">' + productCard(p) + '</div>';
      }).join('');
    });

    $('[data-partners]').innerHTML = D.partners.map(function (p) {
      return '<a class="partner-item" href="' + link(p.href) + '" target="_blank" rel="nofollow noopener"><img src="' + esc(p.img) + '" alt="' + esc(p.alt) + '" draggable="false"></a>';
    }).join('');

    $$('[data-posts]').forEach(function (box) {
      box.innerHTML = D[box.dataset.posts].map(postCard).join('');
    });

    $('[data-videos]').innerHTML = D.videos.map(function (id) { return liteYT(id, 'hqdefault'); }).join('');
    $('[data-video-single]').innerHTML = liteYT(D.video2, 'mqdefault');

    $('[data-testimonials]').innerHTML = D.testimonials.map(function (t) {
      return '<div class="client-item">' +
        '<img src="' + esc(t.img) + '" alt="' + esc(t.name) + '" draggable="false">' +
        '<div class="author-info"><strong><a href="#">' + esc(t.name) + '</a> </strong></div>' +
        '<blockquote><p>' + esc(t.text) + '</p></blockquote>' +
      '</div>';
    }).join('');
  }

  /* ---------------- Danh mục: Xem thêm / Thu gọn ---------------- */
  function slideToggle(el, show, done) {
    var start = el.offsetHeight;
    el.style.overflow = 'hidden';
    el.style.display = 'block';
    var end = show ? el.scrollHeight : 0;
    if (show) { el.style.height = '0px'; start = 0; }
    el.style.height = start + 'px';
    void el.offsetHeight;
    el.style.transition = 'height 400ms ease';
    el.style.height = end + 'px';
    setTimeout(function () {
      el.style.transition = el.style.height = el.style.overflow = '';
      el.style.display = show ? 'block' : 'none';
      if (done) done();
    }, 410);
  }

  function bindCategory() {
    document.addEventListener('click', function (e) {
      var more = e.target.closest('.cat-menu .more');
      if (!more) return;
      var expanded = more.classList.toggle('less');
      more.innerHTML = '<a class="more-toggle"> ' + (expanded ? 'Thu gọn' : 'Xem thêm ...') + '</a>';
      $$('.is-hidden', more.parentNode).forEach(function (li) { slideToggle(li, expanded); });
    });
  }

  /* ---------------- Mobile menu ---------------- */
  function setPanelHeight() {
    var panel = $('.m-nav__panel');
    var bar = $('.hm-bar');
    if (!panel || window.innerWidth > 991) return;
    var h = bar.offsetHeight + (bar.classList.contains('is-fixed') ? 0 : $('.topbar').offsetHeight);
    panel.style.height = window.innerHeight - h + 'px';
  }

  function bindMobileMenu() {
    $('.m-nav__toggle').addEventListener('click', function (e) {
      e.preventDefault();
      setPanelHeight();
      $('.m-nav').classList.toggle('is-open');
    });
    $('.m-nav__panel').addEventListener('click', function (e) {
      var t = e.target.closest('.m-toggle');
      if (!t) return;
      e.preventDefault();
      var sub = t.nextElementSibling;
      var open = getComputedStyle(sub).display === 'none';
      t.querySelector('i').className = open ? 'fa fa-minus' : 'fa fa-plus';
      slideToggle(sub, open);
    });
  }

  /* ---------------- Sticky header ---------------- */
  function bindSticky() {
    var dBar = $('.hd-bar'), dSpacer = $('.header-desktop .hd-sticky-spacer');
    var mBar = $('.hm-bar'), mSpacer = $('.header-mobile .hd-sticky-spacer');
    var page = $('#page-content');

    function fix(bar, spacer, on) {
      if (on === bar.classList.contains('is-fixed')) return;
      if (on) {
        spacer.style.height = bar.offsetHeight + 'px';
        spacer.style.display = 'block';
        bar.classList.add('is-fixed');
      } else {
        bar.classList.remove('is-fixed');
        spacer.style.display = 'none';
      }
      setPanelHeight();
    }

    function onScroll() {
      var y = window.pageYOffset;
      if (window.innerWidth >= 992) {
        fix(mBar, mSpacer, false);
        var top = page.getBoundingClientRect().top + y;
        fix(dBar, dSpacer, y > top);
      } else {
        fix(dBar, dSpacer, false);
        var anchor = mBar.classList.contains('is-fixed') ? mSpacer : mBar;
        var t = anchor.getBoundingClientRect().top + y;
        fix(mBar, mSpacer, y > t);
      }
      // nút lên đầu trang
      toggleScrollTop(y > 200);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------------- Scroll to top (fadeIn/fadeOut 400ms) ---------------- */
  var stt, sttVisible = false;
  function toggleScrollTop(show) {
    if (show === sttVisible) return;
    sttVisible = show;
    stt.style.transition = 'opacity 400ms';
    if (show) {
      stt.style.display = 'block';
      stt.style.opacity = '0';
      void stt.offsetWidth;
      stt.style.opacity = '1';
    } else {
      stt.style.opacity = '0';
      setTimeout(function () { if (!sttVisible) stt.style.display = 'none'; }, 400);
    }
  }
  function smoothScrollTop() {
    var start = window.pageYOffset, t0 = null, dur = 600;
    var ease = function (p) { return 0.5 - Math.cos(p * Math.PI) / 2; }; // jQuery "swing"
    requestAnimationFrame(function stepFn(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      window.scrollTo(0, start * (1 - ease(p)));
      if (p < 1) requestAnimationFrame(stepFn);
    });
  }

  /* ---------------- Lite YouTube ---------------- */
  function bindYouTube() {
    document.addEventListener('click', function (e) {
      var box = e.target.closest('.lite-yt');
      if (!box || box.classList.contains('is-activated')) return;
      box.classList.add('is-activated');
      var f = document.createElement('iframe');
      f.width = 560; f.height = 315;
      f.title = 'Play';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(box.dataset.id) + '?autoplay=1';
      box.appendChild(f);
      f.focus();
    });
  }

  /* ---------------- Giỏ hàng (mô phỏng) ---------------- */
  function bindCart() {
    var count = 0, timer;
    var notify = $('.notify-cart');
    function show() {
      notify.style.display = 'block';
      notify.style.opacity = '0';
      notify.style.transition = 'opacity 600ms';
      void notify.offsetWidth;
      notify.style.opacity = '1';
      clearTimeout(timer);
      timer = setTimeout(hide, 3000);
    }
    function hide() {
      notify.style.opacity = '0';
      setTimeout(function () { notify.style.display = 'none'; }, 600);
    }
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.add_to_cart, .buy_now');
      if (btn) {
        e.preventDefault();
        count++;
        $$('.mini-cart__num').forEach(function (n) { n.textContent = count; });
        if (btn.classList.contains('add_to_cart')) show();
        return;
      }
      if (e.target.closest('.notify-cart__close')) hide();
    });
  }

  /* ---------------- Captcha (vẽ bằng canvas) + form ---------------- */
  function drawCaptcha(canvas) {
    var ctx = canvas.getContext('2d');
    var chars = 'abcdefghkmnpqrstuvwxyz23456789';
    var code = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var l = 0; l < 6; l++) {
      ctx.strokeStyle = 'hsl(' + Math.random() * 360 + ',60%,60%)';
      ctx.beginPath();
      ctx.moveTo(Math.random() * 120, Math.random() * 36);
      ctx.bezierCurveTo(Math.random() * 120, Math.random() * 36, Math.random() * 120, Math.random() * 36, Math.random() * 120, Math.random() * 36);
      ctx.stroke();
    }
    for (var i = 0; i < 5; i++) {
      var ch = chars[Math.floor(Math.random() * chars.length)];
      code += ch;
      ctx.save();
      ctx.translate(8 + i * 22, 26);
      ctx.rotate((Math.random() - 0.5) * 0.6);
      ctx.font = (20 + Math.random() * 8) + 'px Georgia, serif';
      ctx.fillStyle = 'hsl(' + Math.random() * 360 + ',55%,40%)';
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    }
    canvas.dataset.code = code;
  }

  function bindNewsletter() {
    var form = $('.newsletter__form');
    var canvas = $('.captcha-img', form);
    drawCaptcha(canvas);
    $('.regen-captcha', form).addEventListener('click', function (e) { e.preventDefault(); drawCaptcha(canvas); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[required]', form).forEach(function (inp) {
        var bad = !inp.value.trim();
        if (inp.name === 'captcha' && !bad) bad = inp.value.trim().toLowerCase() !== canvas.dataset.code;
        inp.classList.toggle('is-invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      form.reset();
      drawCaptcha(canvas);
      $('.notify-cart__text').textContent = 'Đăng ký thành công!';
      $('.notify-cart__view').style.display = 'none';
      var n = $('.notify-cart');
      n.style.display = 'block'; n.style.opacity = '1';
      setTimeout(function () {
        n.style.display = 'none';
        $('.notify-cart__text').textContent = 'Đã thêm vào giỏ hàng';
        $('.notify-cart__view').style.display = '';
      }, 2500);
    });
    $$('.form-control', form).forEach(function (inp) {
      inp.addEventListener('input', function () { inp.classList.remove('is-invalid'); });
    });
  }

  /* ---------------- Search placeholder (giống onfocus/onblur gốc) ---------------- */
  function bindSearch() {
    $$('.search-form input').forEach(function (inp) {
      var ph = inp.placeholder;
      inp.addEventListener('focus', function () { inp.placeholder = ph; });
      inp.addEventListener('blur', function () { if (!inp.value) inp.placeholder = ph; });
    });
  }

  /* ---------------- Init ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderMenus();
    renderSections();
    $$('.carousel').forEach(function (el) { new window.TahawaCarousel(el); });
    stt = $('.scroll-to-top');
    stt.addEventListener('click', function (e) { e.preventDefault(); smoothScrollTop(); });
    bindCategory();
    bindMobileMenu();
    bindSticky();
    bindYouTube();
    bindCart();
    bindNewsletter();
    bindSearch();
    window.addEventListener('resize', setPanelHeight);
  });
})();
