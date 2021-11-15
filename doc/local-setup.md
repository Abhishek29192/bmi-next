# Local Setup

## Setup local environment

#### NPM TOKEN

The workspace packages are also published to a private NPM registry.
You will need to add the NPM_AUTH_READ_TOKEN to your profile's environment variables to run the install step.

```
export NPM_AUTH_READ_TOKEN="00000000-0000-0000-0000-000000000000"
```

See [this guide by NPM](https://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules) for more details.

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

#### sha1sum

Only required to be installed on Mac separately as Git installs it for Windows and most Linux systems have it already installed.

```bash
brew install md5sha1sum
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

### Windows

#### Git

```cmd
choco install git
```

#### Node

```cmd
choco install nvm
nvm install 14.18.1
nvm use 14.18.1
```

#### Yarn

```cmd
npm install --global yarn
```

## Install dependencies

Clone the repo and run the following commands at the root of the project.

```shell
yarn install
```
