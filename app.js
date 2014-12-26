var express = require('express');
var app = express();
var Application = require('./models/application.js').Application;
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

var uristring =
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/kiva-project';

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

//controllers
var admin_controller = require('./controllers/admin_controller.js');
var volunteer_controller = require('./controllers/volunteer_controller.js');


//other boiler plate
app.use(express.static(__dirname + '/public'));
app.use(express.logger("default"));
app.use( express.cookieParser() );
app.use(express.session({secret:'session'}));
app.use(express.bodyParser())
   .use(express.methodOverride())
   .use(app.router)
   .use(express.multipart());


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

function ensure_auth(req, res, next) {
  if (req.session.logged) {
    return next();
  } else {
    res.redirect('/');
  }
}

function ensure_admin(req, res, next) {
  if (req.session.admin) {
    return next();
  } else {
    res.redirect('/');
  }
}

//General Online
app.get("/", volunteer_controller.index);
app.post("/login", volunteer_controller.login);
app.get("/load_application/:org_id", volunteer_controller.load_application);
app.get("/logout", volunteer_controller.logout);
app.get("/get_questions/:org_id", volunteer_controller.get_questions);

/***** Volunteer requests ******/

//Loads data
app.get("/volunteer/get_min_reviewed_application", ensure_auth, volunteer_controller.getMinReviewedApplication);
app.get("/volunteer/load", ensure_auth, volunteer_controller.loadVolunteer); //loads data of a single User from session info
app.get("/volunteer/get_completed_applications", ensure_auth, volunteer_controller.getCompletedApplications);
app.get("/volunteer/load_leaderboard", volunteer_controller.load_leaderboard);

//signs up a volunteer
app.post("/volunteer/submit-volunteer", volunteer_controller.createVolunteer);
app.get("/volunteer/finished-training", ensure_auth, volunteer_controller.volunteerFinishedTraining);
app.get("/volunteer/get_achievements", ensure_auth, volunteer_controller.getAchievements);

//pages
app.get("/volunteer/home", ensure_auth, volunteer_controller.volunteerHome);
app.get("/volunteer/training", ensure_auth, volunteer_controller.volunteerTraining);
app.get("/volunteer/sign-up", volunteer_controller.volunteerSignupPage);


/****** Review-related Requests ********/
app.post("/review/create/:id", ensure_auth, volunteer_controller.create_review); // org_id
app.get("/review/edit/:id", ensure_auth, volunteer_controller.edit_review); // review id
app.post("/review/save/:id", ensure_auth, volunteer_controller.save_review); // review id
app.get("/review/load/:id", ensure_auth, volunteer_controller.load_unfinished_review); //review id
app.post("/review/submit/:id", ensure_auth, volunteer_controller.submit_review); // review id
app.get("/review/completed/:org_id", ensure_auth, volunteer_controller.completed_review_page); //org_id
app.get("/review/completed/load/:org_id", ensure_auth, volunteer_controller.load_completed_reviews);
app.get("/review/organization_data/:org_id", ensure_auth, volunteer_controller.load_organization_data);
app.post("/review/create/:id", ensure_auth, volunteer_controller.create_review); // org_id here
app.get("/review/edit/:id", ensure_auth, volunteer_controller.edit_review); // review id
app.post("/review/save/:id", ensure_auth, volunteer_controller.save_review); // review id
app.get("/review/load/:id", ensure_auth, volunteer_controller.load_unfinished_review);
app.post("/review/submit/:id", ensure_auth, volunteer_controller.submit_review); // review id
app.get("/review/completed/:org_id", ensure_auth, volunteer_controller.completed_review_page); //org_id
app.get("/review/completed/load/:org_id", ensure_auth, volunteer_controller.load_completed_reviews);
app.get("/review/organization_docs/:org_id", ensure_auth, volunteer_controller.load_organization_docs);
app.get("/review/organization_data/:org_id", ensure_auth, volunteer_controller.load_organization_data);
app.post("/review/upvote_three_questions", ensure_auth, volunteer_controller.upvote_three_questions);

/***** Admin requests ******/
app.get("/admin/sign-up", admin_controller.admin_signup_page);
app.post('/admin/submit-admin', admin_controller.create_admin);
app.get("/admin_submit", ensure_admin, admin_controller.submit_application);
app.post("/post-application", ensure_admin, admin_controller.create_application);
app.get("/admin_applications", ensure_admin, admin_controller.view_applications);
app.get("/admin/application/:id", ensure_admin, admin_controller.view_one_application);
app.get("/admin/load_application/:id", ensure_admin, admin_controller.load_single_application);
app.post("/admin/update_application/:id", ensure_admin, admin_controller.save_application_changes);

app.post("/admin/volunteer/approve", ensure_admin, admin_controller.approve_volunteer);
app.post("/admin/volunteer/deny", ensure_admin, admin_controller.deny_volunteer);
app.get("/admin/pull_applications_short", ensure_admin, admin_controller.send_applications_short);
app.get("/admin/pull_applications_rest", ensure_admin, admin_controller.send_applications_rest);


app.get("/admin/pull_volunteers:approval", ensure_admin, admin_controller.send_volunteers);
app.get("/admin_submit", admin_controller.submit_application);
app.post("/post-application", admin_controller.create_application);
app.get("/admin_applications", admin_controller.view_applications);
app.get("/admin/application/:id", admin_controller.view_one_application);
app.get("/admin/load_application/:id", admin_controller.load_single_application);
app.post("/admin/update_application/:id", admin_controller.save_application_changes);

app.post("/admin/volunteer/approve", admin_controller.approve_volunteer);
app.post("/admin/volunteer/deny", admin_controller.deny_volunteer);
app.get("/admin/pull_applications_short", admin_controller.send_applications_short);
app.get("/admin/pull_applications_rest", admin_controller.send_applications_rest);

app.get("/admin/pull_volunteers:approval", admin_controller.send_volunteers);
module.exports = app;

