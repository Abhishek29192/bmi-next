# Prefix adder
The script was designed for the [DXBDO-397](https://bmigroup.atlassian.net/browse/DXBDO-397).
The end goal was to import a few different markets
into one Contentful space.
To achieve this, entities' IDs in the .json backup file
had to be unique for each market.  

Basically, it adds market/country code to all needed IDs in the file.
## Requirements
To run this script, you will need a backup of
the Contentful space in the .json format.
As it uses `jq`, you'll also need to install it in your environment.  
Use [this link](https://stedolan.github.io/jq/download/)
to their official download section.
## Usage/Examples
This script has two mandatory parameters: `[-f]` & `[-c]`.
The first one is for a backup file and the second one
is for a market/country code.  
Script has some basic error handling and should guide you
if you did something wrong.
But, just in case, here are a few examples:  
1. Print a help message:
```bash
$ ./prefix_adder.sh -h
```
2. Use case example:
```bash
$ ./prefix_adder.sh -f FinlandSpaceBackup.json -c FI
```
In this example, we added the market/country prefix "FI"
to all needed IDs in a backup of
the Finish market space - `FinlandSpaceBackup.json`  
As a result, we've got a new file - `FI_Space.json`,
which can be imported into the multimarket space.