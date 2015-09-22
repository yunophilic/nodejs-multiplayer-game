# basic configuration example for Fabric

from fabric.api import run, sudo
from fabric.operations import put

def base_setup():
    sudo('apt-get install wget ntp')
    put('fabric/files/ntp.conf', '/etc/ntp.conf', use_sudo=True)
    sudo('service ntp restart')
