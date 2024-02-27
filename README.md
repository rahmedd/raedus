Raed.us landing page and blog.

## Run development environment
### Required:
- Node

### Setup project 
```shell
$ npm install
```

### Run project
```shell
$ npm run dev
```

### Expected result
After the application starts, navigate to `http://localhost:3000` in your web browser

## Run production environment
### Required:
- [rahmedd/infra](https://github.com/rahmedd/infra) infrastructure and setup. Please read before continuing.

### Modify infra configurations
Add volume to proxy service in ```infra/compose.yaml```:
```yaml
services:
  proxy:
    build: proxy
    volumes:
      - blog-dist:/blog-dist
```

Add blog server to ```infra/proxy/nginx.conf```:
```nginx
server {
	listen 80;
	server_name	raed.us;
	location / {
		root /blog-dist;
		index index.html;
		try_files $uri $uri/ /index.html;
	}
	error_page 500 502 503 504 /50x.html;
	location = /50x.html {
		root /usr/share/nginx/html;
	}
}
```

### Use existing docker context to deploy:
```shell
$ docker compose up --build
```
### Expected Result 
After the application starts, navigate to `http://mydomain.test` in your web browser

## Thanks
This is partially based on [Astro content collections tutorial](https://github.com/withastro/blog-tutorial-demo/tree/content-collections).
