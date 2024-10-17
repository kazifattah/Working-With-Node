// importing express
// setting portnumber

const express = require('express');

// importing database connection module
const db = require('./utils/database');

// importing module required to generate random greeting
const pokemon = require('./utils/random-greeting');

// console.log(pokemon.getRandomPokemon());


let pokemonname = pokemon.getRandomPokemon()[1];
let pokemonnumber = pokemon.getRandomPokemon()[0];


// What does this do?
// In 1996, a total of 151 pokemon was released(today there are over 1000)!
// This function generates a random pokemon name from the original 151 everytime the server reloads
// When the homepage loads it will have a greeting message that contains this random Pokemon
// There is also a link that will take the user to learn more about the pokemon

// establishing database connection
db.connect((err)=>{
    if(err) throw err;
    console.log('Successfully connected to contacts database')
    // 
});



const app = express();
const port = 8000;

// importing the node module that deals with path
// retrieving the directory for the application

// const path = require('path');
// const rootDir = path.dirname(require.main.filename);

// setting the templating engine to ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));


// calling a middleware method to access css file within the public directory
app.use('/public', express.static('public'));


// EXPRESS
// --------------------------------------------------------------- //

// using express to create endpoint for html pages

/*
app.get('/', (req,res)=>{
    res.sendFile(path.join(rootDir, "views", "homepage.html"));
});

app.get('/contact', (req,res)=>{
    res.sendFile(path.join(rootDir, "views", "contact.html"));
});

app.get('/about', (req,res)=>{
    res.sendFile(path.join(rootDir, "views", "about.html"));
});

app.use((req,res) =>{
    res.sendFile(path.join(rootDir, "views", "404.html"));
}); 
*/



// EJS
// --------------------------------------------------------------- //

// using ejs to serve webpages

app.get('/',(req,res)=>{
    res.render('homepage', {pokemonname, pokemonnumber}); // sends the random pokemon name generated into the ejs page
});

app.get('/about',(req,res)=>{
    res.render('about');
});

app.get('/contact',(req,res)=>{
    res.render('contact');
});

app.get('/thankyou', (req,res)=>{
    res.render("thank-you");

});

// DATABASE
// --------------------------------------------------------------- //



// receiving data fed into contact form and console logging the result
// redirecting user to thank-you page once they have entered their info

app.post('/contact', (req,res)=>{
    console.log("Here is the contact info received:", req.body);
    
    // inputting user info into the database
    const {firstname, lastname, email, phone, city, province, postalcode} = req.body;
    const sql =
    'INSERT INTO contactinfo (firstname, lastname, email, phone, city, province, postalcode) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql,[firstname, lastname, email, phone, city, province, postalcode], (err,result)=>{
        if(err) throw(err);
        // redirecting user to thank-you page once they have entered their info
        res.render("thank-you", {firstname: req.body.firstname, lastname:req.body.lastname, email: req.body.email});    
    });
    
});


// reading database that contains the contact info
// this endpoint will not be available to access by people visiting the website
// so I did not include any links to it
// this is only for backend users so they are able to view people who have inputted their contact info

app.get('/userlog',(req,res)=>{

    
    const sql = 'select * from contactinfo';

    
    db.query(sql,(err, result, field)=>{
        if(err) throw err;
        // console.log(result);
        res.render('userlog', {contactinfo:result});
        // console.log(field);
    });
});

// endpoint to edit contact info

app.get('/edit/:id', (req,res)=>{
    // console.log(req.params);
    const sql = 'select * from contactinfo where id=?';
    db.query(sql,[req.params.id], (err,result)=>{
        // console.log(result);
        res.render('edit',{contactinfo:result[0]});
    });
});

app.post('/edit/:id',(req,res)=>{
    const {firstname, lastname, email, phone, city, province, postalcode} = req.body;
    const sql= 'UPDATE contactinfo SET firstname = ?,lastname=?, email=?, phone=?, city=?, province=?, postalcode=? WHERE (id = ?)';

    // 'update contactinfo'+
    // ' set firstname=?, lastname=?, email=?, phone=?, city=? province=?, postalcode=?'+
    // ' where id =?';
    db.query(sql, [firstname, lastname, email, phone, city, province, postalcode, req.params.id], (err,result)=>{
        if(err) throw err
        console.log("info updated");
        res.redirect('/');
    });

});

// endpoint to delete contact info

app.get('/delete/:id', (req,res)=>{
    // console.log(req.params);
    const sql= 'DELETE FROM contactinfo WHERE (id = ?)';
    db.query(sql,[req.params.id], (err,result)=>{
        // console.log(result);
        res.redirect('/userlog');
    });
});




// endpoint for the 404 page

app.use((req,res)=>{
    res.render('404');
});

// starting the server

app.listen(port, ()=>{
    console.log("the server is running on port 8000")
});