---
title: Docker - Build and Run One-liner
permalink: /docker-build-and-run/
codeHighlighting: true
tags: 
  - docker
  - tech
---
From the path containing the `Dockerfile`:

```shell
docker run --rm $(docker build -q .)
```

Add other flags if necessary, for example `-p 8080:80` to map container port `80` to host port `8080`:

```shell
docker run --rm -p 8080:80 $(docker build -q .)
```

## Explanation

`docker build -q .`

```shell
$ docker build -q .
sha256:018034711c529bcf98bb9683f2cd67f2912caadf3ab8040f5e4f811578b7693f
```

## References
- [docker build](https://docs.docker.com/engine/reference/commandline/build/)
- [docker run](https://docs.docker.com/engine/reference/commandline/run/)
