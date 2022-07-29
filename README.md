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

- add scheduler:
  - runner (raise limits?)
  - customUI
  - contracts
  -
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
- fix in hacknet.js cap of $ for upgrade nodes=3m/levels=.5m/ram=no/cpu=3m

## numbers

### hacknet

- max level from 1 cost: 24m
- max ram from 1Gi: 4.7m
- max core from 1: 345m
- outcome from fully upgraded node: 26k/sec == 93m/hour
