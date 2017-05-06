# chef-cli

The chef cli is a project scaffold/template manager based on github

## Install

- use npm

```bash
npm i -g chef-cli 
```

- use yarn

```bash
yarn install -g chef-cli
```

## chef registry

The chef cli default registry is [chef-template](https://github.com/chef-template). You can use the [chef-template](https://github.com/chef-template) repos. If you have better solution for web development, please tell us.

- set registry

```bash
chef config  set registry https://github.com/{owner}/ 
```

- get registry

```bash
chef config  get registry
```

- delete registry

When delete the config registry, the default registry is [chef-template](https://github.com/chef-template)

```bash
chef config  delete registry
```

## install project template

the version equal to the github repo tag version.

```bash
chef install vue-component // default install latest tag
chef install vue-component@latest // install latest tag
chef install vue-component@1.1.2
// alias
chef i vue-component
```

## init project

```bash
chef init vue-component your-project 
```

## check outdate

view the list of all installed project templates, check the version

```bash
chef outdate
```

## uninstall

uninstall the template

```bash
chef uninstall vue-component
```

## update

update the template to the latest

```bash
chef update vue-component
```