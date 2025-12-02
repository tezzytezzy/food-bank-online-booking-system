import './style.css'

document.querySelector('#app').innerHTML = `
  <!-- Content will be injected here by individual pages if I were using a SPA, 
       but for wireframes I'll use separate HTML files for simplicity or just inject into #app.
       Actually, for wireframes with Vite, separate HTML files are easier to manage than a complex router.
       So main.js might just be for global styles and common scripts.
  -->
`
