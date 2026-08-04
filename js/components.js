
class SiteHeader extends HTMLElement {
    async connectedCallback() {
        const res = await fetch('components/header.html');
        this.innerHTML = await res.text();
        if(window.initNavbar) window.initNavbar();
    }
}
class SiteFooter extends HTMLElement {
    async connectedCallback() {
        const res = await fetch('components/footer.html');
        this.innerHTML = await res.text();
    }
}
customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
