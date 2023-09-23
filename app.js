console.log("Hello");
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();

const playerRoutes = require('./routes/player.routes');
const homeRoutes = require('./routes/index.routes');
const PORT = process.env.PORT || 2000;


// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bhuzhqwszdemuzdofxnq'
});

// connect to database
/*db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});*/
global.db = db;

// configure middleware
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app
app.use('/', homeRoutes);
app.use('/player', playerRoutes);
app.get('*', function(req, res, next){
    res.status(404);

    res.render('404.ejs', {
        title: "Page Not Found",
    });

});

// set the app to listen on the port
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

const html = `
<!DOCTYPE html>
<% include partials/header.ejs %>
    <div class="table-wrapper">
        <% if (players.length > 0) { %>
            <table class="table table-hovered">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Image</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Position</th>
                        <th scope="col">Number</th>
                        <th scope="col">Username</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <% players.forEach((player, index) => { %>
                        <tr>
                            <th scope="row"><%= player.id %></th>
                            <td><img src="/assets/img/<%= player.image %>" class="rounded-circle player-img" alt=""></td>
                            <td><%= player.first_name %></td>
                            <td><%= player.last_name %></td>
                            <td><%= player.position %></td>
                            <td><%= player.number %></td>
                            <td>@<%= player.user_name %></td>
                            <td>
                                <a href="player/edit/<%= player.id %>" target="_blank" rel="noopener" class="btn btn-sm btn-success">Edit</a>
                                <a href="player/delete/<%= player.id %>" class="btn btn-sm btn-danger">Delete</a>
                            </td>
                        </tr>
                    <% }) %>
                </tbody>
            </table>
        <% } else { %>
            <p class="text-center">No players found. Go <a href="/player/add" >here</a> to add players.</p>
        <% } %>
    </div>
</div>
</body>
</html>
`
