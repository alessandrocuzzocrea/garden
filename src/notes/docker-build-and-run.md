---
title: Docker - Build and Run One-liner
permalink: /docker-build-and-run/
tags: 
  - docker
  - tech
---
From the path containing the `Dockerfile`:

```shell
docker run --rm $(docker build -q .)
```

## Explanation

Add more flags as you need. E.g. `-p 8080:80` to map container's port 80 to host's port 80:

```shell
docker run --rm -p 8080:80 $(docker build -q .)
```

## References