# adcomtest
Aouth2 
--------------------------------------
 we consider jboss-eap-6.3
 
download  keycloak-war-dist-all-1.0.4.Final (war distribution),
the dir look like:

keycloak-war-dist-all-1.0.4.Final/

    deployments/
        auth-server.war/
        keycloak-ds.xml
    configuration/
        keycloak-server.json
        themes/
    adapters/
        keycloak-as7-adapter-dist-1.0-rc-1.zip
        keycloak-eap6-adapter-dist-1.0-rc-1.zip
        keycloak-wildfly-adapter-dist-1.0-rc-1.zip
    examples/
    docs/
   ------------- 
    $ cd keycloak-war-dist-all-1.0-rc-1
    $ cp -r deployments $JBOSS_HOME/standalone
    $ cp -r configuration $JBOSS_HOME/standalone
    
    Adapter Installation
    
    $ cd $JBOSS_HOME
    $ unzip keycloak-eap6-adapter-dist.zip


copy adcom.config/standalone.xml to jboss

Realm
--------------------------------------
adcom

Application
--------------------------------------
adbase.server

adbase.client

adcost.server

adcost.client

addashboard.client

Role
--------------------------------------
adbase.client_role

adcost.client_role

adbase.server_role

adcost.server_role

addashboard.client_role(need to be sign in to see it, but everyone has this role by default)

User
--------------------------------------
guy/123

yan/123 

francis/123 

franck/123

 Applications are already configured, just do the above tasks:
 
connect into keycloack and import realm file configuration(adcom.config/adcomrealm.json)

cd adcom/

mvn clean instal

mvn jboss-as:deploy

log to http://localhost:8080/addashbord.client
  
Tip: to export a realm

./bin/standalone.sh -Dkeycloak.migration.action=export -Dkeycloak.migration.realmName=adcom
-Dkeycloak.migration.provider=singleFile -Dkeycloak.migration.file=adcomrealm.json

to come, enable and configure ssl, add a mobile client...

