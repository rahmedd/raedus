---
title: Raed.us infrastructure
author: lorem ipsum
description: "lorem ipsum"
image:
  url: ""
  alt: ""
pubDate: 2024-02-18
tags: ["devops", "docker", "infrastructure", "nginx", "security"]
---

Hosting multiple Docker compose applications on a Ubuntu server.

Source code: https://github.com/rahmedd/infra [](https://github.com/rahmedd/infra)

## FAQ
Why not use a container orchestrator:
- Most container orchestrators are too complex and too heavy to run on a cheap underpowered server.

Why use two reverse proxies?
- Docker has had a security issue in which it bypasses UFW firewall rules. You can use tools/configs such as [chaifeng/ufw-docker](https://github.com/chaifeng/ufw-docker) to block all traffic and then allow specific containers. The issue is that Docker IPs are dynamic, and the app becomes inaccessible when the IP is changed. Naturally, when using the static IP and removing the ports from the compose file, the container is no longer exposed on port 80. This then requires a reverse proxy from the static IP to port 80.
- Two reverse proxies to make it easier to deploy NGINX changes. The primary reverse proxies all traffic to the infra-nginx reverse proxy, which is easily configurable.
- Setting up HTTPS using Certbot and auto updating certificates is much easier on the VM than it is within a Docker container.

Why use a shared MySQL server/container:
- The MySQL container is shared to reduce memory consumption. It uses around 100 MB of memory with no data or load. Each database within the server has a separate user and permissions.

Why use Docker at all?
- Building on the server using Docker is significantly easier than setting up dependencies, build tools, and automating the build process.
- Docker handles env variables, secrets, copying to volumes, etc.
- Git hooks are great, Docker contexts are nice too.
- Consistency
- Using the VSCode Docker extension allows you to easily manage containers and configurations without using the CLI.
- Last but not least, it's fun.

Why not use Heroku or Dokku (self-hosted):
- Heroku is slow and expensive.
- Neither support .NET natively.
- Complex configurations are difficult.


## Run development environment
### Required:
- Docker

### Setup project 
Set ```.env.dev``` vars

### Run compose
```shell
$ docker compose -f compose.yaml -f compose-dev.yaml up
```

### Expected result
After the application starts, navigate to `http://localhost:80` in your web browser

## Run production environment
### Required:
- Ubuntu Server/VM
- Docker
- NGINX

### Prelimary
- Allow NGINX through UFW
- Setup [chaifeng/ufw-docker](https://github.com/chaifeng/ufw-docker) to prevent docker ports from being exposed to the web.

### Setup project 
Copy ```remote.nginx.conf``` to ```/etc/nginx/nginx.conf```

Set production ```.env``` vars

### Use docker contexts to deploy:
```shell
$ docker context create --docker "host=ssh://deployer@mydomain.test" prod
$ docker context use prod
$ docker compose up --build
```
### Expected Result 
After the application starts, navigate to `http://mydomain.test` in your web browser

## Multiple docker compose outline:
```
Ubuntu VM
	NGINX - reverse proxy all traffic under *.mydomain.tld to infra-nginx
		infra
			NGINX - handle subdomain, reverse proxy apis, and serve static files
				network-appA - appA api
				network-appB - appB api
				volume-appA - serve appA frontend dist
				volume-appB - serve appB frontend dist
			MySQL
				network-db
		appA
			api
				network-appA - expose api on docker network
				network-db - db connection
			frontend
				volume-appA - build and copy dist
		appB
			api
				network-appB - expose api on docker network
				network-db - db connection
			frontend
				volume-appB - build and copy dist
```

## Thanks
This is partially based on Daniel Wachtel's tutorial on [Deploying multiple dockerized apps to a single DigitalOcean droplet using docker-compose contexts](https://danielwachtel.com/devops/deploying-multiple-dockerized-apps-digitalocean-docker-compose-contexts).
