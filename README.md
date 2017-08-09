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
	* Search users on users page with num of mutual friends displayed next to each user
	* See online friends (on side panel, online friends marked with green circle icon)
	* Chat with friends
* Toggleable side panel and in-game bgm settings
	* These settings are saved in the database
* Chat logs are stored in the database to display previous messages
* Add Security Header
    * X-Frame-Options  (Avoid clickjacking attacks)
    * X-XSS-Protection (Avoid cross-site scripting attacks)
    * Content-Security-Policy (Whitelisting third party resources)
    
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

# Easily missed URLs 
- /forgot-password
- /reset-password

# Important Notes
- Side Panel is not available on chat and game pages
- General chat and game pages cannot be opened on multiple tabs
- You are allowed to chat with different users on different tabs but cannot chat with the same user on multiple tabs

# References
- https://scotch.io/tutorials/easy-node-authentication-setup-and-local (basic login and signup without username)
- http://rubentd.com/blog/creating-a-multiplayer-game-with-node-js/ (game code and assets modified from this)
- https://github.com/socketio/socket.io/blob/master/examples/chat (basic chat code without multiple chat rooms)
- https://startbootstrap.com/template-overviews/simple-sidebar/ (for side panel)
- https://www.flaticon.com/free-icon/user_149071#term=avatar&page=1&position=3 (default user avatar)
- http://www.bensound.com/royalty-free-music/track/epic (background music)
- https://www.freefavicon.com/freefavicons/objects/iconinfo/nuclear-explosion-152-166696.html (favicon)
- https://www.iconfinder.com/icons/34211/green_icon#size=128 (online indicator icon)