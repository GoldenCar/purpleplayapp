# Prereqs

git
node
yarn
access to git repo


# Steps to set up dev environment:

- [ ]  accept github invite: [`https://github.com/platformpurple/purplePlay/invitations`](https://github.com/platformpurple/purplePlay/invitations)

- [ ]  set up development environment:

git clone git@github.com:platformpurple/purplePlay.git
cd purplePlay
git checkout master

yarn

node env-setup/setEnvElectron.js discoveryekb
 
yarn runElectron


Now you're set up to work on the code, but the app is not built, so you won't really be able to get a real world test.

To build the app:
	yarn buildElectronWinDev
Or
	yarn buildElectronMacDev

# Issue #1

download url doesn't initiate downloading on first launch

Steps:

1) Make sure app is closed
2) Go here: [`https://go.platformpurple.com/?e=gracetest`](https://go.platformpurple.com/?e=gracetest)
3) Click `Edit me!` link
- expected:
	- the app launches, and processes the custom route information to download the product "Parallel Circuits"

- actual:
	- App launches, but no downloading.  (If I go back to the page and click the link again with the app open, then the downloading starts)


# More Info

- URL structure: `discoveryekb://download/ae4de879-4526-4dc6-b725-ae0897deb6e7`
- App protocol functions are handled in `/src/plugins/deepLinking.js`


	
