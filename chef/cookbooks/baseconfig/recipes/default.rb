# Make sure the Apt package lists are up to date, so we're downloading versions that exist.
cookbook_file "apt-sources.list" do
  path "/etc/apt/sources.list"
end
execute 'apt_update' do
  command 'apt-get update'
end

# Base configuration recipe in Chef.
package "wget"
package "ntp"
cookbook_file "ntp.conf" do
  path "/etc/ntp.conf"
end
execute 'ntp_restart' do
  command 'service ntp restart'
end

# Install and configure mongoDB
execute 'create mongoDB list file' do
	command 'echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list'
end
execute 'import mongoDB public gpg key' do
	command 'sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927'
end
execute 'apt-get update' do
	command 'sudo apt-get update'
end
execute 'install mongodb-org' do
	command 'sudo apt-get install -y mongodb-org'
end
execute 'stop mongod' do
	command 'sudo service mongod stop'
end
execute 'run mongod' do
	command 'sudo service mongod start'
end
execute 'wait' do
	command 'sleep 5s'
end
execute 'create db' do
	command 'echo "use appdb" | mongo'
end


# Install and configure node.js
package "npm"
package "nodejs"
package "nodejs-legacy"

Commands
execute 'install app dependencies' do
	cwd '/home/ubuntu/project/app'
	command 'npm install'
end
execute 'install forever' do
	command 'sudo npm install forever --global'
end
execute 'run server' do
	cwd '/home/ubuntu/project/app'
	command 'npm start'
end