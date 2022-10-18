let express = require('express');
let app = express();

//Set Public Static Folder
app.use(express.static(__dirname + '/public'));

let expressHbs = require('express-handlebars');
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    runtimeOptions: { allowProtoPropertiesByDefault: true },
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Define your routes here
// / => index
// /products => category
// /products/:id => single-product

// index.js => routes/..Router.js => controllers/..Controller.js
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));

app.get('/sync', (req,res) => {
    let models = require('./models');
    models.sequelize.sync().then(() => {
        res.send('database sync completed!')
    })
})

app.get('/:page', (req, res) => {
    let banners = {
        blog: 'Our Blog',
        category: 'Shop Category',
        cart: 'Shopping Cart',
        checkout: 'Product Checkout',
        confirmation: 'Order Confirmation',
        contact: 'Contact Us',
        login: 'Login / Register',
        register: 'Register',
        'single-blog': 'Blog Details',
        'single-product': 'Shop Single',
        'tracking-order': 'Order Tracking',
    }
    let page = req.params.page;
    res.render(page, {banner: banners[page]});
})

// Set Server Port & Start Server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`);
})