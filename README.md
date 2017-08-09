# CMPT 470 Project - Team 3

To start the server, just pull the repo and type vagrant up.
- Host: http://localhost:8080

# Features
* User login
* User signup (with recaptcha to prevent bots from registering)
* User info update
* User info validation on both signup and update
* User avatar upload 
	* Only .jpg and .png files are allowed
	* Includes validation to ensure valid image file
* Forgot password
	* Reset password link sent to user email
	* Gmail API is used to send the email
* Main game (Free Roam game mode)
	* In-game chat room
	* User's location displayed on tank (google maps API used)
* General chat room
* Friendship system
	* See online friends (on side panel, online friends marked with green circle icon)
	* Chat with friends
* Toggleable side panel and in-game bgm settings
	* These settings are saved in the database
* Chat logs are stored in the database to display previous messages
* Add Security Header
    * X-Frame-Options
    * X-XSS-Protection
    * Content-Security-Policy
# Future Features
* Quick Play game mode (refer to issue #14)
* Competitive game mode (refer to issue #13)
* Leaderboards (require competitive game mode)
* User chat notification
* Show mutual friends
* Friends suggestion

# Canceled features
These features are cancelled due to 3rd party API related issues
- Login with facebook

# URLs 
- /login
- /signup
- /profile
- /logout
- /game
- /chat
- /help
- /users
- /users/:id

# References
- https://scotch.io/tutorials/easy-node-authentication-setup-and-local (basic login and signup)
- http://rubentd.com/blog/creating-a-multiplayer-game-with-node-js/ (game code and assets modified from this)
- https://github.com/socketio/socket.io/blob/master/examples/chat (basic chat code without multiple chat rooms)
- https://startbootstrap.com/template-overviews/simple-sidebar/ 
- https://www.flaticon.com/free-icon/user_149071#term=avatar&page=1&position=3 (default user avatar)
- http://www.bensound.com/royalty-free-music/track/epic (background music)
- https://www.freefavicon.com/freefavicons/objects/iconinfo/nuclear-explosion-152-166696.html (favicon)
- https://www.iconfinder.com/icons/34211/green_icon#size=128 (online indicator icon)