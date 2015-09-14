class baseconfig {
  exec { 'apt-get update':
    command => '/usr/bin/apt-get update',
  }
  package { ["ntp", "wget"] :
    ensure => present,
    require => Exec['apt-get update']
  }
  file { '/etc/ntp.conf':
    source => 'puppet:///modules/baseconfig/ntp.conf';    
  }
}
