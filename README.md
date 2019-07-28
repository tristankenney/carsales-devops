# carsales-devops

## Pre-reqs
1. Install Docker
2. Generate Docker image `bin/ansible-build`


## Running
```
AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID> \
AWS_SECRET_ACCESS_KEY=<AWS_SECRET_ACCESS_KEY> \
CLOUDFLARE_TOKEN=<CLOUDFLARE_TOKEN> \
CLOUDFLARE_EMAIL=<CLOUDFLARE_EMAIL> \
MYSQL_PASSWORD=<MYSQL_PASSWORD> \
bin/ansible
```
Can be viewed at `https://carsales.kenney.co`


## Structure

The repository is broken into three top-level folders:
- ansible: contains Ansible playbook and associated configuration to deploy app
- app: main application code, consisting of two Lambdas (cron & api), and static web (web)
- bin: helper scripts, as well as self-contained Dockerfile to deploy

## Task
* create a simple application (it can be lambda based or other) that will query all the records in Route53, save the info in a simple database and display the results on a very simple front-end.
* Chose any language that suits you
* The DB needs to be mysql
* The info should be updated at regular intervals (a schedule/cron or something similar), eg once every 3 hours.
* A simple front-end is all that’s needed, as it’s only an internal application.
* The front end needs to read the data from the persistent storage and not from the “data-fetching” lambda directly. 
* No need to worry about authentication on the front-end (but it would be great to explain how you would implement it if you had to).

## To Do

### Coding
#### Scheduled Task
Create a lambda that executes on a schedule that queries entire Route53 set, and updates table.
Should iterate hosted zones, collecting records

*Compromises* 
By executing on a scheduled event (as opposed to Route53 CRUD events), the full set of records must always be addressed instead of the modified subset. This could (potentially) have a performance impact. 

Additionally, as this is a scheduled task, there will be a period of potentially stale data

#### DNS API
Create a lambda that queries MySQL database, and returns JSON payload

*Compromises* 
As there is no caching layer, if this is a high-traffic API there could be performance concerns
Additionally, as there is no authentication on the API, DNS data could be compromised

#### Front end
Deployed as a static website to S3 bucket. 

*Compromises* 
Limited flexibility in terms of deployment (can only serve static files), unable to be


### Deployment

#### Database
* Create & configure security groups
* Create RDS instance 
* Create table instance
* Capture RDS instance details

#### Scheduled task
* Create & configure groups
* Deploy serverless (w/ captured RDS instance details) 

#### DNS API
* Create & configure groups
* Deploy API gateway
* Deploy serverless (w/ captured RDS instance details) 

#### Front end
* Create & configure security groups
* Deploy web payload to S3 bucket

## Concerns / implementation notes
### Secrets management 
There is no robust secrets management. The setup relies on environment variables to contain secrets which poses a number of potential issues. An improvement would be to use ansible-vault or Hasicorp Vault

### DNS 
DNS information to lambdas is shared as part of the Ansible deployment scripts, however this poses some issues. 
Firstly, it prevents a separation of 

### Authentication / ACL
Both API and web packages are open to the web, without any authentication. 
Depending on requirements, this could be as simple as token authentication on the API and HTTP auth

### VPC encapsulation
RDS instance is within a VPC, however it is publicly accessible. This was a trade-off in terms of this exercise to allow easier remote provisioning (outside of VPC). Additionally, Lambdas are not deployed within the VPC