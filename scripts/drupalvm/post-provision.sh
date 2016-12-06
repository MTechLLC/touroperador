#!/usr/bin/env bash
set -ev

# Determine if we are running inside or outside of the vm.
if [ ! -d /var/www/drupalvm ]
then
  cd $(dirname "$0")/../..
else
  cd /var/www/drupalvm
fi

# Provide default settings for running locally.
sudo chmod +w ./web/sites/default
if [ ! -f ./web/sites/default/settings.local.php ]
then
  cp ./scripts/drupalvm/settings.local.php ./web/sites/default/settings.local.php
fi
if [ ! -f ./web/sites/default/services.local.yml ]
then
  cp ./scripts/drupalvm/services.local.yml ./web/sites/default/services.local.yml
fi

# Allow writing to settings.php.
chmod 644 web/sites/default/settings.php

# Prepare the theme by downloading dependencies.
cd web/themes/custom/custom_theme
npm install
node_modules/gulp-cli/.bin/gulp.js

cd web
../vendor/bin/drush si config_installer -y
../vendor/bin/drush cim -y
../vendor/bin/drush updb -y
../vendor/bin/drush cr
