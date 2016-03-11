## dz-dl

Simple AngularJS 2 application downloading Deezer playlists / albums from Youtube

### Library / modules

- Bootstrap: ng2-boostrap https://www.npmjs.com/package/ng2-bootstrap
- Deezer JS SDK: https://developers.deezer.com/sdk/javascript
- nested-property (for ConfigService): https://github.com/cosmosio/nested-property

### How to use in local environment

Go to the root project directory and run:

`npm install` (you may remove the /node_modules directory before, cleaning all your previous installed modules)

`typings install` (https://github.com/typings/typings)

Then, you can either run GULP command to serve static server, or set an Apache configuration, with the DocRoot configured to the dist/ directory. 

#### GULP commands

Four main GULP commands:

- `gulp` : Only build, watch and re-build. Then, access by yourself to the app through Apache

- `gulp serve` : Run a light static server on port 3000 & watch changes (with browser-sync auto-refreshes)

- `gulp serve` : **Require to modify the gulpfile.js before**. Proxify browser-sync to a dynamic server (like Apache, see next part). The `browserSync.init({...})` parameter must be changed to only use the *proxy* property

- `gulp fullbuild` : Run the full build once (no watching process).


#### Running through Apache

During authentication, Deezer SDK cannot redirect to an URL with a specified port (e.g localhost:3000).
Although, it might be easier to run through an Apache server serving a domain name at port 80. The following configuration is available:

```
<VirtualHost *>
    DocumentRoot "/path/to/project-root/dist"
    ServerName deezer-dl.local

    <Directory "/path/to/project-root/dist">
      Order allow,deny
      Allow from all
      Options +FollowSymLinks +ExecCGI
      RewriteEngine On
      AllowOverride All
    </Directory>
</VirtualHost>
``` 

The dist/ directory should also contain an appropriate .htaccess file after building the app.
