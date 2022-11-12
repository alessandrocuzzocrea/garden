---
title: Docker - Dangling Images
permalink: /docker-dangling-images/
codeHighlighting: true
tags: 
  - docker
  - tech
---
**Dangling images** are **Docker images** without a tag.

```shell
$ docker images -a
REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
<none>        <none>    13bd522bda36   49 seconds ago   13.3kB
<none>        <none>    bf679f14b82e   4 minutes ago    13.3kB
<none>        <none>    feb5d9fea6a5   13 months ago    13.3kB
```

Are **dangling images** safe to remove?
