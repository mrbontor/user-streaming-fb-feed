# user-streaming-fb-feed

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

- docker
- docker-compose
- node js
- npm
- facebook Token
- git


Facebook Token Description:

- You can get Facebook Access Token from [Facebook Developers Tools](https://developers.facebook.com/tools)
- In configs folder, replace the [facebook] token with the new one.

Or you can simply to get one token by using command after u create the [Facebook Developers App](https://developers.facebook.com/apps/) and follow the instructions

    curl -X GET "https://graph.facebook.com/oauth/access_token?client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials"

the `access_token` from [Facebook](https://developers.facebook.com/apps/) have to put on config [facebook].[token]

## Settings

### Configuring

#### app config

The default path for config file is `./configs/config.fb.stream.feed.api.dev.ini`, you can explicitly add config file in `--config` or `-c` argument.

```ini
[app]
host	= 0.0.0.0
port	= 2021

; log Configuration
[log]
path        = var/log/
level       = debug
filename    = log-fb-streaming-feed

[facebook]
app_id      = your_fb_id
app_secret  = your_fb_secret
token       = your_access_token
```

### docker-compose.yml

```yaml
version: '3'
services:
    api-fd_user_feed:
        build: .
        container_name: api-fd_user_feed
        networks: ["fd_user_feed"]
        ports:
            - "8080:2021"
networks:
  fd_user_feed:
    driver: bridge

```

Change `network_name` to the name of your docker network
Also you can change `ports` to the port you like

## Testing && Deployment

### Running the test

Before you run the test, u shoul running

    npm install

After which you can run

    npm test

or

    npm run test

This service use `mochawesome` that is used to make reports of the test that u can find in `reports/mochawesome`
the file will be in HTML file.

To open the result of test using

    npm reports


### Deployment && Usage


```sh
# start
$ docker-compose up -d

# stop
$ docker-compose down

# remove
$ docker-compose down -v
```

## API && endpoint

* *GET*    http://localhost:port/fb/user/feed/:id
> {params: id}
> example: 10156282988163546
> contentType: `application/json`
> response :

```json
{
    "status" : "Boolean",
    "message" : "String",
    "data": {
        "id" : "String",
        "name": "String",
        "feed": {
            "data": []
        }
    }
}
```
