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

Watch out for [Dangling Images](/docker-dangling-images/).

## Explanation

Command `docker build` builds an *image* from a *Dockerfile*.

Flag `-q` (*quiet*). Output the *image ID* only. In our case, the *image ID* is then passed directly to the **docker run** command.

Path to the *Dockerfile*. The `.` is used to specify the *current directory*. 

```shell
$ docker build -q .
sha256:018034711c529bcf98bb9683f2cd67f2912caadf3ab8040f5e4f811578b7693f
```

Command `docker run` creates and starts a new *container*.

```shell
$ docker run --rm IMAGE-ID
```

An *image ID* is required.

Flag `--rm` deletes the container when it exists.

## References
- [docker build](https://docs.docker.com/engine/reference/commandline/build/)
- [docker run](https://docs.docker.com/engine/reference/commandline/run/)
