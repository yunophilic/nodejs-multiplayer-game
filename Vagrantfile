# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 80, host: 8080

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder "./", "/home/vagrant/project"
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  #config.vm.provider :virtualbox do |vb|
  #  vb.customize ["modifyvm", :id, "--cpus", "1", "--memory", "1024"]
  #end
  #config.vm.provider "vmware_fusion" do |v, override|
  #    v.vmx["memsize"] = "1024"
  #    v.vmx["numvcpus"] = "1"
  #end

  # Enable provisioning with Puppet stand alone.  Puppet manifests
  # are contained in a directory path relative to this Vagrantfile.
  # You will need to create the manifests directory and a manifest in
  # the file default.pp in the manifests_path directory.
  #config.vm.provision "puppet" do |puppet|
  #  puppet.manifests_path = "puppet/manifests"
  #  puppet.module_path = "puppet/modules"
  #  puppet.manifest_file  = "default.pp"
  #end

  # Enable provisioning with chef solo, specifying a cookbooks path, roles
  # path, and data_bags path (all relative to this Vagrantfile), and adding
  # some recipes and/or roles.
  #config.vm.provision "chef_solo" do |chef|
  #  chef.cookbooks_path = "chef/cookbooks"
  #  chef.add_recipe "baseconfig"
  #end

  # Enable provisioning with Fabric. Before using, you must (on your machine,
  # outside the VM) have Fabric and the vagrant-fabric plugin installed:
  #     sudo apt-get install fabric
  #     vagrant plugin install vagrant-fabric
  # (So if that's going to be a problem for any of your group members, don't
  # choose Fabric.) Then you can specify the main fabfile and which tasks to
  # have targetted at your VM.
  #config.vm.provision :fabric do |fabric|
  #  fabric.fabfile_path = "./fabric/fabfile.py"
  #  fabric.tasks = ["base_setup",]
  #end

end
