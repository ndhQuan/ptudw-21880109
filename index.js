let express = require('express');
let app = express();

//Set Public Static Folder
app.use(express.static(__dirname + '/public'));

let expressHbs = require('express-handlebars');
let helper = require('./controllers/helper');
let paginateHelper = require('express-handlebars-paginate');
let hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    runtimeOptions: { allowProtoPropertiesByDefault: true },
    helpers: {
        createStarList: helper.creatStarList,
        createStars: helper.createStars,
        createPagination: paginateHelper.createPagination
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//Use Body-Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Use Cookie-parser
let cookieParser = require('cookie-parser');
app.use(cookieParser());

//Use Session
let session = require('express-session')
app.use(session({
    cookie: { httpOnly: true, maxAge: null},
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false
}))

// Use Cart Controller
let Cart = require('./controllers/cartController');
app.use((req,res,next) => {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    req.session.cart = cart;
    res.locals.totalQuantity = cart.totalQuantity;

    res.locals.fullname = req.session.user ? req.session.user.fullname : '';
    res.locals.isLoggedIn = req.session.user ? true : false;
    next();
})

// Define your routes here
// / => index
// /products => category
// /products/:id => single-product

// index.js => routes/..Router.js => controllers/..Controller.js
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productRouter'));
app.use('/cart', require('./routes/cartRouter'))
app.use('/comments', require('./routes/commentRouter'));
app.use('/reviews', require('./routes/reviewsRouter'))
app.use('/users', require('./routes/userRouter'));

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