# SSL Dashboard

A free dashboard for tracking SSL/TLS Certificates on various services


## Table of Contents

 1. [Table of Contents](#table-of-contents)
 2. [Why?](#why)
 3. [Configuring](#configuring)
 4. [API](#api)
 5. [Planned Changes](#planned-changes)


## Why

The idea for this project came from having a my IRC bouncer's certificate expire. I made sure to keep the cert up-to-date in my reverse proxy, but due to the way the certificate is configured, it was is not as easy to automate. Additionally, while letsencrypt will send you a reminder email, and certbot can take care of automatically creating and renewing your certificates, it has a few limitations:

 1. It only works for Letsencrypt
 2. Automatic renewals aren't as easy for non-http services


## Configuring

Getting started with SSL Dashboard is easy.
 1. Clone this repo
 2. Add the services you want to track to `/controllers/SSLExpory.php`
 3. Point your webroot at `/web/` in a php-capable webserver of your choice
 4. (If not using apache) Configure a rewrite from `/api/*` to `/api/index.php`
 
 
## API

This dashboard is composed of two parts:
 1. The Backend (API)
 2. The Frontend (Javascript)

The web interface calls the API to query certificate information in parallel. This is done to proxy past cross-site restrictions, as well as give more control about how certificate validation is handled.

The API has two parts. The first is a list of servers:

    $ curl https://ssl.tyzoid.com/api/servers
    {
        "servers": [
            {
                "id": 0,
                "host": "apilabs.tyzoid.com",
                "port": "https (443)",
                "name": "Api Labs"
            }
        ]
    }

The second is the certificate expiry information for a particular server:

    $ curl https://ssl.tyzoid.com/api/expiredate/0
    {
        "cert": {
            "CNMatch": true,
            "validFrom": "2018-04-12T20:51:14-04:00",
            "validUntil": "2018-07-11T20:51:14-04:00"
        }
    }

Both of these API endpoints support XML output as well, simply by adding a `.xml` extension to the request. (`.json` is implicitly added by default):

    $ curl https://ssl.tyzoid.com/api/expiredate/0.xml
    <?xml version="1.0"?>
    <cert>
      <CNMatch>1</CNMatch>
      <validFrom>2018-04-12T20:51:14-04:00</validFrom>
      <validUntil>2018-07-11T20:51:14-04:00</validUntil>
    </cert>


## Planned Changes

I would like to make this appear more as a "dashboard", rather than as a list of hosts/ports, but this will come later. Planned features and issues will be tracked via the issue tracker.
