# bitburner

```shell
wget https://raw.githubusercontent.com/zelig81/bitburner/main/init.js init.js
```

```shell
run init.js
```

```shell
run _runner.js 22 500000
```

## todo

- make own:
  - hacknet
  - netcrawler
  - crimes
  - contracts
- make script of getting all hosts with it's and store it in file mapping:
  - prop: path from host
  - prop: name
  - prop: money?
  - prop: number of ports for nuke
  - prop: level of security
  - logic:
    - make runner.js to read from this file
    - use NS.scan() for recursive connections
    - use NS.getServer() (with `Server` interface https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.server.md)
- improve init.js to fetch all files on repo (js only)
- make script of launching other script on other host:
  - arg: host name to launch on it
  - arg: humber of threads
  - arg(s): of script to be launched
  - logic:
    - wget init.js
    - run init.js
    - run the script with chosen parameters
