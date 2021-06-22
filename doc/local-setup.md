# Local Setup

## Setup local environment

#### **.npmrc**

Add NPM_TOKEN to .npmrc file.

You can generate one of these from your NPM account at [`https://www.npmjs.com/settings/<username>/tokens`](https://www.npmjs.com/settings/<username>/tokens) .

```
//registry.npmjs.org/:_authToken=<NPM_TOKEN>
```

### Mac

#### Git

```bash
brew install git
```

#### Node

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
NVM_SNIPPET='export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm"'
# Add nvm to profile
echo $NVM_SNIPPET >> ~/.profile
# Add nvm to bash profile
echo $NVM_SNIPPET >> ~/.bash_profile
# Add nvm to bash config
echo $NVM_SNIPPET >> ~/.bashrc
# Add nvm to zsh config
echo $NVM_SNIPPET >> ~/.zshrc
# Install LTS version of node
nvm install --lts
```

#### Yarn

```bash
npm install --global yarn
```

### Linux

#### Git

##### Debian/Ubuntu

```bash
sudo apt-get install git
```

##### Fedora

```bash
sudo dnf install git-all
```

##### Arch

```bash
sudo pacman -Sy git
```

#### Node

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
NVM_SNIPPET='export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm"'
# Add nvm to profile
echo $NVM_SNIPPET >> ~/.profile
# Add nvm to bash profile
echo $NVM_SNIPPET >> ~/.bash_profile
# Add nvm to bash config
echo $NVM_SNIPPET >> ~/.bashrc
# Add nvm to zsh config
echo $NVM_SNIPPET >> ~/.zshrc
# Install LTS version of node
nvm install --lts
```

#### Yarn

```bash
npm install --global yarn
```

## Install dependencies

Clone the repo and run the following commands at the root of the project.

```shell
yarn install
```
