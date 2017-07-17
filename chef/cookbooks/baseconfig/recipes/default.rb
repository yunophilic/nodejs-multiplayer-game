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

# Install node and npm
package "npm"
package "nodejs"
package "nodejs-legacy"
package "sqlite3"
package "libsqlite3-dev"
package "zlib1g-dev"

execute 'install app dependencies' do
	command 'sudo npm cache clear -f'
	command 'sudo npm set registry https://registry.npmjs.org/'
	command 'sudo npm update'
	command 'sudo npm install'
	cwd '/home/ubuntu/project/app'
	user 'ubuntu'
end
execute 'install forever' do
	command 'sudo npm install forever --global'
end
execute 'run server' do
	cwd '/home/ubuntu/project/app'
	command 'forever start bin/www'
end

