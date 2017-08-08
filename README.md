# CMPT 470 Project - Team 3

To start the server, just pull the repo and type vagrant up.
- Host: http://localhost:8080

# Features
- User login
- User registration (with recaptcha to prevent bots from registering)
- User avatar upload (with validation preventing upload of 'virus.exe' renamed to 'cat.png')
- Forgot password
- Main game (Free Roam game mode)
- User's location displayed on tank with google maps API
- General chat
- Friendship system
- See online friends (on side panel, online friends marked with green circle icon)
- Chat with friends
- Toggleable side panel and in-game bgm settings (persistent on database level)

# Future features (after the course)
These features are not implemented due to heavy game mechanics and we want to
focus more on web related features rather than game related features. Therefore
we decided to implement these features after the course.
- Quick Play game mode (refer to issue #14)
- Competitive game mode (refer to issue #13)

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

References:
- https://scotch.io/tutorials/easy-node-authentication-setup-and-local (basic login and signup)
- http://rubentd.com/blog/creating-a-multiplayer-game-with-node-js/ (game code and assets modified from this)
- https://github.com/socketio/socket.io/blob/master/examples/chat
- https://startbootstrap.com/template-overviews/simple-sidebar/
- https://www.flaticon.com/free-icon/user_149071#term=avatar&page=1&position=3 (default user avatar)
- http://www.bensound.com/royalty-free-music/track/epic (background music)
- https://www.freefavicon.com/freefavicons/objects/iconinfo/nuclear-explosion-152-166696.html (favicon)
- https://www.iconfinder.com/icons/34211/green_icon#size=128 (online indicator icon)